"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { runWebsiteAnalysisAction, saveAnalysisNotesAction } from "@/actions/outreach-actions";

type WebsiteAnalysisPanelProps = {
  leadId: string;
  analysis: {
    id: string;
    homepageTitle: string | null;
    metaDescription: string | null;
    summary: string;
    rawHtmlSnippet: string | null;
    editorNotes: string | null;
    issues: string[];
    analyzedAt: Date;
  } | null;
};

export function WebsiteAnalysisPanel({ leadId, analysis }: WebsiteAnalysisPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editorNotes, setEditorNotes] = useState(analysis?.editorNotes ?? "");

  function runAnalysis() {
    startTransition(async () => {
      const result = await runWebsiteAnalysisAction(leadId);

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.refresh();
    });
  }

  function saveNotes() {
    if (!analysis) {
      toast.error("Run analysis before saving notes.");
      return;
    }

    startTransition(async () => {
      const result = await saveAnalysisNotesAction(analysis.id, {
        editorNotes,
      });

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.refresh();
    });
  }

  return (
    <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.35)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="font-serif text-2xl text-slate-950">Website analysis</h2>
          <p className="mt-1 text-sm text-slate-600">
            Lightweight homepage heuristics only. This is not a full SEO or Lighthouse audit.
          </p>
        </div>
        <button
          type="button"
          onClick={runAnalysis}
          disabled={isPending}
          className="rounded-full bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Running..." : "Run website analysis"}
        </button>
      </div>

      {analysis ? (
        <div className="mt-6 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-950">Summary</p>
            <p className="mt-2 leading-6">{analysis.summary}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-950">Signals</p>
              <dl className="mt-3 space-y-2 text-sm text-slate-600">
                <div>
                  <dt className="font-medium text-slate-700">Homepage title</dt>
                  <dd>{analysis.homepageTitle ?? "Missing"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-700">Meta description</dt>
                  <dd>{analysis.metaDescription ?? "Missing"}</dd>
                </div>
              </dl>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-950">Detected issues</p>
              {analysis.issues.length > 0 ? (
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  {analysis.issues.map((issue) => (
                    <li key={issue}>• {issue}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-slate-500">No obvious issues were detected by the MVP heuristics.</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-950">Manual notes</p>
            <textarea
              value={editorNotes}
              onChange={(event) => setEditorNotes(event.target.value)}
              className="mt-3 min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              placeholder="Add any nuanced observations you want the draft generator to consider."
            />
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={saveNotes}
                disabled={isPending}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Save analysis notes
              </button>
            </div>
          </div>

          {analysis.rawHtmlSnippet ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-950 p-4">
              <p className="text-sm font-semibold text-white">HTML snippet</p>
              <pre className="mt-3 overflow-x-auto whitespace-pre-wrap text-xs leading-6 text-slate-200">
                {analysis.rawHtmlSnippet}
              </pre>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
          No website analysis has been saved for this lead yet.
        </div>
      )}
    </div>
  );
}
