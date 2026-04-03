"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteCampaignAction, saveCampaignAction } from "@/actions/campaign-actions";

type CampaignFormProps = {
  campaign?: {
    id: string;
    name: string;
    targetNiche: string | null;
    targetCity: string | null;
    offerAngle: string | null;
    cta: string | null;
    isActive: boolean;
    _count?: {
      drafts: number;
    };
  };
};

const inputClassName =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100";

export function CampaignForm({ campaign }: CampaignFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});
  const [values, setValues] = useState({
    name: campaign?.name ?? "",
    targetNiche: campaign?.targetNiche ?? "",
    targetCity: campaign?.targetCity ?? "",
    offerAngle: campaign?.offerAngle ?? "",
    cta: campaign?.cta ?? "",
    isActive: campaign?.isActive ?? true,
  });

  function updateValue<Key extends keyof typeof values>(key: Key, value: (typeof values)[Key]) {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function save() {
    startTransition(async () => {
      const result = await saveCampaignAction({
        id: campaign?.id,
        ...values,
      });

      if (!result.ok) {
        setErrors(result.fieldErrors ?? {});
        toast.error(result.message);
        return;
      }

      setErrors({});
      toast.success(result.message);

      if (!campaign) {
        setValues({
          name: "",
          targetNiche: "",
          targetCity: "",
          offerAngle: "",
          cta: "",
          isActive: true,
        });
      }

      router.refresh();
    });
  }

  function remove() {
    if (!campaign || !window.confirm(`Delete campaign "${campaign.name}"?`)) {
      return;
    }

    startTransition(async () => {
      const result = await deleteCampaignAction(campaign.id);

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.refresh();
    });
  }

  return (
    <div className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.35)]">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-serif text-xl text-slate-950">{campaign ? campaign.name : "New campaign"}</h3>
          {campaign?._count ? (
            <p className="text-sm text-slate-500">{campaign._count.drafts} draft(s) linked</p>
          ) : (
            <p className="text-sm text-slate-500">A simple campaign record for offer angle and CTA.</p>
          )}
        </div>
        <label className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={values.isActive}
            onChange={(event) => updateValue("isActive", event.target.checked)}
          />
          Active
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Name</span>
          <input
            className={inputClassName}
            value={values.name}
            onChange={(event) => updateValue("name", event.target.value)}
            placeholder="Local Website Refresh"
          />
          {errors.name ? <p className="text-xs text-rose-600">{errors.name[0]}</p> : null}
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Target niche</span>
          <input
            className={inputClassName}
            value={values.targetNiche}
            onChange={(event) => updateValue("targetNiche", event.target.value)}
            placeholder="Home services"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Target city</span>
          <input
            className={inputClassName}
            value={values.targetCity}
            onChange={(event) => updateValue("targetCity", event.target.value)}
            placeholder="Brno"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Offer angle</span>
          <input
            className={inputClassName}
            value={values.offerAngle}
            onChange={(event) => updateValue("offerAngle", event.target.value)}
            placeholder="cleaner mobile-first redesign"
          />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium text-slate-700">CTA</span>
          <textarea
            className={`${inputClassName} min-h-24 resize-y`}
            value={values.cta}
            onChange={(event) => updateValue("cta", event.target.value)}
            placeholder="Would you be open to me sending 2–3 quick ideas for your site?"
          />
        </label>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        {campaign ? (
          <button
            type="button"
            onClick={remove}
            disabled={isPending}
            className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Delete
          </button>
        ) : (
          <span className="text-sm text-slate-500">Keep campaigns simple in the MVP.</span>
        )}
        <button
          type="button"
          onClick={save}
          disabled={isPending}
          className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Saving..." : campaign ? "Save campaign" : "Create campaign"}
        </button>
      </div>
    </div>
  );
}
