import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { hashToken } from "@/lib/crypto";
import { hashPassword } from "@/lib/password";

export const runtime = "nodejs"; // needed for native bcrypt

const schema = z.object({
  token: z.string().min(10),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, password } = schema.parse(body);

    const tokenHash = hashToken(token);
    const record = await prisma.authToken.findFirst({
      where: {
        type: "PASSWORD_RESET",
        tokenHash,
        consumedAt: null,
        expiresAt: { gt: new Date() },
      },
    });
    if (!record)
      return NextResponse.json(
        { error: "invalid or expired" },
        { status: 400 },
      );

    const passwordHash = await hashPassword(password, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: record.userId },
        data: { passwordHash },
      }),
      prisma.authToken.update({
        where: { id: record.id },
        data: { consumedAt: new Date() },
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
