/* eslint-disable @next/next/no-img-element */
/**
 * StomatologPrahaV1 — Czech dental clinic niche template
 *
 * Visual direction: white/slate-50 base, teal-600 accent, booking-first CTA,
 * trust strip with ČSK + stats, 4-card services grid, two-column hero,
 * star reviews with Praha district attribution, clean medical footer with IČO.
 *
 * Data source: mockups-v2-data.ts → id: "stomatolog-praha-v1"
 */
import type { ReactNode } from "react";
import type { MockupV2Definition } from "@/lib/mockups-v2-data";
import { MockupV2Shell } from "@/components/mockups-v2/mockup-v2-shell";

type StomatologPrahaV1Props = {
  mockup: MockupV2Definition;
};

const SERVICE_ICONS: Record<number, string> = { 0: "🦷", 1: "💉", 2: "👑", 3: "✨" };

const NAV_LINKS = ["Služby", "O ordinaci", "Ceník", "Objednání"];

function Divider() {
  return <div className="h-px w-full bg-slate-100" />;
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-teal-600">
      {children}
    </p>
  );
}

export function StomatologPrahaV1({ mockup }: StomatologPrahaV1Props) {
  const websiteLabel = mockup.contact.email.split("@")[1] ?? mockup.contact.email;
  const trustStats = mockup.hero.stats.slice(0, 3);

  return (
    <MockupV2Shell businessName={mockup.businessName} websiteLabel={websiteLabel}>
      <div className="overflow-hidden bg-white text-slate-900">

        {/* ── NAV ─────────────────────────────────────────────────── */}
        <nav className="flex items-center justify-between border-b border-slate-100 bg-white px-6 py-3">
          <span className="text-sm font-semibold text-slate-900">{mockup.businessName}</span>
          <div className="hidden gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <span key={link} className="cursor-default text-sm text-slate-500">
                {link}
              </span>
            ))}
          </div>
          <span className="rounded-full bg-teal-600 px-4 py-1.5 text-xs font-semibold text-white">
            Objednat se
          </span>
        </nav>

        {/* ── TRUST STRIP ─────────────────────────────────────────── */}
        <div className="border-b border-slate-100 bg-slate-50 px-6 py-2.5">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
            {trustStats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-2">
                <span className="text-sm font-semibold text-teal-700">{stat.value}</span>
                <span className="text-xs text-slate-500">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── HERO ────────────────────────────────────────────────── */}
        <section className="grid lg:grid-cols-2">
          {/* Copy */}
          <div className="flex flex-col justify-center px-8 py-12 md:px-12 md:py-16">
            <SectionLabel>{mockup.hero.eyebrow}</SectionLabel>
            <h1 className="mt-4 max-w-lg text-3xl font-semibold leading-tight tracking-tight text-slate-900 md:text-[2.6rem] md:leading-[1.12]">
              {mockup.hero.headline}
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-slate-600">
              {mockup.hero.body}
            </p>

            {/* Service bullets */}
            <ul className="mt-6 space-y-2">
              {mockup.hero.serviceBullets.map((bullet) => (
                <li key={bullet} className="flex items-center gap-2 text-sm text-slate-700">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                  {bullet}
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="cursor-default rounded-full bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_-10px_rgba(13,148,136,0.5)]">
                {mockup.hero.primaryCta}
              </span>
              <span className="cursor-default rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700">
                {mockup.contact.phone}
              </span>
            </div>

            {/* Trust bullets */}
            <div className="mt-6 flex flex-wrap gap-4">
              {mockup.hero.trustBullets.map((b) => (
                <span key={b} className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="text-teal-500">✓</span>
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Hero image — placeholder until a real dental stock photo is supplied at
              /public/mockups-v2/stomatolog-hero.jpg. Drop in the file and restore the
              <img> tag to activate it. See asset-checklist in CLAUDE.md. */}
          <div className="relative min-h-[280px] bg-slate-100 lg:min-h-[420px]">
            {mockup.imagery.hero && (
              <img
                src={mockup.imagery.hero}
                alt={mockup.hero.headline}
                className="absolute inset-0 h-full w-full object-cover"
                loading="eager"
              />
            )}
            {/* Teal overlay — doubles as background tint when photo absent */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-700/15 via-teal-600/5 to-transparent" />
            {/* Structural placeholder — hidden once a real photo is loaded */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <span className="text-5xl opacity-10">🦷</span>
              <span className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-slate-400 opacity-60">
                Foto ordinace
              </span>
            </div>
          </div>
        </section>

        <Divider />

        {/* ── SERVICES ────────────────────────────────────────────── */}
        <section className="bg-white px-8 py-12 md:px-12">
          <SectionLabel>Co léčíme</SectionLabel>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900 md:text-3xl">
            Výkony a ošetření
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {mockup.services.map((service, i) => (
              <div
                key={service.title}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-5"
              >
                <span className="text-2xl">{SERVICE_ICONS[i] ?? "🦷"}</span>
                <h3 className="mt-3 text-sm font-semibold text-slate-900">{service.title}</h3>
                <p className="mt-2 text-xs leading-5 text-slate-600">{service.description}</p>
                <span className="mt-3 inline-block rounded-full bg-teal-50 px-2.5 py-0.5 text-[0.65rem] font-medium text-teal-700">
                  {service.note}
                </span>
              </div>
            ))}
          </div>
        </section>

        <Divider />

        {/* ── TRUST POINTS ────────────────────────────────────────── */}
        <section className="bg-slate-50 px-8 py-12 md:px-12">
          <SectionLabel>Proč ordinace Horáčková</SectionLabel>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900 md:text-3xl">
            Na co se můžete spolehnout
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {mockup.trustPoints.map((point) => (
              <div key={point.title} className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-teal-50">
                  <span className="text-teal-600 text-sm">✓</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-900">{point.title}</h3>
                <p className="mt-2 text-xs leading-5 text-slate-600">{point.description}</p>
              </div>
            ))}
          </div>
        </section>

        <Divider />

        {/* ── REVIEWS ─────────────────────────────────────────────── */}
        <section className="bg-white px-8 py-12 md:px-12">
          <SectionLabel>Recenze pacientů</SectionLabel>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900 md:text-3xl">
            Co říkají pacienti
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {mockup.reviews.map((review) => (
              <div key={review.author} className="rounded-2xl border border-slate-100 p-6">
                <div className="flex gap-0.5 text-teal-500 text-xs">
                  {"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-700">"{review.quote}"</p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-50 text-xs font-semibold text-teal-700">
                    {review.author[0]}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">{review.author}</p>
                    <p className="text-[0.65rem] text-slate-400">{review.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Divider />

        {/* ── SERVICE AREA + PROCESS ──────────────────────────────── */}
        <section className="grid gap-0 bg-slate-50 px-8 py-12 md:grid-cols-2 md:px-12">
          <div>
            <SectionLabel>Dostupnost</SectionLabel>
            <h2 className="mt-3 text-xl font-semibold text-slate-900">Kde ordinujeme</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{mockup.serviceArea.intro}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {mockup.serviceArea.areas.map((area) => (
                <span key={area} className="rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
                  {area}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-8 md:mt-0 md:pl-12">
            <SectionLabel>Jak to funguje</SectionLabel>
            <h2 className="mt-3 text-xl font-semibold text-slate-900">Objednání krok za krokem</h2>
            <ol className="mt-4 space-y-3">
              {mockup.serviceArea.process.map((step, i) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="text-sm leading-6 text-slate-700">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <Divider />

        {/* ── CONTACT ─────────────────────────────────────────────── */}
        <section className="bg-teal-700 px-8 py-12 text-white md:px-12">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <SectionLabel>
                <span className="text-teal-200">Kontakt</span>
              </SectionLabel>
              <h2 className="mt-3 text-2xl font-semibold">{mockup.contactSection.title}</h2>
              <p className="mt-3 text-sm leading-6 text-teal-100">{mockup.contactSection.body}</p>
              <div className="mt-6 space-y-2 text-sm text-teal-100">
                <p>📞 {mockup.contact.phone}</p>
                <p>📧 {mockup.contact.email}</p>
                <p>📍 {mockup.contact.address}</p>
                <p>🕐 {mockup.contact.hours}</p>
              </div>
            </div>
            {/* Mock form */}
            <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
              <p className="mb-4 text-sm font-semibold text-white">Online objednávka</p>
              <div className="space-y-3">
                {mockup.contactSection.formFields.map((field) => (
                  <div
                    key={field}
                    className="rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-xs text-teal-100"
                  >
                    {field}
                  </div>
                ))}
                <div className="cursor-default rounded-full bg-white px-6 py-2.5 text-center text-sm font-semibold text-teal-700">
                  Odeslat žádost o termín
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ──────────────────────────────────────────────── */}
        <footer className="border-t border-slate-100 bg-slate-900 px-8 py-6 text-slate-400 md:px-12">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-300">{mockup.businessName}</p>
              <p className="mt-1 text-[0.65rem]">{mockup.footerNote}</p>
            </div>
            <div className="flex gap-4 text-[0.65rem]">
              <span className="cursor-default hover:text-slate-300">GDPR</span>
              <span className="cursor-default hover:text-slate-300">Cookies</span>
              <span className="cursor-default hover:text-slate-300">VOP</span>
              <span className="text-slate-600">© {new Date().getFullYear()}</span>
            </div>
          </div>
        </footer>
      </div>
    </MockupV2Shell>
  );
}
