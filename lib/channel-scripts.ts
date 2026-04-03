import type { Lead, RecommendedOffer } from "@prisma/client";
import { getOfferLabel } from "@/lib/lead-qualification";

type ChannelScriptInput = Pick<
  Lead,
  | "businessName"
  | "contactName"
  | "city"
  | "niche"
  | "website"
  | "recommendedOffer"
  | "websiteState"
  | "recommendedChannel"
>;

type LatestAnalysisInput = {
  summary: string;
  issues: string[];
} | null;

export type GeneratedChannelScripts = {
  phoneOpener: string;
  callScript: string;
  linkedInFirstMessage: string;
  contactFormMessage: string;
  warmEmailSubject: string;
  warmEmailBody: string;
  shortFollowUpMessage: string;
};

const ISSUE_TRANSLATIONS: Array<{ pattern: RegExp; text: string }> = [
  { pattern: /mobile|viewport/i, text: "na webu není úplně jisté, že na mobilu vede návštěvníka rychle k dalšímu kroku" },
  { pattern: /contact information/i, text: "kontakt na webu není na první pohled moc výrazný" },
  { pattern: /call to action/i, text: "na úvodní stránce není úplně jasné, kam má návštěvník kliknout dál" },
  { pattern: /dated/i, text: "web působí trochu starším dojmem" },
];

function getOfferPitch(offer: RecommendedOffer | null) {
  if (offer === "LAUNCH_PAGE") {
    return "navrhnout jednoduchou vstupní stránku, aby firma měla důvěryhodný základ online";
  }

  if (offer === "SIMPLE_WEBSITE") {
    return "navrhnout jednoduchý, přehledný web, který jasně ukáže služby a další krok";
  }

  if (offer === "REDESIGN_SPRINT") {
    return "ukázat pár konkrétních úprav, které mohou web zpřehlednit a zvednout důvěryhodnost";
  }

  return "poslat 2-3 krátké nápady, jak zlepšit online prezentaci";
}

function getObservation(lead: ChannelScriptInput, analysis: LatestAnalysisInput) {
  if (!lead.website) {
    return "všiml jsem si, že firma zatím nemá vlastní web";
  }

  if (!analysis || analysis.issues.length === 0) {
    return null;
  }

  const translated = ISSUE_TRANSLATIONS.find((item) =>
    analysis.issues.some((issue) => item.pattern.test(issue)),
  );

  return translated?.text ?? null;
}

function getIntro(lead: ChannelScriptInput) {
  const niche = lead.niche ? `${lead.niche.toLowerCase()} v ${lead.city ?? "lokalitě"}` : "místní firmu";
  return `narazil jsem na ${lead.businessName}${lead.city ? ` v ${lead.city}` : ""} a dívám se, jak dnes působí online ${niche}`;
}

function getOfferLine(lead: ChannelScriptInput, analysis: LatestAnalysisInput) {
  const observation = getObservation(lead, analysis);
  const offerPitch = getOfferPitch(lead.recommendedOffer);

  if (observation) {
    return `Mám k tomu jednu stručnou poznámku: ${observation}. Uměl bych ${offerPitch}.`;
  }

  return `Uměl bych ${offerPitch} bez zbytečně velkého projektu nebo složitého procesu.`;
}

function getSoftCta(lead: ChannelScriptInput) {
  if (lead.recommendedOffer === "REDESIGN_SPRINT") {
    return "Pokud by Vám to dávalo smysl, mohu poslat 2-3 konkrétní návrhy.";
  }

  return "Pokud by to pro Vás bylo relevantní, klidně pošlu krátký návrh dalšího postupu.";
}

export function generateChannelScripts(
  lead: ChannelScriptInput,
  analysis: LatestAnalysisInput,
): GeneratedChannelScripts {
  const intro = getIntro(lead);
  const offerLine = getOfferLine(lead, analysis);
  const cta = getSoftCta(lead);
  const offerLabel = getOfferLabel(lead.recommendedOffer) ?? "webovou úpravu";

  return {
    phoneOpener: `Dobrý den, tady Martin Kanócz. ${intro}. Volám jen na minutu, protože mám stručný nápad, jak by šla zlepšit Vaše online prezentace.`,
    callScript: [
      "Dobrý den, tady Martin Kanócz.",
      `${intro}.`,
      offerLine,
      cta,
    ].join(" "),
    linkedInFirstMessage: [
      "Dobrý den,",
      `${intro}.`,
      offerLine,
      cta,
    ].join(" "),
    contactFormMessage: [
      "Dobrý den,",
      `${intro}.`,
      offerLine,
      cta,
    ].join("\n\n"),
    warmEmailSubject: `${offerLabel} pro ${lead.businessName}`,
    warmEmailBody: [
      "Dobrý den,",
      "",
      `${intro}.`,
      offerLine,
      cta,
      "",
      "Martin Kanócz",
    ].join("\n"),
    shortFollowUpMessage: [
      "Dobrý den,",
      "",
      `jen krátce navazuji na předchozí zprávu k ${lead.businessName}.`,
      "Pokud by dávalo smysl poslat 2-3 stručné návrhy, rád je připravím.",
      "",
      "Martin Kanócz",
    ].join("\n"),
  };
}
