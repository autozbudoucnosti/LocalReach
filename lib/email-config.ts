import { z } from "zod";
import { normalizeEmail } from "@/lib/utils";

const replyToEmailSchema = z.string().trim().email().transform(normalizeEmail);

export type ReplyToEnvStatus = "configured" | "missing" | "invalid";

export function getReplyToEnvStatus(): ReplyToEnvStatus {
  const raw = process.env.REPLY_TO_EMAIL?.trim();

  if (!raw) {
    return "missing";
  }

  return replyToEmailSchema.safeParse(raw).success ? "configured" : "invalid";
}

export function getConfiguredReplyToEmail() {
  const raw = process.env.REPLY_TO_EMAIL?.trim();

  if (!raw) {
    return null;
  }

  const parsed = replyToEmailSchema.safeParse(raw);

  if (!parsed.success) {
    throw new Error("REPLY_TO_EMAIL must be a valid email address.");
  }

  return parsed.data;
}
