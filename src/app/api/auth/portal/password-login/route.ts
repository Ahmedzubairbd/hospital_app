import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { verifyPassword } from "@/lib/password";
import { normalizePhoneBD } from "@/lib/sms";
import { signJwt } from "@/lib/auth";

const schema = z.object({
  phone: z.string().min(8),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, password } = schema.parse(body);
    const normalized = normalizePhoneBD(phone);
    const user = await prisma.user.findFirst({ where: { phone: normalized } });
    if (!user || !user.passwordHash)
      return NextResponse.json(
        { error: "invalid credentials" },
        { status: 401 },
      );
    if (user.role !== "PATIENT")
      return NextResponse.json({ error: "unauthorized" }, { status: 403 });
    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok)
      return NextResponse.json(
        { error: "invalid credentials" },
        { status: 401 },
      );

    const token = signJwt(
      { sub: user.id, role: "patient", phone: normalized },
      "7d",
    );
    const res = NextResponse.json({ ok: true });
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
