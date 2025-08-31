import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { normalizePhoneBD } from "@/lib/sms";
import { absoluteUrl } from "@/lib/url";

const schema = z.object({
  phone: z.string().min(10).max(15),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone } = schema.parse(body);

    // Normalize phone number for Bangladesh format
    const normalizedPhone = normalizePhoneBD(phone);

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in database with 5-minute expiration
    const expiresAt = new Date(Date.now() + 1000 * 60 * 5); // 5 minutes

    // Find existing OTP for this phone number
    const existingOtp = await prisma.otpCode.findFirst({
      where: { phone: normalizedPhone }
    });
    
    if (existingOtp) {
      // Update existing OTP
      await prisma.otpCode.update({
        where: { id: existingOtp.id },
        data: { codeHash: otp, expiresAt }
      });
    } else {
      // Create new OTP
      await prisma.otpCode.create({
        data: { phone: normalizedPhone, codeHash: otp, expiresAt }
      });
    }

    // Send SMS with OTP via internal SMS route
    const message = `Your Amin Diagnostic login code is: ${otp}. Valid for 5 minutes.`;
    const smsRes = await fetch(absoluteUrl("/api/sms/send"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: normalizedPhone, message }),
    });

    // For development, return the OTP in the response
    const devOtp = process.env.NODE_ENV !== "production" ? otp : undefined;

    if (!smsRes.ok) {
      const body = await smsRes.text();
      console.error("SMS sending failed:", smsRes.status, body);
      return NextResponse.json(
        { error: "Failed to send SMS. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      normalized_phone: normalizedPhone,
      dev_otp: devOtp,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
