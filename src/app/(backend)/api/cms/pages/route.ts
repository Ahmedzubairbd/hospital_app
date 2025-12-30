import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/nextauth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1),
  excerpt: z.string().optional(),
  published: z.boolean().optional(),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  const where: any = q
    ? {
        OR: [
          { slug: { contains: q, mode: "insensitive" } },
          { title: { contains: q, mode: "insensitive" } },
        ],
      }
    : {};
  const pages = await (prisma as any).cmsPage.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    take: 200,
  });
  return NextResponse.json(pages);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions).catch(() => null);
  const role = String(
    ((session?.user as any)?.role as string | undefined) || "",
  ).toLowerCase();
  if (role !== "admin" && role !== "moderator")
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  try {
    const body = await req.json();
    const input = schema.parse(body);
    const page = await (prisma as any).cmsPage.create({
      data: {
        ...input,
        published: input.published ?? false,
        authorId: (session?.user as any).id,
      },
    });
    return NextResponse.json(page, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
