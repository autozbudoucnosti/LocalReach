/* eslint-disable @next/next/no-img-element */
/**
 * BistroBrnoV1 — Czech neighbourhood bistro niche template
 *
 * Visual direction: warm near-black (#1a1612) base, amber-400/500 accent,
 * full-bleed photo hero with gradient overlay, serif headings, dish-preview
 * cards, reservation-first CTA, Google star rating as primary trust signal.
 *
 * Key visual differences from plumber and clinic:
 * - Photography is structural (full-bleed hero), not decorative panel
 * - font-serif on all h1/h2 — gives warmth without luxury pretension
 * - Warm near-black palette vs cold slate (plumber) or white (clinic)
 * - Amber accent vs teal or blue-slate
 * - Dish cards replace service/cert cards
 * - Google rating + "Od 2017" are the trust signals — no cert badges
 * - Reservation is the primary conversion action, not a phone call
 *
 * Data source: mockups-v2-data.ts → id: "bistro-brno-v1"
 */
import type { ReactNode } from "react";
import type { MockupV2Definition } from "@/lib/mockups-v2-data";
import { MockupV2Shell } from "@/components/mockups-v2/mockup-v2-shell";

type BistroBrnoV1Props = {
  mockup: MockupV2Definition;
};

const DISH_ICONS: Record<number, string> = { 0: "🥩", 1: "🍲", 2: "🥗", 3: "🍽️" };
const NAV_LINKS = ["Menu", "O nás", "Akce", "Kontakt"];

function DividerLight() {
  return <div className="h-px w-full bg-stone-200" />;
}

function DividerDark() {
  return <div className="h-px w-full bg-white/10" />;
}

function LabelAmber({ children }: { children: ReactNode }) {
  return (
    <p className="text-[0.67rem] font-semibold uppercase tracking-[0.24em] text-amber-400">
      {children}
    </p>
  );
}

function LabelStone({ children }: { children: ReactNode }) {
  return (
    <p className="text-[0.67rem] font-semibold uppercase tracking-[0.24em] text-stone-400">
      {children}
    </p>
  );
}

export function BistroBrnoV1({ mockup }: BistroBrnoV1Props) {
  const websiteLabel = mockup.contact.email.split("@")[1] ?? mockup.contact.email;

  return (
    <MockupV2Shell businessName={mockup.businessName} websiteLabel={websiteLabel}>
      <div className="overflow-hidden bg-[#1a1612] text-stone-100">

        {/* ── NAV ─────────────────────────────────────────────────── */}
        <nav className="flex items-center justify-between bg-[#1a1612] px-6 py-3.5 border-b border-white/5">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-sm font-semibold text-stone-100">
              {mockup.businessName}
            </span>
            <span className="text-[0.6rem] font-medium uppercase tracking-widest text-amber-400/60">
              {mockup.city}
            </span>
          </div>
          <div className="hidden gap-5 md:flex">
            {NAV_LINKS.map((link) => (
              <span key={link} className="cursor-default text-xs text-stone-400">
                {link}
              </span>
            ))}
          </div>
          <span className="cursor-default rounded bg-amber-500 px-4 py-1.5 text-xs font-semibold text-white shadow-[0_4px_12px_-4px_rgba(245,158,11,0.45)]">
            Rezervovat
          </span>
        </nav>

        {/* ── FAST INFO STRIP ─────────────────────────────────────── */}
        <div className="bg-[#141210] px-6 py-2">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <span className="flex items-center gap-1.5 text-[0.68rem] text-stone-400">
              <span className="text-amber-500">◆</span>
              {mockup.fastStrip.label}
            </span>
            <span className="text-[0.68rem] text-stone-500">{mockup.contact.hours}</span>
            <span className="ml-auto text-[0.68rem] font-medium text-amber-400">
              {mockup.contact.phone}
            </span>
          </div>
        </div>

        {/* ── HERO — full-bleed photo with overlay ─────────────────── */}
        <section className="relative min-h-[400px] overflow-hidden md:min-h-[460px]">
          {/* Photo */}
          <img
            src={mockup.imagery.hero}
            alt={mockup.hero.headline}
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
          />
          {/* Directional overlay — lightened so the photo shows through on the right */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f0d0a]/78 via-[#0f0d0a]/38 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1612]/48 via-transparent to-transparent" />
          {/* Fallback gradient when image is absent */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-stone-900 via-stone-800 to-amber-950" />

          {/* Text — anchored to bottom-left for natural reading flow */}
          <div className="relative flex h-full min-h-[400px] flex-col justify-end px-8 pb-10 md:min-h-[460px] md:px-12 md:pb-14">
            <LabelAmber>{mockup.hero.eyebrow}</LabelAmber>
            <h1 className="mt-3 max-w-xl font-serif text-3xl font-bold leading-tight tracking-tight text-stone-50 md:text-[2.6rem] md:leading-[1.1]">
              {mockup.hero.headline}
            </h1>
            <p className="mt-3 max-w-md text-sm leading-6 text-stone-300 md:text-[0.95rem] md:leading-7">
              {mockup.hero.body}
            </p>

            {/* Food highlights */}
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1.5">
              {mockup.hero.serviceBullets.map((bullet) => (
                <span key={bullet} className="flex items-center gap-1.5 text-xs text-stone-300">
                  <span className="text-amber-400 text-[0.55rem]">✦</span>
                  {bullet}
                </span>
              ))}
            </div>

            {/* CTAs — rounded-md, not pill, for editorial feel */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="cursor-default rounded-md bg-amber-500 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_8px_22px_-8px_rgba(245,158,11,0.55)]">
                {mockup.hero.primaryCta}
              </span>
              <span className="cursor-default rounded-md border border-stone-400/35 px-6 py-2.5 text-sm font-medium text-stone-200">
                {mockup.hero.secondaryCta}
              </span>
            </div>

            {/* Trust bullets removed from hero — repeated in stats row below,
                keeping hero content tight: eyebrow → h1 → body → highlights → CTAs */}
          </div>
        </section>

        {/* ── STATS ROW ────────────────────────────────────────────── */}
        <div className="bg-[#141210] px-6 py-5 border-t border-b border-white/5">
          <div className="grid grid-cols-2 gap-y-4 md:grid-cols-4">
            {mockup.hero.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-serif text-lg font-bold text-amber-400 md:text-2xl">{stat.value}</p>
                <p className="mt-0.5 text-[0.6rem] uppercase tracking-wider text-stone-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── MENU PREVIEW ─────────────────────────────────────────── */}
        <section className="bg-stone-50 px-8 py-12 md:px-12">
          <LabelStone>Co vaříme</LabelStone>
          <h2 className="mt-3 font-serif text-2xl font-bold text-stone-900 md:text-3xl">
            Oblíbené pokrmy
          </h2>
          <p className="mt-2 max-w-lg text-sm text-stone-500">{mockup.fastStrip.text}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {mockup.services.map((dish, i) => (
              <div
                key={dish.title}
                className="rounded-xl border border-stone-200 bg-white p-5 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.07)]"
              >
                <span className="text-2xl">{DISH_ICONS[i] ?? "🍽️"}</span>
                <h3 className="mt-3 font-serif text-sm font-semibold text-stone-900">{dish.title}</h3>
                <p className="mt-1.5 text-xs leading-5 text-stone-500">{dish.description}</p>
                <span className="mt-3 inline-block rounded bg-amber-50 px-2.5 py-0.5 text-[0.63rem] font-medium text-amber-700">
                  {dish.note}
                </span>
              </div>
            ))}
          </div>
        </section>

        <DividerLight />

        {/* ── WHY US ───────────────────────────────────────────────── */}
        <section className="bg-[#1a1612] px-8 py-12 md:px-12">
          <LabelAmber>Proč k nám</LabelAmber>
          <h2 className="mt-3 font-serif text-2xl font-bold text-stone-100 md:text-3xl">
            Co nás odlišuje
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {mockup.trustPoints.map((point) => (
              <div
                key={point.title}
                className="rounded-xl border border-stone-700/50 bg-stone-800/30 p-6"
              >
                <div className="mb-3 flex h-7 w-7 items-center justify-center rounded bg-amber-500/10">
                  <span className="text-[0.6rem] text-amber-400">✦</span>
                </div>
                <h3 className="text-sm font-semibold text-stone-100">{point.title}</h3>
                <p className="mt-2 text-xs leading-5 text-stone-400">{point.description}</p>
              </div>
            ))}
          </div>
        </section>

        <DividerDark />

        {/* ── REVIEWS ──────────────────────────────────────────────── */}
        <section className="bg-stone-50 px-8 py-12 md:px-12">
          <LabelStone>Co říkají hosté</LabelStone>
          <h2 className="mt-3 font-serif text-2xl font-bold text-stone-900 md:text-3xl">
            Recenze
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {mockup.reviews.map((review) => (
              <div
                key={review.author}
                className="rounded-xl border border-stone-200 bg-white p-6 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.06)]"
              >
                <div className="text-sm text-amber-400 tracking-widest">★★★★★</div>
                <p className="mt-3 text-sm italic leading-6 text-stone-700">
                  &ldquo;{review.quote}&rdquo;
                </p>
                <div className="mt-4 border-t border-stone-100 pt-3">
                  <p className="text-xs font-semibold text-stone-800">{review.author}</p>
                  <p className="text-[0.63rem] text-stone-400">{review.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <DividerLight />

        {/* ── HOURS + ADDRESS ──────────────────────────────────────── */}
        <section className="bg-[#1a1612] px-8 py-12 md:px-12">
          <div className="grid gap-10 md:grid-cols-2">
            {/* Hours */}
            <div>
              <LabelAmber>Provozní doba</LabelAmber>
              <h2 className="mt-3 font-serif text-xl font-bold text-stone-100">
                Kdy jsme otevřeni
              </h2>
              <div className="mt-5 space-y-2.5 text-sm">
                <div className="flex justify-between border-b border-white/8 pb-2.5 text-stone-300">
                  <span>Pondělí – Pátek</span>
                  <span className="font-medium text-stone-100">11:00 – 22:00</span>
                </div>
                <div className="flex justify-between border-b border-white/8 pb-2.5 text-stone-300">
                  <span>Sobota</span>
                  <span className="font-medium text-stone-100">12:00 – 23:00</span>
                </div>
                <div className="flex justify-between pb-2 text-stone-300">
                  <span>Neděle</span>
                  <span className="font-medium text-stone-100">12:00 – 21:00</span>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-medium text-emerald-400">Dnes otevřeno</span>
              </div>
            </div>

            {/* Address */}
            <div>
              <LabelAmber>Kde nás najdete</LabelAmber>
              <h2 className="mt-3 font-serif text-xl font-bold text-stone-100">
                Adresa a kontakt
              </h2>
              <div className="mt-5 space-y-3 text-sm text-stone-300">
                <p className="flex items-start gap-2">
                  <span className="mt-0.5 shrink-0 text-amber-500">◆</span>
                  {mockup.contact.address}
                </p>
                <p className="flex items-start gap-2">
                  <span className="mt-0.5 shrink-0 text-amber-500">◆</span>
                  {mockup.contact.phone}
                </p>
                <p className="flex items-start gap-2">
                  <span className="mt-0.5 shrink-0 text-amber-500">◆</span>
                  {mockup.contact.email}
                </p>
              </div>
              <div className="mt-6 rounded-lg border border-stone-700/50 bg-stone-800/30 px-4 py-3">
                <p className="text-xs leading-5 text-stone-400">{mockup.serviceArea.intro}</p>
              </div>
            </div>
          </div>
        </section>

        <DividerDark />

        {/* ── RESERVATION CTA ──────────────────────────────────────── */}
        <section className="bg-[#141210] px-8 py-12 md:px-12">
          <div className="mx-auto max-w-xl text-center">
            <LabelAmber>{mockup.contactSection.title}</LabelAmber>
            <h2 className="mt-4 font-serif text-2xl font-bold text-stone-100 md:text-3xl">
              {mockup.contactSection.body}
            </h2>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <span className="cursor-default rounded-md bg-amber-500 px-8 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(245,158,11,0.5)]">
                {mockup.hero.primaryCta}
              </span>
              <span className="cursor-default rounded-md border border-stone-600 px-8 py-3 text-sm font-medium text-stone-300">
                {mockup.contact.phone}
              </span>
            </div>
            <div className="mt-7 flex flex-wrap justify-center gap-x-5 gap-y-2">
              {mockup.contactSection.formFields.map((field) => (
                <span key={field} className="flex items-center gap-1.5 text-[0.68rem] text-stone-500">
                  <span className="text-amber-600">—</span>
                  {field}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────────────────────── */}
        <footer className="bg-[#0f0d0a] px-8 py-5">
          <div className="flex flex-col gap-1.5 md:flex-row md:items-center md:justify-between">
            <span className="font-serif text-sm font-semibold text-stone-400">
              {mockup.businessName}
            </span>
            <span className="text-[0.63rem] text-stone-600">{mockup.footerNote}</span>
          </div>
        </footer>

      </div>
    </MockupV2Shell>
  );
}
