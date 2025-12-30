import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/nextauth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  const { user } = session;
  return NextResponse.json({
    authenticated: true,
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
}
