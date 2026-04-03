import { PageHeader } from "@/components/page-header";
import { SettingsForm } from "@/components/settings-form";
import { getSettingsPageData } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const data = await getSettingsPageData();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Configuration"
        title="Settings"
        description="Store Czech draft defaults, guardrails, and the suppression list for the local MVP."
      />

      <SettingsForm
        key={JSON.stringify({
          settings: data.settings,
          suppression: data.suppressionEntries.map((entry: { id: string; reason: string }) => [
            entry.id,
            entry.reason,
          ]),
        })}
        settings={data.settings}
        envStatus={data.envStatus}
        suppressionEntries={data.suppressionEntries}
      />
    </div>
  );
}
