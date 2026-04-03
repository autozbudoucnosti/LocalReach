import Link from "next/link";
import { CsvImportCard } from "@/components/csv-import-card";
import { PageHeader } from "@/components/page-header";

export const dynamic = "force-dynamic";

export default function ImportLeadsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Import"
        title="Import leads"
        description="Bring in a small CSV of manually collected local business leads with public contact details only."
        actions={
          <Link
            href="/leads"
            className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back to leads
          </Link>
        }
      />

      <CsvImportCard />
    </div>
  );
}
