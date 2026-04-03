import "dotenv/config";
import { LeadStatus, PrismaClient } from "@prisma/client";
import { DEFAULT_SETTINGS } from "../lib/constants";
import { deriveLeadQualificationSnapshot } from "../lib/lead-qualification";
import { refreshLeadQualificationSnapshot } from "../lib/lead-qualification";

const prisma = new PrismaClient();

async function main() {
  await prisma.emailMessage.deleteMany();
  await prisma.emailDraft.deleteMany();
  await prisma.websiteAnalysis.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.suppressionEntry.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.appSetting.deleteMany();

  await prisma.campaign.create({
    data: {
      name: "Lokální úprava webu",
      targetNiche: "Místní služby",
      targetCity: "Brno",
      offerAngle: "přehlednější mobilní verze",
      cta: "Mělo by pro Vás smysl, kdybych Vám poslal 2-3 krátké nápady k webu?",
      isActive: true,
    },
  });

  const leads = [
    {
      businessName: "Oak Street Dental",
      contactName: "Dr. Novak",
      email: "hello@oakstreetdental.example",
      phone: "+420 111 222 333",
      website: "https://oakstreetdental.example",
      city: "Brno",
      niche: "Dentist",
      sourceUrl: "https://example.com/directory/oak-street-dental",
      googleRating: 4.8,
      googleReviewCount: 41,
      notes: "Family dentistry practice. Public business email from directory listing.",
      status: LeadStatus.NEW,
    },
    {
      businessName: "Riverbend Plumbing",
      contactName: "Martin",
      email: "office@riverbendplumbing.example",
      phone: "+420 222 333 444",
      website: "https://riverbendplumbing.example",
      city: "Brno",
      niche: "Plumber",
      sourceUrl: "https://example.com/directory/riverbend-plumbing",
      googleRating: 4.6,
      googleReviewCount: 18,
      notes: "Busy local plumbing company. Offer mobile refresh angle.",
      status: LeadStatus.DRAFTED,
    },
    {
      businessName: "Maple Corner Bakery",
      contactName: "Eva",
      email: "info@maplecornerbakery.example",
      phone: "+420 333 444 555",
      website: "https://maplecornerbakery.example",
      city: "Prague",
      niche: "Bakery",
      sourceUrl: "https://example.com/directory/maple-corner-bakery",
      googleRating: 4.7,
      googleReviewCount: 67,
      notes: "Seasonal menu highlight could be stronger on homepage.",
      status: LeadStatus.SENT,
    },
    {
      businessName: "Harbor Fitness Studio",
      contactName: "Lucie",
      email: "contact@harborfitness.example",
      phone: "+420 444 555 666",
      website: "https://harborfitness.example",
      city: "Prague",
      niche: "Fitness studio",
      sourceUrl: "https://example.com/directory/harbor-fitness-studio",
      googleRating: 4.5,
      googleReviewCount: 29,
      notes: "Likely candidate for CTA cleanup.",
      status: LeadStatus.REPLIED,
    },
    {
      businessName: "Northfield Legal",
      contactName: null,
      email: "office@northfieldlegal.example",
      phone: "+420 555 666 777",
      website: "https://northfieldlegal.example",
      city: "Ostrava",
      niche: "Law firm",
      sourceUrl: "https://example.com/directory/northfield-legal",
      googleRating: 4.2,
      googleReviewCount: 12,
      notes: "Opted out in a previous conversation. Keep suppressed.",
      status: LeadStatus.OPTED_OUT,
    },
  ];

  for (const lead of leads) {
    const qualification = deriveLeadQualificationSnapshot(
      {
        ...lead,
        phone: lead.phone ?? null,
        website: lead.website ?? null,
        city: lead.city ?? null,
        niche: lead.niche ?? null,
        sourceUrl: lead.sourceUrl ?? null,
        notes: lead.notes ?? null,
        googleRating: lead.googleRating ?? null,
        googleReviewCount: lead.googleReviewCount ?? null,
        outreachOutcome: null,
        dealWon: false,
      },
      null,
    );

    const createdLead = await prisma.lead.create({ data: { ...lead, ...qualification } });
    await refreshLeadQualificationSnapshot(createdLead.id);

    await prisma.activityLog.create({
      data: {
        leadId: createdLead.id,
        type: "seed",
        message: `Seeded lead for ${createdLead.businessName}.`,
      },
    });

    if (createdLead.businessName === "Riverbend Plumbing") {
      await prisma.emailDraft.create({
        data: {
          leadId: createdLead.id,
          subject: "Několik nápadů k webu Riverbend Plumbing",
          body: [
            "Dobrý den, Martine,",
            "",
            "Všiml jsem si, že web Riverbend Plumbing splní základ, ale na mobilu by mohl mít výraznější výzvu pro havarijní kontakt.",
            "Pomáhám místním firmám upravit starší weby tak, aby se v nich lidé rychleji zorientovali a snáze našli další krok.",
            "Mělo by pro Vás smysl, kdybych Vám poslal 2-3 krátké nápady k webu?",
            "",
            DEFAULT_SETTINGS.defaultOptOut,
          ].join("\n"),
          personalizationSummary: "Domovská stránka by mohla mít na mobilu výraznější CTA pro havarijní volání.",
          status: "DRAFT",
        },
      });
    }

    if (createdLead.businessName === "Maple Corner Bakery") {
      const draft = await prisma.emailDraft.create({
        data: {
          leadId: createdLead.id,
          subject: "Krátký podnět k webu Maple Corner Bakery",
          body: [
            "Dobrý den, Evo,",
            "",
            "Všiml jsem si, že Maple Corner Bakery působí příjemně, ale na mobilu by mohly být sezonní produkty a odkazy na objednávku viditelnější.",
            "Upravuji weby malých firem tak, aby působily současněji a byly pro zákazníky jednodušší na použití.",
            "Mělo by pro Vás smysl, kdybych Vám poslal 2-3 krátké nápady k webu?",
            "",
            DEFAULT_SETTINGS.defaultOptOut,
          ].join("\n"),
          personalizationSummary: "Sezonní produkty a odkazy na objednávku by mohly být na mobilu viditelnější.",
          status: "SENT",
        },
      });

      await prisma.emailMessage.create({
        data: {
          leadId: createdLead.id,
          draftId: draft.id,
          direction: "OUTBOUND",
          subject: draft.subject,
          body: draft.body,
          sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          deliveryStatus: "sent",
          resendMessageId: "demo_resend_message_id",
        },
      });
    }

    if (createdLead.businessName === "Harbor Fitness Studio") {
      await prisma.emailMessage.create({
        data: {
          leadId: createdLead.id,
          direction: "INBOUND",
          subject: "Re: nápady k webu",
          body: "Děkujeme, pošlete nám to, až budete mít chvilku.",
          deliveryStatus: "received",
        },
      });
    }
  }

  await prisma.suppressionEntry.create({
    data: {
      email: "office@northfieldlegal.example",
      reason: "Opted out",
    },
  });

  await prisma.appSetting.createMany({
    data: Object.entries(DEFAULT_SETTINGS).map(([key, value]) => ({
      key,
      value,
    })),
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
