import { createHash } from "node:crypto";
import { normalizeComparableText, normalizeOptionalUrl, normalizePhone } from "@/lib/utils";

export type DiscoveryClassification = "HAS_WEBSITE" | "NO_WEBSITE";
export type SuggestedCampaignName = "Lokální úprava webu" | "Jednoduchý nový web";

export type SerpApiDiscoveryResult = {
  resultId: string;
  businessName: string;
  category: string | null;
  address: string | null;
  phone: string | null;
  normalizedPhone: string | null;
  rating: number | null;
  reviewCount: number | null;
  website: string | null;
  sourceUrl: string | null;
  placeId: string | null;
  city: string | null;
  classification: DiscoveryClassification;
  suggestedCampaignName: SuggestedCampaignName;
};

type SearchGoogleMapsBusinessesArgs = {
  keyword: string;
  city: string;
  country: string;
  limit: number;
  onlyWithoutWebsite: boolean;
  onlyWithWebsite: boolean;
};

type SerpApiRawResult = {
  title?: string;
  type?: string;
  address?: string;
  phone?: string;
  rating?: number | string;
  reviews?: number | string;
  website?: string;
  place_id?: string;
  data_id?: string;
  place_id_search?: string;
  gps_coordinates?: {
    latitude?: number;
    longitude?: number;
  };
  links?: {
    directions?: string;
    place?: string;
    website?: string;
  };
};

function getSerpApiKey() {
  const apiKey = process.env.SERPAPI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("SERPAPI_API_KEY is not configured.");
  }

  return apiKey;
}

function mapCountryToGl(country: string) {
  const normalized = normalizeComparableText(country);

  if (normalized === "cz" || normalized.includes("czech")) {
    return "cz";
  }

  return normalized.slice(0, 2) || "cz";
}

function getClassification(website: string | null): DiscoveryClassification {
  return website ? "HAS_WEBSITE" : "NO_WEBSITE";
}

function getSuggestedCampaignName(classification: DiscoveryClassification): SuggestedCampaignName {
  return classification === "HAS_WEBSITE" ? "Lokální úprava webu" : "Jednoduchý nový web";
}

function getSourceUrl(item: SerpApiRawResult) {
  return normalizeOptionalUrl(item.links?.directions) ?? normalizeOptionalUrl(item.links?.place);
}

function getResultId(item: SerpApiRawResult, fallback: string) {
  const raw = [
    item.place_id,
    item.data_id,
    item.title,
    item.address,
    item.phone,
    item.website,
    fallback,
  ]
    .filter(Boolean)
    .join("|");

  return createHash("sha1").update(raw).digest("hex").slice(0, 12);
}

function parseResult(item: SerpApiRawResult, fallbackCity: string, index: number): SerpApiDiscoveryResult | null {
  const businessName = item.title?.trim();

  if (!businessName) {
    return null;
  }

  const website = normalizeOptionalUrl(item.website) ?? normalizeOptionalUrl(item.links?.website);
  const classification = getClassification(website);

  return {
    resultId: getResultId(item, `${fallbackCity}-${index}`),
    businessName,
    category: item.type?.trim() || null,
    address: item.address?.trim() || null,
    phone: item.phone?.trim() || null,
    normalizedPhone: normalizePhone(item.phone),
    rating: typeof item.rating === "number" ? item.rating : Number(item.rating) || null,
    reviewCount: typeof item.reviews === "number" ? item.reviews : Number(item.reviews) || null,
    website,
    sourceUrl: getSourceUrl(item),
    placeId: item.place_id ?? item.data_id ?? null,
    city: fallbackCity,
    classification,
    suggestedCampaignName: getSuggestedCampaignName(classification),
  };
}

function getLocalResults(payload: Record<string, unknown>) {
  if (Array.isArray(payload.local_results)) {
    return payload.local_results as SerpApiRawResult[];
  }

  if (Array.isArray(payload.places_results)) {
    return payload.places_results as SerpApiRawResult[];
  }

  return [];
}

function mapSerpApiError(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid api key")) {
    return "SERPAPI_API_KEY is invalid.";
  }

  if (
    normalized.includes("run out of searches") ||
    normalized.includes("monthly searches limit reached") ||
    normalized.includes("plan searches limit reached")
  ) {
    return "SerpAPI quota exceeded. Check your SerpAPI plan or wait for quota reset.";
  }

  return `SerpAPI error: ${message}`;
}

export async function searchGoogleMapsBusinesses({
  keyword,
  city,
  country,
  limit,
  onlyWithoutWebsite,
  onlyWithWebsite,
}: SearchGoogleMapsBusinessesArgs) {
  const apiKey = getSerpApiKey();
  const gl = mapCountryToGl(country);
  const query = `${keyword} ${city} ${country}`.trim();
  const params = new URLSearchParams({
    engine: "google_maps",
    type: "search",
    q: query,
    hl: "cs",
    gl,
    api_key: apiKey,
  });

  const response = await fetch(`https://serpapi.com/search.json?${params.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`SerpAPI request failed (${response.status}).`);
  }

  const payload = (await response.json()) as Record<string, unknown>;

  if (typeof payload.error === "string") {
    throw new Error(mapSerpApiError(payload.error));
  }

  const parsedResults = getLocalResults(payload)
    .map((item, index) => parseResult(item, city, index))
    .filter((item): item is SerpApiDiscoveryResult => Boolean(item));

  const filteredResults = parsedResults.filter((item) => {
    if (onlyWithoutWebsite && item.classification !== "NO_WEBSITE") {
      return false;
    }

    if (onlyWithWebsite && item.classification !== "HAS_WEBSITE") {
      return false;
    }

    return true;
  });

  return {
    query,
    results: filteredResults.slice(0, limit),
  };
}
