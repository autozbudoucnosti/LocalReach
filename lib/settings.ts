import { DEFAULT_SETTINGS } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

export type AppSettings = {
  senderName: string;
  senderEmail: string;
  serviceDescription: string;
  defaultOffer: string;
  defaultCta: string;
  defaultOptOut: string;
  dailySendCap: number;
  minimumSecondsBetweenSends: number;
  openAiModel: string;
};

export async function getAppSettings(): Promise<AppSettings> {
  const rows = await prisma.appSetting.findMany();

  const merged = {
    ...DEFAULT_SETTINGS,
    ...Object.fromEntries(rows.map((row) => [row.key, row.value])),
  };

  return {
    senderName: merged.senderName,
    senderEmail: merged.senderEmail,
    serviceDescription: merged.serviceDescription,
    defaultOffer: merged.defaultOffer,
    defaultCta: merged.defaultCta,
    defaultOptOut: merged.defaultOptOut,
    dailySendCap: Number(merged.dailySendCap),
    minimumSecondsBetweenSends: Number(merged.minimumSecondsBetweenSends),
    openAiModel: merged.openAiModel,
  };
}

export async function saveSettings(values: Record<string, string>) {
  await prisma.$transaction(
    Object.entries(values).map(([key, value]) =>
      prisma.appSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      }),
    ),
  );
}
