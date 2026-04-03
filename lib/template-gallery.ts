import type { Lead, RecommendedOffer } from "@prisma/client";
import {
  getMockupPreviewImagePath,
  LOCAL_BUSINESS_MOCKUPS,
  MOCKUP_VERTICAL_LABELS,
  type LocalBusinessMockup,
  type MockupKind,
  type MockupVertical,
  type TemplateWebsiteFit,
} from "@/lib/mockup-data";
import {
  getMockupV2PreviewImagePath,
  LOCAL_BUSINESS_MOCKUPS_V2,
  type MockupV2Definition,
} from "@/lib/mockups-v2-data";

export type { TemplateWebsiteFit } from "@/lib/mockup-data";

export type GalleryTemplate = {
  id: string;
  title: string;
  vertical: MockupVertical;
  kind: MockupKind;
  version: "V1" | "V2";
  recommendedForSales: boolean;
  shortDescription: string;
  previewImagePath: string;
  routeSlug: string;
  routePath: string;
  tags: string[];
  proofAngle?: string;
  offerType: RecommendedOffer;
  websiteFit: TemplateWebsiteFit;
  fitsBusiness: string;
  keyBenefit: string;
  priceBandExample: string;
  whoFor: string;
  problemSolved: string;
  style: string;
  whyItHelpsSales: string;
  matchKeywords: string[];
  isGeneric?: boolean;
};

export type SuggestedTemplate = {
  template: GalleryTemplate;
  reason: string;
  isGenericFallback: boolean;
};

type LeadTemplateContext = Pick<Lead, "businessName" | "niche" | "recommendedOffer" | "websiteState">;

type ScoredTemplate = {
  template: GalleryTemplate;
  score: number;
  reason: string;
  isGenericFallback: boolean;
};

export const TEMPLATE_OFFER_LABELS: Record<RecommendedOffer, string> = {
  LAUNCH_PAGE: "Launch Page",
  SIMPLE_WEBSITE: "Simple Website",
  REDESIGN_SPRINT: "Redesign Sprint",
};

export const TEMPLATE_WEBSITE_FIT_LABELS: Record<TemplateWebsiteFit, string> = {
  NO_WEBSITE: "Vhodné pro firmy bez webu",
  HAS_WEBSITE: "Vhodné pro firmy, které už web mají",
  BOTH: "Funguje pro obě situace",
};

export const TEMPLATE_VERTICAL_LABELS = MOCKUP_VERTICAL_LABELS;

function mapMockupToGalleryTemplate(mockup: LocalBusinessMockup): GalleryTemplate {
  return {
    id: mockup.id,
    title: mockup.gallery.title,
    vertical: mockup.vertical,
    kind: mockup.kind,
    version: "V1",
    recommendedForSales: false,
    shortDescription: mockup.gallery.shortDescription,
    previewImagePath: getMockupPreviewImagePath(mockup.slug),
    routeSlug: mockup.slug,
    routePath: `/mockups/${mockup.slug}`,
    tags: mockup.gallery.tags ?? [],
    proofAngle: mockup.gallery.proofAngle,
    offerType: mockup.offerType,
    websiteFit: mockup.websiteFit,
    fitsBusiness: mockup.gallery.fitsBusiness,
    keyBenefit: mockup.gallery.keyBenefit,
    priceBandExample: mockup.gallery.priceBandExample,
    whoFor: mockup.gallery.whoFor,
    problemSolved: mockup.gallery.problemSolved,
    style: mockup.gallery.style,
    whyItHelpsSales: mockup.gallery.whyItHelpsSales,
    matchKeywords: mockup.matchKeywords,
    isGeneric: mockup.isGeneric,
  };
}

function mapMockupV2ToGalleryTemplate(mockup: MockupV2Definition): GalleryTemplate {
  return {
    id: mockup.id,
    title: mockup.gallery.title,
    vertical: mockup.vertical,
    kind: mockup.kind,
    version: "V2",
    recommendedForSales: mockup.recommendedForSales,
    shortDescription: mockup.gallery.shortDescription,
    previewImagePath: getMockupV2PreviewImagePath(mockup.slug),
    routeSlug: mockup.slug,
    routePath: `/mockups-v2/${mockup.slug}`,
    tags: mockup.gallery.tags,
    proofAngle: mockup.gallery.proofAngle,
    offerType: mockup.offerType,
    websiteFit: mockup.websiteFit,
    fitsBusiness: mockup.gallery.fitsBusiness,
    keyBenefit: mockup.gallery.keyBenefit,
    priceBandExample: mockup.gallery.priceBandExample,
    whoFor: mockup.gallery.whoFor,
    problemSolved: mockup.gallery.problemSolved,
    style: mockup.gallery.style,
    whyItHelpsSales: mockup.gallery.whyItHelpsSales,
    matchKeywords: mockup.matchKeywords,
  };
}

export const TEMPLATE_GALLERY: GalleryTemplate[] = [
  ...LOCAL_BUSINESS_MOCKUPS_V2.map(mapMockupV2ToGalleryTemplate),
  ...LOCAL_BUSINESS_MOCKUPS.map(mapMockupToGalleryTemplate),
];

function normalizeText(value: string | null | undefined) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function getLeadSearchText(lead: LeadTemplateContext) {
  return normalizeText([lead.businessName, lead.niche].filter(Boolean).join(" "));
}

function getMatchedKeywords(template: GalleryTemplate, searchText: string) {
  if (!searchText || template.matchKeywords.length === 0) {
    return [];
  }

  return template.matchKeywords.filter((keyword, index) => {
    const normalizedKeyword = normalizeText(keyword);
    return normalizedKeyword.length > 0 && searchText.includes(normalizedKeyword) && template.matchKeywords.indexOf(keyword) === index;
  });
}

function scoreWebsiteFit(template: GalleryTemplate, websiteState: LeadTemplateContext["websiteState"]) {
  if (!websiteState || websiteState === "UNKNOWN") {
    return {
      score: template.websiteFit === "BOTH" ? 2 : 0,
      reason: "",
    };
  }

  if (websiteState === "NO_WEBSITE") {
    if (template.websiteFit === "NO_WEBSITE") {
      return { score: 12, reason: "Dobře sedí na lead bez webu." };
    }

    if (template.websiteFit === "BOTH") {
      return { score: 8, reason: "Funguje i pro lead bez webu." };
    }

    return { score: 0, reason: "" };
  }

  if (template.websiteFit === "HAS_WEBSITE") {
    return { score: 12, reason: "Ladí s firmou, která už web má." };
  }

  if (template.websiteFit === "BOTH") {
    return { score: 8, reason: "Dává smysl i pro firmu, která už web má." };
  }

  return { score: 0, reason: "" };
}

function buildReason(parts: string[]) {
  return parts.filter(Boolean).join(" ");
}

function scoreSpecificTemplate(template: GalleryTemplate, lead: LeadTemplateContext, matchedKeywords: string[]): ScoredTemplate {
  let score = matchedKeywords.length * 100;
  const reasonParts = [`Silná oborová shoda: ${matchedKeywords.slice(0, 3).join(", ")}.`];

  if (lead.recommendedOffer && template.offerType === lead.recommendedOffer) {
    score += 20;
    reasonParts.push(`Sedí i na nabídku ${TEMPLATE_OFFER_LABELS[template.offerType]}.`);
  }

  const websiteFit = scoreWebsiteFit(template, lead.websiteState);
  score += websiteFit.score;
  if (websiteFit.reason) {
    reasonParts.push(websiteFit.reason);
  }

  if (template.version === "V2") {
    score += 14;
    reasonParts.push("Preferovaný V2 sales proof.");
  }

  if (template.recommendedForSales) {
    score += 8;
    reasonParts.push("Doporučený pro ruční sales použití.");
  }

  if (template.proofAngle) {
    reasonParts.push(`Proof angle: ${template.proofAngle}.`);
  }

  return {
    template,
    score,
    reason: buildReason(reasonParts),
    isGenericFallback: false,
  };
}

function scoreGenericTemplate(
  template: GalleryTemplate,
  lead: LeadTemplateContext,
  matchedKeywords: string[],
  hasSpecificMatch: boolean,
): ScoredTemplate {
  let score = matchedKeywords.length * 70;
  const reasonParts = [
    hasSpecificMatch
      ? "Univerzální záložní koncept pro podobný typ lokální služby."
      : "Použitelný fallback pro lokální službu, když nemáme přesnější oborový mockup.",
  ];

  if (matchedKeywords.length > 0) {
    reasonParts.push(`Blízká shoda: ${matchedKeywords.slice(0, 3).join(", ")}.`);
  }

  if (lead.recommendedOffer && template.offerType === lead.recommendedOffer) {
    score += 20;
    reasonParts.push(`Sedí na nabídku ${TEMPLATE_OFFER_LABELS[template.offerType]}.`);
  }

  const websiteFit = scoreWebsiteFit(template, lead.websiteState);
  score += websiteFit.score;
  if (websiteFit.reason) {
    reasonParts.push(websiteFit.reason);
  }

  return {
    template,
    score,
    reason: buildReason(reasonParts),
    isGenericFallback: true,
  };
}

function canUseGenericFallback(searchText: string, matchedSpecificTemplates: ScoredTemplate[]) {
  if (matchedSpecificTemplates.length > 0) {
    return matchedSpecificTemplates[0]?.template.kind === "trade";
  }

  return TEMPLATE_GALLERY.some((template) => template.kind === "trade" && getMatchedKeywords(template, searchText).length > 0);
}

function dedupeByVertical(templates: ScoredTemplate[]) {
  const seenVerticals = new Set<MockupVertical>();

  return templates.filter((item) => {
    if (item.isGenericFallback) {
      return true;
    }

    if (seenVerticals.has(item.template.vertical)) {
      return false;
    }

    seenVerticals.add(item.template.vertical);
    return true;
  });
}

export function getSuggestedTemplatesForLead(lead: LeadTemplateContext, limit = 2): SuggestedTemplate[] {
  const searchText = getLeadSearchText(lead);
  const specificTemplates = TEMPLATE_GALLERY.filter((template) => !template.isGeneric);
  const genericTemplates = TEMPLATE_GALLERY.filter((template) => template.isGeneric);

  const matchedSpecificTemplates = specificTemplates
    .map((template) => ({
      template,
      matchedKeywords: getMatchedKeywords(template, searchText),
    }))
    .filter((item) => item.matchedKeywords.length > 0)
    .map((item) => scoreSpecificTemplate(item.template, lead, item.matchedKeywords))
    .sort((left, right) => right.score - left.score);

  const results: ScoredTemplate[] = dedupeByVertical(matchedSpecificTemplates).slice(0, limit);

  if (results.length < limit && canUseGenericFallback(searchText, matchedSpecificTemplates)) {
    const genericFallback = genericTemplates
      .map((template) =>
        scoreGenericTemplate(template, lead, getMatchedKeywords(template, searchText), matchedSpecificTemplates.length > 0),
      )
      .filter((item) => item.score > 0)
      .sort((left, right) => right.score - left.score)[0];

    if (genericFallback) {
      results.push(genericFallback);
    }
  }

  return results.slice(0, limit).map(({ template, reason, isGenericFallback }) => ({
    template,
    reason,
    isGenericFallback,
  }));
}
