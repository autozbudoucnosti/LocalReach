import { DiscoveryWorkbench } from "@/components/discovery-workbench";
import { PageHeader } from "@/components/page-header";

export const dynamic = "force-dynamic";

export default function DiscoveryPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Discovery"
        title="Google Maps lead discovery"
        description="Search Google Maps through SerpAPI, review businesses, and import selected results into LocalReach without any automatic sending."
      />

      <DiscoveryWorkbench serpApiConfigured={Boolean(process.env.SERPAPI_API_KEY)} />
    </div>
  );
}
