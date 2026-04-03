"use server";

import { revalidatePath } from "next/cache";
import { logActivity } from "@/lib/activity";
import type { ActionResult } from "@/lib/action-result";
import { prisma } from "@/lib/prisma";
import { campaignInputSchema } from "@/lib/validators";

type CampaignPayload = {
  id?: string;
  name: string;
  targetNiche?: string;
  targetCity?: string;
  offerAngle?: string;
  cta?: string;
  isActive: boolean;
};

export async function saveCampaignAction(
  payload: CampaignPayload,
): Promise<ActionResult<{ id: string }>> {
  const parsed = campaignInputSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the campaign fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const campaign = payload.id
    ? await prisma.campaign.update({
        where: { id: payload.id },
        data: parsed.data,
      })
    : await prisma.campaign.create({
        data: parsed.data,
      });

  await logActivity({
    type: payload.id ? "campaign.updated" : "campaign.created",
    message: `${payload.id ? "Updated" : "Created"} campaign ${campaign.name}.`,
  });

  revalidatePath("/campaigns");
  revalidatePath("/leads");

  return {
    ok: true,
    message: payload.id ? "Campaign updated." : "Campaign created.",
    data: { id: campaign.id },
  };
}

export async function deleteCampaignAction(id: string): Promise<ActionResult> {
  try {
    const campaign = await prisma.campaign.delete({
      where: { id },
    });

    await logActivity({
      type: "campaign.deleted",
      message: `Deleted campaign ${campaign.name}.`,
    });

    revalidatePath("/campaigns");
    revalidatePath("/leads");

    return {
      ok: true,
      message: "Campaign deleted.",
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Could not delete campaign.",
    };
  }
}
