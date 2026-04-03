/* eslint-disable @next/next/no-img-element */
/**
 * PlumberBrnoV1 — Czech plumber niche template
 *
 * Visual direction: dark-navy hero, orange CTAs, horizontal trust strip,
 * 4-card services grid, two-column "why us", star testimonials, dark contact
 * section with form mock, and a realistic Czech footer with IČO.
 *
 * Data source: mockups-v2-data.ts → id: "plumber-brno-v1"
 */
import type { MockupV2Definition } from "@/lib/mockups-v2-data";
import { MockupV2Shell } from "@/components/mockups-v2/mockup-v2-shell";

type PlumberBrnoV1Props = {
  mockup: MockupV2Definition;
};

const SERVICE_ICONS: Record<number, string> = { 0: "🔧", 1: "🪛", 2: "🚿", 3: "🔥" };

const NAV_LINKS = ["Služby", "O nás", "Ceník", "Kontakt"];

export function PlumberBrnoV1({ mockup }: PlumberBrnoV1Props) {
  const websiteLabel = mockup.contact.email.split("@")[1] ?? mockup.contact.email;
  // Trust strip — use first 3 stats only (matches 3-column Stitch layout)
  const trustStats = mockup.hero.stats.slice(0, 3);

  return (
    <MockupV2Shell businessName={mockup.businessName} websiteLabel={websiteLabel}>
      <div className="overflow-hidden bg-white text-slate-900">

        {/* ── NAV ─────────────────────────────────────────────────── */}
        <nav className="flex items-center justify-between bg-slate-900 px-6 py-3">
          <span className="text-sm font-semibold text-white">{mockup.businessName}</span>
          <div className="hidden gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <span key={link} className="cursor-default text-sm text-slate-400">
                {link}
              </span>
            ))}
          </div>
          <span className="rounded bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white">
            ☎ {mockup.contact.phone}
          </span>
        </nav>

        {/* ── HERO ────────────────────────────────────────────────── */}
        <section className="relative grid bg-slate-900 lg:grid-cols-2">
          {/* Copy */}
          <div className="relative z-10 flex flex-col justify-center px-8 py-14 md:px-14 md:py-20">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-orange-400">
              {mockup.hero.eyebrow}
            </p>
            <h1 className="mb-5 text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-white md:text-5xl lg:text-[3.4rem]">
              {mockup.hero.headline}
            </h1>
            <p className="mb-8 max-w-md text-base leading-7 text-slate-300">
              {mockup.hero.body}
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="cursor-default rounded bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_-10px_rgba(249,115,22,0.6)]">
                {mockup.hero.primaryCta}
              </span>
              <span className="cursor-default rounded border border-slate-500 px-6 py-3 text-sm font-semibold text-white">
                {mockup.hero.secondaryCta}
              </span>
            </div>
          </div>

          {/* Hero image */}
          <div className="relative min-h-[300px] lg:min-h-[460px]">
            <img
              src={mockup.imagery.hero}
              alt={mockup.hero.headline}
              className="absolute inset-0 h-full w-full object-cover opacity-55"
              loading="eager"
            />
            {/* gradient fades image into dark panel on left */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/50 to-transparent lg:from-transparent lg:via-transparent" />
          </div>
        </section>

        {/* ── TRUST STRIP ─────────────────────────────────────────── */}
        <section className="border-b border-slate-100 bg-white py-8">
          <div className="mx-auto grid max-w-3xl grid-cols-3 divide-x divide-slate-100 text-center">
            {trustStats.map((stat) => (
              <div key={stat.value} className="px-4">
                <p className="text-xl font-bold text-slate-900 md:text-2xl">{stat.value}</p>
                <p className="mt-0.5 text-xs text-slate-500 md:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SERVICES ────────────────────────────────────────────── */}
        <section className="bg-slate-50 px-6 py-12 md:px-10 md:py-14">
          <div className="mx-auto max-w-5xl">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">Nabízíme</p>
            <h2 className="mb-8 text-2xl font-bold tracking-[-0.02em] text-slate-900 md:text-3xl">
              Naše služby
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {mockup.services.map((service, i) => (
                <div
                  key={service.title}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <span className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-lg">
                    {SERVICE_ICONS[i] ?? "🔧"}
                  </span>
                  <h3 className="mb-2 text-[0.95rem] font-semibold text-slate-900">{service.title}</h3>
                  <p className="text-sm leading-6 text-slate-500">{service.description}</p>
                  <p className="mt-3 text-xs font-medium text-orange-600">{service.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY US ──────────────────────────────────────────────── */}
        <section className="grid lg:grid-cols-2">
          {/* Left: dark image */}
          <div className="relative min-h-[300px] bg-slate-800 lg:min-h-[420px]">
            <img
              src={mockup.imagery.references[0] ?? mockup.imagery.hero}
              alt="Realizace instalatér"
              className="absolute inset-0 h-full w-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-slate-900/50" />
            <div className="absolute bottom-6 left-6 rounded bg-white/10 px-4 py-2 text-xs font-medium text-white backdrop-blur-sm">
              {mockup.realizations[0]?.location ?? "Brno"}
            </div>
          </div>

          {/* Right: bullet points */}
          <div className="bg-white px-8 py-12 md:px-12 md:py-14">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">Proč my</p>
            <h2 className="mb-8 text-2xl font-bold tracking-[-0.02em] text-slate-900 md:text-3xl">
              Proč si vybrat nás?
            </h2>
            <div className="space-y-7">
              {mockup.trustPoints.map((point) => (
                <div key={point.title} className="flex gap-4">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500 text-[0.65rem] font-bold text-white">
                    ✓
                  </span>
                  <div>
                    <h3 className="mb-1 text-[0.95rem] font-semibold text-slate-900">{point.title}</h3>
                    <p className="text-sm leading-6 text-slate-500">{point.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ────────────────────────────────────────── */}
        <section className="bg-slate-50 px-6 py-12 md:px-10 md:py-14">
          <div className="mx-auto max-w-5xl">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">Reference</p>
            <h2 className="mb-8 text-2xl font-bold tracking-[-0.02em] text-slate-900 md:text-3xl">
              Co o nás říkají klienti
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {mockup.reviews.map((review) => (
                <div
                  key={review.author}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <p className="mb-3 text-sm text-orange-400">★★★★★</p>
                  <p className="mb-4 text-sm leading-7 text-slate-700">„{review.quote}"</p>
                  <p className="text-sm font-semibold text-slate-900">{review.author}</p>
                  <p className="text-xs text-slate-400">{review.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTACT ─────────────────────────────────────────────── */}
        <section className="bg-slate-900 px-6 py-12 md:px-10 md:py-14">
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2">
            {/* Contact info */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">Kontakt</p>
              <h2 className="mb-5 text-2xl font-bold tracking-[-0.02em] text-white md:text-3xl">
                {mockup.contactSection.title}
              </h2>
              <p className="mb-7 text-sm leading-7 text-slate-300">{mockup.contactSection.body}</p>
              <div className="space-y-2.5 text-sm text-slate-300">
                <p>
                  <span className="font-medium text-white">Telefon:</span>{" "}
                  {mockup.contact.phone}
                </p>
                <p>
                  <span className="font-medium text-white">E-mail:</span>{" "}
                  {mockup.contact.email}
                </p>
                <p>
                  <span className="font-medium text-white">Adresa:</span>{" "}
                  {mockup.contact.address}
                </p>
                <p>
                  <span className="font-medium text-white">Provozní doba:</span>{" "}
                  {mockup.contact.hours}
                </p>
              </div>
            </div>

            {/* Form mock */}
            <div className="rounded-xl bg-white p-6">
              <p className="mb-4 text-sm font-semibold text-slate-900">Nezávazná poptávka</p>
              <div className="space-y-3">
                {mockup.contactSection.formFields.map((field) => (
                  <div
                    key={field}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-400"
                  >
                    {field}
                  </div>
                ))}
                <div className="rounded-lg bg-orange-500 px-4 py-3 text-center text-sm font-semibold text-white">
                  Odeslat poptávku
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ──────────────────────────────────────────────── */}
        <footer className="bg-slate-800 px-6 py-8 md:px-10">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-7 md:grid-cols-3">
              {/* Brand */}
              <div>
                <p className="mb-2 text-sm font-semibold text-white">{mockup.businessName}</p>
                <p className="text-xs leading-6 text-slate-400">{mockup.footerNote}</p>
              </div>
              {/* Services list */}
              <div>
                <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Služby
                </p>
                <div className="space-y-1">
                  {mockup.services.map((s) => (
                    <p key={s.title} className="text-xs text-slate-400">
                      {s.title}
                    </p>
                  ))}
                </div>
              </div>
              {/* Service area */}
              <div>
                <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Oblast servisu
                </p>
                <div className="space-y-1">
                  {mockup.serviceArea.areas.map((area) => (
                    <p key={area} className="text-xs text-slate-400">
                      {area}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            {/* Bottom bar */}
            <div className="mt-6 border-t border-slate-700 pt-5 text-center text-xs text-slate-600">
              © {new Date().getFullYear()} {mockup.businessName} · {mockup.contact.address}
            </div>
          </div>
        </footer>

      </div>
    </MockupV2Shell>
  );
}
