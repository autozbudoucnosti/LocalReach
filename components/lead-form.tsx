"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createLeadAction, updateLeadAction } from "@/actions/lead-actions";
import { LEAD_STATUSES } from "@/lib/constants";

type LeadFormProps = {
  leadId?: string;
  initialValues: {
    businessName: string;
    contactName: string;
    email: string;
    phone: string;
    website: string;
    city: string;
    niche: string;
    sourceUrl: string;
    notes: string;
    googleRating: string;
    googleReviewCount: string;
    status: (typeof LEAD_STATUSES)[number];
  };
};

const inputClassName =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100";

export function LeadForm({ leadId, initialValues }: LeadFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});

  function updateValue<Key extends keyof typeof values>(key: Key, value: (typeof values)[Key]) {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function submit() {
    startTransition(async () => {
      const result = leadId
        ? await updateLeadAction(leadId, values)
        : await createLeadAction(values);

      if (!result.ok) {
        setErrors(result.fieldErrors ?? {});
        toast.error(result.message);
        return;
      }

      setErrors({});
      toast.success(result.message);

      if (!leadId && result.data?.id) {
        router.push(`/leads/${result.data.id}`);
        return;
      }

      router.refresh();
    });
  }

  return (
    <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.35)]">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Business name</span>
          <input
            className={inputClassName}
            value={values.businessName}
            onChange={(event) => updateValue("businessName", event.target.value)}
            placeholder="Oak Street Dental"
          />
          {errors.businessName ? <p className="text-xs text-rose-600">{errors.businessName[0]}</p> : null}
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Contact name</span>
          <input
            className={inputClassName}
            value={values.contactName}
            onChange={(event) => updateValue("contactName", event.target.value)}
            placeholder="Optional"
          />
          {errors.contactName ? <p className="text-xs text-rose-600">{errors.contactName[0]}</p> : null}
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Public business email</span>
          <input
            className={inputClassName}
            value={values.email}
            onChange={(event) => updateValue("email", event.target.value)}
            placeholder="Optional, if known"
            type="email"
          />
          {errors.email ? <p className="text-xs text-rose-600">{errors.email[0]}</p> : null}
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Website</span>
          <input
            className={inputClassName}
            value={values.website}
            onChange={(event) => updateValue("website", event.target.value)}
            placeholder="https://business.com"
          />
          {errors.website ? <p className="text-xs text-rose-600">{errors.website[0]}</p> : null}
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Phone</span>
          <input
            className={inputClassName}
            value={values.phone}
            onChange={(event) => updateValue("phone", event.target.value)}
            placeholder="+420 ..."
          />
          {errors.phone ? <p className="text-xs text-rose-600">{errors.phone[0]}</p> : null}
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">City</span>
          <input
            className={inputClassName}
            value={values.city}
            onChange={(event) => updateValue("city", event.target.value)}
            placeholder="Brno"
          />
          {errors.city ? <p className="text-xs text-rose-600">{errors.city[0]}</p> : null}
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Niche</span>
          <input
            className={inputClassName}
            value={values.niche}
            onChange={(event) => updateValue("niche", event.target.value)}
            placeholder="Dentist"
          />
          {errors.niche ? <p className="text-xs text-rose-600">{errors.niche[0]}</p> : null}
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Google rating</span>
          <input
            className={inputClassName}
            value={values.googleRating}
            onChange={(event) => updateValue("googleRating", event.target.value)}
            placeholder="4.6"
            type="number"
            min={0}
            max={5}
            step="0.1"
          />
          {errors.googleRating ? <p className="text-xs text-rose-600">{errors.googleRating[0]}</p> : null}
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Google reviews</span>
          <input
            className={inputClassName}
            value={values.googleReviewCount}
            onChange={(event) => updateValue("googleReviewCount", event.target.value)}
            placeholder="24"
            type="number"
            min={0}
          />
          {errors.googleReviewCount ? <p className="text-xs text-rose-600">{errors.googleReviewCount[0]}</p> : null}
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium text-slate-700">Source URL</span>
          <input
            className={inputClassName}
            value={values.sourceUrl}
            onChange={(event) => updateValue("sourceUrl", event.target.value)}
            placeholder="https://directory.example/listing"
          />
          {errors.sourceUrl ? <p className="text-xs text-rose-600">{errors.sourceUrl[0]}</p> : null}
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium text-slate-700">Notes</span>
          <textarea
            className={`${inputClassName} min-h-28 resize-y`}
            value={values.notes}
            onChange={(event) => updateValue("notes", event.target.value)}
            placeholder="Manual notes, context, or relevant observations."
          />
          {errors.notes ? <p className="text-xs text-rose-600">{errors.notes[0]}</p> : null}
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium text-slate-700">Status</span>
          <select
            className={inputClassName}
            value={values.status}
            onChange={(event) => updateValue("status", event.target.value as (typeof LEAD_STATUSES)[number])}
          >
            {LEAD_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status.replaceAll("_", " ")}
              </option>
            ))}
          </select>
          {errors.status ? <p className="text-xs text-rose-600">{errors.status[0]}</p> : null}
        </label>
      </div>

      <div className="mt-6 flex items-center justify-end">
        <button
          type="button"
          onClick={submit}
          disabled={isPending}
          className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Saving..." : leadId ? "Save lead" : "Create lead"}
        </button>
      </div>
    </div>
  );
}
