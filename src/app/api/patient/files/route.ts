import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { head, put } from "@vercel/blob";
import { handleUpload } from "@vercel/blob/client";

export const runtime = "nodejs";

async function getPatientUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const payload = token ? verifyJwt(token) : null;
  if (!payload || payload.role !== "patient") return null;
  return payload.sub as string;
}

export async function GET() {
  const userId = await getPatientUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const items = await prisma.fileAsset.findMany({ where: { ownerUserId: userId }, orderBy: { createdAt: "desc" }, take: 100 });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const userId = await getPatientUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const ct = req.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const json = await req.json().catch(() => null);
    if (!json || typeof json !== "object" || !("type" in json)) {
      return NextResponse.json({ error: "invalid request" }, { status: 400 });
    }
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ error: "blob token missing on server" }, { status: 500 });
    }
    return handleUpload({
      request: req,
      body: json,
      async onBeforeGenerateToken() {
        const imageTypes = ["image/avif", "image/webp", "image/png", "image/jpeg", "image/gif"];
        return {
          allowedContentTypes: imageTypes,
          maximumSizeInBytes: 10 * 1024 * 1024,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ ownerUserId: userId }),
          cacheControlMaxAge: 60 * 60 * 24 * 365,
        };
      },
      async onUploadCompleted({ blob }) {
        let size: number | null = null;
        let contentType: string | null = null;
        try {
          const meta = await head(blob.url);
          size = meta.size ?? null;
          contentType = meta.contentType ?? null;
        } catch {}
        await prisma.fileAsset.create({
          data: {
            bucketKey: blob.pathname,
            url: blob.url,
            contentType,
            sizeBytes: size,
            ownerUserId: userId,
          },
        });
      },
    }) as unknown as NextResponse;
  }

  // multipart fallback
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "file field required" }, { status: 400 });
  try {
    const blob = await put(`user/${userId}/${Date.now()}-${(file as any).name}`.replace(/\s+/g, "_"), file as unknown as Blob, {
      access: "public",
      contentType: (file as any).type || "application/octet-stream",
      addRandomSuffix: true,
      cacheControlMaxAge: 60 * 60 * 24 * 365,
    });
    let size: number | null = null;
    let contentType: string | null = (file as any).type || null;
    try {
      const meta = await head(blob.url);
      size = meta.size ?? size;
      contentType = meta.contentType ?? contentType;
    } catch {}
    const uploaded = await prisma.fileAsset.create({
      data: { bucketKey: blob.pathname, url: blob.url, contentType, sizeBytes: size, ownerUserId: userId },
    });
    return NextResponse.json(uploaded, { status: 201 });
  } catch (e) {
    const arrayBuffer = await (file as File).arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const dataUrl = `data:${(file as any).type || "application/octet-stream"};base64,${base64}`;
    const uploaded = await prisma.fileAsset.create({
      data: { bucketKey: `inline:${Date.now()}`, url: dataUrl, contentType: (file as any).type || null, sizeBytes: (file as any).size || null, ownerUserId: userId },
    });
    return NextResponse.json(uploaded, { status: 201 });
  }
}

