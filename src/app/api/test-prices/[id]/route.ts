import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { verifyJwt } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/nextauth";
import { supportsTestPriceExtendedColumns } from "@/lib/test-price-csv";

const patchSchema = z.object({
  code: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  priceCents: z.number().int().nonnegative().optional(),
  active: z.boolean().optional(),
  examType: z.string().optional().nullable(),
  department: z.string().optional().nullable(),
  serialNo: z.string().optional().nullable(),
  shortName: z.string().optional().nullable(),
  deliveryType: z.string().optional().nullable(),
  deliveryHour: z.number().int().nonnegative().optional().nullable(),
});

async function requireStaff(req: Request) {
  const session = await getServerSession(authOptions).catch(() => null);
  const sessionUser = session?.user as
    | { role?: string | null; id?: string | null }
    | undefined;
  const sessionRole = String(sessionUser?.role ?? "").toLowerCase();
  const sessionUserId = sessionUser?.id ?? undefined;
  let ok = sessionRole === "admin" || sessionRole === "moderator";
  let userId: string | null = sessionUserId ?? null;
  if (!ok) {
    const cookie = req.headers.get("cookie") ?? "";
    const token = /(?:^|; )token=([^;]+)/.exec(cookie)?.[1];
    const payload = token ? verifyJwt(decodeURIComponent(token)) : null;
    const role = payload?.role;
    ok = role === "admin" || role === "moderator";
    userId = payload?.sub ?? null;
  }
  return { ok, userId };
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const item = await prisma.testPrice.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireStaff(req);
  if (!guard.ok)
    return NextResponse.json({ error: "forbidden" }, { status: 403 });

  try {
    const body = await req.json();
    const input = patchSchema.parse(body);

    const supportsExtended = await supportsTestPriceExtendedColumns(prisma);
    const {
      examType,
      department,
      serialNo,
      shortName,
      deliveryType,
      deliveryHour,
      ...base
    } = input;
    const data = supportsExtended ? input : base;

    const { id } = await params;

    const updated = await prisma.testPrice.update({
      where: { id },
      data,
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
  const guard = await requireStaff(req);
  if (!guard.ok)
    return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const { id } = await params;

  await prisma.testPrice.update({
    where: { id },
    data: { active: false },
  });
  return NextResponse.json({ ok: true });
}
