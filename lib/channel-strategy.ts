import type { ChannelType, ContactStatus, Lead, LeadStatus, WorkflowAction } from "@prisma/client";

type LeadChannelSource = Pick<
  Lead,
  | "status"
  | "email"
  | "phone"
  | "website"
  | "city"
  | "businessName"
  | "contactName"
  | "sourceUrl"
  | "priorityBucket"
  | "recommendedOffer"
  | "nextBestAction"
  | "contactStatus"
  | "preferredChannel"
  | "followUpDueAt"
  | "outreachOutcome"
  | "dealWon"
  | "meetingBooked"
  | "proposalSent"
>;

export type LeadChannelStrategySnapshot = {
  recommendedChannel: ChannelType;
  channelReason: string;
  contactStatus: ContactStatus;
  nextAction: WorkflowAction;
};

export const CHANNEL_LABELS: Record<ChannelType, string> = {
  PHONE: "Telefon",
  LINKEDIN: "LinkedIn",
  CONTACT_FORM: "Kontaktní formulář",
  WARM_EMAIL: "Warm email",
  MANUAL_RESEARCH_FIRST: "Nejdřív dohledat kontakt",
  SKIP: "Přeskočit",
};

export const CONTACT_STATUS_LABELS: Record<ContactStatus, string> = {
  NOT_STARTED: "Bez kontaktu",
  ATTEMPTED: "Kontaktováno",
  REPLIED: "Odpověděli",
  WARM_LEAD: "Warm lead",
  SKIPPED: "Přeskočeno",
};

export const WORKFLOW_ACTION_LABELS: Record<WorkflowAction, string> = {
  MAKE_CALL: "Zavolat",
  SEND_LINKEDIN: "Poslat LinkedIn zprávu",
  SEND_CONTACT_FORM: "Poslat zprávu přes formulář",
  SEND_WARM_EMAIL: "Poslat warm email",
  DO_MANUAL_RESEARCH: "Dohledat správný kontakt",
  FOLLOW_UP: "Udělat follow-up",
  REVIEW_REPLY: "Ruční zpracování odpovědi",
  WAIT_FOR_REPLY: "Počkat na reakci",
  SKIP: "Přeskočit",
};

function getDerivedContactStatus(source: LeadChannelSource): ContactStatus {
  if (source.contactStatus) {
    return source.contactStatus;
  }

  if (source.status === "REPLIED" || source.outreachOutcome === "REPLIED") {
    return "REPLIED";
  }

  if (source.outreachOutcome === "INTERESTED" || source.meetingBooked || source.proposalSent) {
    return "WARM_LEAD";
  }

  return "NOT_STARTED";
}

function hasLinkedInContext(source: LeadChannelSource) {
  return Boolean(source.businessName && source.city && (source.contactName || source.website || source.sourceUrl));
}

function getRecommendedChannel(source: LeadChannelSource): {
  recommendedChannel: ChannelType;
  channelReason: string;
} {
  if (source.status === "OPTED_OUT" || source.outreachOutcome === "LOST" || source.dealWon) {
    return {
      recommendedChannel: "SKIP",
      channelReason: "Lead se teď nemá dál aktivně oslovovat.",
    };
  }

  if (source.priorityBucket === "LOW") {
    return {
      recommendedChannel: "SKIP",
      channelReason: "Priorita je nízká, takže dává smysl lead zatím přeskočit.",
    };
  }

  if (source.nextBestAction === "CALL_FIRST" && source.phone) {
    return {
      recommendedChannel: "PHONE",
      channelReason: "Telefon je dostupný a kvalifikace už teď naznačuje, že nejrychlejší je krátký hovor.",
    };
  }

  if (!source.email && source.phone) {
    return {
      recommendedChannel: "PHONE",
      channelReason: "Firma nemá přímý email, ale má veřejný telefon, takže první kontakt dává největší smysl přes hovor.",
    };
  }

  if (!source.email && source.website) {
    return {
      recommendedChannel: "CONTACT_FORM",
      channelReason: "Email chybí, ale web pravděpodobně nabízí kontaktní formulář nebo jinou ruční cestu.",
    };
  }

  if (source.email) {
    return {
      recommendedChannel: "WARM_EMAIL",
      channelReason: "Veřejný business email je dostupný, takže jde připravit krátký personalizovaný první kontakt bez automatizace.",
    };
  }

  if (hasLinkedInContext(source)) {
    return {
      recommendedChannel: "LINKEDIN",
      channelReason: "Je dost kontextu pro ruční dohledání osoby nebo firmy na LinkedIn, ale chybí lepší přímý kanál.",
    };
  }

  return {
    recommendedChannel: "MANUAL_RESEARCH_FIRST",
    channelReason: "Nejdřív je potřeba ručně dohledat vhodný kontakt nebo kanál, jinak by oslovení bylo slabé.",
  };
}

function getWorkflowAction(args: {
  status: LeadStatus;
  contactStatus: ContactStatus;
  recommendedChannel: ChannelType;
  preferredChannel: ChannelType | null;
  followUpDueAt: Date | null;
}) {
  const effectiveChannel = args.preferredChannel ?? args.recommendedChannel;
  const isFollowUpDue = Boolean(args.followUpDueAt && args.followUpDueAt.getTime() <= Date.now());

  if (args.status === "OPTED_OUT" || args.contactStatus === "SKIPPED" || effectiveChannel === "SKIP") {
    return "SKIP" satisfies WorkflowAction;
  }

  if (args.contactStatus === "REPLIED" || args.contactStatus === "WARM_LEAD") {
    return "REVIEW_REPLY" satisfies WorkflowAction;
  }

  if (isFollowUpDue && args.contactStatus === "ATTEMPTED") {
    return "FOLLOW_UP" satisfies WorkflowAction;
  }

  if (args.contactStatus === "ATTEMPTED") {
    return "WAIT_FOR_REPLY" satisfies WorkflowAction;
  }

  if (effectiveChannel === "PHONE") {
    return "MAKE_CALL" satisfies WorkflowAction;
  }

  if (effectiveChannel === "LINKEDIN") {
    return "SEND_LINKEDIN" satisfies WorkflowAction;
  }

  if (effectiveChannel === "CONTACT_FORM") {
    return "SEND_CONTACT_FORM" satisfies WorkflowAction;
  }

  if (effectiveChannel === "WARM_EMAIL") {
    return "SEND_WARM_EMAIL" satisfies WorkflowAction;
  }

  if (effectiveChannel === "MANUAL_RESEARCH_FIRST") {
    return "DO_MANUAL_RESEARCH" satisfies WorkflowAction;
  }

  return "SKIP" satisfies WorkflowAction;
}

export function deriveLeadChannelStrategySnapshot(source: LeadChannelSource): LeadChannelStrategySnapshot {
  const { recommendedChannel, channelReason } = getRecommendedChannel(source);
  const contactStatus = getDerivedContactStatus(source);

  return {
    recommendedChannel,
    channelReason,
    contactStatus,
    nextAction: getWorkflowAction({
      status: source.status,
      contactStatus,
      recommendedChannel,
      preferredChannel: source.preferredChannel,
      followUpDueAt: source.followUpDueAt,
    }),
  };
}
