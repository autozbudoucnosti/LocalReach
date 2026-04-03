"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  addSuppressionEntryAction,
  removeSuppressionEntryAction,
  saveSettingsAction,
} from "@/actions/settings-actions";

type SettingsFormProps = {
  settings: {
    senderName: string;
    senderEmail: string;
    serviceDescription: string;
    defaultOffer: string;
    defaultCta: string;
    defaultOptOut: string;
    dailySendCap: number;
    minimumSecondsBetweenSends: number;
    openAiModel: string;
  };
  envStatus: {
    resendApiKey: boolean;
    openAiApiKey: boolean;
    resendFromEmail: boolean;
    replyToEmail: "configured" | "missing" | "invalid";
    serpApiKey: boolean;
  };
  suppressionEntries: {
    id: string;
    email: string;
    reason: string;
    createdAt: Date;
  }[];
};

const inputClassName =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100";

export function SettingsForm({ settings, envStatus, suppressionEntries }: SettingsFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});
  const [values, setValues] = useState({
    senderName: settings.senderName,
    senderEmail: settings.senderEmail,
    serviceDescription: settings.serviceDescription,
    defaultOffer: settings.defaultOffer,
    defaultCta: settings.defaultCta,
    defaultOptOut: settings.defaultOptOut,
    dailySendCap: String(settings.dailySendCap),
    minimumSecondsBetweenSends: String(settings.minimumSecondsBetweenSends),
    openAiModel: settings.openAiModel,
  });
  const [suppressionEmail, setSuppressionEmail] = useState("");
  const [suppressionReason, setSuppressionReason] = useState("Manual suppression");

  function updateValue<Key extends keyof typeof values>(key: Key, value: (typeof values)[Key]) {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function save() {
    startTransition(async () => {
      const result = await saveSettingsAction(values);

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

  function addSuppression() {
    startTransition(async () => {
      const result = await addSuppressionEntryAction({
        email: suppressionEmail,
        reason: suppressionReason,
      });

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      setSuppressionEmail("");
      setSuppressionReason("Manual suppression");
      toast.success(result.message);
      router.refresh();
    });
  }

  function removeSuppression(id: string) {
    startTransition(async () => {
      const result = await removeSuppressionEntryAction(id);

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.35)]">
        <h2 className="font-serif text-2xl text-slate-950">Integrations and defaults</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-5">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-950">Resend API key</p>
            <p className="mt-2">{envStatus.resendApiKey ? "Configured" : "Missing"}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-950">OpenAI API key</p>
            <p className="mt-2">{envStatus.openAiApiKey ? "Configured" : "Missing"}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-950">Resend from email</p>
            <p className="mt-2">{envStatus.resendFromEmail ? "Configured" : "Missing"}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-950">Reply-To email</p>
            <p className="mt-2">
              {envStatus.replyToEmail === "configured"
                ? "Configured"
                : envStatus.replyToEmail === "invalid"
                  ? "Invalid"
                  : "Missing"}
            </p>
            <p className="mt-2 text-xs text-slate-500">Env only. Set `REPLY_TO_EMAIL` in `.env`.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-950">SerpAPI key</p>
            <p className="mt-2">{envStatus.serpApiKey ? "Configured" : "Missing"}</p>
            <p className="mt-2 text-xs text-slate-500">Used for low-volume Google Maps discovery.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Sender name</span>
            <input
              className={inputClassName}
              value={values.senderName}
              onChange={(event) => updateValue("senderName", event.target.value)}
            />
            {errors.senderName ? <p className="text-xs text-rose-600">{errors.senderName[0]}</p> : null}
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Sender email</span>
            <input
              className={inputClassName}
              value={values.senderEmail}
              onChange={(event) => updateValue("senderEmail", event.target.value)}
            />
            {errors.senderEmail ? <p className="text-xs text-rose-600">{errors.senderEmail[0]}</p> : null}
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-slate-700">Company/service description</span>
            <textarea
              className={`${inputClassName} min-h-28 resize-y`}
              value={values.serviceDescription}
              onChange={(event) => updateValue("serviceDescription", event.target.value)}
            />
            {errors.serviceDescription ? (
              <p className="text-xs text-rose-600">{errors.serviceDescription[0]}</p>
            ) : null}
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Default offer</span>
            <input
              className={inputClassName}
              value={values.defaultOffer}
              onChange={(event) => updateValue("defaultOffer", event.target.value)}
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Default CTA</span>
            <input
              className={inputClassName}
              value={values.defaultCta}
              onChange={(event) => updateValue("defaultCta", event.target.value)}
            />
            <p className="text-xs text-slate-500">Used as the default soft CTA in Czech AI drafts.</p>
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-slate-700">Default opt-out sentence</span>
            <input
              className={inputClassName}
              value={values.defaultOptOut}
              onChange={(event) => updateValue("defaultOptOut", event.target.value)}
            />
            <p className="text-xs text-slate-500">
              This line is appended verbatim to every Czech AI-generated draft.
            </p>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Daily send cap</span>
            <input
              className={inputClassName}
              value={values.dailySendCap}
              onChange={(event) => updateValue("dailySendCap", event.target.value)}
              type="number"
              min={1}
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Minimum seconds between sends</span>
            <input
              className={inputClassName}
              value={values.minimumSecondsBetweenSends}
              onChange={(event) => updateValue("minimumSecondsBetweenSends", event.target.value)}
              type="number"
              min={0}
            />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-slate-700">OpenAI model</span>
            <input
              className={inputClassName}
              value={values.openAiModel}
              onChange={(event) => updateValue("openAiModel", event.target.value)}
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={save}
            disabled={isPending}
            className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Saving..." : "Save settings"}
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.35)]">
        <h2 className="font-serif text-2xl text-slate-950">Suppression list</h2>
        <p className="mt-1 text-sm text-slate-600">
          Once an email is suppressed, future sends are blocked until you remove the entry manually.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-[2fr_2fr_auto]">
          <input
            className={inputClassName}
            placeholder="suppressed@business.com"
            value={suppressionEmail}
            onChange={(event) => setSuppressionEmail(event.target.value)}
          />
          <input
            className={inputClassName}
            placeholder="Reason"
            value={suppressionReason}
            onChange={(event) => setSuppressionReason(event.target.value)}
          />
          <button
            type="button"
            onClick={addSuppression}
            disabled={isPending}
            className="rounded-full bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Add
          </button>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
          {suppressionEntries.length > 0 ? (
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Reason</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {suppressionEntries.map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-4 py-3 text-slate-950">{entry.email}</td>
                    <td className="px-4 py-3 text-slate-600">{entry.reason}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => removeSuppression(entry.id)}
                        disabled={isPending || entry.reason.toLowerCase() === "opted out"}
                        className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {entry.reason.toLowerCase() === "opted out" ? "Permanent" : "Remove"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="bg-slate-50 px-4 py-6 text-sm text-slate-500">No suppression entries yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
