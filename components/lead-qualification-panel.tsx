"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateLeadQualificationAction } from "@/actions/outreach-actions";
import { OUTREACH_CHANNELS, OUTREACH_OUTCOMES } from "@/lib/constants";
import {
  LEAD_BUCKET_LABELS,
  NEXT_ACTION_LABELS,
  OFFER_CONFIG,
  SIGNAL_STRENGTH_LABELS,
  WEBSITE_STATE_LABELS,
  getOfferLabel,
  getOfferPriceLabel,
} from "@/lib/lead-qualification";

type LeadQualificationPanelProps = {
  leadId: string;
  qualification: {
    leadScore: number;
    priorityBucket: "LOW" | "MEDIUM" | "HIGH" | null;
    icpFit: "LOW" | "MEDIUM" | "HIGH" | null;
    estimatedTicketValue: "LOW" | "MEDIUM" | "HIGH" | null;
    ownerLedProbability: "LOW" | "MEDIUM" | "HIGH" | "UNKNOWN" | null;
    singleLocation: boolean | null;
    reviewStrength: "LOW" | "MEDIUM" | "HIGH" | "UNKNOWN" | null;
    websiteState: "NO_WEBSITE" | "WEAK_WEBSITE" | "DECENT_WEBSITE" | "UNKNOWN" | null;
    reachability: "LOW" | "MEDIUM" | "HIGH" | "UNKNOWN" | null;
    scoreExplanation: string | null;
    recommendedOffer: "LAUNCH_PAGE" | "SIMPLE_WEBSITE" | "REDESIGN_SPRINT" | null;
    nextBestAction:
      | "REVIEW_MANUALLY"
      | "CALL_FIRST"
      | "LINKEDIN_OUTREACH"
      | "CONTACT_FORM_MESSAGE"
      | "PREVIEW_WORTH_IT"
      | "LOW_PRIORITY_SKIP"
      | "ADD_BUSINESS_EMAIL_FIRST"
      | null;
    googleRating: number | null;
    googleReviewCount: number | null;
    qualificationNotes: string | null;
    outreachChannelUsed: "EMAIL" | "CALL" | "CONTACT_FORM" | "LINKEDIN" | "OTHER" | null;
    outreachOutcome: "NO_RESPONSE" | "REPLIED" | "INTERESTED" | "NOT_NOW" | "LOST" | null;
    lostReason: string | null;
    meetingBooked: boolean;
    proposalSent: boolean;
    dealWon: boolean;
    dealValue: number | null;
  };
};

type ChannelValue = NonNullable<LeadQualificationPanelProps["qualification"]["outreachChannelUsed"]> | "";
type OutcomeValue = NonNullable<LeadQualificationPanelProps["qualification"]["outreachOutcome"]> | "";

const inputClassName =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100";

function bucketClass(bucket: "LOW" | "MEDIUM" | "HIGH" | null) {
  if (bucket === "HIGH") {
    return "bg-emerald-100 text-emerald-900";
  }

  if (bucket === "MEDIUM") {
    return "bg-amber-100 text-amber-900";
  }

  return "bg-slate-100 text-slate-700";
}

function booleanLabel(value: boolean | null) {
  if (value === true) {
    return "Yes";
  }

  if (value === false) {
    return "No";
  }

  return "Unknown";
}

export function LeadQualificationPanel({ leadId, qualification }: LeadQualificationPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});
  const [form, setForm] = useState({
    qualificationNotes: qualification.qualificationNotes ?? "",
    outreachChannelUsed: (qualification.outreachChannelUsed ?? "") as ChannelValue,
    outreachOutcome: (qualification.outreachOutcome ?? "") as OutcomeValue,
    lostReason: qualification.lostReason ?? "",
    meetingBooked: qualification.meetingBooked,
    proposalSent: qualification.proposalSent,
    dealWon: qualification.dealWon,
    dealValue: qualification.dealValue?.toString() ?? "",
  });

  const offerLabel = getOfferLabel(qualification.recommendedOffer);
  const priceLabel = getOfferPriceLabel(qualification.recommendedOffer);
  const offerSummary = qualification.recommendedOffer ? OFFER_CONFIG[qualification.recommendedOffer].summary : null;

  function updateForm<Key extends keyof typeof form>(key: Key, value: (typeof form)[Key]) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function save() {
    startTransition(async () => {
      const result = await updateLeadQualificationAction(leadId, {
        qualificationNotes: form.qualificationNotes,
        outreachChannelUsed: form.outreachChannelUsed || null,
        outreachOutcome: form.outreachOutcome || null,
        lostReason: form.lostReason,
        meetingBooked: form.meetingBooked,
        proposalSent: form.proposalSent,
        dealWon: form.dealWon,
        dealValue: form.dealValue,
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

  return (
    <div className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.35)] md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="font-serif text-2xl text-slate-950">ICP and qualification</h2>
          <p className="mt-1 text-sm text-slate-600">
            Cash-first scoring for closability, likely offer, and the next manual step.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${bucketClass(qualification.priorityBucket)}`}>
            {qualification.priorityBucket ? `${LEAD_BUCKET_LABELS[qualification.priorityBucket]} priority` : "Unscored"}
          </span>
          <span className="rounded-full bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white">
            Score {qualification.leadScore}
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-5 2xl:grid-cols-[1.12fr_0.88fr]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-950">Scoring explanation</p>
            <p className="mt-2 leading-6">
              {qualification.scoreExplanation ?? "No scoring explanation is available yet."}
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-950">Qualification signals</p>
              <dl className="mt-3 space-y-2 text-sm text-slate-600">
                <div className="flex items-center justify-between gap-3">
                  <dt>ICP fit</dt>
                  <dd className="font-medium text-slate-900">
                    {qualification.icpFit ? LEAD_BUCKET_LABELS[qualification.icpFit] : "Unknown"}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt>Estimated ticket</dt>
                  <dd className="font-medium text-slate-900">
                    {qualification.estimatedTicketValue
                      ? LEAD_BUCKET_LABELS[qualification.estimatedTicketValue]
                      : "Unknown"}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt>Owner-led probability</dt>
                  <dd className="font-medium text-slate-900">
                    {qualification.ownerLedProbability
                      ? SIGNAL_STRENGTH_LABELS[qualification.ownerLedProbability]
                      : "Unknown"}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt>Single location</dt>
                  <dd className="font-medium text-slate-900">{booleanLabel(qualification.singleLocation)}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt>Review strength</dt>
                  <dd className="font-medium text-slate-900">
                    {qualification.reviewStrength ? SIGNAL_STRENGTH_LABELS[qualification.reviewStrength] : "Unknown"}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt>Website state</dt>
                  <dd className="font-medium text-slate-900">
                    {qualification.websiteState ? WEBSITE_STATE_LABELS[qualification.websiteState] : "Unknown"}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt>Reachability</dt>
                  <dd className="font-medium text-slate-900">
                    {qualification.reachability ? SIGNAL_STRENGTH_LABELS[qualification.reachability] : "Unknown"}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt>Google reviews</dt>
                  <dd className="font-medium text-slate-900">
                    {qualification.googleReviewCount !== null
                      ? `${qualification.googleReviewCount}${qualification.googleRating ? ` at ${qualification.googleRating}` : ""}`
                      : "Unknown"}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-950">Offer recommendation</p>
              <div className="mt-3 space-y-3 text-sm text-slate-600">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Offer</p>
                  <p className="mt-1 font-medium text-slate-950">{offerLabel ?? "No clear offer yet"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Price band</p>
                  <p className="mt-1 font-medium text-slate-950">{priceLabel ?? "Review manually first"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Next best action</p>
                  <p className="mt-1 font-medium text-slate-950">
                    {qualification.nextBestAction ? NEXT_ACTION_LABELS[qualification.nextBestAction] : "Review manually"}
                  </p>
                </div>
                {offerSummary ? <p className="rounded-2xl bg-slate-50 p-3 leading-6">{offerSummary}</p> : null}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
          <p className="text-sm font-semibold text-slate-950">Outcome tracking</p>
          <div className="mt-4 space-y-4">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Qualification notes</span>
              <textarea
                value={form.qualificationNotes}
                onChange={(event) => updateForm("qualificationNotes", event.target.value)}
                className={`${inputClassName} min-h-24 resize-y`}
                placeholder="Keep this factual: budget signals, owner cues, trust signals, or reasons to skip."
              />
              {errors.qualificationNotes ? <p className="text-xs text-rose-600">{errors.qualificationNotes[0]}</p> : null}
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Outreach channel used</span>
              <select
                value={form.outreachChannelUsed}
                onChange={(event) => updateForm("outreachChannelUsed", event.target.value as ChannelValue)}
                className={inputClassName}
              >
                <option value="">None yet</option>
                {OUTREACH_CHANNELS.map((channel) => (
                  <option key={channel} value={channel}>
                    {channel.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
              {errors.outreachChannelUsed ? <p className="text-xs text-rose-600">{errors.outreachChannelUsed[0]}</p> : null}
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Outreach outcome</span>
              <select
                value={form.outreachOutcome}
                onChange={(event) => updateForm("outreachOutcome", event.target.value as OutcomeValue)}
                className={inputClassName}
              >
                <option value="">No outcome yet</option>
                {OUTREACH_OUTCOMES.map((outcome) => (
                  <option key={outcome} value={outcome}>
                    {outcome.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
              {errors.outreachOutcome ? <p className="text-xs text-rose-600">{errors.outreachOutcome[0]}</p> : null}
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Lost reason</span>
              <input
                value={form.lostReason}
                onChange={(event) => updateForm("lostReason", event.target.value)}
                className={inputClassName}
                placeholder="Optional"
              />
              {errors.lostReason ? <p className="text-xs text-rose-600">{errors.lostReason[0]}</p> : null}
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Deal value (CZK)</span>
              <input
                value={form.dealValue}
                onChange={(event) => updateForm("dealValue", event.target.value)}
                className={inputClassName}
                placeholder="Optional"
                type="number"
                min={0}
              />
              {errors.dealValue ? <p className="text-xs text-rose-600">{errors.dealValue[0]}</p> : null}
            </label>

            <div className="grid gap-3 sm:grid-cols-3">
              <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input
                  checked={form.meetingBooked}
                  onChange={(event) => updateForm("meetingBooked", event.target.checked)}
                  type="checkbox"
                />
                Meeting booked
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input
                  checked={form.proposalSent}
                  onChange={(event) => updateForm("proposalSent", event.target.checked)}
                  type="checkbox"
                />
                Proposal sent
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input
                  checked={form.dealWon}
                  onChange={(event) => updateForm("dealWon", event.target.checked)}
                  type="checkbox"
                />
                Deal won
              </label>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={save}
                disabled={isPending}
                className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Saving..." : "Save qualification"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
