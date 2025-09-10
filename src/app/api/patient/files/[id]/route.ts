import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { del } from "@vercel/blob";

export const runtime = "nodejs";

async function getPatientUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const payload = token ? verifyJwt(token) : null;
  if (!payload || payload.role !== "patient") return null;
  return payload.sub as string;
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getPatientUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await params;
  const asset = await prisma.fileAsset.findUnique({ where: { id } });
  if (!asset || asset.ownerUserId !== userId) return NextResponse.json({ error: "not found" }, { status: 404 });

  try {
    if (/^https:/.test(asset.url) && asset.url.includes(".public.blob.vercel-storage.com")) {
      await del(asset.url);
    }
  } catch {}
  await prisma.fileAsset.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

