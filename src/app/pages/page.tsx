import Link from "next/link";
import {
  cmsSlugToPath,
  listPublishedCmsPages,
  CmsPageSummary,
} from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function CmsPagesIndex() {
  const pages = await listPublishedCmsPages();

  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: 16 }}>
      <h1>Pages</h1>

      {pages.length === 0 ? (
        <p>No published pages yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {pages.map((page: CmsPageSummary) => (
            <li
              key={page.id}
              style={{
                borderBottom: "1px solid rgba(206, 251, 164, 0.67)",
                padding: "12px 0",
              }}
            >
              <Link
                href={cmsSlugToPath(page.slug)}
                style={{ fontSize: "1.1rem", fontWeight: 600 }}
              >
                {page.title}
              </Link>

              {page.excerpt ? (
                <p
                  style={{
                    margin: "6px 0 0",
                    color: "rgba(255, 243, 243, 0.98)",
                  }}
                >
                  {page.excerpt}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
