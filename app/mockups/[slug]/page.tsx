import Link from "next/link";
import { notFound } from "next/navigation";
import { MockupPage } from "@/components/mockups/mockup-page";
import { PageHeader } from "@/components/page-header";
import { getAllMockupSlugs, getMockupBySlug, MOCKUP_VERTICAL_LABELS } from "@/lib/mockup-data";

type MockupRoutePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getAllMockupSlugs().map((slug) => ({ slug }));
}

export default async function MockupRoutePage({ params }: MockupRoutePageProps) {
  const { slug } = await params;
  const mockup = getMockupBySlug(slug);

  if (!mockup) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Sales Mockup"
        title={mockup.gallery.title}
        description={`${MOCKUP_VERTICAL_LABELS[mockup.vertical]} koncept pro LocalReach proof layer. Slouží jako prodejní mockup, ne jako produkční klientský web.`}
        actions={
          <Link
            href="/templates"
            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Zpět do galerie
          </Link>
        }
      />

      <MockupPage mockup={mockup} />
    </div>
  );
}
