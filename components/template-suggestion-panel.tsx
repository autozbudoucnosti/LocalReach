import Link from "next/link";
import { TemplatePreview } from "@/components/template-preview";
import {
  TEMPLATE_OFFER_LABELS,
  TEMPLATE_VERTICAL_LABELS,
  TEMPLATE_WEBSITE_FIT_LABELS,
  type SuggestedTemplate,
} from "@/lib/template-gallery";

type TemplateSuggestionPanelProps = {
  templates: SuggestedTemplate[];
};

export function TemplateSuggestionPanel({ templates }: TemplateSuggestionPanelProps) {
  if (templates.length === 0) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.35)]">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="font-serif text-2xl text-slate-950">Suggested proof</h2>
          <p className="mt-1 text-sm text-slate-600">
            Reálné mockup koncepty, které můžete ukázat nebo zmínit při ručním outreachi.
          </p>
        </div>
        <Link href="/templates" className="text-sm font-semibold text-cyan-700 transition hover:text-cyan-800">
          Open gallery
        </Link>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {templates.map(({ template, reason, isGenericFallback }) => (
          <div key={template.id} className="rounded-[1.6rem] border border-slate-200 bg-slate-50 p-4">
            <TemplatePreview template={template} sizes="(max-width: 1024px) 100vw, 33vw" />
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full bg-white px-3 py-1 text-slate-700">
                {TEMPLATE_VERTICAL_LABELS[template.vertical]}
              </span>
              <span className="rounded-full bg-cyan-50 px-3 py-1 text-cyan-800">
                {TEMPLATE_OFFER_LABELS[template.offerType]}
              </span>
              <span
                className={`rounded-full px-3 py-1 ${
                  template.version === "V2" ? "bg-slate-950 text-white" : "bg-slate-200 text-slate-700"
                }`}
              >
                {template.version}
              </span>
              {template.recommendedForSales ? (
                <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-800">Recommended</span>
              ) : null}
              {isGenericFallback ? (
                <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-800">Fallback</span>
              ) : null}
            </div>
            <h3 className="mt-4 font-serif text-xl text-slate-950">{template.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{template.shortDescription}</p>
            <div className="mt-4 rounded-2xl border border-dashed border-cyan-200 bg-cyan-50/70 p-3">
              <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-700">Why suggested</p>
              <p className="mt-1 text-sm leading-6 text-slate-700">{reason}</p>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-3">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Benefit</p>
                <p className="mt-1 text-sm font-medium text-slate-900">{template.keyBenefit}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-3">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Fit</p>
                <p className="mt-1 text-sm font-medium text-slate-900">{TEMPLATE_WEBSITE_FIT_LABELS[template.websiteFit]}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href={template.routePath}
                className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Otevřít mockup
              </Link>
              <Link
                href="/templates"
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-white"
              >
                Všechny šablony
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
