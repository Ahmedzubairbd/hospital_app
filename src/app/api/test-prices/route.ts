import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { verifyJwt } from "@/lib/auth";

const createSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  priceCents: z.number().int().nonnegative(),
  active: z.boolean().optional().default(true),
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
  // RBAC: admin/moderator only
  const cookie = req.headers.get("cookie") ?? "";
  const token = /(?:^|; )token=([^;]+)/.exec(cookie)?.[1];
  const payload = token ? verifyJwt(decodeURIComponent(token)) : null;
  const role = payload?.role;

  if (role !== "admin" && role !== "moderator") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

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
        createdByUserId: payload?.sub ?? "",
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
