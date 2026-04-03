"use client";

import { differenceInDays } from "date-fns";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  approveDraftAction,
  generateDraftAction,
  generateFollowUpAction,
  saveDraftEditsAction,
  sendApprovedEmailAction,
} from "@/actions/outreach-actions";
import { FOLLOW_UP_MAX, FOLLOW_UP_RECOMMENDED_MIN_DAYS } from "@/lib/constants";
import { countWords } from "@/lib/utils";
import { StatusBadge } from "@/components/status-badge";

type DraftEditorProps = {
  leadId: string;
  draft: {
    id: string;
    subject: string;
    body: string;
    personalizationSummary: string | null;
    status: string;
    campaignId: string | null;
    followUpNumber: number;
    updatedAt: Date;
  } | null;
  campaigns: {
    id: string;
    name: string;
    isActive: boolean;
  }[];
  followUpCount: number;
  lastSentAt: Date | null;
  isSuppressed: boolean;
};

const inputClassName =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100";

export function DraftEditor({
  leadId,
  draft,
  campaigns,
  followUpCount,
  lastSentAt,
  isSuppressed,
}: DraftEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedCampaignId, setSelectedCampaignId] = useState(draft?.campaignId ?? "");
  const [subject, setSubject] = useState(draft?.subject ?? "");
  const [body, setBody] = useState(draft?.body ?? "");
  const [personalizationSummary, setPersonalizationSummary] = useState(draft?.personalizationSummary ?? "");

  const daysSinceLastSend =
    lastSentAt instanceof Date ? differenceInDays(new Date(), lastSentAt) : null;

  const followUpHint = useMemo(() => {
    if (daysSinceLastSend === null) {
      return "Follow-ups are available after an initial email has been sent.";
    }

    if (daysSinceLastSend < FOLLOW_UP_RECOMMENDED_MIN_DAYS) {
      return `Recommended timing is ${FOLLOW_UP_RECOMMENDED_MIN_DAYS}-${FOLLOW_UP_RECOMMENDED_MIN_DAYS + 2} days after the last send.`;
    }

    return "Follow-up timing looks reasonable.";
  }, [daysSinceLastSend]);

  function withCampaignId() {
    return selectedCampaignId ? selectedCampaignId : null;
  }

  function generateDraft() {
    startTransition(async () => {
      const result = await generateDraftAction({
        leadId,
        campaignId: withCampaignId(),
      });

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.refresh();
    });
  }

  function generateFollowUp() {
    startTransition(async () => {
      const result = await generateFollowUpAction({
        leadId,
        campaignId: withCampaignId(),
      });

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.refresh();
    });
  }

  function saveDraft() {
    if (!draft) {
      toast.error("Generate a draft first.");
      return;
    }

    startTransition(async () => {
      const result = await saveDraftEditsAction(draft.id, {
        subject,
        body,
        personalizationSummary,
      });

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.refresh();
    });
  }

  function approveDraft() {
    if (!draft) {
      toast.error("Generate a draft first.");
      return;
    }

    startTransition(async () => {
      const result = await approveDraftAction(draft.id);

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.refresh();
    });
  }

  function sendDraft() {
    if (!draft) {
      toast.error("Generate a draft first.");
      return;
    }

    startTransition(async () => {
      const result = await sendApprovedEmailAction(draft.id);

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
          <h2 className="font-serif text-2xl text-slate-950">AI draft</h2>
          <p className="mt-1 text-sm text-slate-600">
            Generate, edit, approve, and manually send one concise Czech draft at a time.
          </p>
        </div>
        {draft ? <StatusBadge status={draft.status} /> : null}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto_auto] md:items-end">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Campaign</span>
          <select
            className={inputClassName}
            value={selectedCampaignId}
            onChange={(event) => setSelectedCampaignId(event.target.value)}
          >
            <option value="">No campaign</option>
            {campaigns.map((campaign) => (
              <option key={campaign.id} value={campaign.id}>
                {campaign.name}
                {campaign.isActive ? "" : " (inactive)"}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={generateDraft}
          disabled={isPending || isSuppressed}
          className="rounded-full bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Working..." : "Generate draft"}
        </button>
        <button
          type="button"
          onClick={generateFollowUp}
          disabled={isPending || isSuppressed || followUpCount >= FOLLOW_UP_MAX}
          className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Generate follow-up
        </button>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        {followUpHint} Drafts are generated in formal Czech for local Czech businesses.
      </p>

      {draft ? (
        <div className="mt-6 space-y-4">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Subject</span>
            <input
              className={inputClassName}
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Email body</span>
            <textarea
              className={`${inputClassName} min-h-60 resize-y`}
              value={body}
              onChange={(event) => setBody(event.target.value)}
            />
            <p className="text-xs text-slate-500">
              {countWords(body)} words. Aim for roughly 80-120 Czech words plus the opt-out line.
            </p>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Personalization summary</span>
            <textarea
              className={`${inputClassName} min-h-24 resize-y`}
              value={personalizationSummary}
              onChange={(event) => setPersonalizationSummary(event.target.value)}
            />
          </label>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={saveDraft}
              disabled={isPending}
              className="rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Save draft edits
            </button>
            <button
              type="button"
              onClick={approveDraft}
              disabled={isPending}
              className="rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Approve draft
            </button>
            <button
              type="button"
              onClick={sendDraft}
              disabled={isPending || draft.status !== "APPROVED" || isSuppressed}
              className="rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Send approved email
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
          No draft yet. Generate a first Czech draft after reviewing the lead details and website analysis.
        </div>
      )}
    </div>
  );
}
