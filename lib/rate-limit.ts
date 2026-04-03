import { MessageDirection, type EmailDraft, type Lead } from "@prisma/client";
import { differenceInSeconds, startOfDay } from "date-fns";
import { prisma } from "@/lib/prisma";
import { getAppSettings } from "@/lib/settings";
import { normalizeEmail } from "@/lib/utils";

type SendEligibilityArgs = {
  lead: Lead;
  draft: EmailDraft;
};

export async function assertCanSendEmail({ lead, draft }: SendEligibilityArgs) {
  if (draft.status !== "APPROVED") {
    throw new Error("Only approved drafts can be sent.");
  }

  if (!lead.email) {
    throw new Error("Add a public business email before sending outreach.");
  }

  if (lead.status === "OPTED_OUT") {
    throw new Error("This lead has opted out and cannot be emailed.");
  }

  const [settings, suppression, sentToday, lastSentMessage] = await Promise.all([
    getAppSettings(),
    prisma.suppressionEntry.findUnique({
      where: { email: normalizeEmail(lead.email) },
    }),
    prisma.emailMessage.count({
      where: {
        direction: MessageDirection.OUTBOUND,
        sentAt: {
          gte: startOfDay(new Date()),
        },
      },
    }),
    prisma.emailMessage.findFirst({
      where: {
        direction: MessageDirection.OUTBOUND,
        sentAt: {
          not: null,
        },
      },
      orderBy: {
        sentAt: "desc",
      },
    }),
  ]);

  if (suppression) {
    throw new Error("This email is on the suppression list.");
  }

  if (sentToday >= settings.dailySendCap) {
    throw new Error(
      `Daily send cap reached (${settings.dailySendCap}). Increase it in settings before sending more outreach.`,
    );
  }

  if (lastSentMessage?.sentAt) {
    const secondsSincePreviousSend = differenceInSeconds(new Date(), lastSentMessage.sentAt);

    if (secondsSincePreviousSend < settings.minimumSecondsBetweenSends) {
      const waitSeconds = settings.minimumSecondsBetweenSends - secondsSincePreviousSend;
      throw new Error(`Wait ${waitSeconds} more seconds before sending another email.`);
    }
  }

  return {
    sentToday,
    dailySendCap: settings.dailySendCap,
  };
}
