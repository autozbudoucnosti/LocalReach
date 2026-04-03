import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { getOfferLabel } from "@/lib/lead-qualification";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { getDashboardSnapshot } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const data = await getDashboardSnapshot();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Overview"
        title="Local outreach dashboard"
        description="A simple review-and-send workflow for personalized website redesign outreach."
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

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total leads" value={data.totalLeads} hint="All manually entered or imported business leads." />
        <StatCard label="Drafts pending review" value={data.pendingDrafts} hint="Drafts still awaiting manual approval." />
        <StatCard label="High-priority leads" value={data.highPriorityLeads} hint="Best near-term revenue candidates." />
        <StatCard label="No-website leads" value={data.noWebsiteLeads} hint="Usually the fastest path to a concrete offer." />
        <StatCard label="Needs business email" value={data.needsBusinessEmail} hint="Medium/high-priority leads still missing a direct email." />
        <StatCard label="Sent this week" value={data.sentThisWeek} hint="Outbound messages created this week." />
        <StatCard label="Replies" value={data.replies} hint="Leads manually marked as replied." />
        <StatCard label="Opted out" value={data.optedOut} hint="Leads permanently suppressed from future sends." />
      </section>

      <section className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.35)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl text-slate-950">Workflow queue</h2>
            <p className="mt-1 text-sm text-slate-600">What should happen next across manual outreach channels.</p>
          </div>
          <Link href="/leads" className="text-sm font-semibold text-cyan-700 transition hover:text-cyan-800">
            Open queue
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <StatCard label="Calls to make" value={data.workflowSummary.callsToMake} />
          <StatCard label="Messages to send" value={data.workflowSummary.messagesToSend} />
          <StatCard label="Follow-ups due" value={data.workflowSummary.followUpsDue} />
          <StatCard label="Warm leads" value={data.workflowSummary.warmLeads} />
          <StatCard label="Manual research" value={data.workflowSummary.manualResearchNeeded} />
        </div>
      </section>

      <section className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.35)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl text-slate-950">Offer mix</h2>
            <p className="mt-1 text-sm text-slate-600">How the current lead pool breaks down by recommended offer.</p>
          </div>
          <Link href="/leads" className="text-sm font-semibold text-cyan-700 transition hover:text-cyan-800">
            Work the pipeline
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {data.offerBreakdown.map((item) => (
            <div key={item.offer} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-500">{getOfferLabel(item.offer)}</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{item.count}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.35)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl text-slate-950">Recent activity</h2>
            <p className="mt-1 text-sm text-slate-600">The latest lead, draft, and send events.</p>
          </div>
          <Link href="/leads" className="text-sm font-semibold text-cyan-700 transition hover:text-cyan-800">
            View all leads
          </Link>
        </div>

        {data.recentActivity.length > 0 ? (
          <div className="mt-6 space-y-3">
            {data.recentActivity.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">{item.message}</p>
                  {item.lead ? (
                    <Link href={`/leads/${item.lead.id}`} className="mt-1 text-xs text-cyan-700 hover:text-cyan-800">
                      {item.lead.businessName}
                    </Link>
                  ) : null}
                </div>
                <p className="text-xs text-slate-500">
                  {formatDistanceToNow(item.createdAt, { addSuffix: true })}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
            Activity will appear here once you add leads and start generating drafts.
          </div>
        )}
      </section>
    </div>
  );
}
