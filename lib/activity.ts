import { prisma } from "@/lib/prisma";

type LogActivityArgs = {
  leadId?: string | null;
  type: string;
  message: string;
};

export async function logActivity({ leadId, type, message }: LogActivityArgs) {
  await prisma.activityLog.create({
    data: {
      leadId: leadId ?? null,
      type,
      message,
    },
  });
}
