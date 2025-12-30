import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { verifyJwt } from "@/lib/auth";

const patchSchema = z.object({
  status: z
    .enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"])
    .optional(),
  scheduledAt: z.string().datetime().optional(), // ISO
  notes: z.string().nullable().optional(),
});

function auth(req: Request) {
  const cookie = req.headers.get("cookie") ?? "";
  const token = /(?:^|; )token=([^;]+)/.exec(cookie)?.[1];
  const payload = token ? verifyJwt(decodeURIComponent(token)) : null;
  return payload;
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const payload = auth(req);
  if (!payload)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const input = patchSchema.parse(body);

    const { id } = await params;

    const appt = await prisma.appointment.findUnique({
      where: { id },
      include: { doctor: true, patient: true },
    });
    if (!appt)
      return NextResponse.json({ error: "not found" }, { status: 404 });

    // RBAC:
    // - doctor can update their own appointment (status, scheduledAt, notes)
    // - patient can only cancel their own appointment
    // - admin/moderator can update any
    if (payload.role === "doctor") {
      const me = await prisma.doctor.findUnique({
        where: { userId: payload.sub },
      });
      if (!me || me.id !== appt.doctorId)
        return NextResponse.json({ error: "forbidden" }, { status: 403 });
    } else if (payload.role === "patient") {
      const me = await prisma.patient.findUnique({
        where: { userId: payload.sub },
      });
      if (!me || me.id !== appt.patientId)
        return NextResponse.json({ error: "forbidden" }, { status: 403 });
      // patient can only set CANCELLED
      if (input.status && input.status !== "CANCELLED") {
        return NextResponse.json(
          { error: "patient can only cancel" },
          { status: 403 },
        );
      }
    } else if (payload.role !== "admin" && payload.role !== "moderator") {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        ...("status" in input ? { status: input.status } : {}),
        ...("scheduledAt" in input
          ? {
              scheduledAt: input.scheduledAt
                ? new Date(input.scheduledAt)
                : undefined,
            }
          : {}),
        ...("notes" in input ? { notes: input.notes ?? null } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
