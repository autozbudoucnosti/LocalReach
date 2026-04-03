import { startOfWeek } from "date-fns";
import type { Prisma } from "@prisma/client";
import { getReplyToEnvStatus } from "@/lib/email-config";
import { prisma } from "@/lib/prisma";
import { getAppSettings } from "@/lib/settings";
import { parseStringArray } from "@/lib/utils";

export type LeadFilters = {
  search?: string;
  niche?: string;
  city?: string;
  status?: string;
  priority?: string;
  recommendedOffer?: string;
  websiteState?: string;
  recommendedChannel?: string;
  contactStatus?: string;
  followUpDue?: string;
  warmOnly?: string;
};

const priorityRank: Record<string, number> = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

export async function getDashboardSnapshot() {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

  const [
    totalLeads,
    pendingDrafts,
    sentThisWeek,
    replies,
    optedOut,
    highPriorityLeads,
    noWebsiteLeads,
    needsBusinessEmail,
    callsToMake,
    messagesToSend,
    followUpsDue,
    warmLeads,
    manualResearchNeeded,
    launchPageLeads,
    simpleWebsiteLeads,
    redesignSprintLeads,
    recentActivity,
  ] =
    await Promise.all([
      prisma.lead.count(),
      prisma.emailDraft.count({
        where: {
          status: "DRAFT",
        },
      }),
      prisma.emailMessage.count({
        where: {
          direction: "OUTBOUND",
          sentAt: {
            gte: weekStart,
          },
        },
      }),
      prisma.lead.count({
        where: {
          status: "REPLIED",
        },
      }),
      prisma.lead.count({
        where: {
          status: "OPTED_OUT",
        },
      }),
      prisma.lead.count({
        where: {
          priorityBucket: "HIGH",
        },
      }),
      prisma.lead.count({
        where: {
          websiteState: "NO_WEBSITE",
        },
      }),
      prisma.lead.count({
        where: {
          email: null,
          status: {
            not: "OPTED_OUT",
          },
          priorityBucket: {
            in: ["MEDIUM", "HIGH"],
          },
        },
      }),
      prisma.lead.count({
        where: {
          nextAction: "MAKE_CALL",
        },
      }),
      prisma.lead.count({
        where: {
          nextAction: {
            in: ["SEND_LINKEDIN", "SEND_CONTACT_FORM", "SEND_WARM_EMAIL"],
          },
        },
      }),
      prisma.lead.count({
        where: {
          followUpDueAt: {
            lte: new Date(),
          },
          contactStatus: {
            notIn: ["REPLIED", "SKIPPED"],
          },
        },
      }),
      prisma.lead.count({
        where: {
          contactStatus: "WARM_LEAD",
        },
      }),
      prisma.lead.count({
        where: {
          nextAction: "DO_MANUAL_RESEARCH",
        },
      }),
      prisma.lead.count({
        where: {
          recommendedOffer: "LAUNCH_PAGE",
        },
      }),
      prisma.lead.count({
        where: {
          recommendedOffer: "SIMPLE_WEBSITE",
        },
      }),
      prisma.lead.count({
        where: {
          recommendedOffer: "REDESIGN_SPRINT",
        },
      }),
      prisma.activityLog.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
        include: {
          lead: {
            select: {
              id: true,
              businessName: true,
            },
          },
        },
      }),
    ]);

  return {
    totalLeads,
    pendingDrafts,
    sentThisWeek,
    replies,
    optedOut,
    highPriorityLeads,
    noWebsiteLeads,
    needsBusinessEmail,
    workflowSummary: {
      callsToMake,
      messagesToSend,
      followUpsDue,
      warmLeads,
      manualResearchNeeded,
    },
    offerBreakdown: [
      { offer: "LAUNCH_PAGE" as const, count: launchPageLeads },
      { offer: "SIMPLE_WEBSITE" as const, count: simpleWebsiteLeads },
      { offer: "REDESIGN_SPRINT" as const, count: redesignSprintLeads },
    ],
    recentActivity,
  };
}

export async function getLeadsPageData(filters: LeadFilters) {
  const search = filters.search?.trim();

  const where: Prisma.LeadWhereInput = {
    ...(filters.niche ? { niche: filters.niche } : {}),
    ...(filters.city ? { city: filters.city } : {}),
    ...(filters.status ? { status: filters.status as Prisma.EnumLeadStatusFilter["equals"] } : {}),
    ...(filters.priority ? { priorityBucket: filters.priority as Prisma.EnumLeadBucketNullableFilter["equals"] } : {}),
    ...(filters.recommendedOffer
      ? { recommendedOffer: filters.recommendedOffer as Prisma.EnumRecommendedOfferNullableFilter["equals"] }
      : {}),
    ...(filters.websiteState
      ? { websiteState: filters.websiteState as Prisma.EnumWebsiteStateNullableFilter["equals"] }
      : {}),
    ...(filters.recommendedChannel
      ? { recommendedChannel: filters.recommendedChannel as Prisma.EnumChannelTypeNullableFilter["equals"] }
      : {}),
    ...(filters.contactStatus
      ? { contactStatus: filters.contactStatus as Prisma.EnumContactStatusNullableFilter["equals"] }
      : {}),
    ...(filters.warmOnly === "1" ? { contactStatus: "WARM_LEAD" } : {}),
    ...(filters.followUpDue === "1"
      ? {
          followUpDueAt: {
            lte: new Date(),
          },
          contactStatus: {
            notIn: ["REPLIED", "SKIPPED"] as const,
          },
        }
      : {}),
    ...(search
      ? {
          OR: [
            { businessName: { contains: search } },
            { email: { contains: search } },
            { phone: { contains: search } },
            { website: { contains: search } },
          ],
        }
      : {}),
  };

  const [
    leads,
    filterSource,
    highPriorityLeads,
    noWebsiteLeads,
    needsBusinessEmail,
    callsToMake,
    messagesToSend,
    followUpsDue,
    warmLeads,
    manualResearchNeeded,
  ] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: {
        updatedAt: "desc",
      },
    }),
    prisma.lead.findMany({
      select: {
        city: true,
        niche: true,
      },
    }),
    prisma.lead.count({
      where: {
        priorityBucket: "HIGH",
      },
    }),
    prisma.lead.count({
      where: {
        websiteState: "NO_WEBSITE",
      },
    }),
    prisma.lead.count({
      where: {
        email: null,
        status: {
          not: "OPTED_OUT",
        },
        priorityBucket: {
          in: ["MEDIUM", "HIGH"],
        },
      },
    }),
    prisma.lead.count({
      where: {
        nextAction: "MAKE_CALL",
      },
    }),
    prisma.lead.count({
      where: {
        nextAction: {
          in: ["SEND_LINKEDIN", "SEND_CONTACT_FORM", "SEND_WARM_EMAIL"],
        },
      },
    }),
    prisma.lead.count({
      where: {
        followUpDueAt: {
          lte: new Date(),
        },
        contactStatus: {
          notIn: ["REPLIED", "SKIPPED"],
        },
      },
    }),
    prisma.lead.count({
      where: {
        contactStatus: "WARM_LEAD",
      },
    }),
    prisma.lead.count({
      where: {
        nextAction: "DO_MANUAL_RESEARCH",
      },
    }),
  ]);

  const niches = Array.from(
    new Set(filterSource.map((item) => item.niche).filter((value): value is string => Boolean(value))),
  ).sort();
  const cities = Array.from(
    new Set(filterSource.map((item) => item.city).filter((value): value is string => Boolean(value))),
  ).sort();
  const sortedLeads = [...leads].sort((left, right) => {
    const priorityDelta = (priorityRank[right.priorityBucket ?? ""] ?? 0) - (priorityRank[left.priorityBucket ?? ""] ?? 0);

    if (priorityDelta !== 0) {
      return priorityDelta;
    }

    if (right.leadScore !== left.leadScore) {
      return right.leadScore - left.leadScore;
    }

    return right.updatedAt.getTime() - left.updatedAt.getTime();
  });

  return {
    leads: sortedLeads,
    niches,
    cities,
    summary: {
      highPriorityLeads,
      noWebsiteLeads,
      needsBusinessEmail,
      callsToMake,
      messagesToSend,
      followUpsDue,
      warmLeads,
      manualResearchNeeded,
    },
  };
}

export async function getLeadDetail(id: string) {
  const [lead, campaigns] = await Promise.all([
    prisma.lead.findUnique({
      where: { id },
      include: {
        analyses: {
          orderBy: {
            analyzedAt: "desc",
          },
        },
        drafts: {
          orderBy: {
            updatedAt: "desc",
          },
          include: {
            campaign: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: "desc",
          },
        },
        activities: {
          orderBy: {
            createdAt: "desc",
          },
          take: 20,
        },
      },
    }),
    prisma.campaign.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    }),
  ]);

  if (!lead) {
    return null;
  }

  const suppression = lead.email
    ? await prisma.suppressionEntry.findUnique({
        where: {
          email: lead.email,
        },
      })
    : null;

  return {
    lead,
    campaigns,
    suppression,
    latestAnalysis: lead.analyses[0]
      ? {
          ...lead.analyses[0],
          issues: parseStringArray(lead.analyses[0].detectedIssues),
        }
      : null,
    latestDraft: lead.drafts[0] ?? null,
    followUpCount: lead.drafts.filter((draft) => draft.followUpNumber > 0).length,
  };
}

export async function getCampaignsPageData() {
  return prisma.campaign.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      _count: {
        select: {
          drafts: true,
        },
      },
    },
  });
}

export async function getSettingsPageData() {
  const [settings, suppressionEntries] = await Promise.all([
    getAppSettings(),
    prisma.suppressionEntry.findMany({
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  return {
    settings,
    suppressionEntries,
    envStatus: {
      resendApiKey: Boolean(process.env.RESEND_API_KEY),
      openAiApiKey: Boolean(process.env.OPENAI_API_KEY),
      resendFromEmail: Boolean(process.env.RESEND_FROM_EMAIL),
      replyToEmail: getReplyToEnvStatus(),
      serpApiKey: Boolean(process.env.SERPAPI_API_KEY),
    },
  };
}
