import type { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { verifyJwt } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/nextauth";
import {
  ensureTestPricesSeeded,
  supportsTestPriceExtendedColumns,
} from "@/lib/test-price-csv";

const createSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  priceCents: z.number().int().nonnegative(),
  active: z.boolean().optional().default(true),
  examType: z.string().optional().nullable(),
  department: z.string().optional().nullable(),
  serialNo: z.string().optional().nullable(),
  shortName: z.string().optional().nullable(),
  deliveryType: z.string().optional().nullable(),
  deliveryHour: z.number().int().nonnegative().optional().nullable(),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  const includeInactive = searchParams.get("includeInactive") === "1";

  await ensureTestPricesSeeded(prisma);

  const supportsExtended = await supportsTestPriceExtendedColumns(prisma);

  let where: Prisma.TestPriceWhereInput = {};

  if (q) {
    // Important: filter only on columns that exist in the current DB
    // to avoid Prisma P2022 (unknown column) errors in older databases.
    const or: Prisma.TestPriceWhereInput[] = [
      { code: { contains: q, mode: "insensitive" } },
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
    if (supportsExtended) {
      or.push(
        { department: { contains: q, mode: "insensitive" } },
        { shortName: { contains: q, mode: "insensitive" } },
      );
    }
    where = { OR: or };
  }

  if (!includeInactive) {
    where = {
      ...where,
      active: true,
    };
  }

  const baseSelect = {
    id: true,
    code: true,
    name: true,
    description: true,
    priceCents: true,
    active: true,
  } satisfies Prisma.TestPriceSelect;

  const select: Prisma.TestPriceSelect = supportsExtended
    ? {
        ...baseSelect,
        examType: true,
        department: true,
        serialNo: true,
        shortName: true,
        deliveryType: true,
        deliveryHour: true,
      }
    : baseSelect;

  const data = await prisma.testPrice.findMany({
    where,
    // Select only columns supported in the current DB
    select,
    orderBy: [{ code: "asc" }],
    take: 500,
  });

  if (supportsExtended) return NextResponse.json(data);

  return NextResponse.json(
    data.map((item) => ({
      ...item,
      examType: null,
      department: null,
      serialNo: null,
      shortName: null,
      deliveryType: null,
      deliveryHour: null,
    })),
  );
}

export async function POST(req: Request) {
  // RBAC: admin/moderator via NextAuth or JWT cookie
  const session = await getServerSession(authOptions).catch(() => null);
  const sessionUser = session?.user as
    | { role?: string | null; id?: string | null }
    | undefined;
  const sessionRole = String(sessionUser?.role ?? "").toLowerCase();
  const sessionUserId = sessionUser?.id ?? undefined;
  let userId = sessionUserId;
  let allowed = sessionRole === "admin" || sessionRole === "moderator";
  if (!allowed) {
    const cookie = req.headers.get("cookie") ?? "";
    const token = /(?:^|; )token=([^;]+)/.exec(cookie)?.[1];
    const payload = token ? verifyJwt(decodeURIComponent(token)) : null;
    const role = payload?.role;
    allowed = role === "admin" || role === "moderator";
    userId = payload?.sub ?? undefined;
  }
  if (!allowed)
    return NextResponse.json({ error: "forbidden" }, { status: 403 });

  try {
    const body = await req.json();
    const input = createSchema.parse(body);

    const supportsExtended = await supportsTestPriceExtendedColumns(prisma);

    const created = await prisma.testPrice.create({
      data: {
        code: input.code,
        name: input.name,
        description: input.description ?? null,
        priceCents: input.priceCents,
        active: input.active,
        ...(supportsExtended
          ? {
              examType: input.examType ?? null,
              department: input.department ?? null,
              serialNo: input.serialNo ?? null,
              shortName: input.shortName ?? null,
              deliveryType: input.deliveryType ?? null,
              deliveryHour: input.deliveryHour ?? null,
            }
          : {}),
        createdByUserId: userId ?? "",
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
