import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { hashToken } from "@/lib/crypto";

const schema = z.object({ token: z.string().min(10) });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token } = schema.parse(body);
    const tokenHash = hashToken(token);

    const record = await prisma.authToken.findFirst({
      where: {
        type: "EMAIL_VERIFY",
        tokenHash,
        consumedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });
    if (!record)
      return NextResponse.json(
        { error: "invalid or expired" },
        { status: 400 },
      );

    await prisma.$transaction([
      prisma.user.update({
        where: { id: record.userId },
        data: { emailVerifiedAt: new Date() },
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
