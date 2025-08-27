import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { signJwt } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";

export const runtime = "nodejs"; // needed for native bcrypt

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = schema.parse(body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: "invalid credentials" },
        { status: 401 },
      );
    }

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok)
      return NextResponse.json(
        { error: "invalid credentials" },
        { status: 401 },
      );

    // Prisma role likely 'ADMIN' | 'MODERATOR' — map to lowercase AppRole
    const appRole = (user.role as "ADMIN" | "MODERATOR").toLowerCase() as
      | "admin"
      | "moderator";
    const token = signJwt({ sub: user.id, role: appRole });

    const res = NextResponse.json({ ok: true });
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : "failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
