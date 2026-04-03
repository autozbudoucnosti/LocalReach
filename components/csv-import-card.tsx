"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { importLeadsCsvAction } from "@/actions/lead-actions";

export function CsvImportCard() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<{
    created: number;
    skipped: number;
    invalid: number;
    errors: string[];
  } | null>(null);

  function submit() {
    if (!file) {
      toast.error("Choose a CSV file first.");
      return;
    }

    const formData = new FormData();
    formData.set("file", file);

    startTransition(async () => {
      const result = await importLeadsCsvAction(formData);

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      setSummary(result.data ?? null);
      toast.success(result.message);
      router.refresh();
    });
  }

  return (
    <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.35)]">
      <div className="space-y-2">
        <h2 className="font-serif text-2xl text-slate-950">Import leads from CSV</h2>
        <p className="text-sm text-slate-600">
          Supported columns: businessName, contactName, email, website, city, niche, sourceUrl, notes.
        </p>
      </div>

      <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          className="block w-full text-sm text-slate-700 file:mr-4 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800"
        />
        <button
          type="button"
          onClick={submit}
          disabled={isPending}
          className="mt-4 rounded-full bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Importing..." : "Import CSV"}
        </button>
      </div>

      {summary ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <p className="font-semibold text-slate-950">Latest import result</p>
          <div className="mt-3 grid gap-2 md:grid-cols-3">
            <p>Created: {summary.created}</p>
            <p>Skipped: {summary.skipped}</p>
            <p>Invalid: {summary.invalid}</p>
          </div>
          {summary.errors.length > 0 ? (
            <ul className="mt-3 space-y-1 text-xs text-slate-500">
              {summary.errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
