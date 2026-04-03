import type { CSSProperties } from "react";
import type {
  LocalBusinessMockup,
  MockupFaqItem,
  MockupFeature,
  MockupQuote,
  MockupTheme,
  MockupVisual,
} from "@/lib/mockup-data";

function getCardStyle(theme: MockupTheme): CSSProperties {
  return {
    background: theme.cardBackground,
    borderColor: theme.borderColor,
  };
}

function getMutedCardStyle(theme: MockupTheme): CSSProperties {
  return {
    background: theme.cardMuted,
    borderColor: theme.borderColor,
  };
}

type SectionHeadingProps = {
  title: string;
  intro?: string;
  accentText: string;
  secondaryText: string;
};

export function SectionHeading({ title, intro, accentText, secondaryText }: SectionHeadingProps) {
  return (
    <div className="max-w-3xl space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.28em]" style={{ color: accentText }}>
        Sales mockup
      </p>
      <h2 className="font-serif text-3xl tracking-tight text-slate-950">{title}</h2>
      {intro ? (
        <p className="text-sm leading-7 md:text-base" style={{ color: secondaryText }}>
          {intro}
        </p>
      ) : null}
    </div>
  );
}

type MockupHeroProps = {
  mockup: LocalBusinessMockup;
};

export function MockupHero({ mockup }: MockupHeroProps) {
  const { theme, hero, contact, kind, businessName } = mockup;

  return (
    <section
      className="relative overflow-hidden rounded-[2rem] border p-6 md:p-10"
      style={{
        background: `linear-gradient(145deg, ${theme.heroFrom}, ${theme.heroTo})`,
        borderColor: theme.borderColor,
      }}
    >
      <div
        className="absolute -right-24 -top-16 h-64 w-64 rounded-full blur-3xl"
        style={{ background: `${theme.heroAccent}33` }}
      />
      <div
        className="absolute -bottom-24 left-0 h-56 w-56 rounded-full blur-3xl"
        style={{ background: `${theme.heroAccent}22` }}
      />

      <div className="relative grid gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-start">
        <div className="space-y-6">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.28em]" style={{ color: theme.secondaryText }}>
              {hero.eyebrow}
            </p>
            <div className="space-y-4">
              <h1 className="max-w-3xl font-serif text-4xl tracking-tight md:text-5xl" style={{ color: theme.primaryText }}>
                {hero.headline}
              </h1>
              <p className="max-w-2xl text-base leading-8 md:text-lg" style={{ color: theme.secondaryText }}>
                {hero.body}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <span
              className="rounded-full px-5 py-3 text-sm font-semibold shadow-sm"
              style={{ background: theme.ctaBackground, color: theme.ctaText }}
            >
              {hero.primaryCta}
            </span>
            <span
              className="rounded-full border px-5 py-3 text-sm font-semibold"
              style={{ borderColor: theme.borderColor, color: theme.primaryText, background: "rgba(255,255,255,0.06)" }}
            >
              {hero.secondaryCta}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {hero.highlights.map((highlight) => (
              <span
                key={highlight}
                className="rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em]"
                style={{ borderColor: theme.borderColor, color: theme.primaryText, background: "rgba(255,255,255,0.08)" }}
              >
                {highlight}
              </span>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {hero.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[1.4rem] border p-4"
                style={{ borderColor: theme.borderColor, background: "rgba(255,255,255,0.08)" }}
              >
                <p className="text-2xl font-semibold" style={{ color: theme.primaryText }}>
                  {stat.value}
                </p>
                <p className="mt-2 text-sm leading-6" style={{ color: theme.secondaryText }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[1.8rem] border p-5 shadow-[0_18px_60px_-38px_rgba(15,23,42,0.55)]" style={{ ...getCardStyle(theme), color: theme.accentText }}>
            <p className="text-xs font-semibold uppercase tracking-[0.24em]" style={{ color: theme.accentText }}>
              {businessName}
            </p>
            <h2 className="mt-3 font-serif text-2xl tracking-tight text-slate-950">{hero.panelTitle}</h2>
            <div className="mt-4 space-y-3">
              {hero.panelItems.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[1.3rem] border p-4"
                  style={{ ...getMutedCardStyle(theme), color: theme.accentText }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-slate-950">{item.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{item.description}</p>
                    </div>
                    {item.meta ? <span className="text-xs font-semibold uppercase tracking-[0.16em]">{item.meta}</span> : null}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="rounded-[1.8rem] border p-5 shadow-[0_18px_60px_-38px_rgba(15,23,42,0.55)]"
            style={{ ...getCardStyle(theme), color: theme.accentText }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em]">{kind === "gastro" ? "Kontakt a návštěva" : "Kontakt a dojezd"}</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-[1.2rem] border p-4" style={getMutedCardStyle(theme)}>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Telefon</p>
                <p className="mt-2 text-xl font-semibold text-slate-950">{contact.phone}</p>
              </div>
              <div className="rounded-[1.2rem] border p-4" style={getMutedCardStyle(theme)}>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Email</p>
                <p className="mt-2 text-base font-semibold text-slate-950">{contact.email}</p>
              </div>
              <div className="rounded-[1.2rem] border p-4" style={getMutedCardStyle(theme)}>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Adresa</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{contact.address}</p>
              </div>
              <div className="rounded-[1.2rem] border p-4" style={getMutedCardStyle(theme)}>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {kind === "gastro" ? "Poznámka" : "Servisní oblast"}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {kind === "gastro" ? contact.reservationNote : contact.serviceArea}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type MockupEmergencyStripProps = {
  label: string;
  text: string;
  action: string;
  theme: MockupTheme;
};

export function MockupEmergencyStrip({ label, text, action, theme }: MockupEmergencyStripProps) {
  return (
    <section
      className="flex flex-col gap-3 rounded-[1.6rem] border px-5 py-4 md:flex-row md:items-center md:justify-between"
      style={{ background: theme.ctaBackground, color: theme.ctaText, borderColor: `${theme.ctaBackground}33` }}
    >
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.28em]">{label}</p>
        <p className="text-sm md:text-base">{text}</p>
      </div>
      <span className="rounded-full border px-4 py-2 text-sm font-semibold" style={{ borderColor: "rgba(255,255,255,0.34)" }}>
        {action}
      </span>
    </section>
  );
}

type FeatureGridProps = {
  title: string;
  intro: string;
  features: MockupFeature[];
  theme: MockupTheme;
};

export function FeatureGrid({ title, intro, features, theme }: FeatureGridProps) {
  return (
    <section className="space-y-6">
      <SectionHeading title={title} intro={intro} accentText={theme.accentText} secondaryText={theme.accentText} />
      <div className="grid gap-4 lg:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="rounded-[1.6rem] border p-5" style={getCardStyle(theme)}>
            <h3 className="font-serif text-2xl tracking-tight text-slate-950">{feature.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
            {feature.meta ? (
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: theme.accentText }}>
                {feature.meta}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

type AboutAndContactProps = {
  mockup: LocalBusinessMockup;
};

export function AboutAndContact({ mockup }: AboutAndContactProps) {
  const { theme, sections, contact, kind } = mockup;

  return (
    <section className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
      <div className="rounded-[1.7rem] border p-6" style={getCardStyle(theme)}>
        <SectionHeading
          title={sections.aboutTitle}
          intro={sections.aboutBody}
          accentText={theme.accentText}
          secondaryText="#475569"
        />
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {sections.aboutHighlights.map((highlight) => (
            <div key={highlight} className="rounded-[1.3rem] border p-4" style={getMutedCardStyle(theme)}>
              <p className="text-sm font-medium leading-6 text-slate-700">{highlight}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[1.7rem] border p-6" style={getCardStyle(theme)}>
        <p className="text-xs font-semibold uppercase tracking-[0.28em]" style={{ color: theme.accentText }}>
          {kind === "gastro" ? "Kontakt a otevírací doba" : "Kontakt a dostupnost"}
        </p>
        <div className="mt-5 space-y-4">
          <div className="rounded-[1.3rem] border p-4" style={getMutedCardStyle(theme)}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{kind === "gastro" ? "Rezervace / kontakt" : "Telefon / servis"}</p>
            <p className="mt-2 text-xl font-semibold text-slate-950">{contact.phone}</p>
            <p className="mt-2 text-sm text-slate-600">{contact.email}</p>
          </div>
          <div className="rounded-[1.3rem] border p-4" style={getMutedCardStyle(theme)}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Adresa</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">{contact.address}</p>
            {contact.serviceArea ? <p className="mt-3 text-sm leading-6 text-slate-700">{contact.serviceArea}</p> : null}
            {contact.reservationNote ? <p className="mt-3 text-sm leading-6 text-slate-700">{contact.reservationNote}</p> : null}
            {contact.responseTime ? <p className="mt-3 text-sm leading-6 text-slate-700">{contact.responseTime}</p> : null}
          </div>
          <div className="rounded-[1.3rem] border p-4" style={getMutedCardStyle(theme)}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              {kind === "gastro" ? "Otevírací doba" : "Dostupnost"}
            </p>
            <div className="mt-3 space-y-2">
              {contact.hours.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-4 text-sm text-slate-700">
                  <span>{row.label}</span>
                  <span className="font-medium text-slate-950">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type VisualGridProps = {
  title: string;
  intro: string;
  items: MockupVisual[];
  theme: MockupTheme;
};

export function VisualGrid({ title, intro, items, theme }: VisualGridProps) {
  return (
    <section className="space-y-6">
      <SectionHeading title={title} intro={intro} accentText={theme.accentText} secondaryText="#64748b" />
      <div className="grid gap-4 lg:grid-cols-3">
        {items.map((item, index) => (
          <div key={item.title} className="rounded-[1.8rem] border p-4" style={getCardStyle(theme)}>
            <div
              className="flex aspect-[4/3] items-end overflow-hidden rounded-[1.4rem] border p-4"
              style={{
                background: `linear-gradient(160deg, ${theme.heroFrom}, ${theme.heroTo})`,
                borderColor: theme.borderColor,
              }}
            >
              <div
                className="rounded-[1.2rem] border px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em]"
                style={{ borderColor: `${theme.heroAccent}55`, background: `${theme.heroAccent}22`, color: theme.primaryText }}
              >
                Scene 0{index + 1}
              </div>
            </div>
            <h3 className="mt-4 font-serif text-2xl tracking-tight text-slate-950">{item.title}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

type ReviewGridProps = {
  title: string;
  reviews: MockupQuote[];
  theme: MockupTheme;
};

export function ReviewGrid({ title, reviews, theme }: ReviewGridProps) {
  return (
    <section className="space-y-6">
      <SectionHeading title={title} accentText={theme.accentText} secondaryText="#64748b" />
      <div className="grid gap-4 lg:grid-cols-3">
        {reviews.map((review) => (
          <div key={`${review.author}-${review.detail}`} className="rounded-[1.6rem] border p-5" style={getMutedCardStyle(theme)}>
            <p className="text-lg leading-8 text-slate-700">“{review.quote}”</p>
            <div className="mt-5">
              <p className="font-semibold text-slate-950">{review.author}</p>
              <p className="mt-1 text-sm text-slate-500">{review.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

type FaqGridProps = {
  title: string;
  items: MockupFaqItem[];
  theme: MockupTheme;
};

export function FaqGrid({ title, items, theme }: FaqGridProps) {
  return (
    <section className="space-y-6">
      <SectionHeading title={title} accentText={theme.accentText} secondaryText="#64748b" />
      <div className="grid gap-4 lg:grid-cols-2">
        {items.map((item) => (
          <div key={item.question} className="rounded-[1.6rem] border p-5" style={getCardStyle(theme)}>
            <h3 className="font-semibold text-slate-950">{item.question}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

type MockupCtaProps = {
  mockup: LocalBusinessMockup;
};

export function MockupCta({ mockup }: MockupCtaProps) {
  const { theme, sections } = mockup;

  return (
    <section
      className="rounded-[2rem] border p-6 md:p-8"
      style={{
        background: `linear-gradient(145deg, ${theme.heroFrom}, ${theme.heroTo})`,
        borderColor: theme.borderColor,
      }}
    >
      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr] xl:items-end">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.28em]" style={{ color: theme.secondaryText }}>
            Sales use case
          </p>
          <h2 className="max-w-3xl font-serif text-3xl tracking-tight md:text-4xl" style={{ color: theme.primaryText }}>
            {sections.ctaTitle}
          </h2>
          <p className="max-w-2xl text-sm leading-7 md:text-base" style={{ color: theme.secondaryText }}>
            {sections.ctaBody}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 xl:justify-end">
          <span
            className="rounded-full px-5 py-3 text-sm font-semibold shadow-sm"
            style={{ background: theme.ctaBackground, color: theme.ctaText }}
          >
            {sections.ctaPrimary}
          </span>
          <span
            className="rounded-full border px-5 py-3 text-sm font-semibold"
            style={{ borderColor: theme.borderColor, color: theme.primaryText, background: "rgba(255,255,255,0.08)" }}
          >
            {sections.ctaSecondary}
          </span>
        </div>
      </div>
    </section>
  );
}

type MockupFooterProps = {
  note: string;
  theme: MockupTheme;
  businessName: string;
};

export function MockupFooter({ note, theme, businessName }: MockupFooterProps) {
  return (
    <footer className="rounded-[1.8rem] border p-5" style={getCardStyle(theme)}>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-serif text-2xl tracking-tight text-slate-950">{businessName}</p>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">{note}</p>
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: theme.accentText }}>
          LocalReach sales mockup
        </p>
      </div>
    </footer>
  );
}
