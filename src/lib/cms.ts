import { prisma } from "@/lib/db";

function toArray(slug: string | string[]): string[] {
  return Array.isArray(slug) ? slug : [slug];
}

export function normalizeCmsSlug(slug: string | string[]): string {
  const joined = toArray(slug).join("/").trim();
  if (!joined) return "";
  return joined.replace(/^[\\/]+/, "").replace(/[\\/]+$/, "");
}

export function buildCmsSlugVariants(slug: string | string[]): string[] {
  const normalized = normalizeCmsSlug(slug);
  if (!normalized) return [];
  const variants = new Set<string>([normalized, `/${normalized}`]);
  return Array.from(variants);
}

export async function getPublishedCmsPage(slug: string | string[]) {
  const variants = buildCmsSlugVariants(slug);
  if (!variants.length) return null;
  return (prisma as any).cmsPage.findFirst({
    where: {
      published: true,
      OR: variants.map((value) => ({
        slug: { equals: value, mode: "insensitive" },
      })),
    },
  });
}

export function cmsSlugToPath(slug: string): string {
  return `/cms/${slug}`;
}

export type CmsPageSummary = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
};
const mockPages: CmsPageSummary[] = [
  {
    id: "1",
    slug: "about",
    title: "About Us",
    excerpt: "Information about our organization.",
  },
  {
    id: "2",
    slug: "contact",
    title: "Contact",
    excerpt: "How to reach us.",
  },
];

export async function listPublishedCmsPages(): Promise<CmsPageSummary[]> {
  return (prisma as any).cmsPage.findMany({
    where: { published: true },
    select: { id: true, slug: true, title: true, excerpt: true },
    orderBy: [{ updatedAt: "desc" }],
    take: 200,
  });
}
