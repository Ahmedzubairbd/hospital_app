import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { cookies } from "next/headers";
import { z } from "zod";
import { authOptions } from "@/lib/nextauth";
import { verifyJwt } from "@/lib/auth";
import { prisma } from "@/lib/db";

async function getUserIdAndRole() {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    return { userId: session.user.id, role: session.user.role };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const payload = token ? verifyJwt(token) : null;
  if (payload?.sub) {
    return { userId: payload.sub, role: payload.role };
  }

  return { userId: null, role: null };
}

export async function GET() {
  const { userId } = await getUserIdAndRole();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, phone: true, role: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

const patchSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().optional(),
});

export async function PATCH(req: Request) {
  const { userId } = await getUserIdAndRole();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, phone } = patchSchema.parse(body);

    const user = await prisma.user.update({
      where: { id: userId },
      data: { name, phone },
      select: { name: true, email: true, phone: true, role: true },
    });

    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
