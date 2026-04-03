import { PageHeader } from "@/components/page-header";
import { LeadForm } from "@/components/lead-form";

export const dynamic = "force-dynamic";

export default function NewLeadPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Create"
        title="Add lead"
        description="Only store public business contact details that you entered manually or imported from CSV."
      />

      <LeadForm
        initialValues={{
          businessName: "",
          contactName: "",
          email: "",
          phone: "",
          website: "",
          city: "",
          niche: "",
          sourceUrl: "",
          notes: "",
          googleRating: "",
          googleReviewCount: "",
          status: "NEW",
        }}
      />
    </div>
  );
}
