import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";
import { prisma } from "@/lib/db";
import { head, put } from "@vercel/blob";
import { handleUpload } from "@vercel/blob/client";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  // Staff-only uploads for now
  const session = await getServerSession(authOptions).catch(() => null);
  const role = String(((session?.user as any)?.role as string | undefined) || '').toLowerCase();
  if (role !== "admin" && role !== "moderator")
    return NextResponse.json({ error: "forbidden" }, { status: 403 });

  // If JSON body -> treat as Vercel Blob signed upload flow (handleUpload)
  const ct = req.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const json = await req.json().catch(() => null);
    if (!json || typeof json !== "object" || !("type" in json)) {
      return NextResponse.json({ error: "invalid request" }, { status: 400 });
    }
    // Ensure server has RW token to generate client tokens
    const hasToken = !!process.env.BLOB_READ_WRITE_TOKEN;
    if (!hasToken) {
      return NextResponse.json({ error: "blob token missing on server" }, { status: 500 });
    }

    return handleUpload({
      request: req,
      body: json,
      async onBeforeGenerateToken(pathname, clientPayload, multipart) {
        // Configure allowed types and max size based on optional clientPayload
        let allow: "images" | "images-pdf" = "images-pdf";
        let maxMB = 20;
        if (typeof clientPayload === "string" && clientPayload) {
          try {
            const cfg = JSON.parse(clientPayload);
            if (cfg.allow === "images") allow = "images";
            if (typeof cfg.maxMB === "number" && cfg.maxMB > 0 && cfg.maxMB <= 100) maxMB = cfg.maxMB;
          } catch {
            if (clientPayload === "images") allow = "images";
          }
        }
        const imageTypes = ["image/avif", "image/webp", "image/png", "image/jpeg", "image/gif"];
        const allowedContentTypes = allow === "images" ? imageTypes : [...imageTypes, "application/pdf"];
        return {
          allowedContentTypes,
          maximumSizeInBytes: maxMB * 1024 * 1024,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ ownerUserId: (session?.user as any)?.id ?? null }),
          cacheControlMaxAge: 60 * 60 * 24 * 365,
        };
      },
      async onUploadCompleted({ blob, tokenPayload }) {
        let ownerUserId: string | null = null;
        try {
          if (tokenPayload) ownerUserId = JSON.parse(tokenPayload).ownerUserId ?? null;
        } catch {}
        // Enrich with HEAD to get size/contentType
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
            ownerUserId,
          },
        });
      },
    }) as unknown as NextResponse;
  }

  // Fallback: support multipart/form-data uploads via server-side put
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file field required" }, { status: 400 });
  }
  try {
    // Prefer Vercel Blob if configured
    const blob = await put(`uploads/${Date.now()}-${(file as any).name}`.replace(/\s+/g, "_"), file as unknown as Blob, {
      access: "public",
      contentType: (file as any).type || "application/octet-stream",
      addRandomSuffix: true,
      cacheControlMaxAge: 60 * 60 * 24 * 365,
    });
    // Enrich with HEAD to get size/contentType
    let size: number | null = null;
    let contentType: string | null = (file as any).type || null;
    try {
      const meta = await head(blob.url);
      size = meta.size ?? size;
      contentType = meta.contentType ?? contentType;
    } catch {}
    const uploaded = await prisma.fileAsset.create({
      data: {
        bucketKey: blob.pathname,
        url: blob.url,
        contentType,
        sizeBytes: size,
        ownerUserId: (session?.user as any)?.id ?? null,
      },
    });
    return NextResponse.json(uploaded, { status: 201 });
  } catch (e) {
    // Fallback to inline data URL if Blob not available
    const arrayBuffer = await (file as File).arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const dataUrl = `data:${(file as any).type || "application/octet-stream"};base64,${base64}`;
    const uploaded = await prisma.fileAsset.create({
      data: {
        bucketKey: `inline:${Date.now()}`,
        url: dataUrl,
        contentType: (file as any).type || null,
        sizeBytes: (file as any).size || null,
        ownerUserId: (session?.user as any)?.id ?? null,
      },
    });
    return NextResponse.json(uploaded, { status: 201 });
  }
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
