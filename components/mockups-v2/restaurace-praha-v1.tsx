/* eslint-disable @next/next/no-img-element */
/**
 * RestauracePrahaV1 — Czech neighbourhood restaurant niche template
 *
 * ui-ux-pro-max design system (Restaurant category):
 *   Pattern:    Hero-Centric + Menu Showcase + Social Proof
 *   Style:      Editorial / Organic Biophilic
 *   Base:       #f6f1eb  (warm parchment/cream)  ← fully distinct from bistro dark + dentist cold-white
 *   Accent:     #2d4a3e  (deep forest green)      ← distinct from bistro amber, dentist teal, plumber orange
 *   Gold:       #8b6914  (warm gold for prices/highlights)
 *   Text:       #1c1a17  (near-black warm)
 *   Typography: font-serif h1/h2 for warmth; sans body for readability
 *
 * Key visual differences from existing mockups:
 *   - Light cream base (vs bistro dark, dentist cold-white)
 *   - Forest green accent (vs amber, teal, orange)
 *   - Polední menu strip as primary differentiator (uniquely Czech, no other mockup has this)
 *   - Split hero: text left, photo right (vs bistro full-bleed overlay)
 *   - Prices visible in menu cards (drives realism)
 *   - Praha 2 Vinohrady address (vs Brno)
 *
 * Anti-patterns avoided (per ui-ux-pro-max):
 *   - No dark mode (bistro owns it)
 *   - No luxury fine-dining feel (white glove, script fonts, champagne)
 *   - No SaaS/startup styling (gradients, rounded pill CTAs, emoji bullets)
 *   - No AI purple/pink gradients
 *   - No amber (bistro) or teal (dentist) accent
 *
 * Data source: mockups-v2-data.ts → id: "restaurace-praha-v1"
 */
import type { ReactNode } from "react";
import type { MockupV2Definition } from "@/lib/mockups-v2-data";
import { MockupV2Shell } from "@/components/mockups-v2/mockup-v2-shell";

type RestauracePrahaV1Props = {
  mockup: MockupV2Definition;
};

const NAV_LINKS = ["Menu", "Polední menu", "O restauraci", "Rezervace"];

// Menu section icons — SVG inline to avoid emoji inconsistency (per ui-ux-pro-max checklist)
const DISH_ACCENTS: Record<number, string> = { 0: "I", 1: "II", 2: "III", 3: "IV" };

function DividerCream() {
  return <div className="h-px w-full bg-[#e4ddd5]" />;
}

function DividerGreen() {
  return <div className="h-px w-full bg-[#2d4a3e]/10" />;
}

function LabelGreen({ children }: { children: ReactNode }) {
  return (
    <p className="text-[0.67rem] font-semibold uppercase tracking-[0.26em] text-[#2d4a3e]">
      {children}
    </p>
  );
}

function LabelMuted({ children }: { children: ReactNode }) {
  return (
    <p className="text-[0.67rem] font-semibold uppercase tracking-[0.26em] text-[#8b6914]">
      {children}
    </p>
  );
}

export function RestauracePrahaV1({ mockup }: RestauracePrahaV1Props) {
  const websiteLabel = mockup.contact.email.split("@")[1] ?? mockup.contact.email;

  return (
    <MockupV2Shell businessName={mockup.businessName} websiteLabel={websiteLabel}>
      <div className="overflow-hidden bg-[#f6f1eb] text-[#1c1a17]">

        {/* ── NAV ─────────────────────────────────────────────────── */}
        <nav className="flex items-center justify-between bg-[#f6f1eb] px-6 py-3.5 border-b border-[#e4ddd5]">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-sm font-bold text-[#1c1a17]">
              {mockup.businessName}
            </span>
            <span className="text-[0.58rem] font-medium uppercase tracking-widest text-[#2d4a3e]/60">
              {mockup.city}
            </span>
          </div>
          <div className="hidden gap-5 md:flex">
            {NAV_LINKS.map((link) => (
              <span key={link} className="cursor-default text-xs text-[#6b6560]">
                {link}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-xs font-medium text-[#2d4a3e] md:block">
              {mockup.contact.phone}
            </span>
            <span className="cursor-default rounded bg-[#2d4a3e] px-4 py-1.5 text-xs font-semibold text-white shadow-[0_4px_12px_-4px_rgba(45,74,62,0.35)]">
              Rezervovat
            </span>
          </div>
        </nav>

        {/* ── POLEDNÍ MENU STRIP ────────────────────────────────────
            Czech-specific hook — "polední menu" is the #1 reason
            local restaurants get website traffic.
        ──────────────────────────────────────────────────────────── */}
        <div className="bg-[#2d4a3e] px-6 py-2.5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-[0.63rem] font-bold uppercase tracking-wider text-white/60">
              Dnešní polední menu
            </span>
            <span className="text-[0.63rem] text-white/80">·</span>
            <span className="text-[0.7rem] font-medium text-white">
              Polévka dne + hlavní jídlo od 139 Kč
            </span>
            <span className="text-[0.63rem] text-white/40 ml-0.5">
              Vydáváme Po–Pá 11:00–14:30
            </span>
            <span className="ml-auto cursor-default rounded border border-white/20 px-3 py-0.5 text-[0.62rem] font-medium text-white/80">
              Zobrazit menu →
            </span>
          </div>
        </div>

        {/* ── HERO — split layout: copy left, photo right ────────── */}
        <section className="grid bg-[#f6f1eb] lg:grid-cols-[1fr_1fr]">
          {/* Copy side */}
          <div className="flex flex-col justify-center px-8 py-14 md:px-12 md:py-16 lg:py-20">
            <LabelGreen>{mockup.hero.eyebrow}</LabelGreen>
            <h1 className="mt-3 font-serif text-3xl font-bold leading-[1.1] tracking-[-0.02em] text-[#1c1a17] md:text-[2.8rem] lg:text-[3.1rem]">
              {mockup.hero.headline}
            </h1>
            <p className="mt-4 max-w-md text-sm leading-7 text-[#6b6560] md:text-[0.92rem]">
              {mockup.hero.body}
            </p>

            {/* Service bullets — horizontal pills */}
            <div className="mt-5 flex flex-wrap gap-2">
              {mockup.hero.serviceBullets.map((bullet) => (
                <span
                  key={bullet}
                  className="rounded-sm border border-[#2d4a3e]/20 bg-[#2d4a3e]/5 px-2.5 py-1 text-[0.65rem] font-medium text-[#2d4a3e]"
                >
                  {bullet}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <span className="cursor-default rounded bg-[#2d4a3e] px-7 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(45,74,62,0.45)]">
                {mockup.hero.primaryCta}
              </span>
              <span className="cursor-default rounded border border-[#2d4a3e]/30 px-7 py-2.5 text-sm font-medium text-[#2d4a3e]">
                {mockup.hero.secondaryCta}
              </span>
            </div>

            {/* Trust bullets */}
            <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5">
              {mockup.hero.trustBullets.map((b) => (
                <span key={b} className="flex items-center gap-1.5 text-[0.67rem] text-[#6b6560]">
                  <span className="h-1 w-1 rounded-full bg-[#2d4a3e]" />
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Photo side */}
          <div className="relative min-h-[300px] lg:min-h-[440px]">
            <img
              src={mockup.imagery.hero}
              alt={mockup.hero.headline}
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
            />
            {/* Left-edge feather — blends the photo into the cream copy panel */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#f6f1eb]/40 via-[#f6f1eb]/8 to-transparent" />
            {/* Bottom depth shadow — adds grounding without muddying colour */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/12 via-transparent to-transparent" />
          </div>
        </section>

        {/* ── STATS ROW ────────────────────────────────────────────── */}
        <div className="border-y border-[#e4ddd5] bg-white px-6 py-5">
          <div className="grid grid-cols-2 gap-y-4 md:grid-cols-4">
            {mockup.hero.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-serif text-xl font-bold text-[#2d4a3e] md:text-2xl">{stat.value}</p>
                <p className="mt-0.5 text-[0.6rem] uppercase tracking-wider text-[#9c9490]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── MENU CARDS ───────────────────────────────────────────── */}
        <section className="bg-[#f6f1eb] px-8 py-12 md:px-12">
          <LabelGreen>Co vaříme</LabelGreen>
          <h2 className="mt-3 font-serif text-2xl font-bold text-[#1c1a17] md:text-3xl">
            Oblíbená jídla
          </h2>
          <p className="mt-2 max-w-lg text-sm text-[#6b6560]">{mockup.fastStrip.text}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {mockup.services.map((dish, i) => (
              <div
                key={dish.title}
                className="group rounded-lg border border-[#e4ddd5] bg-white p-5 shadow-[0_2px_10px_-4px_rgba(28,26,23,0.06)]"
              >
                {/* Ordinal accent — editorial, not emoji */}
                <span className="inline-block font-serif text-xs font-bold text-[#2d4a3e]/30">
                  {DISH_ACCENTS[i] ?? "—"}
                </span>
                <h3 className="mt-2 font-serif text-sm font-bold leading-snug text-[#1c1a17]">
                  {dish.title}
                </h3>
                <p className="mt-2 text-xs leading-5 text-[#6b6560]">{dish.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[0.67rem] font-semibold text-[#8b6914]">
                    {dish.note}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* View full menu CTA */}
          <div className="mt-7 flex justify-center">
            <span className="cursor-default rounded border border-[#2d4a3e] px-8 py-2.5 text-sm font-medium text-[#2d4a3e]">
              Zobrazit celý jídelní lístek
            </span>
          </div>
        </section>

        <DividerCream />

        {/* ── WHY US ───────────────────────────────────────────────── */}
        <section className="bg-[#f0ede7] px-8 py-12 md:px-12">
          <LabelMuted>Proč k nám</LabelMuted>
          <h2 className="mt-3 font-serif text-2xl font-bold text-[#1c1a17] md:text-3xl">
            Co nás odlišuje
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {mockup.trustPoints.map((point) => (
              <div
                key={point.title}
                className="rounded-lg border border-[#e4ddd5] bg-white p-6 shadow-[0_2px_8px_-4px_rgba(28,26,23,0.05)]"
              >
                <div className="mb-3 h-5 w-5 rounded border border-[#2d4a3e]/20 bg-[#2d4a3e]/5 flex items-center justify-center">
                  <span className="text-[0.5rem] font-bold text-[#2d4a3e]">✦</span>
                </div>
                <h3 className="text-sm font-semibold text-[#1c1a17]">{point.title}</h3>
                <p className="mt-2 text-xs leading-5 text-[#6b6560]">{point.description}</p>
              </div>
            ))}
          </div>
        </section>

        <DividerGreen />

        {/* ── REVIEWS ──────────────────────────────────────────────── */}
        <section className="bg-[#f6f1eb] px-8 py-12 md:px-12">
          <LabelGreen>Co říkají hosté</LabelGreen>
          <h2 className="mt-3 font-serif text-2xl font-bold text-[#1c1a17] md:text-3xl">
            Recenze
          </h2>

          {/* Google rating badge */}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm text-[#8b6914] tracking-wide">★★★★★</span>
            <span className="text-xs font-semibold text-[#2d4a3e]">4.7</span>
            <span className="text-xs text-[#9c9490]">Google hodnocení</span>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {mockup.reviews.map((review) => (
              <div
                key={review.author}
                className="rounded-lg border border-[#e4ddd5] bg-white p-6 shadow-[0_2px_8px_-4px_rgba(28,26,23,0.05)]"
              >
                <div className="text-xs text-[#8b6914] tracking-widest">★★★★★</div>
                <p className="mt-3 text-sm italic leading-6 text-[#4a4540]">
                  &ldquo;{review.quote}&rdquo;
                </p>
                <div className="mt-4 border-t border-[#f0eade] pt-3">
                  <p className="text-xs font-semibold text-[#1c1a17]">{review.author}</p>
                  <p className="text-[0.63rem] text-[#9c9490]">{review.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <DividerCream />

        {/* ── HOURS + ADDRESS ──────────────────────────────────────── */}
        <section className="bg-white px-8 py-12 md:px-12">
          <div className="grid gap-10 md:grid-cols-2">
            {/* Hours */}
            <div>
              <LabelGreen>Provozní doba</LabelGreen>
              <h2 className="mt-3 font-serif text-xl font-bold text-[#1c1a17]">
                Kdy jsme otevřeni
              </h2>
              <div className="mt-5 space-y-2.5 text-sm">
                <div className="flex justify-between border-b border-[#f0eae4] pb-2.5">
                  <span className="text-[#6b6560]">Pondělí – Pátek</span>
                  <span className="font-semibold text-[#1c1a17]">11:00 – 22:00</span>
                </div>
                <div className="flex justify-between border-b border-[#f0eae4] pb-2.5">
                  <span className="text-[#6b6560]">Sobota – Neděle</span>
                  <span className="font-semibold text-[#1c1a17]">12:00 – 22:00</span>
                </div>
                <div className="flex justify-between pb-2.5">
                  <span className="text-[#6b6560]">Polední menu</span>
                  <span className="font-semibold text-[#2d4a3e]">Po–Pá 11:00–14:30</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-medium text-emerald-600">Dnes otevřeno</span>
              </div>
            </div>

            {/* Address */}
            <div>
              <LabelGreen>Kde nás najdete</LabelGreen>
              <h2 className="mt-3 font-serif text-xl font-bold text-[#1c1a17]">
                Adresa a kontakt
              </h2>
              <div className="mt-5 space-y-3 text-sm">
                <p className="flex items-start gap-2 text-[#4a4540]">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2d4a3e]" />
                  {mockup.contact.address}
                </p>
                <p className="flex items-start gap-2 text-[#4a4540]">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2d4a3e]" />
                  {mockup.contact.phone}
                </p>
                <p className="flex items-start gap-2 text-[#4a4540]">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2d4a3e]" />
                  {mockup.contact.email}
                </p>
              </div>
              <div className="mt-5 rounded-md border border-[#e4ddd5] bg-[#f6f1eb] px-4 py-3">
                <p className="text-xs leading-5 text-[#6b6560]">{mockup.serviceArea.intro}</p>
              </div>
            </div>
          </div>
        </section>

        <DividerCream />

        {/* ── RESERVATION CTA ──────────────────────────────────────── */}
        <section className="bg-[#f6f1eb] px-8 py-12 md:px-12">
          <div className="mx-auto max-w-xl rounded-xl border border-[#2d4a3e]/15 bg-white px-8 py-10 text-center shadow-[0_4px_24px_-8px_rgba(45,74,62,0.12)]">
            <LabelGreen>{mockup.contactSection.title}</LabelGreen>
            <h2 className="mt-4 font-serif text-2xl font-bold text-[#1c1a17] md:text-3xl">
              {mockup.contactSection.body}
            </h2>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <span className="cursor-default rounded bg-[#2d4a3e] px-8 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(45,74,62,0.45)]">
                Rezervovat stůl
              </span>
              <span className="cursor-default rounded border border-[#2d4a3e]/30 px-8 py-2.5 text-sm font-medium text-[#2d4a3e]">
                {mockup.contact.phone}
              </span>
            </div>
            {/* Form field labels — suggest form structure without building one */}
            <div className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
              {mockup.contactSection.formFields.map((field) => (
                <span key={field} className="flex items-center gap-1.5 text-[0.65rem] text-[#9c9490]">
                  <span className="text-[#2d4a3e]/40">—</span>
                  {field}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────────────────────── */}
        <footer className="border-t border-[#e4ddd5] bg-[#2d4a3e] px-8 py-5">
          <div className="flex flex-col gap-1.5 md:flex-row md:items-center md:justify-between">
            <span className="font-serif text-sm font-semibold text-white/80">
              {mockup.businessName}
            </span>
            <span className="text-[0.62rem] text-white/40">{mockup.footerNote}</span>
          </div>
        </footer>

      </div>
    </MockupV2Shell>
  );
}
