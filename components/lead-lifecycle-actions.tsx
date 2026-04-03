"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  addLeadToSuppressionAction,
  markOptedOutAction,
  markRepliedAction,
} from "@/actions/outreach-actions";

type LeadLifecycleActionsProps = {
  leadId: string;
  isSuppressed: boolean;
};

export function LeadLifecycleActions({ leadId, isSuppressed }: LeadLifecycleActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function run(action: () => Promise<{ ok: boolean; message: string }>) {
    startTransition(async () => {
      const result = await action();

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
      <h2 className="font-serif text-2xl text-slate-950">Lead actions</h2>
      <p className="mt-1 text-sm text-slate-600">
        Manual lifecycle updates only. No automatic sending or reply automation is included.
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => run(() => markRepliedAction(leadId))}
          disabled={isPending}
          className="rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Mark replied
        </button>
        <button
          type="button"
          onClick={() => run(() => markOptedOutAction(leadId))}
          disabled={isPending}
          className="rounded-full bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Mark opted out
        </button>
        <button
          type="button"
          onClick={() => run(() => addLeadToSuppressionAction(leadId))}
          disabled={isPending || isSuppressed}
          className="rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSuppressed ? "Already suppressed" : "Add to suppression list"}
        </button>
      </div>
    </div>
  );
}
