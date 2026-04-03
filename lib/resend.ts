import { Resend } from "resend";
import { getConfiguredReplyToEmail } from "@/lib/email-config";

type SendEmailArgs = {
  to: string;
  subject: string;
  text: string;
  senderName: string;
  replyTo?: string | null;
};

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  return new Resend(apiKey);
}

export async function sendEmail({
  to,
  subject,
  text,
  senderName,
  replyTo,
}: SendEmailArgs) {
  const from = process.env.RESEND_FROM_EMAIL;

  if (!from) {
    throw new Error("RESEND_FROM_EMAIL is not configured.");
  }

  const resend = getResendClient();
  const fromAddress = from.includes("<") ? from : `${senderName} <${from}>`;
  const resolvedReplyTo = replyTo ?? getConfiguredReplyToEmail();
  const { data, error } = await resend.emails.send({
    from: fromAddress,
    to,
    replyTo: resolvedReplyTo ?? undefined,
    subject,
    text,
  });

  if (error) {
    throw new Error(error.message || "Resend could not send the email.");
  }

  return data?.id ?? null;
}
