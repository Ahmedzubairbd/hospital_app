import { notFound } from "next/navigation";
import { getPublishedCmsPage } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function CmsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPublishedCmsPage(slug);
  if (!page) return notFound();
  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: 16 }}>
      <h1>{page.title}</h1>
      {/* Assume HTML in body; sanitize upstream if needed */}
      <div dangerouslySetInnerHTML={{ __html: page.body }} />
    </main>
  );
}
