import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  NEW: "bg-slate-100 text-slate-700",
  DRAFTED: "bg-amber-100 text-amber-800",
  APPROVED: "bg-cyan-100 text-cyan-800",
  SENT: "bg-emerald-100 text-emerald-800",
  REPLIED: "bg-violet-100 text-violet-800",
  OPTED_OUT: "bg-rose-100 text-rose-800",
  BOUNCED: "bg-rose-100 text-rose-800",
  DRAFT: "bg-amber-100 text-amber-800",
  ARCHIVED: "bg-slate-100 text-slate-600",
};

type StatusBadgeProps = {
  status: string;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide",
        STATUS_STYLES[status] ?? "bg-slate-100 text-slate-700",
      )}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}
