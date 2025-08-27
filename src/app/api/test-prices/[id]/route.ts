import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { verifyJwt } from "@/lib/auth";

const patchSchema = z.object({
  code: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  priceCents: z.number().int().nonnegative().optional(),
  active: z.boolean().optional(),
});

function requireStaff(req: Request) {
  const cookie = req.headers.get("cookie") ?? "";
  const token = /(?:^|; )token=([^;]+)/.exec(cookie)?.[1];
  const payload = token ? verifyJwt(decodeURIComponent(token)) : null;
  const role = payload?.role;
  const ok = role === "admin" || role === "moderator";
  return { ok, userId: payload?.sub ?? null };
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.testPrice.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = requireStaff(req);
  if (!guard.ok)
    return NextResponse.json({ error: "forbidden" }, { status: 403 });

  try {
    const body = await req.json();
    const input = patchSchema.parse(body);
    
    const { id } = await params;

    const updated = await prisma.testPrice.update({
      where: { id },
      data: { ...input },
    });
    return NextResponse.json(updated);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// Soft-delete: set active=false (safer than hard delete)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = requireStaff(req);
  if (!guard.ok)
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
    
  const { id } = await params;

  await prisma.testPrice.update({
    where: { id },
    data: { active: false },
  });
  return NextResponse.json({ ok: true });
}
