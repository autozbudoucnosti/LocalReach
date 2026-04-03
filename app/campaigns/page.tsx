import { CampaignForm } from "@/components/campaign-form";
import { PageHeader } from "@/components/page-header";
import { getCampaignsPageData } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function CampaignsPage() {
  const campaigns = await getCampaignsPageData();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Offer framing"
        title="Campaigns"
        description="Keep campaigns lightweight: a name, targeting hints, offer angle, CTA, and active flag."
      />

      <section className="space-y-4">
        <CampaignForm />
        {campaigns.length > 0 ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {campaigns.map((campaign) => (
              <CampaignForm
                key={`${campaign.id}-${campaign.updatedAt.toISOString()}`}
                campaign={campaign}
              />
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
