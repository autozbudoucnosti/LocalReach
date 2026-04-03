"use server";

import { revalidatePath } from "next/cache";
import { logActivity } from "@/lib/activity";
import type { ActionResult } from "@/lib/action-result";
import { prisma } from "@/lib/prisma";
import { saveSettings } from "@/lib/settings";
import { suppressionInputSchema, settingsInputSchema } from "@/lib/validators";

type SettingsPayload = {
  senderName: string;
  senderEmail: string;
  serviceDescription: string;
  defaultOffer: string;
  defaultCta: string;
  defaultOptOut: string;
  dailySendCap: number | string;
  minimumSecondsBetweenSends: number | string;
  openAiModel: string;
};

function revalidateSettingsPages() {
  revalidatePath("/settings");
  revalidatePath("/dashboard");
  revalidatePath("/leads");
}

export async function saveSettingsAction(payload: SettingsPayload): Promise<ActionResult> {
  const parsed = settingsInputSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the settings fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  await saveSettings({
    senderName: parsed.data.senderName,
    senderEmail: parsed.data.senderEmail,
    serviceDescription: parsed.data.serviceDescription,
    defaultOffer: parsed.data.defaultOffer,
    defaultCta: parsed.data.defaultCta,
    defaultOptOut: parsed.data.defaultOptOut,
    dailySendCap: String(parsed.data.dailySendCap),
    minimumSecondsBetweenSends: String(parsed.data.minimumSecondsBetweenSends),
    openAiModel: parsed.data.openAiModel,
  });

  await logActivity({
    type: "settings.updated",
    message: "Updated app settings.",
  });

  revalidateSettingsPages();

  return {
    ok: true,
    message: "Settings saved.",
  };
}

export async function addSuppressionEntryAction(payload: {
  email: string;
  reason: string;
}): Promise<ActionResult> {
  const parsed = suppressionInputSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Enter a valid email and reason.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  await prisma.suppressionEntry.upsert({
    where: {
      email: parsed.data.email,
    },
    update: {
      reason: parsed.data.reason,
    },
    create: parsed.data,
  });

  await prisma.lead.updateMany({
    where: {
      email: parsed.data.email,
    },
    data: {
      status: "OPTED_OUT",
    },
  });

  await logActivity({
    type: "suppression.added",
    message: `Suppressed ${parsed.data.email}.`,
  });

  revalidateSettingsPages();

  return {
    ok: true,
    message: "Suppression entry saved.",
  };
}

export async function removeSuppressionEntryAction(id: string): Promise<ActionResult> {
  try {
    const existingEntry = await prisma.suppressionEntry.findUnique({
      where: { id },
    });

    if (!existingEntry) {
      return {
        ok: false,
        message: "Suppression entry not found.",
      };
    }

    if (existingEntry.reason.toLowerCase() === "opted out") {
      return {
        ok: false,
        message: "Opt-out suppressions are permanent in this MVP.",
      };
    }

    const entry = await prisma.suppressionEntry.delete({
      where: { id },
    });

    await logActivity({
      type: "suppression.removed",
      message: `Removed suppression for ${entry.email}.`,
    });

    revalidateSettingsPages();

    return {
      ok: true,
      message: "Suppression entry removed.",
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Could not remove suppression entry.",
    };
  }
}
