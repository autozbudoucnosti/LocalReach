import { notFound } from "next/navigation";
import { format, formatDistanceToNow } from "date-fns";
import { DraftEditor } from "@/components/draft-editor";
import { LeadForm } from "@/components/lead-form";
import { LeadQualificationPanel } from "@/components/lead-qualification-panel";
import { LeadLifecycleActions } from "@/components/lead-lifecycle-actions";
import { LeadWorkflowPanel } from "@/components/lead-workflow-panel";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { TemplateSuggestionPanel } from "@/components/template-suggestion-panel";
import { WebsiteAnalysisPanel } from "@/components/website-analysis-panel";
import { generateChannelScripts } from "@/lib/channel-scripts";
import { getLeadDetail } from "@/lib/queries";
import { getSuggestedTemplatesForLead } from "@/lib/template-gallery";

export const dynamic = "force-dynamic";

type LeadDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params;
  const data = await getLeadDetail(id);

  if (!data) {
    notFound();
  }

  const workflowScripts = generateChannelScripts(
    {
      businessName: data.lead.businessName,
      contactName: data.lead.contactName,
      city: data.lead.city,
      niche: data.lead.niche,
      website: data.lead.website,
      recommendedOffer: data.lead.recommendedOffer,
      websiteState: data.lead.websiteState,
      recommendedChannel: data.lead.recommendedChannel,
    },
    data.latestAnalysis
      ? {
          summary: data.latestAnalysis.summary,
          issues: data.latestAnalysis.issues,
        }
      : null,
  );
  const suggestedTemplates = getSuggestedTemplatesForLead({
    businessName: data.lead.businessName,
    niche: data.lead.niche,
    recommendedOffer: data.lead.recommendedOffer,
    websiteState: data.lead.websiteState,
  });

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Lead detail"
        title={data.lead.businessName}
        description="Review qualification, workflow, proof references, website context, and manual outreach assets before any approved send."
        actions={<StatusBadge status={data.lead.status} />}
      />

      <div className="grid gap-6 2xl:grid-cols-[1.08fr_0.92fr]">
        <div className="space-y-6">
          <LeadQualificationPanel
            leadId={data.lead.id}
            qualification={{
              leadScore: data.lead.leadScore,
              priorityBucket: data.lead.priorityBucket,
              icpFit: data.lead.icpFit,
              estimatedTicketValue: data.lead.estimatedTicketValue,
              ownerLedProbability: data.lead.ownerLedProbability,
              singleLocation: data.lead.singleLocation,
              reviewStrength: data.lead.reviewStrength,
              websiteState: data.lead.websiteState,
              reachability: data.lead.reachability,
              scoreExplanation: data.lead.scoreExplanation,
              recommendedOffer: data.lead.recommendedOffer,
              nextBestAction: data.lead.nextBestAction,
              googleRating: data.lead.googleRating,
              googleReviewCount: data.lead.googleReviewCount,
              qualificationNotes: data.lead.qualificationNotes,
              outreachChannelUsed: data.lead.outreachChannelUsed,
              outreachOutcome: data.lead.outreachOutcome,
              lostReason: data.lead.lostReason,
              meetingBooked: data.lead.meetingBooked,
              proposalSent: data.lead.proposalSent,
              dealWon: data.lead.dealWon,
              dealValue: data.lead.dealValue,
            }}
          />

          <TemplateSuggestionPanel templates={suggestedTemplates} />

          <LeadForm
            key={`${data.lead.id}-${data.lead.updatedAt.toISOString()}`}
            leadId={data.lead.id}
            initialValues={{
              businessName: data.lead.businessName,
              contactName: data.lead.contactName ?? "",
              email: data.lead.email ?? "",
              phone: data.lead.phone ?? "",
              website: data.lead.website ?? "",
              city: data.lead.city ?? "",
              niche: data.lead.niche ?? "",
              sourceUrl: data.lead.sourceUrl ?? "",
              notes: data.lead.notes ?? "",
              googleRating: data.lead.googleRating?.toString() ?? "",
              googleReviewCount: data.lead.googleReviewCount?.toString() ?? "",
              status: data.lead.status,
            }}
          />

          <WebsiteAnalysisPanel
            key={data.latestAnalysis ? `${data.latestAnalysis.id}-${data.latestAnalysis.analyzedAt.toISOString()}` : "analysis-empty"}
            leadId={data.lead.id}
            analysis={data.latestAnalysis}
          />
        </div>

        <div className="space-y-6">
          <LeadWorkflowPanel
            leadId={data.lead.id}
            workflow={{
              recommendedChannel: data.lead.recommendedChannel,
              preferredChannel: data.lead.preferredChannel,
              channelReason: data.lead.channelReason,
              contactStatus: data.lead.contactStatus,
              lastChannelUsed: data.lead.lastChannelUsed,
              firstContactChannel: data.lead.firstContactChannel,
              firstContactAt: data.lead.firstContactAt,
              followUpDueAt: data.lead.followUpDueAt,
              nextAction: data.lead.nextAction,
              nextActionNotes: data.lead.nextActionNotes,
            }}
            scripts={workflowScripts}
          />

          <DraftEditor
            key={data.latestDraft ? `${data.latestDraft.id}-${data.latestDraft.updatedAt.toISOString()}` : "draft-empty"}
            leadId={data.lead.id}
            draft={data.latestDraft}
            campaigns={data.campaigns.map((campaign) => ({
              id: campaign.id,
              name: campaign.name,
              isActive: campaign.isActive,
            }))}
            followUpCount={data.followUpCount}
            lastSentAt={data.lead.lastContactedAt}
            isSuppressed={Boolean(data.suppression)}
          />

          <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.35)]">
            <h2 className="font-serif text-2xl text-slate-950">Suppression and compliance</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p>
                Suppressed:{" "}
                <span className="font-semibold text-slate-900">{data.suppression ? "Yes" : "No"}</span>
              </p>
              <p>
                Reason:{" "}
                <span className="font-semibold text-slate-900">
                  {data.suppression?.reason ?? "No suppression entry"}
                </span>
              </p>
              <p>
                Last contacted:{" "}
                <span className="font-semibold text-slate-900">
                  {data.lead.lastContactedAt ? format(data.lead.lastContactedAt, "PPP p") : "Never"}
                </span>
              </p>
            </div>
          </div>

          <LeadLifecycleActions leadId={data.lead.id} isSuppressed={Boolean(data.suppression)} />
        </div>
      </div>

      <div className="grid gap-6 2xl:grid-cols-2">
        <section className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.35)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl text-slate-950">Email history</h2>
              <p className="mt-1 text-sm text-slate-600">Outbound and manual inbound records for this lead.</p>
            </div>
          </div>

          {data.lead.messages.length > 0 ? (
            <div className="mt-6 space-y-3">
              {data.lead.messages.map((message) => (
                <div key={message.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                      <StatusBadge status={message.direction === "OUTBOUND" ? "SENT" : "REPLIED"} />
                      <p className="font-medium text-slate-950">{message.subject}</p>
                    </div>
                    <p className="text-xs text-slate-500">
                      {message.sentAt
                        ? format(message.sentAt, "PPP p")
                        : formatDistanceToNow(message.createdAt, { addSuffix: true })}
                    </p>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">{message.body}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
              No email history yet.
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.35)]">
          <h2 className="font-serif text-2xl text-slate-950">Recent activity</h2>
          {data.lead.activities.length > 0 ? (
            <div className="mt-6 space-y-3">
              {data.lead.activities.map((activity) => (
                <div key={activity.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-950">{activity.message}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-400">{activity.type}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    {formatDistanceToNow(activity.createdAt, { addSuffix: true })}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
              Activity events will appear here after you interact with the lead.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
