import type { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  accent?: ReactNode;
};

export function StatCard({ label, value, hint, accent }: StatCardProps) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-[0_14px_40px_-28px_rgba(15,23,42,0.4)] backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
        </div>
        {accent ? <div className="text-cyan-700">{accent}</div> : null}
      </div>
      {hint ? <p className="mt-3 text-sm text-slate-500">{hint}</p> : null}
    </div>
  );
}
