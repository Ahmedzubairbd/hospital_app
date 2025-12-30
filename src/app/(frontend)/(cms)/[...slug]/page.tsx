import { notFound } from "next/navigation";
import { getPublishedCmsPage } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function CmsCatchAllPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  if (!slug || slug.length === 0) return notFound();
  const page = await getPublishedCmsPage(slug);
  if (!page) return notFound();
  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: 16 }}>
      <h1>{page.title}</h1>
      <div
        className="cms-content"
        dangerouslySetInnerHTML={{ __html: page.body }}
      />
    </main>
  );
}
