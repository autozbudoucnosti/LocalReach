import type { ReactNode } from "react";

type MockupV2ShellProps = {
  businessName: string;
  websiteLabel: string;
  children: ReactNode;
};

export function MockupV2Shell({ businessName, websiteLabel, children }: MockupV2ShellProps) {
  return (
    <section
      data-mockup-canvas
      className="relative overflow-hidden rounded-[2.8rem] border border-slate-200/70 bg-[linear-gradient(180deg,_#f7f6f2_0%,_#f2f1ec_100%)] px-4 py-6 shadow-[0_42px_120px_-68px_rgba(15,23,42,0.55)] md:px-6 md:py-8"
    >
      <div className="absolute inset-x-16 top-0 h-28 rounded-full bg-cyan-200/20 blur-3xl" />

      <article className="relative">
        <div className="overflow-hidden rounded-[2.2rem] border border-slate-200 bg-white shadow-[0_34px_96px_-58px_rgba(15,23,42,0.28)]">
          <div className="flex items-center justify-between border-b border-slate-200 bg-[#f8f7f4] px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-slate-300" />
              <span className="h-3 w-3 rounded-full bg-slate-300" />
              <span className="h-3 w-3 rounded-full bg-slate-300" />
            </div>
            <p className="text-sm font-medium text-slate-700">{businessName}</p>
            <div className="rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
              {websiteLabel}
            </div>
          </div>

          <div className="p-4 md:p-6 lg:p-7">{children}</div>
        </div>
      </article>
    </section>
  );
}
