import { z } from "zod";
import { CHANNEL_TYPES, CONTACT_STATUSES, DRAFT_STATUSES, LEAD_STATUSES } from "@/lib/constants";
import { formatOptionalText, normalizeEmail, normalizeOptionalEmail, normalizeOptionalUrl } from "@/lib/utils";

const optionalString = (max: number) =>
  z.preprocess(
    (value) => (value === null ? undefined : value),
    z
      .string()
      .trim()
      .max(max)
      .optional()
      .transform((value) => formatOptionalText(value)),
  );

const optionalUrl = z
  .preprocess(
    (value) => (value === null ? undefined : value),
    z
      .string()
      .trim()
      .optional()
      .transform((value) => formatOptionalText(value))
      .refine((value) => !value || Boolean(normalizeOptionalUrl(value)), {
        message: "Enter a valid URL or leave it blank.",
      })
      .transform((value) => normalizeOptionalUrl(value)),
  );

const optionalEmail = z
  .preprocess(
    (value) => (value === null ? undefined : value),
    z
      .string()
      .trim()
      .optional()
      .transform((value) => formatOptionalText(value))
      .refine((value) => !value || z.string().email().safeParse(value).success, {
        message: "Enter a valid business email or leave it blank.",
      })
      .transform((value) => normalizeOptionalEmail(value)),
  );

const optionalNumber = (min: number, max: number) =>
  z.preprocess(
    (value) => {
      if (value === "" || value === null || value === undefined) {
        return null;
      }

      return value;
    },
    z.coerce.number().min(min).max(max).nullable(),
  );

export const leadInputSchema = z.object({
  businessName: z.string().trim().min(1, "Business name is required.").max(160),
  contactName: optionalString(120),
  email: optionalEmail,
  phone: optionalString(80),
  website: optionalUrl,
  city: optionalString(80),
  niche: optionalString(80),
  sourceUrl: optionalUrl,
  notes: optionalString(4000),
  googleRating: optionalNumber(0, 5),
  googleReviewCount: optionalNumber(0, 50000).transform((value) => (value === null ? null : Math.round(value))),
  status: z.enum(LEAD_STATUSES),
});

export const csvLeadSchema = leadInputSchema.pick({
  businessName: true,
  contactName: true,
  email: true,
  phone: true,
  website: true,
  city: true,
  niche: true,
  sourceUrl: true,
  notes: true,
  googleRating: true,
  googleReviewCount: true,
});

export const leadQualificationUpdateSchema = z.object({
  qualificationNotes: optionalString(2000),
  outreachChannelUsed: z.enum(["EMAIL", "CALL", "CONTACT_FORM", "LINKEDIN", "OTHER"]).nullable(),
  outreachOutcome: z.enum(["NO_RESPONSE", "REPLIED", "INTERESTED", "NOT_NOW", "LOST"]).nullable(),
  lostReason: optionalString(240),
  meetingBooked: z.boolean(),
  proposalSent: z.boolean(),
  dealWon: z.boolean(),
  dealValue: optionalNumber(0, 10000000).transform((value) => (value === null ? null : Math.round(value))),
});

export const leadWorkflowUpdateSchema = z.object({
  preferredChannel: z.enum(CHANNEL_TYPES).nullable(),
  followUpDueAt: z.preprocess(
    (value) => {
      if (value === "" || value === null || value === undefined) {
        return null;
      }

      if (value instanceof Date) {
        return value;
      }

      return new Date(String(value));
    },
    z.date().nullable(),
  ),
  nextActionNotes: optionalString(1200),
});

export const leadWorkflowEventSchema = z.object({
  event: z.enum(["CALLED", "MESSAGED", "REPLIED", "WARM_LEAD", "SKIPPED"]),
  channel: z.enum(CHANNEL_TYPES).nullable(),
});

export const leadContactStatusSchema = z.enum(CONTACT_STATUSES);

export const campaignInputSchema = z.object({
  name: z.string().trim().min(1, "Campaign name is required.").max(160),
  targetNiche: optionalString(80),
  targetCity: optionalString(80),
  offerAngle: optionalString(240),
  cta: optionalString(240),
  isActive: z.boolean(),
});

export const settingsInputSchema = z.object({
  senderName: z.string().trim().min(1, "Sender name is required.").max(120),
  senderEmail: z.string().trim().email("Enter a valid sender email."),
  serviceDescription: z
    .string()
    .trim()
    .min(1, "Company/service description is required.")
    .max(2000),
  defaultOffer: z.string().trim().min(1, "Default offer is required.").max(240),
  defaultCta: z.string().trim().min(1, "Default CTA is required.").max(240),
  defaultOptOut: z
    .string()
    .trim()
    .min(1, "Default opt-out sentence is required.")
    .max(240),
  dailySendCap: z.coerce.number().int().min(1).max(100),
  minimumSecondsBetweenSends: z.coerce.number().int().min(0).max(86400),
  openAiModel: z.string().trim().min(1).max(120),
});

export const draftEditSchema = z.object({
  subject: z.string().trim().min(1, "Subject is required.").max(200),
  body: z.string().trim().min(1, "Body is required.").max(5000),
  personalizationSummary: optionalString(500),
  status: z.enum(DRAFT_STATUSES).optional(),
});

export const analysisNotesSchema = z.object({
  editorNotes: optionalString(1000),
});

export const suppressionInputSchema = z.object({
  email: z.string().trim().email("Enter a valid email.").transform(normalizeEmail),
  reason: z.string().trim().min(1, "Reason is required.").max(160),
});

export const outboundDraftSchema = z.object({
  subject: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(2000),
  personalizationSummary: z.string().trim().min(1).max(300),
});

export const discoverySearchSchema = z
  .object({
    keyword: z.string().trim().min(1, "Keyword is required.").max(120),
    city: z.string().trim().min(1, "City is required.").max(120),
    country: z.string().trim().min(1, "Country is required.").max(120).default("Czech Republic"),
    limit: z.coerce.number().int().min(1).max(20).default(10),
    onlyWithoutWebsite: z.boolean().default(false),
    onlyWithWebsite: z.boolean().default(false),
  })
  .refine((value) => !(value.onlyWithoutWebsite && value.onlyWithWebsite), {
    message: "Choose at most one website filter.",
    path: ["onlyWithoutWebsite"],
  });

const discoveryClassificationSchema = z.enum(["HAS_WEBSITE", "NO_WEBSITE"]);
const suggestedCampaignSchema = z.enum(["Lokální úprava webu", "Jednoduchý nový web"]);

export const discoveryImportItemSchema = z.object({
  resultId: z.string().trim().min(1).max(80),
  businessName: z.string().trim().min(1).max(160),
  category: optionalString(120),
  address: optionalString(240),
  phone: optionalString(80),
  normalizedPhone: optionalString(40),
  rating: optionalNumber(0, 5),
  reviewCount: optionalNumber(0, 50000).transform((value) => (value === null ? null : Math.round(value))),
  website: optionalUrl,
  sourceUrl: optionalUrl,
  placeId: optionalString(120),
  city: optionalString(120),
  classification: discoveryClassificationSchema,
  suggestedCampaignName: suggestedCampaignSchema,
});

export const discoveryImportRequestSchema = z.object({
  search: discoverySearchSchema,
  items: z.array(discoveryImportItemSchema).min(1).max(20),
});
