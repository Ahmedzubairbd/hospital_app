import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/nextauth";
import { prisma } from "@/lib/db";
import { del } from "@vercel/blob";

export const runtime = "nodejs";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions).catch(() => null);
  const role = String(
    ((session?.user as any)?.role as string | undefined) || "",
  ).toLowerCase();
  if (role !== "admin" && role !== "moderator")
    return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const { id } = await params;
  const asset = await prisma.fileAsset.findUnique({ where: { id } });
  if (!asset) return NextResponse.json({ error: "not found" }, { status: 404 });

  try {
    // Only attempt remote delete for HTTPS Blob URLs
    if (
      /^https:/.test(asset.url) &&
      asset.url.includes(".public.blob.vercel-storage.com")
    ) {
      await del(asset.url);
    }
  } catch {
    // ignore blob delete errors to avoid DB locks
  }
  await prisma.fileAsset.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
