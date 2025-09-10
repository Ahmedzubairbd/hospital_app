import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: Request) {
  // Staff-only uploads for now
  const session = await getServerSession(authOptions).catch(() => null);
  const role = String(((session?.user as any)?.role as string | undefined) || '').toLowerCase();
  if (role !== "admin" && role !== "moderator")
    return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file field required" }, { status: 400 });
  }
  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const dataUrl = `data:${file.type || "application/octet-stream"};base64,${base64}`;
  const uploaded = await prisma.fileAsset.create({
    data: {
      bucketKey: `inline:${Date.now()}`,
      url: dataUrl,
      contentType: file.type || null,
      sizeBytes: file.size || null,
      ownerUserId: (session?.user as any)?.id ?? null,
    },
  });
  return NextResponse.json(uploaded, { status: 201 });
}

export async function GET() {
  // Staff-only list
  const session = await getServerSession(authOptions).catch(() => null);
  const role = String(((session?.user as any)?.role as string | undefined) || '').toLowerCase();
  if (role !== "admin" && role !== "moderator")
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const items = await prisma.fileAsset.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  return NextResponse.json(items);
}

