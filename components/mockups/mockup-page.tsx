import type { LocalBusinessMockup } from "@/lib/mockup-data";
import {
  AboutAndContact,
  FaqGrid,
  FeatureGrid,
  MockupCta,
  MockupEmergencyStrip,
  MockupFooter,
  MockupHero,
  ReviewGrid,
  VisualGrid,
} from "@/components/mockups/mockup-sections";

type MockupPageProps = {
  mockup: LocalBusinessMockup;
};

function BrowserChrome({ businessName, browserTint }: { businessName: string; browserTint: string }) {
  return (
    <div
      className="flex items-center justify-between rounded-t-[1.8rem] border-b px-5 py-3"
      style={{ background: browserTint, borderColor: "rgba(255,255,255,0.12)" }}
    >
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-rose-300" />
        <span className="h-3 w-3 rounded-full bg-amber-300" />
        <span className="h-3 w-3 rounded-full bg-emerald-300" />
      </div>
      <p className="text-sm font-medium text-white/80">{businessName}</p>
      <div className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-white/60">
        Desktop preview
      </div>
    </div>
  );
}

export function MockupPage({ mockup }: MockupPageProps) {
  const { theme, sections, emergencyStrip, footerNote, businessName, kind } = mockup;

  return (
    <article
      data-mockup-canvas
      className="overflow-hidden rounded-[2rem] border shadow-[0_35px_110px_-50px_rgba(15,23,42,0.55)]"
      style={{ background: theme.shellBackground, borderColor: theme.borderColor }}
    >
      <BrowserChrome businessName={businessName} browserTint={theme.browserTint} />

      <div className="space-y-6 p-4 md:p-6">
        {emergencyStrip ? (
          <MockupEmergencyStrip
            label={emergencyStrip.label}
            text={emergencyStrip.text}
            action={emergencyStrip.action}
            theme={theme}
          />
        ) : null}

        <MockupHero mockup={mockup} />

        <div className="space-y-6 rounded-[2rem] p-1" style={{ background: theme.sectionBackground }}>
          {kind === "gastro" ? (
            <>
              <FeatureGrid
                title={sections.servicesTitle}
                intro={sections.servicesIntro}
                features={sections.services}
                theme={theme}
              />
              <AboutAndContact mockup={mockup} />
              <VisualGrid
                title={sections.galleryTitle}
                intro={sections.galleryIntro}
                items={sections.galleryItems}
                theme={theme}
              />
              <ReviewGrid title={sections.reviewsTitle} reviews={sections.reviews} theme={theme} />
            </>
          ) : (
            <>
              <FeatureGrid
                title={sections.servicesTitle}
                intro={sections.servicesIntro}
                features={sections.services}
                theme={theme}
              />
              <VisualGrid
                title={sections.galleryTitle}
                intro={sections.galleryIntro}
                items={sections.galleryItems}
                theme={theme}
              />
              <AboutAndContact mockup={mockup} />
              <ReviewGrid title={sections.reviewsTitle} reviews={sections.reviews} theme={theme} />
            </>
          )}

          {sections.faqTitle && sections.faqItems?.length ? (
            <FaqGrid title={sections.faqTitle} items={sections.faqItems} theme={theme} />
          ) : null}

          <MockupCta mockup={mockup} />
          <MockupFooter note={footerNote} theme={theme} businessName={businessName} />
        </div>
      </div>
    </article>
  );
}
