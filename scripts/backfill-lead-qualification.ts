import "dotenv/config";
import { prisma } from "../lib/prisma";
import { refreshLeadQualificationSnapshot } from "../lib/lead-qualification";

async function main() {
  const leads = await prisma.lead.findMany({
    select: {
      id: true,
    },
  });

  for (const lead of leads) {
    await refreshLeadQualificationSnapshot(lead.id);
  }

  console.log(`Refreshed qualification snapshot for ${leads.length} lead(s).`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
