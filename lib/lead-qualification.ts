import type {
  Lead,
  LeadBucket,
  LeadStatus,
  NextBestAction,
  OutreachOutcome,
  PriceBand,
  RecommendedOffer,
  SignalStrength,
  WebsiteState,
} from "@prisma/client";
import { deriveLeadChannelStrategySnapshot } from "@/lib/channel-strategy";
import { prisma } from "@/lib/prisma";
import { normalizeComparableText, parseStringArray } from "@/lib/utils";

const HIGH_TICKET_KEYWORDS = [
  "dent",
  "zuba",
  "law",
  "legal",
  "advok",
  "clinic",
  "klin",
  "medical",
  "plast",
  "implant",
  "hvac",
  "roof",
  "kuchyn",
  "remodel",
  "renov",
  "construction",
  "staveb",
  "real estate",
  "reality",
];

const MEDIUM_TICKET_KEYWORDS = [
  "plumb",
  "instalat",
  "electric",
  "elektro",
  "fitness",
  "gym",
  "salon",
  "beauty",
  "mas",
  "physio",
  "autoservis",
  "car service",
  "restaurant",
  "restaur",
  "cafe",
  "hotel",
  "pension",
  "account",
  "účet",
];

const LOW_TICKET_KEYWORDS = [
  "bakery",
  "peka",
  "flower",
  "květ",
  "gift",
  "retail",
  "obchod",
  "barber",
  "hair",
  "kosmet",
  "nail",
  "boutique",
];

const OWNER_LED_HIGH_KEYWORDS = [
  "plumb",
  "instalat",
  "electric",
  "elektro",
  "dent",
  "zuba",
  "bakery",
  "peka",
  "salon",
  "beauty",
  "barber",
  "hair",
  "mas",
  "physio",
  "cafe",
  "restaurant",
  "restaur",
  "květ",
  "flower",
  "fitness",
];

const OWNER_LED_LOW_KEYWORDS = [
  "bank",
  "insurance",
  "hospital",
  "nemoc",
  "university",
  "hotel chain",
  "franchise",
  "developer",
  "group",
  "holding",
  "corporate",
];

const CHAIN_KEYWORDS = [
  "group",
  "holding",
  "franchise",
  "network",
  "chain",
  "pobo",
  "branch",
  "campus",
  "hotel",
  "resort",
  "bank",
  "insurance",
  "clinic group",
];

const LOCAL_FIT_KEYWORDS = [
  "dent",
  "zuba",
  "plumb",
  "instalat",
  "electric",
  "elektro",
  "salon",
  "beauty",
  "fitness",
  "bakery",
  "peka",
  "cafe",
  "restaurant",
  "restaur",
  "law",
  "advok",
  "repair",
  "servis",
  "studio",
];

export const OFFER_CONFIG: Record<
  RecommendedOffer,
  {
    label: string;
    priceBand: PriceBand;
    priceLabel: string;
    summary: string;
  }
> = {
  LAUNCH_PAGE: {
    label: "Launch Page",
    priceBand: "LOW",
    priceLabel: "8 000-15 000 CZK",
    summary: "Rychlý start pro firmu bez webu nebo s velmi slabou online prezentací.",
  },
  SIMPLE_WEBSITE: {
    label: "Simple Website",
    priceBand: "MEDIUM",
    priceLabel: "18 000-35 000 CZK",
    summary: "Jednoduchý prezentační web pro lokální firmu, kde už dává smysl plnější struktura.",
  },
  REDESIGN_SPRINT: {
    label: "Redesign Sprint",
    priceBand: "HIGH",
    priceLabel: "25 000-60 000 CZK",
    summary: "Omezený redesign pro firmy, které už mají web i důvěryhodnost, ale ztrácí konverze.",
  },
};

export const NEXT_ACTION_LABELS: Record<NextBestAction, string> = {
  REVIEW_MANUALLY: "Review manually",
  CALL_FIRST: "Call first",
  LINKEDIN_OUTREACH: "LinkedIn outreach",
  CONTACT_FORM_MESSAGE: "Contact form message",
  PREVIEW_WORTH_IT: "Preview worth it",
  LOW_PRIORITY_SKIP: "Low-priority skip",
  ADD_BUSINESS_EMAIL_FIRST: "Add business email first",
};

export const LEAD_BUCKET_LABELS: Record<LeadBucket, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

export const SIGNAL_STRENGTH_LABELS: Record<SignalStrength, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  UNKNOWN: "Unknown",
};

export const WEBSITE_STATE_LABELS: Record<WebsiteState, string> = {
  NO_WEBSITE: "No website",
  WEAK_WEBSITE: "Weak website",
  DECENT_WEBSITE: "Decent website",
  UNKNOWN: "Unknown",
};

type LeadQualificationSource = Pick<
  Lead,
  | "businessName"
  | "email"
  | "phone"
  | "website"
  | "city"
  | "niche"
  | "sourceUrl"
  | "notes"
  | "googleRating"
  | "googleReviewCount"
  | "status"
  | "outreachOutcome"
  | "dealWon"
>;

type LatestAnalysisInput = {
  detectedIssues: string[];
  homepageTitle: string | null;
  metaDescription: string | null;
} | null;

export type LeadQualificationSnapshot = {
  icpFit: LeadBucket;
  estimatedTicketValue: LeadBucket;
  ownerLedProbability: SignalStrength;
  singleLocation: boolean | null;
  reviewStrength: SignalStrength;
  websiteState: WebsiteState;
  reachability: SignalStrength;
  leadScore: number;
  priorityBucket: LeadBucket;
  scoreExplanation: string;
  recommendedOffer: RecommendedOffer | null;
  recommendedPriceBand: PriceBand | null;
  nextBestAction: NextBestAction;
  qualificationUpdatedAt: Date;
};

function containsKeyword(value: string, keywords: string[]) {
  return keywords.some((keyword) => value.includes(keyword));
}

function joinReasons(items: string[]) {
  if (items.length <= 1) {
    return items[0] ?? "";
  }

  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }

  return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;
}

function getCombinedText(source: LeadQualificationSource) {
  return normalizeComparableText(
    [source.businessName, source.niche, source.notes, source.city].filter(Boolean).join(" "),
  );
}

function getWebsiteState(source: LeadQualificationSource, latestAnalysis: LatestAnalysisInput): WebsiteState {
  if (!source.website) {
    return "NO_WEBSITE";
  }

  if (!latestAnalysis) {
    return "UNKNOWN";
  }

  const issueCount = latestAnalysis.detectedIssues.length;
  const hasStructuralIssue = latestAnalysis.detectedIssues.some((issue) =>
    /dated|mobile|viewport|call to action|contact/i.test(issue),
  );

  if (issueCount >= 3 || (issueCount >= 2 && hasStructuralIssue)) {
    return "WEAK_WEBSITE";
  }

  return "DECENT_WEBSITE";
}

function getReviewStrength(source: LeadQualificationSource): SignalStrength {
  if (source.googleReviewCount === null && source.googleRating === null) {
    return "UNKNOWN";
  }

  const reviewCount = source.googleReviewCount ?? 0;
  const rating = source.googleRating ?? 0;

  if (reviewCount >= 25 && rating >= 4.2) {
    return "HIGH";
  }

  if (reviewCount >= 8 && rating >= 4) {
    return "MEDIUM";
  }

  return "LOW";
}

function getEstimatedTicketValue(combinedText: string): LeadBucket {
  if (containsKeyword(combinedText, HIGH_TICKET_KEYWORDS)) {
    return "HIGH";
  }

  if (containsKeyword(combinedText, MEDIUM_TICKET_KEYWORDS)) {
    return "MEDIUM";
  }

  if (containsKeyword(combinedText, LOW_TICKET_KEYWORDS)) {
    return "LOW";
  }

  return "MEDIUM";
}

function getOwnerLedProbability(combinedText: string, isChainLike: boolean): SignalStrength {
  if (isChainLike || containsKeyword(combinedText, OWNER_LED_LOW_KEYWORDS)) {
    return "LOW";
  }

  if (containsKeyword(combinedText, OWNER_LED_HIGH_KEYWORDS)) {
    return "HIGH";
  }

  return "MEDIUM";
}

function getReachability(source: LeadQualificationSource): SignalStrength {
  if (source.email) {
    return "HIGH";
  }

  if (source.phone || source.website || source.sourceUrl) {
    return "MEDIUM";
  }

  return "LOW";
}

function getSingleLocation(source: LeadQualificationSource, isChainLike: boolean): boolean | null {
  if (isChainLike) {
    return false;
  }

  if (source.city && (source.sourceUrl || source.phone || source.website || source.niche)) {
    return true;
  }

  return null;
}

function toBucket(score: number, mediumThreshold: number, highThreshold: number): LeadBucket {
  if (score >= highThreshold) {
    return "HIGH";
  }

  if (score >= mediumThreshold) {
    return "MEDIUM";
  }

  return "LOW";
}

function getRecommendedOffer(args: {
  websiteState: WebsiteState;
  estimatedTicketValue: LeadBucket;
  reviewStrength: SignalStrength;
  priorityBucket: LeadBucket;
}): RecommendedOffer | null {
  const { websiteState, estimatedTicketValue, reviewStrength, priorityBucket } = args;

  if (websiteState === "NO_WEBSITE") {
    return estimatedTicketValue === "LOW" && reviewStrength !== "HIGH" ? "LAUNCH_PAGE" : "SIMPLE_WEBSITE";
  }

  if (websiteState === "WEAK_WEBSITE") {
    if (estimatedTicketValue === "HIGH" || reviewStrength === "HIGH" || reviewStrength === "MEDIUM") {
      return "REDESIGN_SPRINT";
    }

    return "SIMPLE_WEBSITE";
  }

  if (websiteState === "UNKNOWN") {
    return priorityBucket === "HIGH" ? "REDESIGN_SPRINT" : "SIMPLE_WEBSITE";
  }

  if (websiteState === "DECENT_WEBSITE" && priorityBucket === "HIGH" && estimatedTicketValue === "HIGH") {
    return "REDESIGN_SPRINT";
  }

  return null;
}

function getNextBestAction(args: {
  status: LeadStatus;
  outreachOutcome: OutreachOutcome | null;
  dealWon: boolean;
  priorityBucket: LeadBucket;
  recommendedOffer: RecommendedOffer | null;
  websiteState: WebsiteState;
  email: string | null;
  phone: string | null;
  website: string | null;
}): NextBestAction {
  const { status, outreachOutcome, dealWon, priorityBucket, recommendedOffer, websiteState, email, phone, website } =
    args;

  if (status === "OPTED_OUT" || outreachOutcome === "LOST" || dealWon) {
    return "LOW_PRIORITY_SKIP";
  }

  if (priorityBucket === "LOW") {
    return "LOW_PRIORITY_SKIP";
  }

  if (!email && phone && priorityBucket === "HIGH") {
    return "CALL_FIRST";
  }

  if (!email && website) {
    return "CONTACT_FORM_MESSAGE";
  }

  if (!email) {
    return "ADD_BUSINESS_EMAIL_FIRST";
  }

  if (recommendedOffer === "REDESIGN_SPRINT" && websiteState === "WEAK_WEBSITE") {
    return "PREVIEW_WORTH_IT";
  }

  return "REVIEW_MANUALLY";
}

function getExplanation(priorityBucket: LeadBucket, reasons: Array<{ points: number; text: string }>) {
  const positives = reasons.filter((reason) => reason.points > 0).sort((a, b) => b.points - a.points);
  const negatives = reasons.filter((reason) => reason.points < 0).sort((a, b) => a.points - b.points);

  if (priorityBucket === "LOW") {
    const summary = [...negatives.slice(0, 2), ...positives.slice(0, 1)].map((item) => item.text);
    return `Lower priority because ${joinReasons(summary)}.`;
  }

  const summary = [...positives.slice(0, 3), ...negatives.slice(0, 1)].map((item) => item.text);
  return `${priorityBucket === "HIGH" ? "High" : "Medium"} priority because ${joinReasons(summary)}.`;
}

export function getOfferPriceLabel(offer: RecommendedOffer | null) {
  return offer ? OFFER_CONFIG[offer].priceLabel : null;
}

export function getOfferLabel(offer: RecommendedOffer | null) {
  return offer ? OFFER_CONFIG[offer].label : null;
}

export function deriveLeadQualificationSnapshot(
  source: LeadQualificationSource,
  latestAnalysis: LatestAnalysisInput,
): LeadQualificationSnapshot {
  const combinedText = getCombinedText(source);
  const isChainLike = containsKeyword(combinedText, CHAIN_KEYWORDS);
  const websiteState = getWebsiteState(source, latestAnalysis);
  const reviewStrength = getReviewStrength(source);
  const estimatedTicketValue = getEstimatedTicketValue(combinedText);
  const ownerLedProbability = getOwnerLedProbability(combinedText, isChainLike);
  const reachability = getReachability(source);
  const singleLocation = getSingleLocation(source, isChainLike);
  const hasLocalBusinessFit =
    Boolean(source.city) && (containsKeyword(combinedText, LOCAL_FIT_KEYWORDS) || Boolean(source.sourceUrl));

  let icpScore = 0;
  icpScore += hasLocalBusinessFit ? 25 : 10;
  icpScore += ownerLedProbability === "HIGH" ? 25 : ownerLedProbability === "MEDIUM" ? 15 : 2;
  icpScore += estimatedTicketValue === "HIGH" ? 20 : estimatedTicketValue === "MEDIUM" ? 12 : 4;
  icpScore += singleLocation === true ? 15 : singleLocation === null ? 6 : 0;
  icpScore += websiteState === "NO_WEBSITE" || websiteState === "WEAK_WEBSITE" ? 15 : websiteState === "UNKNOWN" ? 8 : 2;

  const icpFit = toBucket(icpScore, 40, 65);

  const reasons: Array<{ points: number; text: string }> = [];
  let leadScore = 0;

  const addScore = (points: number, text: string) => {
    leadScore += points;
    reasons.push({ points, text });
  };

  if (websiteState === "NO_WEBSITE") {
    addScore(35, "there is no website yet");
  } else if (websiteState === "WEAK_WEBSITE") {
    addScore(26, "the current website looks weak enough to justify a redesign conversation");
  } else if (websiteState === "UNKNOWN") {
    addScore(6, "the site exists but still needs manual review");
  } else {
    addScore(-4, "the current website does not show an obvious urgent problem");
  }

  addScore(
    estimatedTicketValue === "HIGH" ? 18 : estimatedTicketValue === "MEDIUM" ? 10 : 0,
    estimatedTicketValue === "HIGH"
      ? "the niche likely supports a stronger ticket"
      : estimatedTicketValue === "MEDIUM"
        ? "the niche looks commercially viable"
        : "the niche likely has a smaller budget ceiling",
  );

  addScore(
    ownerLedProbability === "HIGH" ? 15 : ownerLedProbability === "MEDIUM" ? 8 : -8,
    ownerLedProbability === "HIGH"
      ? "the business looks owner-led"
      : ownerLedProbability === "MEDIUM"
        ? "the business still looks reachable without a long approval chain"
        : "the business may require a longer buying process",
  );

  addScore(
    singleLocation === true ? 10 : singleLocation === false ? -10 : 0,
    singleLocation === true
      ? "it likely operates as a single local location"
      : "it may be multi-location or chain-like",
  );

  addScore(
    reviewStrength === "HIGH" ? 12 : reviewStrength === "MEDIUM" ? 6 : reviewStrength === "LOW" ? -6 : 0,
    reviewStrength === "HIGH"
      ? "public reviews suggest strong local trust"
      : reviewStrength === "MEDIUM"
        ? "there is at least some public review traction"
        : "public review signals are still weak",
  );

  addScore(
    reachability === "HIGH" ? 16 : reachability === "MEDIUM" ? 8 : -12,
    reachability === "HIGH"
      ? "there is a direct business email"
      : reachability === "MEDIUM"
        ? "there is at least one practical contact path"
        : "contactability is weak right now",
  );

  addScore(
    hasLocalBusinessFit ? 10 : -8,
    hasLocalBusinessFit ? "the lead matches the local-service ICP" : "the local-service fit is still unclear",
  );

  if (source.status === "OPTED_OUT" || source.outreachOutcome === "LOST") {
    addScore(-40, "the lead should not be actively pursued");
  }

  if (source.dealWon) {
    addScore(-25, "this lead is already marked as won");
  }

  const priorityBucket = toBucket(leadScore, 45, 70);
  const recommendedOffer = getRecommendedOffer({
    websiteState,
    estimatedTicketValue,
    reviewStrength,
    priorityBucket,
  });
  const recommendedPriceBand = recommendedOffer ? OFFER_CONFIG[recommendedOffer].priceBand : null;
  const nextBestAction = getNextBestAction({
    status: source.status,
    outreachOutcome: source.outreachOutcome,
    dealWon: source.dealWon,
    priorityBucket,
    recommendedOffer,
    websiteState,
    email: source.email,
    phone: source.phone,
    website: source.website,
  });

  return {
    icpFit,
    estimatedTicketValue,
    ownerLedProbability,
    singleLocation,
    reviewStrength,
    websiteState,
    reachability,
    leadScore,
    priorityBucket,
    scoreExplanation: getExplanation(priorityBucket, reasons),
    recommendedOffer,
    recommendedPriceBand,
    nextBestAction,
    qualificationUpdatedAt: new Date(),
  };
}

export async function refreshLeadQualificationSnapshot(leadId: string) {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: {
      analyses: {
        orderBy: {
          analyzedAt: "desc",
        },
        take: 1,
        select: {
          detectedIssues: true,
          homepageTitle: true,
          metaDescription: true,
        },
      },
    },
  });

  if (!lead) {
    return null;
  }

  const latestAnalysis = lead.analyses[0]
    ? {
        detectedIssues: parseStringArray(lead.analyses[0].detectedIssues),
        homepageTitle: lead.analyses[0].homepageTitle,
        metaDescription: lead.analyses[0].metaDescription,
      }
    : null;

  const snapshot = deriveLeadQualificationSnapshot(lead, latestAnalysis);
  const workflowSnapshot = deriveLeadChannelStrategySnapshot({
    status: lead.status,
    email: lead.email,
    phone: lead.phone,
    website: lead.website,
    city: lead.city,
    businessName: lead.businessName,
    contactName: lead.contactName,
    sourceUrl: lead.sourceUrl,
    priorityBucket: snapshot.priorityBucket,
    recommendedOffer: snapshot.recommendedOffer,
    nextBestAction: snapshot.nextBestAction,
    contactStatus: lead.contactStatus,
    preferredChannel: lead.preferredChannel,
    followUpDueAt: lead.followUpDueAt,
    outreachOutcome: lead.outreachOutcome,
    dealWon: lead.dealWon,
    meetingBooked: lead.meetingBooked,
    proposalSent: lead.proposalSent,
  });

  await prisma.lead.update({
    where: { id: leadId },
    data: {
      ...snapshot,
      ...workflowSnapshot,
    },
  });

  return {
    ...snapshot,
    ...workflowSnapshot,
  };
}
