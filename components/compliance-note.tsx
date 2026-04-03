import { COMPLIANCE_NOTE } from "@/lib/constants";

export function ComplianceNote() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm text-amber-900 shadow-sm">
      {COMPLIANCE_NOTE}
    </div>
  );
}
