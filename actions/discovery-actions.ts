"use server";

import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/lib/action-result";
import { logActivity } from "@/lib/activity";
import { refreshLeadQualificationSnapshot } from "@/lib/lead-qualification";
import { prisma } from "@/lib/prisma";
import {
  searchGoogleMapsBusinesses,
  type DiscoveryClassification,
  type SerpApiDiscoveryResult,
  type SuggestedCampaignName,
} from "@/lib/serpapi";
import {
  discoveryImportRequestSchema,
  discoverySearchSchema,
} from "@/lib/validators";
import { normalizeComparableText } from "@/lib/utils";

export type DiscoveryPreviewResult = SerpApiDiscoveryResult & {
  isDuplicate: boolean;
  duplicateReason: string | null;
  existingLeadId: string | null;
};

export type DiscoverySearchSummary = {
  query: string;
  resultsReturned: number;
  hasWebsiteCount: number;
  noWebsiteCount: number;
};

export type DiscoveryImportedLead = {
  resultId: string;
  leadId: string;
  businessName: string;
};

export type DiscoverySkippedLead = {
  businessName: string;
  reason: string;
  existingLeadId: string | null;
};

export type DiscoveryImportSummary = {
  query: string;
  resultsReturned: number;
  selected: number;
  imported: number;
  skippedDuplicates: number;
  hasWebsiteCount: number;
  noWebsiteCount: number;
  importedLeads: DiscoveryImportedLead[];
  skippedLeads: DiscoverySkippedLead[];
};

type DuplicateMatch = {
  existingLeadId: string;
  reason: string;
};

function revalidateDiscoveryPages() {
  revalidatePath("/dashboard");
  revalidatePath("/leads");
  revalidatePath("/discovery");
}

async function findDuplicateLead(result: SerpApiDiscoveryResult): Promise<DuplicateMatch | null> {
  if (result.website) {
    const existingByWebsite = await prisma.lead.findFirst({
      where: {
        website: result.website,
      },
      select: {
        id: true,
      },
    });

    if (existingByWebsite) {
      return {
        existingLeadId: existingByWebsite.id,
        reason: "Same website already exists.",
      };
    }
  }

  if (result.businessName && result.city) {
    const sameBusinessCandidates = await prisma.lead.findMany({
      where: {
        businessName: result.businessName,
      },
      select: {
        id: true,
        city: true,
      },
      take: 10,
    });

    const sameBusinessAndCity = sameBusinessCandidates.find(
      (candidate) => normalizeComparableText(candidate.city) === normalizeComparableText(result.city),
    );

    if (sameBusinessAndCity) {
      return {
        existingLeadId: sameBusinessAndCity.id,
        reason: "Same business name and city already exist.",
      };
    }
  }

  if (result.normalizedPhone) {
    const existingByPhone = await prisma.lead.findFirst({
      where: {
        notes: {
          contains: `Phone digits: ${result.normalizedPhone}`,
        },
      },
      select: {
        id: true,
      },
    });

    if (existingByPhone) {
      return {
        existingLeadId: existingByPhone.id,
        reason: "Same phone number was already imported.",
      };
    }
  }

  return null;
}

function buildDiscoveryNotes({
  result,
  search,
}: {
  result: SerpApiDiscoveryResult;
  search: {
    keyword: string;
    city: string;
    country: string;
  };
}) {
  const lines = [
    "Imported from Google Maps via SerpAPI.",
    `Search: ${search.keyword} | ${search.city} | ${search.country}`,
    `Classification: ${result.classification}`,
    `Suggested campaign: ${result.suggestedCampaignName}`,
    result.category ? `Category: ${result.category}` : null,
    result.address ? `Address: ${result.address}` : null,
    result.phone ? `Phone: ${result.phone}` : null,
    result.normalizedPhone ? `Phone digits: ${result.normalizedPhone}` : null,
    result.rating ? `Google rating: ${result.rating}` : null,
    result.reviewCount !== null ? `Google reviews: ${result.reviewCount}` : null,
    result.website ? `Website: ${result.website}` : "Website: none found during discovery",
    result.sourceUrl ? `Google Maps source: ${result.sourceUrl}` : null,
    "Public email not found during discovery. Add a business email manually before outreach.",
  ].filter(Boolean);

  return lines.join("\n");
}

function countByClassification(items: Array<{ classification: DiscoveryClassification }>) {
  return {
    hasWebsiteCount: items.filter((item) => item.classification === "HAS_WEBSITE").length,
    noWebsiteCount: items.filter((item) => item.classification === "NO_WEBSITE").length,
  };
}

export async function searchDiscoveryAction(
  payload: {
    keyword: string;
    city: string;
    country?: string;
    limit?: number;
    onlyWithoutWebsite?: boolean;
    onlyWithWebsite?: boolean;
  },
): Promise<ActionResult<{ summary: DiscoverySearchSummary; results: DiscoveryPreviewResult[] }>> {
  const parsed = discoverySearchSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the discovery search fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const search = await searchGoogleMapsBusinesses(parsed.data);
    const duplicateMatches = await Promise.all(search.results.map((result) => findDuplicateLead(result)));
    const results = search.results.map((result, index) => ({
      ...result,
      isDuplicate: Boolean(duplicateMatches[index]),
      duplicateReason: duplicateMatches[index]?.reason ?? null,
      existingLeadId: duplicateMatches[index]?.existingLeadId ?? null,
    }));
    const counts = countByClassification(results);

    return {
      ok: true,
      message:
        results.length > 0
          ? `Found ${results.length} discovery result(s).`
          : "No Google Maps results matched the current search.",
      data: {
        summary: {
          query: search.query,
          resultsReturned: results.length,
          ...counts,
        },
        results,
      },
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Discovery search failed.",
    };
  }
}

export async function importDiscoveryResultsAction(
  payload: {
    search: {
      keyword: string;
      city: string;
      country?: string;
      limit?: number;
      onlyWithoutWebsite?: boolean;
      onlyWithWebsite?: boolean;
    };
    items: Array<{
      resultId: string;
      businessName: string;
      category?: string | null;
      address?: string | null;
      phone?: string | null;
      normalizedPhone?: string | null;
      rating?: number | null;
      reviewCount?: number | null;
      website?: string | null;
      sourceUrl?: string | null;
      placeId?: string | null;
      city?: string | null;
      classification: DiscoveryClassification;
      suggestedCampaignName: SuggestedCampaignName;
    }>;
  },
): Promise<ActionResult<DiscoveryImportSummary>> {
  const parsed = discoveryImportRequestSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the discovery import payload.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const importedLeads: DiscoveryImportedLead[] = [];
  const skippedLeads: DiscoverySkippedLead[] = [];

  for (const item of parsed.data.items) {
    const duplicate = await findDuplicateLead(item);

    if (duplicate) {
      skippedLeads.push({
        businessName: item.businessName,
        reason: duplicate.reason,
        existingLeadId: duplicate.existingLeadId,
      });
      continue;
    }

    const lead = await prisma.lead.create({
      data: {
        businessName: item.businessName,
        email: null,
        phone: item.phone,
        website: item.website,
        city: item.city ?? parsed.data.search.city,
        niche: item.category ?? parsed.data.search.keyword,
        sourceUrl: item.sourceUrl,
        googleRating: item.rating,
        googleReviewCount: item.reviewCount,
        notes: buildDiscoveryNotes({
          result: item,
          search: {
            keyword: parsed.data.search.keyword,
            city: parsed.data.search.city,
            country: parsed.data.search.country,
          },
        }),
        status: "NEW",
      },
    });

    await refreshLeadQualificationSnapshot(lead.id);

    await logActivity({
      leadId: lead.id,
      type: "lead.imported.discovery",
      message: `Imported lead for ${lead.businessName} from Google Maps discovery.`,
    });

    importedLeads.push({
      resultId: item.resultId,
      leadId: lead.id,
      businessName: lead.businessName,
    });
  }

  revalidateDiscoveryPages();

  const counts = countByClassification(parsed.data.items);

  return {
    ok: true,
    message: `Import finished. ${importedLeads.length} lead(s) created, ${skippedLeads.length} skipped as duplicates.`,
    data: {
      query: `${parsed.data.search.keyword} ${parsed.data.search.city} ${parsed.data.search.country}`.trim(),
      resultsReturned: parsed.data.items.length,
      selected: parsed.data.items.length,
      imported: importedLeads.length,
      skippedDuplicates: skippedLeads.length,
      ...counts,
      importedLeads,
      skippedLeads,
    },
  };
}
