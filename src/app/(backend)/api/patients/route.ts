import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/nextauth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { hashPassword } from "@/lib/password";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().min(10).max(10),
  password: z.string().min(8).optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  const role = String(
    ((session?.user as any)?.role as string | undefined) || ""
  ).toLowerCase();
  if (role !== "admin" && role !== "moderator")
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const items = await prisma.patient.findMany({
    include: { user: { select: { name: true, email: true, phone: true } } },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const role = String(
    ((session?.user as any)?.role as string | undefined) || ""
  ).toLowerCase();
  if (role !== "admin" && role !== "moderator")
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  try {
    const body = await req.json();
    const input = schema.parse(body);
    const passwordHash = input.password
      ? await hashPassword(input.password)
      : undefined;
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        phone: input.phone,
        role: "PATIENT",
        passwordHash,
      },
    });
    const patient = await prisma.patient.create({ data: { userId: user.id } });
    return NextResponse.json(
      {
        ...patient,
        user: { name: user.name, email: user.email, phone: user.phone },
      },
      { status: 201 }
    );
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
