import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/nextauth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { hashPassword } from "@/lib/password";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const role = String(session?.user?.role || '').toLowerCase();

  if (role !== "admin" && role !== "moderator") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const doctors = await prisma.doctor.findMany({
    include: {
      user: { select: { name: true, email: true, phone: true } },
      branch: { select: { name: true, city: true } },
    },
    orderBy: { user: { name: "asc" } },
  });

  return NextResponse.json(doctors);
}

const createSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  password: z.string().min(8),
  specialization: z.string().min(1),
  bio: z.string().optional().nullable(),
  schedule: z.string().optional().nullable(),
  sliderPictureUrl: z.string().url().optional().nullable(),
  branchId: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const role = String(session?.user?.role || '').toLowerCase();

  if (role !== "admin" && role !== "moderator") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const input = createSchema.parse(body);

    if (input.email) {
      const existing = await prisma.user.findUnique({ where: { email: input.email } });
      if (existing) {
        return NextResponse.json({ error: "Email already in use" }, { status: 409 });
      }
    }

    const passwordHash = await hashPassword(input.password);

    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        phone: input.phone,
        passwordHash,
        role: "DOCTOR",
      },
    });

    const doctor = await prisma.doctor.create({
      data: {
        userId: user.id,
        specialization: input.specialization,
        bio: input.bio,
        schedule: input.schedule,
        sliderPictureUrl: input.sliderPictureUrl,
        branchId: input.branchId,
      },
      include: {
        user: { select: { name: true, email: true, phone: true } },
      },
    });

    return NextResponse.json(doctor, { status: 201 });
  } catch (e: unknown) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.issues }, { status: 400 });
    }
    const message = e instanceof Error ? e.message : "failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
