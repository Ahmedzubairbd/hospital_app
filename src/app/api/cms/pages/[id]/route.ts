import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/nextauth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const patchSchema = z.object({
  title: z.string().min(1).optional(),
  body: z.string().min(1).optional(),
  excerpt: z.string().optional(),
  published: z.boolean().optional(),
  slug: z.string().min(1).optional(),
});

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const page = await (prisma as any).cmsPage.findUnique({ where: { id } });
  if (!page) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(page);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions).catch(() => null);
  const role = String(
    ((session?.user as any)?.role as string | undefined) || "",
  ).toLowerCase();
  if (role !== "admin" && role !== "moderator")
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  try {
    const { id } = await params;
    const body = await req.json();
    const input = patchSchema.parse(body);
    const page = await (prisma as any).cmsPage.update({
      where: { id },
      data: input,
    });
    return NextResponse.json(page);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions).catch(() => null);
  const role = String(
    ((session?.user as any)?.role as string | undefined) || "",
  ).toLowerCase();
  if (role !== "admin" && role !== "moderator")
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const { id } = await params;
  await (prisma as any).cmsPage.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
