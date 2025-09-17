import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyJwt } from "@/lib/auth";
import { z } from "zod";
import { hashPassword } from "@/lib/password";

const patchSchema = z.object({
  name: z.string().min(1).optional(),
  dateOfBirth: z.string().datetime().or(z.string().min(1)).optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "UNSPECIFIED"]).optional(),
  insuranceNo: z.string().optional(),
  password: z.string().min(8).optional(),
});

function requirePatient(req: Request) {
  const cookie = req.headers.get("cookie") ?? "";
  const token = /(?:^|; )token=([^;]+)/.exec(cookie)?.[1];
  const payload = token ? verifyJwt(decodeURIComponent(token)) : null;
  if (!payload || payload.role !== "patient") return null;
  return payload.sub;
}

export async function GET(req: Request) {
  const userId = requirePatient(req);
  if (!userId)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, phone: true },
  });
  const patient = await prisma.patient.findUnique({
    where: { userId },
    select: { dateOfBirth: true, gender: true, insuranceNo: true },
  });
  return NextResponse.json({ user, patient });
}

export async function PATCH(req: Request) {
  const userId = requirePatient(req);
  if (!userId)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const input = patchSchema.parse(body);

    const updates: any[] = [];
    if (input.name || input.password) {
      updates.push(
        prisma.user.update({
          where: { id: userId },
          data: {
            ...(input.name ? { name: input.name } : {}),
            ...(input.password
              ? { passwordHash: await hashPassword(input.password) }
              : {}),
          },
        }),
      );
    }
    if (input.dateOfBirth || input.gender || input.insuranceNo) {
      updates.push(
        prisma.patient.update({
          where: { userId },
          data: {
            ...(input.dateOfBirth
              ? { dateOfBirth: new Date(input.dateOfBirth) }
              : {}),
            ...(input.gender ? { gender: input.gender as any } : {}),
            ...(input.insuranceNo ? { insuranceNo: input.insuranceNo } : {}),
          },
        }),
      );
    }

    if (updates.length === 0) return NextResponse.json({ ok: true });
    await prisma.$transaction(updates as any);
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
