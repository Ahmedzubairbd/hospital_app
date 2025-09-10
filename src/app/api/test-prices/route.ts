import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { verifyJwt } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/nextauth";

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

  let where: any = {};
  
  if (q) {
    where = {
      OR: [
        { code: { contains: q, mode: "insensitive" } },
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { department: { contains: q, mode: "insensitive" } },
        { shortName: { contains: q, mode: "insensitive" } },
      ]
    };
  }
  
  if (!includeInactive) {
    where = {
      ...where,
      active: true
    };
  }

  const data = await prisma.testPrice.findMany({
    where,
    orderBy: [{ code: "asc" }],
    take: 500,
  });

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  // RBAC: admin/moderator via NextAuth or JWT cookie
  const session = await getServerSession(authOptions).catch(() => null);
  const sessionRole = String(((session?.user as any)?.role as string | undefined) || '').toLowerCase();
  const sessionUserId = (session?.user as any)?.id as string | undefined;
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
  if (!allowed) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  try {
    const body = await req.json();
    const input = createSchema.parse(body);

    const created = await prisma.testPrice.create({
      data: {
        code: input.code,
        name: input.name,
        description: input.description ?? null,
        priceCents: input.priceCents,
        active: input.active,
        examType: input.examType ?? null,
        department: input.department ?? null,
        serialNo: input.serialNo ?? null,
        shortName: input.shortName ?? null,
        deliveryType: input.deliveryType ?? null,
        deliveryHour: input.deliveryHour ?? null,
        createdByUserId: userId ?? "",
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
