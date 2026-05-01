import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import type { Campaign, EmailMessage, Lead } from "@prisma/client";
import type { ParsedResponse } from "openai/resources/responses/responses";
import type { AppSettings } from "@/lib/settings";
import { outboundDraftSchema } from "@/lib/validators";

type DraftGenerationArgs = {
  lead: Lead;
  settings: AppSettings;
  campaign: Campaign | null;
  analysis:
    | {
        homepageTitle: string | null;
        metaDescription: string | null;
        summary: string;
        editorNotes: string | null;
        detectedIssues: string[];
      }
    | null;
  previousMessages?: Pick<EmailMessage, "subject" | "body" | "sentAt">[];
  followUpNumber?: number;
};

type OutreachCase = "website_improvement" | "new_website" | "generic_outreach";
const SIGNATURE_BLOCK = `[Sender Name]
tvorba a úprava webů pro lokální firmy

sender.example.com
hello@sender.example.com
[City]`;

const SYSTEM_PROMPT = `You write low-volume, highly targeted cold outreach emails for local Czech businesses.

Rules:
- Write the subject and body in natural Czech only.
- Use formal Czech (vykani), not informal Czech.
- Use only the supplied business, campaign, and website-analysis details.
- Never invent facts, metrics, or claims.
- Keep the tone human, concise, and specific.
- Keep the subject short and natural.
- Make the opening feel natural, not like a sales template.
- Avoid openers such as "jmenuji se Martin a pomáhám...".
- Prefer a brief natural opener that says you came across the business and have one or two quick observations or one practical thought.
- Mention one real observation from the website analysis when the supplied data supports it.
- If the lead has no website, focus on offering a simple, modern website from scratch and do not imply that a current website was reviewed.
- If the analysis does not contain a strong observation, stay honest and generic instead of pretending you noticed something specific.
- For businesses with an existing website, focus on improvement or modernization.
- For businesses with no website, focus on creating a simple, modern website from scratch.
- No hype, no guaranteed results, no fake familiarity, and no spammy phrasing.
- Prefer understated phrasing such as "vsiml jsem si" only when it is true.
- Include a soft CTA in Czech.
- Keep the body plain text and between 80 and 120 words before the opt-out line.
- Do not add your own closing signature block. The exact signature will be added separately.
- Include the supplied opt-out line verbatim at the end of the body.
- Return valid JSON only.`;

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  return new OpenAI({ apiKey });
}

function stripTrailingOptOut(body: string, optOutLine: string) {
  const trimmedBody = body.trim();
  const trimmedOptOut = optOutLine.trim();

  if (!trimmedBody) {
    return trimmedBody;
  }

  const lowerBody = trimmedBody.toLowerCase();
  const lowerOptOut = trimmedOptOut.toLowerCase();

  if (!lowerBody.includes(lowerOptOut)) {
    return trimmedBody;
  }

  const startIndex = lowerBody.indexOf(lowerOptOut);
  return trimmedBody.slice(0, startIndex).trim();
}

function ensureSignatureAndOptOut(body: string, optOutLine: string) {
  const trimmedBody = stripTrailingOptOut(body, optOutLine);
  const bodyWithoutSignature = trimmedBody.includes(SIGNATURE_BLOCK)
    ? trimmedBody.replace(SIGNATURE_BLOCK, "").trim()
    : trimmedBody;
  const trimmedOptOut = optOutLine.trim();

  return `${bodyWithoutSignature}\n\n${SIGNATURE_BLOCK}\n\n${trimmedOptOut}`;
}

function parseDraftFromOutputText(outputText: string | undefined) {
  if (!outputText?.trim()) {
    return null;
  }

  try {
    return outboundDraftSchema.parse(JSON.parse(outputText));
  } catch {
    return null;
  }
}

function summarizeOutput(response: ParsedResponse<unknown>) {
  return response.output.map((item) => {
    if (item.type !== "message") {
      return { type: item.type };
    }

    return {
      type: item.type,
      contentTypes: item.content.map((content) => content.type),
    };
  });
}

function buildEmptyResponseError(response: ParsedResponse<unknown>) {
  const detailParts = [
    response.status ? `status=${response.status}` : null,
    response.incomplete_details?.reason
      ? `incomplete_reason=${response.incomplete_details.reason}`
      : null,
    response.output_text ? `output_text_length=${response.output_text.length}` : "output_text_length=0",
  ].filter(Boolean);

  return `OpenAI returned no usable draft content (${detailParts.join(", ")}). Check server logs for response details.`;
}

function getOutreachCase({
  lead,
  analysis,
}: Pick<DraftGenerationArgs, "lead" | "analysis">): OutreachCase {
  if (!lead.website) {
    return "new_website";
  }

  if (analysis) {
    return "website_improvement";
  }

  return "generic_outreach";
}

function getCaseInstructions(outreachCase: OutreachCase, isFollowUp: boolean) {
  if (isFollowUp) {
    return "Write a polite Czech follow-up. Briefly reference the earlier email, keep the tone calm and human, and ask only once whether they would like a few brief suggestions for the website. Do not sound automated.";
  }

  if (outreachCase === "website_improvement") {
    return "Write a first-touch Czech outreach email for a business with an existing website and a completed website analysis. Focus on practical improvement or modernization. Use one real observation only if it is clearly supported by the analysis. If the analysis is positive or weak, stay measured and do not overstate problems. Open naturally, as if you briefly came across the business and wanted to share one or two quick thoughts.";
  }

  if (outreachCase === "new_website") {
    return "Write a first-touch Czech outreach email for a business that does not currently have a website. Focus on offering a simple, modern website from scratch. Do not mention redesign, website analysis, or website problems that you could not have observed. Open naturally, as if you came across the business and wanted to suggest a simple practical improvement to its online presence.";
  }

  return "Write a first-touch Czech outreach email for a freelance or local service context. If website analysis is weak or generic, keep the message honest and generic rather than fabricating a website observation. Open naturally, not with a sales-template self-introduction.";
}

function buildPrompt({
  lead,
  settings,
  campaign,
  analysis,
  previousMessages,
  followUpNumber,
}: DraftGenerationArgs) {
  const outreachCase = getOutreachCase({ lead, analysis });
  const isFollowUp = Boolean(followUpNumber && followUpNumber > 0);

  return JSON.stringify(
    {
      task: isFollowUp ? "follow_up_email" : "initial_outreach_email",
      followUpNumber: followUpNumber ?? 0,
      outreachCase,
      sender: {
        name: settings.senderName,
        email: settings.senderEmail,
        serviceDescription: settings.serviceDescription,
        defaultOffer: settings.defaultOffer,
        defaultCta: campaign?.cta ?? settings.defaultCta,
        defaultOptOut: settings.defaultOptOut,
      },
      lead: {
        businessName: lead.businessName,
        contactName: lead.contactName,
        email: lead.email,
        website: lead.website,
        city: lead.city,
        niche: lead.niche,
        sourceUrl: lead.sourceUrl,
        notes: lead.notes,
      },
      output: {
        language: "cs-CZ",
        audience: "local_czech_businesses",
        tone: "formal_human_concise",
      },
      campaign: campaign
        ? {
            name: campaign.name,
            targetNiche: campaign.targetNiche,
            targetCity: campaign.targetCity,
            offerAngle: campaign.offerAngle,
            cta: campaign.cta,
          }
        : null,
      websiteAnalysis: analysis,
      previousOutreach:
        previousMessages?.map((message) => ({
          subject: message.subject,
          body: message.body,
          sentAt: message.sentAt?.toISOString() ?? null,
        })) ?? [],
      instructions: getCaseInstructions(outreachCase, isFollowUp),
    },
    null,
    2,
  );
}

export async function generatePersonalizedDraft(args: DraftGenerationArgs) {
  const client = getClient();
  const response = await client.responses.parse({
    model: args.settings.openAiModel,
    reasoning: {
      effort: "minimal",
    },
    instructions: SYSTEM_PROMPT,
    input: buildPrompt(args),
    max_output_tokens: 500,
    text: {
      format: zodTextFormat(outboundDraftSchema, "localreach_draft"),
    },
  });

  const parsed = response.output_parsed ?? parseDraftFromOutputText(response.output_text);

  if (!parsed) {
    console.error("OpenAI draft generation returned no parseable output.", {
      responseId: response.id,
      model: args.settings.openAiModel,
      status: response.status,
      incompleteDetails: response.incomplete_details,
      outputSummary: summarizeOutput(response),
      outputTextPreview: response.output_text.slice(0, 500),
    });

    throw new Error(buildEmptyResponseError(response));
  }

  const draft = outboundDraftSchema.parse(parsed);

  return {
    subject: draft.subject.trim(),
    body: ensureSignatureAndOptOut(draft.body, args.settings.defaultOptOut),
    personalizationSummary: draft.personalizationSummary.trim(),
  };
}
