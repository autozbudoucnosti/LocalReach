export const APP_NAME = "LocalReach";

export const COMPLIANCE_NOTE =
  "Use only for low-volume, personalized business outreach. Check local legal requirements before sending.";

export const LEAD_STATUSES = [
  "NEW",
  "DRAFTED",
  "APPROVED",
  "SENT",
  "REPLIED",
  "OPTED_OUT",
  "BOUNCED",
] as const;

export const DRAFT_STATUSES = ["DRAFT", "APPROVED", "SENT", "ARCHIVED"] as const;

export const LEAD_BUCKETS = ["LOW", "MEDIUM", "HIGH"] as const;
export const SIGNAL_STRENGTHS = ["LOW", "MEDIUM", "HIGH", "UNKNOWN"] as const;
export const WEBSITE_STATES = ["NO_WEBSITE", "WEAK_WEBSITE", "DECENT_WEBSITE", "UNKNOWN"] as const;
export const RECOMMENDED_OFFERS = ["LAUNCH_PAGE", "SIMPLE_WEBSITE", "REDESIGN_SPRINT"] as const;
export const PRICE_BANDS = ["LOW", "MEDIUM", "HIGH"] as const;
export const NEXT_BEST_ACTIONS = [
  "REVIEW_MANUALLY",
  "CALL_FIRST",
  "LINKEDIN_OUTREACH",
  "CONTACT_FORM_MESSAGE",
  "PREVIEW_WORTH_IT",
  "LOW_PRIORITY_SKIP",
  "ADD_BUSINESS_EMAIL_FIRST",
] as const;
export const OUTREACH_CHANNELS = ["EMAIL", "CALL", "CONTACT_FORM", "LINKEDIN", "OTHER"] as const;
export const OUTREACH_OUTCOMES = ["NO_RESPONSE", "REPLIED", "INTERESTED", "NOT_NOW", "LOST"] as const;
export const CHANNEL_TYPES = [
  "PHONE",
  "LINKEDIN",
  "CONTACT_FORM",
  "WARM_EMAIL",
  "MANUAL_RESEARCH_FIRST",
  "SKIP",
] as const;
export const CONTACT_STATUSES = ["NOT_STARTED", "ATTEMPTED", "REPLIED", "WARM_LEAD", "SKIPPED"] as const;
export const WORKFLOW_ACTIONS = [
  "MAKE_CALL",
  "SEND_LINKEDIN",
  "SEND_CONTACT_FORM",
  "SEND_WARM_EMAIL",
  "DO_MANUAL_RESEARCH",
  "FOLLOW_UP",
  "REVIEW_REPLY",
  "WAIT_FOR_REPLY",
  "SKIP",
] as const;

export const DEFAULT_SETTINGS = {
  senderName: "LocalReach",
  senderEmail: process.env.RESEND_FROM_EMAIL ?? "outreach@example.com",
  serviceDescription:
    "Pomáhám místním firmám upravit starší weby tak, aby působily důvěryhodněji, fungovaly lépe na mobilu a jasněji vedly návštěvníka k dalšímu kroku.",
  defaultOffer: "pomoc s úpravou a modernizací webu",
  defaultCta: "Mělo by pro Vás smysl, kdybych Vám poslal 2-3 krátké nápady k webu?",
  defaultOptOut:
    "Pokud to pro Vás není relevantní, stačí odepsat, že nemáte zájem, a už se neozvu.",
  dailySendCap: "10",
  minimumSecondsBetweenSends: "300",
  openAiModel: process.env.OPENAI_MODEL ?? "gpt-5-mini",
} as const;

export const SETTING_LABELS: Record<keyof typeof DEFAULT_SETTINGS, string> = {
  senderName: "Sender name",
  senderEmail: "Sender email",
  serviceDescription: "Company/service description",
  defaultOffer: "Default offer",
  defaultCta: "Default CTA",
  defaultOptOut: "Default opt-out sentence",
  dailySendCap: "Daily send cap",
  minimumSecondsBetweenSends: "Minimum seconds between sends",
  openAiModel: "OpenAI model",
};

export const FOLLOW_UP_MAX = 2;
export const FOLLOW_UP_RECOMMENDED_MIN_DAYS = 5;
