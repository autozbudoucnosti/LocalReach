"use server";

import { addDays, differenceInDays } from "date-fns";
import { revalidatePath } from "next/cache";
import { FOLLOW_UP_MAX } from "@/lib/constants";
import { logActivity } from "@/lib/activity";
import type { ActionResult } from "@/lib/action-result";
import { refreshLeadQualificationSnapshot } from "@/lib/lead-qualification";
import { generatePersonalizedDraft } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import { assertCanSendEmail } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/resend";
import { getAppSettings } from "@/lib/settings";
import { parseStringArray, stringifyStringArray } from "@/lib/utils";
import { analyzeWebsiteHomepage } from "@/lib/website-analysis";
import {
  analysisNotesSchema,
  draftEditSchema,
  leadQualificationUpdateSchema,
  leadWorkflowEventSchema,
  leadWorkflowUpdateSchema,
} from "@/lib/validators";

function revalidateOutreachPages(leadId: string) {
  revalidatePath("/dashboard");
  revalidatePath("/leads");
  revalidatePath(`/leads/${leadId}`);
}

async function getLeadContext(leadId: string) {
  return prisma.lead.findUnique({
    where: { id: leadId },
    include: {
      analyses: {
        orderBy: {
          analyzedAt: "desc",
        },
        take: 1,
      },
      drafts: {
        orderBy: {
          updatedAt: "desc",
        },
        take: 10,
      },
      messages: {
        where: {
          direction: "OUTBOUND",
        },
        orderBy: {
          sentAt: "desc",
        },
        take: 3,
      },
    },
  });
}

export async function runWebsiteAnalysisAction(leadId: string): Promise<ActionResult> {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
  });

  if (!lead?.website) {
    return {
      ok: false,
      message: "Add a website URL before running analysis.",
    };
  }

  try {
    const analysis = await analyzeWebsiteHomepage(lead.website);

    await prisma.websiteAnalysis.create({
      data: {
        leadId,
        homepageTitle: analysis.homepageTitle,
        metaDescription: analysis.metaDescription,
        detectedIssues: stringifyStringArray(analysis.detectedIssues),
        summary: analysis.summary,
        rawHtmlSnippet: analysis.rawHtmlSnippet,
      },
    });

    await prisma.lead.update({
      where: { id: leadId },
      data: {
        website: analysis.normalizedUrl,
      },
    });

    await refreshLeadQualificationSnapshot(leadId);

    await logActivity({
      leadId,
      type: "analysis.created",
      message: `Ran homepage analysis for ${lead.businessName}.`,
    });

    revalidateOutreachPages(leadId);

    return {
      ok: true,
      message: "Website analysis completed.",
    };
  } catch (error) {
    await logActivity({
      leadId,
      type: "analysis.failed",
      message: `Website analysis failed for ${lead.businessName}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    });

    return {
      ok: false,
      message: error instanceof Error ? error.message : "Analysis failed.",
    };
  }
}

export async function saveAnalysisNotesAction(
  analysisId: string,
  payload: { editorNotes?: string },
): Promise<ActionResult> {
  const parsed = analysisNotesSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the analysis notes.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const analysis = await prisma.websiteAnalysis.update({
    where: { id: analysisId },
    data: {
      editorNotes: parsed.data.editorNotes,
    },
  });

  await logActivity({
    leadId: analysis.leadId,
    type: "analysis.notes_saved",
    message: "Updated website analysis notes.",
  });

  revalidateOutreachPages(analysis.leadId);

  return {
    ok: true,
    message: "Analysis notes saved.",
  };
}

export async function updateLeadQualificationAction(
  leadId: string,
  payload: {
    qualificationNotes?: string | null;
    outreachChannelUsed: "EMAIL" | "CALL" | "CONTACT_FORM" | "LINKEDIN" | "OTHER" | null;
    outreachOutcome: "NO_RESPONSE" | "REPLIED" | "INTERESTED" | "NOT_NOW" | "LOST" | null;
    lostReason?: string | null;
    meetingBooked: boolean;
    proposalSent: boolean;
    dealWon: boolean;
    dealValue?: number | string | null;
  },
): Promise<ActionResult> {
  const parsed = leadQualificationUpdateSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the qualification fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    select: { id: true, businessName: true },
  });

  if (!lead) {
    return {
      ok: false,
      message: "Lead not found.",
    };
  }

  await prisma.lead.update({
    where: { id: leadId },
    data: parsed.data,
  });

  await refreshLeadQualificationSnapshot(leadId);

  await logActivity({
    leadId,
    type: "lead.qualification_updated",
    message: `Updated qualification tracking for ${lead.businessName}.`,
  });

  revalidateOutreachPages(leadId);

  return {
    ok: true,
    message: "Qualification details saved.",
  };
}

export async function saveLeadWorkflowAction(
  leadId: string,
  payload: {
    preferredChannel:
      | "PHONE"
      | "LINKEDIN"
      | "CONTACT_FORM"
      | "WARM_EMAIL"
      | "MANUAL_RESEARCH_FIRST"
      | "SKIP"
      | null;
    followUpDueAt?: string | Date | null;
    nextActionNotes?: string | null;
  },
): Promise<ActionResult> {
  const parsed = leadWorkflowUpdateSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the workflow fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    select: { businessName: true },
  });

  if (!lead) {
    return {
      ok: false,
      message: "Lead not found.",
    };
  }

  await prisma.lead.update({
    where: { id: leadId },
    data: parsed.data,
  });

  await refreshLeadQualificationSnapshot(leadId);

  await logActivity({
    leadId,
    type: "lead.workflow_saved",
    message: `Updated workflow settings for ${lead.businessName}.`,
  });

  revalidateOutreachPages(leadId);

  return {
    ok: true,
    message: "Workflow details saved.",
  };
}

export async function recordLeadWorkflowEventAction(
  leadId: string,
  payload: {
    event: "CALLED" | "MESSAGED" | "REPLIED" | "WARM_LEAD" | "SKIPPED";
    channel:
      | "PHONE"
      | "LINKEDIN"
      | "CONTACT_FORM"
      | "WARM_EMAIL"
      | "MANUAL_RESEARCH_FIRST"
      | "SKIP"
      | null;
  },
): Promise<ActionResult> {
  const parsed = leadWorkflowEventSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the workflow action.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    select: {
      businessName: true,
      recommendedChannel: true,
      preferredChannel: true,
      firstContactAt: true,
      firstContactChannel: true,
    },
  });

  if (!lead) {
    return {
      ok: false,
      message: "Lead not found.",
    };
  }

  const effectiveChannel = parsed.data.channel ?? lead.preferredChannel ?? lead.recommendedChannel ?? null;
  const defaultFollowUpDueAt =
    parsed.data.event === "CALLED"
      ? addDays(new Date(), 3)
      : parsed.data.event === "MESSAGED"
        ? addDays(new Date(), 4)
        : null;

  const updateData =
    parsed.data.event === "CALLED"
      ? {
          contactStatus: "ATTEMPTED" as const,
          lastChannelUsed: "PHONE" as const,
          firstContactAt: lead.firstContactAt ?? new Date(),
          firstContactChannel: lead.firstContactChannel ?? "PHONE",
          followUpDueAt: defaultFollowUpDueAt,
        }
      : parsed.data.event === "MESSAGED"
        ? {
            contactStatus: "ATTEMPTED" as const,
            lastChannelUsed: effectiveChannel,
            firstContactAt: lead.firstContactAt ?? new Date(),
            firstContactChannel: lead.firstContactChannel ?? effectiveChannel,
            followUpDueAt: defaultFollowUpDueAt,
          }
        : parsed.data.event === "REPLIED"
          ? {
              contactStatus: "REPLIED" as const,
              outreachOutcome: "REPLIED" as const,
              status: "REPLIED" as const,
              followUpDueAt: null,
            }
          : parsed.data.event === "WARM_LEAD"
            ? {
                contactStatus: "WARM_LEAD" as const,
                outreachOutcome: "INTERESTED" as const,
              }
            : {
                contactStatus: "SKIPPED" as const,
                followUpDueAt: null,
              };

  await prisma.lead.update({
    where: { id: leadId },
    data: updateData,
  });

  await refreshLeadQualificationSnapshot(leadId);

  const eventLabel =
    parsed.data.event === "CALLED"
      ? "called"
      : parsed.data.event === "MESSAGED"
        ? "marked as messaged"
        : parsed.data.event === "REPLIED"
          ? "marked as replied"
          : parsed.data.event === "WARM_LEAD"
            ? "marked as warm"
            : "marked as skipped";

  await logActivity({
    leadId,
    type: "lead.workflow_event",
    message: `Workflow updated for ${lead.businessName}: ${eventLabel}.`,
  });

  revalidateOutreachPages(leadId);

  return {
    ok: true,
    message: "Workflow updated.",
  };
}

export async function generateDraftAction(payload: {
  leadId: string;
  campaignId?: string | null;
}): Promise<ActionResult<{ draftId: string }>> {
  const lead = await getLeadContext(payload.leadId);

  if (!lead) {
    return {
      ok: false,
      message: "Lead not found.",
    };
  }

  if (!lead.email) {
    return {
      ok: false,
      message: "Add a public business email before generating outreach.",
    };
  }

  const leadEmail = lead.email;

  const suppression = await prisma.suppressionEntry.findUnique({
    where: {
      email: leadEmail,
    },
  });

  if (suppression || lead.status === "OPTED_OUT") {
    return {
      ok: false,
      message: "Suppressed leads cannot receive new outreach drafts.",
    };
  }

  const [settings, campaign] = await Promise.all([
    getAppSettings(),
    payload.campaignId
      ? prisma.campaign.findUnique({
          where: { id: payload.campaignId },
        })
      : Promise.resolve(null),
  ]);

  try {
    const generated = await generatePersonalizedDraft({
      lead,
      settings,
      campaign,
      analysis: lead.analyses[0]
        ? {
            homepageTitle: lead.analyses[0].homepageTitle,
            metaDescription: lead.analyses[0].metaDescription,
            summary: lead.analyses[0].summary,
            editorNotes: lead.analyses[0].editorNotes,
            detectedIssues: parseStringArray(lead.analyses[0].detectedIssues),
          }
        : null,
    });

    const draft = await prisma.emailDraft.create({
      data: {
        leadId: lead.id,
        campaignId: campaign?.id ?? null,
        subject: generated.subject,
        body: generated.body,
        personalizationSummary: generated.personalizationSummary,
        status: "DRAFT",
      },
    });

    await prisma.lead.update({
      where: { id: lead.id },
      data: {
        status: "DRAFTED",
      },
    });

    await refreshLeadQualificationSnapshot(lead.id);

    await logActivity({
      leadId: lead.id,
      type: "draft.generated",
      message: `Generated a new outreach draft${campaign ? ` for ${campaign.name}` : ""}.`,
    });

    revalidateOutreachPages(lead.id);

    return {
      ok: true,
      message: "Draft generated.",
      data: {
        draftId: draft.id,
      },
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Draft generation failed.",
    };
  }
}

export async function generateFollowUpAction(payload: {
  leadId: string;
  campaignId?: string | null;
}): Promise<ActionResult<{ draftId: string; followUpNumber: number }>> {
  const lead = await getLeadContext(payload.leadId);

  if (!lead) {
    return {
      ok: false,
      message: "Lead not found.",
    };
  }

  if (!lead.email) {
    return {
      ok: false,
      message: "Add a public business email before generating follow-up drafts.",
    };
  }

  const leadEmail = lead.email;

  const suppression = await prisma.suppressionEntry.findUnique({
    where: {
      email: leadEmail,
    },
  });

  if (suppression || lead.status === "OPTED_OUT") {
    return {
      ok: false,
      message: "Suppressed leads cannot receive follow-up drafts.",
    };
  }

  if (lead.messages.length === 0) {
    return {
      ok: false,
      message: "Send an initial email before creating a follow-up.",
    };
  }

  const followUpNumber = lead.drafts.filter((draft) => draft.followUpNumber > 0).length + 1;

  if (followUpNumber > FOLLOW_UP_MAX) {
    return {
      ok: false,
      message: `This MVP allows up to ${FOLLOW_UP_MAX} follow-up drafts per lead.`,
    };
  }

  const [settings, campaign] = await Promise.all([
    getAppSettings(),
    payload.campaignId
      ? prisma.campaign.findUnique({
          where: { id: payload.campaignId },
        })
      : Promise.resolve(null),
  ]);

  try {
    const generated = await generatePersonalizedDraft({
      lead,
      settings,
      campaign,
      analysis: lead.analyses[0]
        ? {
            homepageTitle: lead.analyses[0].homepageTitle,
            metaDescription: lead.analyses[0].metaDescription,
            summary: lead.analyses[0].summary,
            editorNotes: lead.analyses[0].editorNotes,
            detectedIssues: parseStringArray(lead.analyses[0].detectedIssues),
          }
        : null,
      previousMessages: lead.messages,
      followUpNumber,
    });

    const draft = await prisma.emailDraft.create({
      data: {
        leadId: lead.id,
        campaignId: campaign?.id ?? null,
        subject: generated.subject,
        body: generated.body,
        personalizationSummary: generated.personalizationSummary,
        status: "DRAFT",
        followUpNumber,
      },
    });

    await prisma.lead.update({
      where: { id: lead.id },
      data: {
        status: "DRAFTED",
      },
    });

    await refreshLeadQualificationSnapshot(lead.id);

    const daysSinceLastSend = lead.messages[0]?.sentAt
      ? differenceInDays(new Date(), lead.messages[0].sentAt)
      : null;

    await logActivity({
      leadId: lead.id,
      type: "draft.follow_up_generated",
      message:
        daysSinceLastSend !== null
          ? `Generated follow-up #${followUpNumber} (${daysSinceLastSend} days after last send).`
          : `Generated follow-up #${followUpNumber}.`,
    });

    revalidateOutreachPages(lead.id);

    return {
      ok: true,
      message: `Follow-up #${followUpNumber} generated.`,
      data: {
        draftId: draft.id,
        followUpNumber,
      },
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Follow-up generation failed.",
    };
  }
}

export async function saveDraftEditsAction(
  draftId: string,
  payload: {
    subject: string;
    body: string;
    personalizationSummary?: string;
  },
): Promise<ActionResult> {
  const parsed = draftEditSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the draft fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const existingDraft = await prisma.emailDraft.findUnique({
    where: { id: draftId },
    include: {
      lead: true,
    },
  });

  if (!existingDraft) {
    return {
      ok: false,
      message: "Draft not found.",
    };
  }

  if (existingDraft.status === "SENT") {
    return {
      ok: false,
      message: "Sent drafts are read-only.",
    };
  }

  await prisma.emailDraft.update({
    where: { id: draftId },
    data: {
      subject: parsed.data.subject,
      body: parsed.data.body,
      personalizationSummary: parsed.data.personalizationSummary,
      status: "DRAFT",
    },
  });

  await prisma.lead.update({
    where: { id: existingDraft.leadId },
    data: {
      status: "DRAFTED",
    },
  });

  await refreshLeadQualificationSnapshot(existingDraft.leadId);

  await logActivity({
    leadId: existingDraft.leadId,
    type: "draft.saved",
    message: "Saved draft edits and reset approval.",
  });

  revalidateOutreachPages(existingDraft.leadId);

  return {
    ok: true,
    message: "Draft saved.",
  };
}

export async function approveDraftAction(draftId: string): Promise<ActionResult> {
  const draft = await prisma.emailDraft.findUnique({
    where: { id: draftId },
  });

  if (!draft) {
    return {
      ok: false,
      message: "Draft not found.",
    };
  }

  await prisma.emailDraft.update({
    where: { id: draftId },
    data: {
      status: "APPROVED",
    },
  });

  await prisma.lead.update({
    where: { id: draft.leadId },
    data: {
      status: "APPROVED",
    },
  });

  await refreshLeadQualificationSnapshot(draft.leadId);

  await logActivity({
    leadId: draft.leadId,
    type: "draft.approved",
    message: "Draft approved for manual sending.",
  });

  revalidateOutreachPages(draft.leadId);

  return {
    ok: true,
    message: "Draft approved.",
  };
}

export async function sendApprovedEmailAction(draftId: string): Promise<ActionResult> {
  const draft = await prisma.emailDraft.findUnique({
    where: { id: draftId },
    include: {
      lead: true,
    },
  });

  if (!draft) {
    return {
      ok: false,
      message: "Draft not found.",
    };
  }

  if (!draft.lead.email) {
    return {
      ok: false,
      message: "Add a public business email before sending outreach.",
    };
  }

  const recipientEmail = draft.lead.email;

  try {
    const settings = await getAppSettings();
    await assertCanSendEmail({
      lead: draft.lead,
      draft,
    });

    const resendMessageId = await sendEmail({
      to: recipientEmail,
      subject: draft.subject,
      text: draft.body,
      senderName: settings.senderName,
    });

    await prisma.$transaction([
      prisma.emailDraft.update({
        where: { id: draft.id },
        data: {
          status: "SENT",
        },
      }),
      prisma.lead.update({
        where: { id: draft.leadId },
        data: {
          status: "SENT",
          lastContactedAt: new Date(),
        },
      }),
      prisma.emailMessage.create({
        data: {
          leadId: draft.leadId,
          draftId: draft.id,
          resendMessageId: resendMessageId ?? undefined,
          direction: "OUTBOUND",
          subject: draft.subject,
          body: draft.body,
          sentAt: new Date(),
          deliveryStatus: "sent",
        },
      }),
      prisma.activityLog.create({
        data: {
          leadId: draft.leadId,
          type: "email.sent",
          message: `Sent approved outreach email to ${recipientEmail}.`,
        },
      }),
    ]);

    await refreshLeadQualificationSnapshot(draft.leadId);

    revalidateOutreachPages(draft.leadId);

    return {
      ok: true,
      message: "Email sent through Resend.",
    };
  } catch (error) {
    await logActivity({
      leadId: draft.leadId,
      type: "email.failed",
      message: `Send failed for ${recipientEmail}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    });

    return {
      ok: false,
      message: error instanceof Error ? error.message : "Email send failed.",
    };
  }
}

export async function markRepliedAction(leadId: string): Promise<ActionResult> {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
  });

  if (!lead) {
    return {
      ok: false,
      message: "Lead not found.",
    };
  }

  await prisma.$transaction([
    prisma.lead.update({
      where: { id: leadId },
      data: {
        status: "REPLIED",
      },
    }),
    prisma.emailMessage.create({
      data: {
        leadId,
        direction: "INBOUND",
        subject: "Reply recorded manually",
        body: "Lead marked as replied manually in LocalReach.",
        deliveryStatus: "recorded",
      },
    }),
    prisma.activityLog.create({
      data: {
        leadId,
        type: "lead.replied",
        message: `Marked ${lead.businessName} as replied.`,
      },
    }),
  ]);

  await refreshLeadQualificationSnapshot(leadId);

  revalidateOutreachPages(leadId);

  return {
    ok: true,
    message: "Lead marked as replied.",
  };
}

export async function markOptedOutAction(leadId: string): Promise<ActionResult> {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
  });

  if (!lead) {
    return {
      ok: false,
      message: "Lead not found.",
    };
  }

  if (!lead.email) {
    return {
      ok: false,
      message: "This lead has no email to suppress yet.",
    };
  }

  const email = lead.email;

  await prisma.$transaction([
    prisma.lead.update({
      where: { id: leadId },
      data: {
        status: "OPTED_OUT",
      },
    }),
    prisma.suppressionEntry.upsert({
      where: {
        email,
      },
      update: {
        reason: "Opted out",
      },
      create: {
        email,
        reason: "Opted out",
      },
    }),
    prisma.activityLog.create({
      data: {
        leadId,
        type: "lead.opted_out",
        message: `${lead.businessName} was marked as opted out.`,
      },
    }),
  ]);

  await refreshLeadQualificationSnapshot(leadId);

  revalidateOutreachPages(leadId);
  revalidatePath("/settings");

  return {
    ok: true,
    message: "Lead marked as opted out and suppressed.",
  };
}

export async function addLeadToSuppressionAction(leadId: string): Promise<ActionResult> {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
  });

  if (!lead) {
    return {
      ok: false,
      message: "Lead not found.",
    };
  }

  if (!lead.email) {
    return {
      ok: false,
      message: "This lead has no email to suppress yet.",
    };
  }

  const email = lead.email;

  await prisma.$transaction([
    prisma.lead.update({
      where: { id: leadId },
      data: {
        status: "OPTED_OUT",
      },
    }),
    prisma.suppressionEntry.upsert({
      where: {
        email,
      },
      update: {
        reason: "Manually suppressed",
      },
      create: {
        email,
        reason: "Manually suppressed",
      },
    }),
    prisma.activityLog.create({
      data: {
        leadId,
        type: "lead.suppressed",
        message: `${lead.businessName} was added to the suppression list.`,
      },
    }),
  ]);

  await refreshLeadQualificationSnapshot(leadId);

  revalidateOutreachPages(leadId);
  revalidatePath("/settings");

  return {
    ok: true,
    message: "Lead added to the suppression list.",
  };
}
