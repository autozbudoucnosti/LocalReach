"use server";

import { Prisma } from "@prisma/client";
import { parse } from "csv-parse/sync";
import { revalidatePath } from "next/cache";
import { logActivity } from "@/lib/activity";
import type { ActionResult } from "@/lib/action-result";
import { refreshLeadQualificationSnapshot } from "@/lib/lead-qualification";
import { prisma } from "@/lib/prisma";
import { csvLeadSchema, leadInputSchema } from "@/lib/validators";

type LeadPayload = {
  businessName: string;
  contactName?: string;
  email?: string;
  phone?: string;
  website?: string;
  city?: string;
  niche?: string;
  sourceUrl?: string;
  notes?: string;
  googleRating?: number | string | null;
  googleReviewCount?: number | string | null;
  status: string;
};

function validationError(error: Prisma.PrismaClientKnownRequestError | Error | unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    return "A lead with that email or business name + website already exists.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong.";
}

function revalidateLeadPages(id?: string) {
  revalidatePath("/dashboard");
  revalidatePath("/leads");
  if (id) {
    revalidatePath(`/leads/${id}`);
  }
}

export async function createLeadAction(payload: LeadPayload): Promise<ActionResult<{ id: string }>> {
  const parsed = leadInputSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the highlighted lead fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const lead = await prisma.lead.create({
      data: parsed.data,
    });

    await refreshLeadQualificationSnapshot(lead.id);

    await logActivity({
      leadId: lead.id,
      type: "lead.created",
      message: `Lead added for ${lead.businessName}.`,
    });

    revalidateLeadPages(lead.id);

    return {
      ok: true,
      message: "Lead created.",
      data: { id: lead.id },
    };
  } catch (error) {
    return {
      ok: false,
      message: validationError(error),
    };
  }
}

export async function updateLeadAction(
  id: string,
  payload: LeadPayload,
): Promise<ActionResult<{ id: string }>> {
  const parsed = leadInputSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the highlighted lead fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const lead = await prisma.lead.update({
      where: { id },
      data: parsed.data,
    });

    await refreshLeadQualificationSnapshot(id);

    await logActivity({
      leadId: id,
      type: "lead.updated",
      message: `Updated details for ${lead.businessName}.`,
    });

    revalidateLeadPages(id);

    return {
      ok: true,
      message: "Lead details saved.",
      data: { id },
    };
  } catch (error) {
    return {
      ok: false,
      message: validationError(error),
    };
  }
}

export async function importLeadsCsvAction(
  formData: FormData,
): Promise<
  ActionResult<{
    created: number;
    skipped: number;
    invalid: number;
    errors: string[];
  }>
> {
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return {
      ok: false,
      message: "Choose a CSV file to import.",
    };
  }

  try {
    const csvText = await file.text();
    const rows = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as Record<string, string>[];

    let created = 0;
    let skipped = 0;
    let invalid = 0;
    const errors: string[] = [];

    for (const [index, row] of rows.entries()) {
      const parsed = csvLeadSchema.safeParse({
        businessName: row.businessName,
        contactName: row.contactName,
        email: row.email,
        website: row.website,
        city: row.city,
        niche: row.niche,
        sourceUrl: row.sourceUrl,
        notes: row.notes,
      });

      if (!parsed.success) {
        invalid += 1;
        errors.push(`Row ${index + 2}: ${parsed.error.issues[0]?.message ?? "Invalid row."}`);
        continue;
      }

      const duplicateWhere = [
        ...(parsed.data.email ? [{ email: parsed.data.email }] : []),
        ...(parsed.data.website
          ? [
              {
            businessName: parsed.data.businessName,
            website: parsed.data.website,
              },
            ]
          : parsed.data.city
            ? [
                {
                  businessName: parsed.data.businessName,
                  city: parsed.data.city,
                },
              ]
            : []),
      ];

      const duplicate =
        duplicateWhere.length > 0
          ? await prisma.lead.findFirst({
              where: {
                OR: duplicateWhere,
              },
            })
          : null;

      if (duplicate) {
        skipped += 1;
        errors.push(`Row ${index + 2}: skipped duplicate for ${parsed.data.businessName}.`);
        continue;
      }

      try {
        const lead = await prisma.lead.create({
          data: {
            ...parsed.data,
            status: "NEW",
          },
        });

        await refreshLeadQualificationSnapshot(lead.id);

        await logActivity({
          leadId: lead.id,
          type: "lead.imported",
          message: `Imported lead for ${lead.businessName} from CSV.`,
        });

        created += 1;
      } catch (error) {
        skipped += 1;
        errors.push(`Row ${index + 2}: ${validationError(error)}`);
      }
    }

    revalidateLeadPages();

    return {
      ok: true,
      message: `Import finished. ${created} created, ${skipped} skipped, ${invalid} invalid.`,
      data: {
        created,
        skipped,
        invalid,
        errors: errors.slice(0, 10),
      },
    };
  } catch (error) {
    return {
      ok: false,
      message: validationError(error),
    };
  }
}
