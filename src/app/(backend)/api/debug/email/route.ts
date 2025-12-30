// src/app/(backend)/api/debug/email/route.ts
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function GET() {
  try {
    const to = process.env.EMAIL_USER ?? "";
    if (!to) {
      return NextResponse.json(
        { ok: false, error: "EMAIL_USER environment variable is not set" },
        { status: 500 },
      );
    }
    const info = await sendEmail(
      to,
      "SMTP debug — Amin Diagnostics",
      "<p>If you see this, SMTP works 🎉</p>",
    );
    return NextResponse.json({ ok: true, info });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
