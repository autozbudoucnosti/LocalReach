"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { TemplatePreview } from "@/components/template-preview";
import { RECOMMENDED_OFFERS } from "@/lib/constants";
import {
  TEMPLATE_GALLERY,
  TEMPLATE_OFFER_LABELS,
  TEMPLATE_VERTICAL_LABELS,
  TEMPLATE_WEBSITE_FIT_LABELS,
  type GalleryTemplate,
  type TemplateWebsiteFit,
} from "@/lib/template-gallery";

type TemplateGalleryProps = {
  templates?: GalleryTemplate[];
};

export function TemplateGallery({ templates = TEMPLATE_GALLERY }: TemplateGalleryProps) {
  const [selectedVertical, setSelectedVertical] = useState("");
  const [selectedOffer, setSelectedOffer] = useState("");
  const [selectedWebsiteFit, setSelectedWebsiteFit] = useState<TemplateWebsiteFit | "">("");
  const [expandedTemplateId, setExpandedTemplateId] = useState<string | null>(templates[0]?.id ?? null);

  const verticals = useMemo(
    () => Array.from(new Set(templates.map((template) => template.vertical))).sort(),
    [templates],
  );

  const filteredTemplates = useMemo(
    () =>
      templates.filter((template) => {
        if (selectedVertical && template.vertical !== selectedVertical) {
          return false;
        }

        if (selectedOffer && template.offerType !== selectedOffer) {
          return false;
        }

        if (selectedWebsiteFit && template.websiteFit !== selectedWebsiteFit) {
          return false;
        }

        return true;
      }),
    [selectedOffer, selectedVertical, selectedWebsiteFit, templates],
  );

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.35)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-serif text-2xl text-slate-950">Šablony a sales mockupy</h2>
            <p className="mt-1 max-w-3xl text-sm text-slate-600">
              Reálné mockup stránky pro LocalReach proof layer. Slouží pro galerii, screenshot export i rychlé
              vysvětlení nabídky podle oboru.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={selectedVertical}
              onChange={(event) => setSelectedVertical(event.target.value)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
            >
              <option value="">Všechny vertikály</option>
              {verticals.map((vertical) => (
                <option key={vertical} value={vertical}>
                  {TEMPLATE_VERTICAL_LABELS[vertical]}
                </option>
              ))}
            </select>

            <select
              value={selectedOffer}
              onChange={(event) => setSelectedOffer(event.target.value)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
            >
              <option value="">Všechny nabídky</option>
              {RECOMMENDED_OFFERS.map((offer) => (
                <option key={offer} value={offer}>
                  {TEMPLATE_OFFER_LABELS[offer]}
                </option>
              ))}
            </select>

            <select
              value={selectedWebsiteFit}
              onChange={(event) => setSelectedWebsiteFit(event.target.value as TemplateWebsiteFit | "")}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
            >
              <option value="">Web / bez webu</option>
              {Object.entries(TEMPLATE_WEBSITE_FIT_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {filteredTemplates.map((template) => {
          const expanded = expandedTemplateId === template.id;

          return (
            <div
              key={template.id}
              className="rounded-[1.9rem] border border-white/70 bg-white/90 p-4 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-34px_rgba(15,23,42,0.42)]"
            >
              <TemplatePreview template={template} />

              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
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
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-800">
                  {template.previewImagePath ? "PNG preview" : "Mockup route"}
                </span>
              </div>

              <div className="mt-4">
                <h3 className="font-serif text-xl text-slate-950">{template.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{template.shortDescription}</p>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Fit</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{template.fitsBusiness}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Benefit</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{template.keyBenefit}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                <span>{template.priceBandExample}</span>
                <span className="text-slate-300">•</span>
                <span>{TEMPLATE_WEBSITE_FIT_LABELS[template.websiteFit]}</span>
              </div>

              {template.tags.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {template.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={template.routePath}
                  className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  Otevřít mockup
                </Link>
                <button
                  type="button"
                  onClick={() => setExpandedTemplateId(expanded ? null : template.id)}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  {expanded ? "Skrýt detail" : "Zobrazit detail"}
                </button>
              </div>

              {expanded ? (
                <div className="mt-5 space-y-3 rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                  {template.proofAngle ? (
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Proof angle</p>
                      <p className="mt-1 leading-6">{template.proofAngle}</p>
                    </div>
                  ) : null}
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Pro koho</p>
                    <p className="mt-1 leading-6">{template.whoFor}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Jaký problém řeší</p>
                    <p className="mt-1 leading-6">{template.problemSolved}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Styl</p>
                    <p className="mt-1 leading-6">{template.style}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Proč pomáhá prodeji</p>
                    <p className="mt-1 leading-6">{template.whyItHelpsSales}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Route slug</p>
                    <p className="mt-1 leading-6 text-slate-600">{template.routePath}</p>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </section>
    </div>
  );
}
