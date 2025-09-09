import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/nextauth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const patchSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  specialization: z.string().min(1).optional(),
  bio: z.string().optional().nullable(),
  schedule: z.string().optional().nullable(),
  sliderPictureUrl: z.string().url().optional().nullable(),
  branchId: z.string().optional().nullable(),
});

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (role !== "ADMIN" && role !== "MODERATOR") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const input = patchSchema.parse(body);
    const { id } = params;

    const doctor = await prisma.doctor.findUnique({ where: { id } });
    if (!doctor) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    if (input.email) {
      const existing = await prisma.user.findUnique({ where: { email: input.email } });
      if (existing && existing.id !== doctor.userId) {
        return NextResponse.json({ error: "Email already in use" }, { status: 409 });
      }
    }

    const userUpdateData: Record<string, unknown> = {};
    if (input.name) userUpdateData.name = input.name;
    if (input.email) userUpdateData.email = input.email;
    if (input.phone) userUpdateData.phone = input.phone;

    const doctorUpdateData: Record<string, unknown> = {};
    if (input.specialization) doctorUpdateData.specialization = input.specialization;
    if (input.bio) doctorUpdateData.bio = input.bio;
    if (input.schedule) doctorUpdateData.schedule = input.schedule;
    if (input.sliderPictureUrl) doctorUpdateData.sliderPictureUrl = input.sliderPictureUrl;
    if (input.branchId) doctorUpdateData.branchId = input.branchId;

    const [, updatedDoctor] = await prisma.$transaction([
      prisma.user.update({
        where: { id: doctor.userId },
        data: userUpdateData,
      }),
      prisma.doctor.update({
        where: { id },
        data: doctorUpdateData,
        include: {
          user: { select: { name: true, email: true, phone: true } },
          branch: { select: { name: true, city: true } },
        },
      }),
    ]);

    return NextResponse.json(updatedDoctor);
  } catch (e: unknown) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.issues }, { status: 400 });
    }
    const message = e instanceof Error ? e.message : "failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (role !== "ADMIN" && role !== "MODERATOR") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  try {
    const { id } = params; // This is doctor ID

    const doctor = await prisma.doctor.findUnique({ where: { id } });
    if (!doctor) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    await prisma.user.delete({ where: { id: doctor.userId } });

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    if (e instanceof prisma.PrismaClientKnownRequestError && e.code === 'P2003') {
        return NextResponse.json({ error: "Cannot delete doctor with existing appointments. Please reassign or delete them first." }, { status: 409 });
    }
    const message = e instanceof Error ? e.message : "failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
