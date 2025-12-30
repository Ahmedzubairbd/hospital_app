import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { verifyJwt } from "@/lib/auth";

const createSchema = z.object({
  doctorId: z.string().min(1),
  scheduledAt: z.string().datetime(), // ISO
  reason: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

function auth(req: Request) {
  const cookie = req.headers.get("cookie") ?? "";
  const token = /(?:^|; )token=([^;]+)/.exec(cookie)?.[1];
  const payload = token ? verifyJwt(decodeURIComponent(token)) : null;
  return payload; // { sub, role, ... }
}

export async function GET(req: Request) {
  const payload = auth(req);
  if (!payload)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const role = payload.role;
  const where: Record<string, unknown> = {};
  if (role === "patient") {
    const patient = await prisma.patient.findUnique({
      where: { userId: payload.sub },
    });
    if (!patient) return NextResponse.json([], { status: 200 });
    where.patientId = patient.id;
  } else if (role === "doctor") {
    const doctor = await prisma.doctor.findUnique({
      where: { userId: payload.sub },
    });
    if (!doctor) return NextResponse.json([], { status: 200 });
    where.doctorId = doctor.id;
  } else {
    // admin or moderator: all
  }

  const data = await prisma.appointment.findMany({
    where,
    include: {
      patient: {
        include: { user: { select: { name: true, phone: true, email: true } } },
      },
      doctor: {
        include: { user: { select: { name: true, phone: true, email: true } } },
      },
    },
    orderBy: [{ scheduledAt: "asc" }],
    take: 200,
  });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const payload = auth(req);
  if (!payload)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (
    payload.role !== "patient" &&
    payload.role !== "admin" &&
    payload.role !== "moderator"
  ) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const input = createSchema.parse(body);

    // find patient, doctor
    const patient = await prisma.patient.findUnique({
      where: { userId: payload.sub },
    });
    if (!patient)
      return NextResponse.json(
        { error: "patient record not found" },
        { status: 400 },
      );

    const doctor = await prisma.doctor.findUnique({
      where: { id: input.doctorId },
    });
    if (!doctor)
      return NextResponse.json({ error: "doctor not found" }, { status: 404 });

    const created = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId: doctor.id,
        scheduledAt: new Date(input.scheduledAt),
        reason: input.reason ?? null,
        notes: input.notes ?? null,
        createdByUserId: payload.sub,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
