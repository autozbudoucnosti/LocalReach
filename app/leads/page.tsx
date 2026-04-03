import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import {
  CHANNEL_TYPES,
  CONTACT_STATUSES,
  LEAD_BUCKETS,
  LEAD_STATUSES,
  RECOMMENDED_OFFERS,
  WEBSITE_STATES,
} from "@/lib/constants";
import {
  CHANNEL_LABELS,
  CONTACT_STATUS_LABELS,
  WORKFLOW_ACTION_LABELS,
} from "@/lib/channel-strategy";
import { getOfferLabel, LEAD_BUCKET_LABELS, WEBSITE_STATE_LABELS } from "@/lib/lead-qualification";
import { getLeadsPageData } from "@/lib/queries";

export const dynamic = "force-dynamic";

type LeadsPageProps = {
  searchParams: Promise<{
    search?: string;
    niche?: string;
    city?: string;
    status?: string;
    priority?: string;
    recommendedOffer?: string;
    websiteState?: string;
    recommendedChannel?: string;
    contactStatus?: string;
    followUpDue?: string;
    warmOnly?: string;
  }>;
};

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const filters = await searchParams;
  const data = await getLeadsPageData(filters);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Pipeline"
        title="Leads"
        description="Filter local business leads, open records, and move each one through manual draft review."
        actions={
          <>
            <Link
              href="/leads/new"
              className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Add lead
            </Link>
            <Link
              href="/leads/import"
              className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Import CSV
            </Link>
          </>
        }
      />

      <section className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.35)]">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">High-priority leads</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              {data.summary.highPriorityLeads}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">No website</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{data.summary.noWebsiteLeads}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">Need business email</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              {data.summary.needsBusinessEmail}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">Calls to make</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{data.summary.callsToMake}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">Follow-ups due</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{data.summary.followUpsDue}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">Warm leads</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{data.summary.warmLeads}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">Manual research</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              {data.summary.manualResearchNeeded}
            </p>
          </div>
        </div>

        <form className="mt-6 flex flex-wrap gap-3">
          <input
            name="search"
            defaultValue={filters.search ?? ""}
            placeholder="Search business name, email, phone, or website"
            className="min-w-[16rem] flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
          />
          <select
            name="niche"
            defaultValue={filters.niche ?? ""}
            className="min-w-[10rem] rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
          >
            <option value="">All niches</option>
            {data.niches.map((niche) => (
              <option key={niche} value={niche}>
                {niche}
              </option>
            ))}
          </select>
          <select
            name="city"
            defaultValue={filters.city ?? ""}
            className="min-w-[10rem] rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
          >
            <option value="">All cities</option>
            {data.cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          <select
            name="status"
            defaultValue={filters.status ?? ""}
            className="min-w-[10rem] rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
          >
            <option value="">All statuses</option>
            {LEAD_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status.replaceAll("_", " ")}
              </option>
            ))}
          </select>
          <select
            name="priority"
            defaultValue={filters.priority ?? ""}
            className="min-w-[10rem] rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
          >
            <option value="">All priorities</option>
            {LEAD_BUCKETS.map((bucket) => (
              <option key={bucket} value={bucket}>
                {LEAD_BUCKET_LABELS[bucket]}
              </option>
            ))}
          </select>
          <select
            name="recommendedOffer"
            defaultValue={filters.recommendedOffer ?? ""}
            className="min-w-[11rem] rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
          >
            <option value="">All offers</option>
            {RECOMMENDED_OFFERS.map((offer) => (
              <option key={offer} value={offer}>
                {getOfferLabel(offer)}
              </option>
            ))}
          </select>
          <select
            name="websiteState"
            defaultValue={filters.websiteState ?? ""}
            className="min-w-[11rem] rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
          >
            <option value="">All website states</option>
            {WEBSITE_STATES.map((state) => (
              <option key={state} value={state}>
                {WEBSITE_STATE_LABELS[state]}
              </option>
            ))}
          </select>
          <select
            name="recommendedChannel"
            defaultValue={filters.recommendedChannel ?? ""}
            className="min-w-[11rem] rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
          >
            <option value="">All channels</option>
            {CHANNEL_TYPES.map((channel) => (
              <option key={channel} value={channel}>
                {CHANNEL_LABELS[channel]}
              </option>
            ))}
          </select>
          <select
            name="contactStatus"
            defaultValue={filters.contactStatus ?? ""}
            className="min-w-[11rem] rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
          >
            <option value="">All contact states</option>
            {CONTACT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {CONTACT_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
          <label className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700">
            <input type="checkbox" name="followUpDue" value="1" defaultChecked={filters.followUpDue === "1"} />
            Follow-up due
          </label>
          <label className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700">
            <input type="checkbox" name="warmOnly" value="1" defaultChecked={filters.warmOnly === "1"} />
            Warm leads only
          </label>
          <button
            type="submit"
            className="rounded-full bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700"
          >
            Apply filters
          </button>
        </form>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
          {data.leads.length > 0 ? (
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Business</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Phone / website</th>
                  <th className="px-4 py-3 font-medium">City / niche</th>
                  <th className="px-4 py-3 font-medium">Priority / score</th>
                  <th className="px-4 py-3 font-medium">Offer</th>
                  <th className="px-4 py-3 font-medium">Channel / next</th>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {data.leads.map((lead) => (
                  <tr key={lead.id} className="align-top hover:bg-slate-50/70">
                    <td className="px-4 py-3">
                      <Link href={`/leads/${lead.id}`} className="font-semibold text-slate-950 hover:text-cyan-700">
                        {lead.businessName}
                      </Link>
                      {lead.contactName ? <p className="mt-1 text-xs text-slate-500">{lead.contactName}</p> : null}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{lead.email ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-600">
                      <p>{lead.phone ?? "—"}</p>
                      {lead.website ? (
                        <a href={lead.website} target="_blank" rel="noreferrer" className="mt-1 block hover:text-cyan-700">
                          {lead.website}
                        </a>
                      ) : (
                        <p className="mt-1">No website</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {[lead.city, lead.niche].filter(Boolean).join(" / ") || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-2">
                        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                          {lead.priorityBucket ? LEAD_BUCKET_LABELS[lead.priorityBucket] : "Unknown"}
                        </span>
                        <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Score</span>
                          <span className="text-base font-semibold text-slate-950">{lead.leadScore}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <p className="font-medium text-slate-900">
                        {lead.recommendedOffer ? getOfferLabel(lead.recommendedOffer) : "Review manually"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {lead.websiteState ? WEBSITE_STATE_LABELS[lead.websiteState] : "Website state unknown"}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <p className="font-medium text-slate-900">
                        {lead.recommendedChannel ? CHANNEL_LABELS[lead.recommendedChannel] : "No channel yet"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {lead.nextAction ? WORKFLOW_ACTION_LABELS[lead.nextAction] : "No next action"}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <p className="font-medium text-slate-900">
                        {lead.contactStatus ? CONTACT_STATUS_LABELS[lead.contactStatus] : "No contact yet"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {lead.followUpDueAt
                          ? `Follow-up ${formatDistanceToNow(lead.followUpDueAt, { addSuffix: true })}`
                          : "No follow-up set"}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {formatDistanceToNow(lead.updatedAt, { addSuffix: true })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="bg-slate-50 px-4 py-8 text-sm text-slate-600">
              No leads match the current filters yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
