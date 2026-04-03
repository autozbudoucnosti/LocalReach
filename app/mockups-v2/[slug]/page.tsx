import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { PlumberTradesV2 } from "@/components/mockups-v2/plumber-trades-v2";
import { PlumberBrnoV1 } from "@/components/mockups-v2/plumber-brno-v1";
import { StomatologPrahaV1 } from "@/components/mockups-v2/stomatolog-praha-v1";
import { BistroBrnoV1 } from "@/components/mockups-v2/bistro-brno-v1";
import { RestauracePrahaV1 } from "@/components/mockups-v2/restaurace-praha-v1";
import { getAllMockupV2Slugs, getMockupV2BySlug, type MockupV2Definition } from "@/lib/mockups-v2-data";
import { TEMPLATE_VERTICAL_LABELS } from "@/lib/template-gallery";

function renderMockupComponent(mockup: MockupV2Definition) {
  if (mockup.id === "plumber-brno-v1") {
    return <PlumberBrnoV1 mockup={mockup} />;
  }
  if (mockup.id === "stomatolog-praha-v1") {
    return <StomatologPrahaV1 mockup={mockup} />;
  }
  if (mockup.id === "bistro-brno-v1") {
    return <BistroBrnoV1 mockup={mockup} />;
  }
  if (mockup.id === "restaurace-praha-v1") {
    return <RestauracePrahaV1 mockup={mockup} />;
  }
  return <PlumberTradesV2 mockup={mockup} />;
}

type MockupV2PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getAllMockupV2Slugs().map((slug) => ({ slug }));
}

export default async function MockupV2Page({ params }: MockupV2PageProps) {
  const { slug } = await params;
  const mockup = getMockupV2BySlug(slug);

  if (!mockup) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Sales Mockup V2"
        title={mockup.gallery.title}
        description={`Izolovaný V2 proof směr pro ${TEMPLATE_VERTICAL_LABELS[mockup.vertical]}. Slouží jako silnější obchodní vizuál, ne jako produkční klientský web.`}
        actions={
          <Link
            href="/templates"
            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Zpět do galerie
          </Link>
        }
      />

      {renderMockupComponent(mockup)}
    </div>
  );
}
