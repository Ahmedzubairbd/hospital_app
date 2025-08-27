import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { newToken, hashToken } from "@/lib/crypto";
import { absoluteUrl } from "@/lib/url";
import { sendEmail } from "@/lib/email";

const schema = z.object({ email: z.string().email() });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = schema.parse(body);

    const user = await prisma.user.findUnique({ where: { email } });
    // Always respond OK to prevent user enumeration
    if (!user) return NextResponse.json({ ok: true });

    const token = newToken();
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30m
    await prisma.authToken.create({
      data: { userId: user.id, type: "PASSWORD_RESET", tokenHash, expiresAt },
    });

    const link = absoluteUrl(
      `/auth/admin/new-password?token=${encodeURIComponent(token)}`,
    );
    await sendEmail(
      email,
      "Reset your password",
      `<p>Hello,</p><p>Reset your password:</p><p><a href="${link}">${link}</a></p>`,
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
