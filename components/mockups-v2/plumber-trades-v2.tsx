/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from "react";
import type { MockupV2Definition } from "@/lib/mockups-v2-data";
import { MockupV2Shell } from "@/components/mockups-v2/mockup-v2-shell";

type PlumberTradesV2Props = {
  mockup: MockupV2Definition;
};

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-500">{children}</p>;
}

function ImageFrame({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-[1.9rem] bg-slate-200 shadow-[0_26px_56px_-40px_rgba(15,23,42,0.2)] ${className}`}>
      <img src={src} alt={alt} className="h-full w-full object-cover" loading="eager" />
    </div>
  );
}

export function PlumberTradesV2({ mockup }: PlumberTradesV2Props) {
  const websiteLabel = mockup.contact.email.split("@")[1] ?? mockup.contact.email;

  return (
    <MockupV2Shell businessName={mockup.businessName} websiteLabel={websiteLabel}>
      <div className="space-y-24 bg-[linear-gradient(180deg,_#f6f4ef_0%,_#f2f0ea_100%)] p-6 md:p-8 lg:p-10">
        <section className="rounded-[1.6rem] border border-slate-200/70 bg-white/90 px-5 py-4 shadow-[0_18px_44px_-36px_rgba(15,23,42,0.2)] backdrop-blur">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-slate-600 md:text-[0.96rem]">{mockup.fastStrip.text}</p>
            <p className="text-sm font-semibold text-slate-950">{mockup.contact.phone}</p>
          </div>
        </section>

        <section className="overflow-hidden rounded-[2.3rem] bg-white shadow-[0_34px_96px_-58px_rgba(15,23,42,0.24)]">
          <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="flex flex-col justify-center px-8 py-10 md:px-12 md:py-14 lg:pr-10">
              <div className="space-y-7">
                <div className="space-y-5">
                  <SectionLabel>{mockup.hero.eyebrow}</SectionLabel>
                  <h1 className="max-w-xl text-[2.9rem] font-semibold leading-[0.98] tracking-[-0.05em] text-slate-950 md:text-[4.5rem]">
                    {mockup.hero.headline}
                  </h1>
                  <p className="max-w-lg text-base leading-7 text-slate-600 md:text-[1.02rem]">
                    {mockup.hero.body}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <span className="rounded-full bg-slate-950 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_16px_28px_-18px_rgba(15,23,42,0.28)]">
                    {mockup.hero.primaryCta}
                  </span>
                  <p className="text-sm text-slate-600">
                    <span className="font-semibold text-slate-950">{mockup.contact.phone}</span>
                    {"  "}
                    <span className="text-slate-400">/</span>
                    {"  "}
                    Brno a okolí
                  </p>
                </div>

                <div className="border-t border-slate-200 pt-5 text-sm text-slate-600">
                  <p>{mockup.hero.trustBullets.join(" • ")}</p>
                  <p className="mt-2">{mockup.contact.serviceAreaLabel}</p>
                </div>
              </div>
            </div>

            <div className="relative min-h-[540px] bg-[#e9ece8] lg:min-h-[640px]">
              <img
                src={mockup.imagery.hero}
                alt="Instalatér při montáži a servisu vody a topení"
                className="absolute inset-0 h-full w-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,_rgba(255,255,255,0.02)_0%,_rgba(255,255,255,0)_52%,_rgba(15,23,42,0.18)_100%)]" />
              <div className="absolute left-6 top-6 rounded-full bg-white/92 px-4 py-2 text-sm font-medium text-slate-900 shadow-[0_12px_30px_-22px_rgba(15,23,42,0.35)]">
                Brno a okolí
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="space-y-2">
            <SectionLabel>Služby</SectionLabel>
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 md:text-[2.4rem]">Co řešíme</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {mockup.services.map((service) => (
              <div
                key={service.title}
                className="rounded-[1.7rem] border border-slate-200/80 bg-white p-8 shadow-[0_18px_44px_-36px_rgba(15,23,42,0.14)]"
              >
                <h3 className="text-[1.55rem] font-semibold tracking-[-0.04em] text-slate-950">{service.title}</h3>
                <p className="mt-3 max-w-[18rem] text-sm leading-7 text-slate-600">{service.description}</p>
              </div>
            ))}
          </div>

          <span className="inline-flex rounded-full bg-slate-950 px-7 py-3.5 text-sm font-semibold text-white">
            Zavolat {mockup.contact.phone}
          </span>
        </section>

        <section className="space-y-8">
          <div className="space-y-3">
            <SectionLabel>Realizace</SectionLabel>
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 md:text-[2.4rem]">Ukázky práce</h2>
            <p className="max-w-xl text-sm leading-7 text-slate-600 md:text-base">
              Pár běžných zakázek z Brna a okolí.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {mockup.realizations.map((realization, index) => (
              <article
                key={`${realization.title}-${realization.location}`}
                className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_24px_56px_-44px_rgba(15,23,42,0.16)]"
              >
                <ImageFrame
                  src={mockup.imagery.references[index] ?? mockup.imagery.references[0]}
                  alt={realization.title}
                  className="aspect-[16/11] rounded-none shadow-none"
                />
                <div className="space-y-3 px-7 py-8">
                  <p className="text-sm font-medium text-slate-500">{realization.location}</p>
                  <h3 className="text-[1.8rem] font-semibold tracking-[-0.04em] text-slate-950">{realization.title}</h3>
                  <p className="max-w-xl text-sm leading-7 text-slate-600">{realization.summary}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200/80 bg-white px-8 py-9 shadow-[0_18px_44px_-36px_rgba(15,23,42,0.12)] md:px-10 md:py-11">
          <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
            <div className="space-y-5">
              <SectionLabel>Kontakt</SectionLabel>
              <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 md:text-[2.4rem]">
                {mockup.contactSection.title}
              </h2>
              <p className="max-w-lg text-sm leading-7 text-slate-600 md:text-base">{mockup.contactSection.body}</p>
              <div className="space-y-2 text-sm leading-7 text-slate-600">
                <p>
                  <span className="font-semibold text-slate-950">Telefon:</span> {mockup.contact.phone}
                </p>
                <p>
                  <span className="font-semibold text-slate-950">Email:</span> {mockup.contact.email}
                </p>
                <p>
                  <span className="font-semibold text-slate-950">Adresa:</span> {mockup.contact.address}
                </p>
              </div>
              <div className="pt-2">
                <span className="inline-flex rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white">
                  Zavolat {mockup.contact.phone}
                </span>
              </div>
            </div>

            <div className="grid gap-3">
              {mockup.contactSection.formFields.map((field) => (
                <div
                  key={field}
                  className="rounded-[1.25rem] border border-slate-200 bg-[#f7f5f0] px-5 py-4 text-sm text-slate-400"
                >
                  {field}
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="border-t border-slate-300/80 pt-8 text-sm text-slate-500">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">{mockup.businessName}</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">{mockup.footerNote}</p>
            </div>
            <p className="text-sm leading-7">
              {mockup.contact.address}
              <br />
              {mockup.contact.email}
            </p>
          </div>
        </footer>
      </div>
    </MockupV2Shell>
  );
}
