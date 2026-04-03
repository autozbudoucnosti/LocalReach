import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="space-y-2">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-700">{eyebrow}</p>
        ) : null}
        <div className="space-y-1">
          <h1 className="font-serif text-3xl tracking-tight text-slate-950 md:text-4xl">{title}</h1>
          {description ? <p className="max-w-3xl text-sm text-slate-600 md:text-base">{description}</p> : null}
        </div>
      </div>
      {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
    </div>
  );
}
