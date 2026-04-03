"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  importDiscoveryResultsAction,
  searchDiscoveryAction,
  type DiscoveryImportSummary,
  type DiscoveryPreviewResult,
  type DiscoverySearchSummary,
} from "@/actions/discovery-actions";

const inputClassName =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100";

type DiscoveryWorkbenchProps = {
  serpApiConfigured: boolean;
};

export function DiscoveryWorkbench({ serpApiConfigured }: DiscoveryWorkbenchProps) {
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    keyword: "",
    city: "",
    country: "Czech Republic",
    limit: "10",
    onlyWithoutWebsite: false,
    onlyWithWebsite: false,
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[] | undefined>>({});
  const [summary, setSummary] = useState<DiscoverySearchSummary | null>(null);
  const [results, setResults] = useState<DiscoveryPreviewResult[]>([]);
  const [selection, setSelection] = useState<Record<string, boolean>>({});
  const [importSummary, setImportSummary] = useState<DiscoveryImportSummary | null>(null);

  const selectedResults = useMemo(
    () => results.filter((result) => selection[result.resultId]),
    [results, selection],
  );
  const visibleNonDuplicates = useMemo(
    () => results.filter((result) => !result.isDuplicate),
    [results],
  );
  const importedLeadMap = useMemo(
    () =>
      new Map(importSummary?.importedLeads.map((item) => [item.resultId, item.leadId]) ?? []),
    [importSummary],
  );

  function updateForm<Key extends keyof typeof form>(key: Key, value: (typeof form)[Key]) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function toggleSelection(resultId: string, checked: boolean) {
    setSelection((current) => ({
      ...current,
      [resultId]: checked,
    }));
  }

  function search() {
    startTransition(async () => {
      const result = await searchDiscoveryAction({
        keyword: form.keyword,
        city: form.city,
        country: form.country,
        limit: Number(form.limit),
        onlyWithoutWebsite: form.onlyWithoutWebsite,
        onlyWithWebsite: form.onlyWithWebsite,
      });

      if (!result.ok) {
        setFieldErrors(result.fieldErrors ?? {});
        toast.error(result.message);
        return;
      }

      setFieldErrors({});
      setSummary(result.data?.summary ?? null);
      setResults(result.data?.results ?? []);
      setImportSummary(null);
      setSelection({});
      toast.success(result.message);
    });
  }

  function importResults(items: DiscoveryPreviewResult[]) {
    if (items.length === 0) {
      toast.error("Select at least one non-duplicate result to import.");
      return;
    }

    startTransition(async () => {
      const result = await importDiscoveryResultsAction({
        search: {
          keyword: form.keyword,
          city: form.city,
          country: form.country,
          limit: Number(form.limit),
          onlyWithoutWebsite: form.onlyWithoutWebsite,
          onlyWithWebsite: form.onlyWithWebsite,
        },
        items: items.map((item) => ({
          resultId: item.resultId,
          businessName: item.businessName,
          category: item.category,
          address: item.address,
          phone: item.phone,
          normalizedPhone: item.normalizedPhone,
          rating: item.rating,
          reviewCount: item.reviewCount,
          website: item.website,
          sourceUrl: item.sourceUrl,
          placeId: item.placeId,
          city: item.city,
          classification: item.classification,
          suggestedCampaignName: item.suggestedCampaignName,
        })),
      });

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      const importedMap = new Map(result.data?.importedLeads.map((item) => [item.resultId, item.leadId]) ?? []);

      setImportSummary(result.data ?? null);
      setSelection({});
      setResults((current) =>
        current.map((item) =>
          importedMap.has(item.resultId)
            ? {
                ...item,
                isDuplicate: true,
                duplicateReason: "Imported just now.",
                existingLeadId: importedMap.get(item.resultId) ?? item.existingLeadId,
              }
            : item,
        ),
      );
      toast.success(result.message);
    });
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.35)]">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-serif text-2xl text-slate-950">Google Maps discovery</h2>
            <p className="mt-1 text-sm text-slate-600">
              Search low-volume Google Maps results through SerpAPI, review them, and import selected businesses as leads.
            </p>
          </div>
          <p className="text-sm text-slate-500">
            SerpAPI status:{" "}
            <span className="font-semibold text-slate-900">{serpApiConfigured ? "Configured" : "Missing"}</span>
          </p>
        </div>

        {!serpApiConfigured ? (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Add <code>SERPAPI_API_KEY</code> to <code>.env</code> before running discovery.
          </div>
        ) : null}

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.3fr_1fr_1fr_0.8fr]">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Niche / keyword</span>
            <input
              className={inputClassName}
              value={form.keyword}
              onChange={(event) => updateForm("keyword", event.target.value)}
              placeholder="např. zubař, květinářství, instalatér"
            />
            {fieldErrors.keyword ? <p className="text-xs text-rose-600">{fieldErrors.keyword[0]}</p> : null}
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">City</span>
            <input
              className={inputClassName}
              value={form.city}
              onChange={(event) => updateForm("city", event.target.value)}
              placeholder="Brno"
            />
            {fieldErrors.city ? <p className="text-xs text-rose-600">{fieldErrors.city[0]}</p> : null}
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Country</span>
            <input
              className={inputClassName}
              value={form.country}
              onChange={(event) => updateForm("country", event.target.value)}
              placeholder="Czech Republic"
            />
            {fieldErrors.country ? <p className="text-xs text-rose-600">{fieldErrors.country[0]}</p> : null}
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Result limit</span>
            <input
              className={inputClassName}
              value={form.limit}
              onChange={(event) => updateForm("limit", event.target.value)}
              type="number"
              min={1}
              max={20}
            />
            {fieldErrors.limit ? <p className="text-xs text-rose-600">{fieldErrors.limit[0]}</p> : null}
          </label>
        </div>

        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-4 text-sm text-slate-700">
            <label className="inline-flex items-center gap-2">
              <input
                checked={form.onlyWithoutWebsite}
                onChange={(event) => updateForm("onlyWithoutWebsite", event.target.checked)}
                type="checkbox"
              />
              Only show businesses without websites
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                checked={form.onlyWithWebsite}
                onChange={(event) => updateForm("onlyWithWebsite", event.target.checked)}
                type="checkbox"
              />
              Only show businesses with websites
            </label>
          </div>

          <button
            type="button"
            onClick={search}
            disabled={isPending || !serpApiConfigured}
            className="rounded-full bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Searching..." : "Search Google Maps"}
          </button>
        </div>
        {fieldErrors.onlyWithoutWebsite ? (
          <p className="mt-3 text-xs text-rose-600">{fieldErrors.onlyWithoutWebsite[0]}</p>
        ) : null}
      </section>

      {summary ? (
        <section className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.35)]">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-serif text-2xl text-slate-950">Search summary</h2>
              <p className="mt-1 text-sm text-slate-600">{summary.query}</p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-slate-600">
              <span className="rounded-full bg-slate-100 px-3 py-1.5">{summary.resultsReturned} returned</span>
              <span className="rounded-full bg-slate-100 px-3 py-1.5">{summary.hasWebsiteCount} has website</span>
              <span className="rounded-full bg-slate-100 px-3 py-1.5">{summary.noWebsiteCount} no website</span>
              <span className="rounded-full bg-slate-100 px-3 py-1.5">{selectedResults.length} selected</span>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => importResults(selectedResults)}
              disabled={isPending || selectedResults.length === 0}
              className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Import selected
            </button>
            <button
              type="button"
              onClick={() => importResults(visibleNonDuplicates)}
              disabled={isPending || visibleNonDuplicates.length === 0}
              className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Import all visible non-duplicates
            </button>
            <p className="self-center text-sm text-slate-500">
              Imported leads without public email will still need a business email added manually before outreach.
            </p>
          </div>
        </section>
      ) : null}

      {importSummary ? (
        <section className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-6 text-sm text-emerald-950 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.2)]">
          <h2 className="font-serif text-2xl text-slate-950">Import summary</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="rounded-full bg-white px-3 py-1.5">{importSummary.selected} selected</span>
            <span className="rounded-full bg-white px-3 py-1.5">{importSummary.imported} imported</span>
            <span className="rounded-full bg-white px-3 py-1.5">
              {importSummary.skippedDuplicates} skipped as duplicates
            </span>
            <span className="rounded-full bg-white px-3 py-1.5">{importSummary.hasWebsiteCount} has website</span>
            <span className="rounded-full bg-white px-3 py-1.5">{importSummary.noWebsiteCount} no website</span>
          </div>

          {importSummary.importedLeads.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-3">
              {importSummary.importedLeads.map((lead) => (
                <Link
                  key={lead.leadId}
                  href={`/leads/${lead.leadId}`}
                  className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-100"
                >
                  Open {lead.businessName}
                </Link>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.35)]">
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          {results.length > 0 ? (
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Select</th>
                  <th className="px-4 py-3 font-medium">Business</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Address</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium">Reviews</th>
                  <th className="px-4 py-3 font-medium">Website</th>
                  <th className="px-4 py-3 font-medium">Source</th>
                  <th className="px-4 py-3 font-medium">Classification</th>
                  <th className="px-4 py-3 font-medium">Suggested campaign</th>
                  <th className="px-4 py-3 font-medium">Duplicate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {results.map((result) => {
                  const importedLeadId = importedLeadMap.get(result.resultId) ?? result.existingLeadId;

                  return (
                    <tr key={result.resultId} className="align-top hover:bg-slate-50/70">
                      <td className="px-4 py-3">
                        <input
                          checked={Boolean(selection[result.resultId])}
                          onChange={(event) => toggleSelection(result.resultId, event.target.checked)}
                          disabled={result.isDuplicate || isPending}
                          type="checkbox"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-950">{result.businessName}</p>
                        {importedLeadId ? (
                          <Link href={`/leads/${importedLeadId}`} className="mt-1 inline-block text-xs text-cyan-700 hover:text-cyan-800">
                            Open in leads
                          </Link>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{result.category ?? "—"}</td>
                      <td className="px-4 py-3 text-slate-600">{result.address ?? "—"}</td>
                      <td className="px-4 py-3 text-slate-600">{result.phone ?? "—"}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {result.reviewCount !== null
                          ? `${result.reviewCount}${result.rating ? ` (${result.rating})` : ""}`
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {result.website ? (
                          <a href={result.website} target="_blank" rel="noreferrer" className="hover:text-cyan-700">
                            {result.website}
                          </a>
                        ) : (
                          "No website"
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {result.sourceUrl ? (
                          <a href={result.sourceUrl} target="_blank" rel="noreferrer" className="hover:text-cyan-700">
                            Open Maps
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                          {result.classification}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{result.suggestedCampaignName}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {result.isDuplicate ? (
                          <div className="space-y-1">
                            <p className="font-medium text-rose-700">{result.duplicateReason}</p>
                            {result.existingLeadId ? (
                              <Link href={`/leads/${result.existingLeadId}`} className="text-xs text-cyan-700 hover:text-cyan-800">
                                View existing lead
                              </Link>
                            ) : null}
                          </div>
                        ) : (
                          "No"
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="bg-slate-50 px-4 py-8 text-sm text-slate-600">
              Search Google Maps to preview businesses before importing them as leads.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
