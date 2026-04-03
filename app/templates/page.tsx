import { PageHeader } from "@/components/page-header";
import { TemplateGallery } from "@/components/template-gallery";

export const dynamic = "force-dynamic";

export default function TemplatesPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Proof Layer"
        title="Templates"
        description="Interní galerie reálných sales mockupů pro LocalReach. Slouží pro proof layer, export PNG previewů a rychlé vysvětlení nabídky podle oboru."
      />

      <TemplateGallery />
    </div>
  );
}
