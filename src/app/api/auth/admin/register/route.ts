import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { newToken, hashToken } from "@/lib/crypto";
import { absoluteUrl } from "@/lib/url";
import { sendEmail } from "@/lib/email";
import { hashPassword } from "@/lib/password";

export const runtime = "nodejs"; // needed for native bcrypt

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["ADMIN", "MODERATOR"]).default("ADMIN"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, role } = schema.parse(body);

    // Enforce max 10 staff accounts (ADMIN + MODERATOR)
    const staffCount = await prisma.user.count({
      where: { role: { in: ["ADMIN", "MODERATOR"] } },
    });
    if (staffCount >= 10) {
      return NextResponse.json(
        { error: "Registration limit reached (max 10 users)." },
        { status: 403 },
      );
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists)
      return NextResponse.json(
        { error: "email already in use" },
        { status: 409 },
      );

    const passwordHash = await hashPassword(password, 12);
    const user = await prisma.user.create({
      data: { name, email, passwordHash, role },
    });

    // email verify token (24h)
    const token = newToken();
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);
    await prisma.authToken.create({
      data: { userId: user.id, type: "EMAIL_VERIFY", tokenHash, expiresAt },
    });

    const link = absoluteUrl(
      `/auth/admin/verify?token=${encodeURIComponent(token)}`,
    );
    await sendEmail(
      email,
      "Verify your admin account",
      `<p>Hello ${name},</p><p>Please verify your account:</p><p><a href="${link}">${link}</a></p>`,
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
