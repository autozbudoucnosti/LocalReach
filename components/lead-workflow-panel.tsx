"use client";

import { format } from "date-fns";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { recordLeadWorkflowEventAction, saveLeadWorkflowAction } from "@/actions/outreach-actions";
import { CHANNEL_TYPES } from "@/lib/constants";
import {
  CHANNEL_LABELS,
  CONTACT_STATUS_LABELS,
  WORKFLOW_ACTION_LABELS,
} from "@/lib/channel-strategy";

type LeadWorkflowPanelProps = {
  leadId: string;
  workflow: {
    recommendedChannel: "PHONE" | "LINKEDIN" | "CONTACT_FORM" | "WARM_EMAIL" | "MANUAL_RESEARCH_FIRST" | "SKIP" | null;
    preferredChannel: "PHONE" | "LINKEDIN" | "CONTACT_FORM" | "WARM_EMAIL" | "MANUAL_RESEARCH_FIRST" | "SKIP" | null;
    channelReason: string | null;
    contactStatus: "NOT_STARTED" | "ATTEMPTED" | "REPLIED" | "WARM_LEAD" | "SKIPPED" | null;
    lastChannelUsed: "PHONE" | "LINKEDIN" | "CONTACT_FORM" | "WARM_EMAIL" | "MANUAL_RESEARCH_FIRST" | "SKIP" | null;
    firstContactChannel:
      | "PHONE"
      | "LINKEDIN"
      | "CONTACT_FORM"
      | "WARM_EMAIL"
      | "MANUAL_RESEARCH_FIRST"
      | "SKIP"
      | null;
    firstContactAt: Date | null;
    followUpDueAt: Date | null;
    nextAction:
      | "MAKE_CALL"
      | "SEND_LINKEDIN"
      | "SEND_CONTACT_FORM"
      | "SEND_WARM_EMAIL"
      | "DO_MANUAL_RESEARCH"
      | "FOLLOW_UP"
      | "REVIEW_REPLY"
      | "WAIT_FOR_REPLY"
      | "SKIP"
      | null;
    nextActionNotes: string | null;
  };
  scripts: {
    phoneOpener: string;
    callScript: string;
    linkedInFirstMessage: string;
    contactFormMessage: string;
    warmEmailSubject: string;
    warmEmailBody: string;
    shortFollowUpMessage: string;
  };
};

type PreferredChannelValue = NonNullable<LeadWorkflowPanelProps["workflow"]["preferredChannel"]> | "";

const inputClassName =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100";

function ScriptCard({
  title,
  body,
  eyebrow,
}: {
  title: string;
  body: string;
  eyebrow?: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
      {eyebrow ? <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">{eyebrow}</p> : null}
      <p className="mt-1 text-sm font-semibold text-slate-950">{title}</p>
      <div className="mt-3 rounded-2xl bg-slate-50 p-4">
        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{body}</p>
      </div>
    </div>
  );
}

function formatDateTimeLocal(value: Date | null) {
  if (!value) {
    return "";
  }

  return format(value, "yyyy-MM-dd'T'HH:mm");
}

export function LeadWorkflowPanel({ leadId, workflow, scripts }: LeadWorkflowPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});
  const [form, setForm] = useState({
    preferredChannel: (workflow.preferredChannel ?? "") as PreferredChannelValue,
    followUpDueAt: formatDateTimeLocal(workflow.followUpDueAt),
    nextActionNotes: workflow.nextActionNotes ?? "",
  });

  function updateForm<Key extends keyof typeof form>(key: Key, value: (typeof form)[Key]) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function saveWorkflow() {
    startTransition(async () => {
      const result = await saveLeadWorkflowAction(leadId, {
        preferredChannel: form.preferredChannel || null,
        followUpDueAt: form.followUpDueAt || null,
        nextActionNotes: form.nextActionNotes,
      });

      if (!result.ok) {
        setErrors(result.fieldErrors ?? {});
        toast.error(result.message);
        return;
      }

      setErrors({});
      toast.success(result.message);
      router.refresh();
    });
  }

  function runEvent(event: "CALLED" | "MESSAGED" | "REPLIED" | "WARM_LEAD" | "SKIPPED") {
    startTransition(async () => {
      const messageChannel =
        workflow.preferredChannel ??
        workflow.recommendedChannel ??
        (event === "CALLED" ? "PHONE" : null);
      const result = await recordLeadWorkflowEventAction(leadId, {
        event,
        channel: event === "CALLED" ? "PHONE" : messageChannel,
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
    <div className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.35)] md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="font-serif text-2xl text-slate-950">Outreach workflow</h2>
          <p className="mt-1 text-sm text-slate-600">
            Ruční operátorský panel pro první kontakt, follow-up a další krok.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Next action</p>
          <p className="mt-1 font-semibold text-slate-950">
            {workflow.nextAction ? WORKFLOW_ACTION_LABELS[workflow.nextAction] : "Bez doporučení"}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 2xl:grid-cols-[0.92fr_1.08fr]">
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Recommended channel</p>
              <p className="mt-2 text-base font-semibold text-slate-950">
                {workflow.recommendedChannel ? CHANNEL_LABELS[workflow.recommendedChannel] : "Bez doporučení"}
              </p>
              <p className="mt-2 leading-6">{workflow.channelReason ?? "Kanál zatím nebyl vyhodnocen."}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Contact state</p>
              <p className="mt-2 text-base font-semibold text-slate-950">
                {workflow.contactStatus ? CONTACT_STATUS_LABELS[workflow.contactStatus] : "Bez stavu"}
              </p>
              <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-slate-400">Last channel</p>
              <p className="mt-1 text-slate-900">
                {workflow.lastChannelUsed ? CHANNEL_LABELS[workflow.lastChannelUsed] : "Zatím nic"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Follow-up</p>
              <p className="mt-2 text-base font-semibold text-slate-950">
                {workflow.followUpDueAt ? format(workflow.followUpDueAt, "PPP p") : "Nenastaveno"}
              </p>
              <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-slate-400">First contact</p>
              <p className="mt-1 text-slate-900">
                {workflow.firstContactAt
                  ? `${format(workflow.firstContactAt, "PPP p")}${workflow.firstContactChannel ? ` · ${CHANNEL_LABELS[workflow.firstContactChannel]}` : ""}`
                  : "Zatím nic"}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-950">Rychlé akce</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => runEvent("CALLED")}
                disabled={isPending}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
              >
                Mark called
              </button>
              <button
                type="button"
                onClick={() => runEvent("MESSAGED")}
                disabled={isPending}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
              >
                Mark messaged
              </button>
              <button
                type="button"
                onClick={() => runEvent("REPLIED")}
                disabled={isPending}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
              >
                Mark replied
              </button>
              <button
                type="button"
                onClick={() => runEvent("WARM_LEAD")}
                disabled={isPending}
                className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100 disabled:opacity-60"
              >
                Mark warm lead
              </button>
              <button
                type="button"
                onClick={() => runEvent("SKIPPED")}
                disabled={isPending}
                className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-800 transition hover:bg-rose-100 disabled:opacity-60"
              >
                Mark skipped
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-950">Workflow notes</p>
            <div className="mt-4 space-y-4">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Preferred channel</span>
                <select
                  value={form.preferredChannel}
                  onChange={(event) => updateForm("preferredChannel", event.target.value as PreferredChannelValue)}
                  className={inputClassName}
                >
                  <option value="">Use recommended channel</option>
                  {CHANNEL_TYPES.map((channel) => (
                    <option key={channel} value={channel}>
                      {CHANNEL_LABELS[channel]}
                    </option>
                  ))}
                </select>
                {errors.preferredChannel ? <p className="text-xs text-rose-600">{errors.preferredChannel[0]}</p> : null}
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Follow-up due</span>
                <input
                  value={form.followUpDueAt}
                  onChange={(event) => updateForm("followUpDueAt", event.target.value)}
                  type="datetime-local"
                  className={inputClassName}
                />
                {errors.followUpDueAt ? <p className="text-xs text-rose-600">{errors.followUpDueAt[0]}</p> : null}
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Manual notes</span>
                <textarea
                  value={form.nextActionNotes}
                  onChange={(event) => updateForm("nextActionNotes", event.target.value)}
                  className={`${inputClassName} min-h-24 resize-y`}
                  placeholder="Krátké poznámky k dalšímu kroku, reakci nebo kontextu."
                />
                {errors.nextActionNotes ? <p className="text-xs text-rose-600">{errors.nextActionNotes[0]}</p> : null}
              </label>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={saveWorkflow}
                  disabled={isPending}
                  className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
                >
                  {isPending ? "Saving..." : "Save workflow"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[1.8rem] border border-slate-200 bg-slate-50/80 p-4 md:p-5">
          <div className="flex flex-col gap-1">
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Script library</p>
            <h3 className="font-serif text-2xl text-slate-950">Ruční komunikační podklady</h3>
            <p className="text-sm text-slate-600">
              Krátké návrhy pro telefon, LinkedIn, formulář, warm email i follow-up. Vše je určené jen k ručnímu použití.
            </p>
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            <ScriptCard title="Phone opener" body={scripts.phoneOpener} eyebrow="Call" />
            <ScriptCard title="Short call script" body={scripts.callScript} eyebrow="Call" />
            <ScriptCard title="LinkedIn message" body={scripts.linkedInFirstMessage} eyebrow="LinkedIn" />
            <ScriptCard title="Contact form message" body={scripts.contactFormMessage} eyebrow="Form" />
            <ScriptCard
              title={`Warm email · ${scripts.warmEmailSubject}`}
              body={scripts.warmEmailBody}
              eyebrow="Email"
            />
            <ScriptCard title="Short follow-up" body={scripts.shortFollowUpMessage} eyebrow="Follow-up" />
          </div>
        </div>
      </div>
    </div>
  );
}
