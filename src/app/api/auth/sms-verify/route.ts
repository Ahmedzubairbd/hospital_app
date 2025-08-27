import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Role } from "@prisma/client";
import { z } from "zod";
import { normalizePhoneBD } from "@/lib/sms";
import { signJwt } from "@/lib/auth";
import { cookies } from "next/headers";

const schema = z.object({
  phone: z.string().min(10).max(15),
  code: z.string().min(6).max(6),
  role: z.enum(["doctor", "patient"]),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, code, role } = schema.parse(body);

    // Normalize phone number for Bangladesh format
    const normalizedPhone = normalizePhoneBD(phone);

    // Find the most recent OTP in the database
    const otpRecord = await prisma.otpCode.findFirst({
      where: { phone: normalizedPhone },
      orderBy: { createdAt: 'desc' }
    });

    // Verify OTP exists, is not expired, and matches
    if (!otpRecord) {
      return NextResponse.json(
        { error: "No OTP found for this phone number" },
        { status: 400 },
      );
    }

    if (otpRecord.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "OTP has expired. Please request a new one" },
        { status: 400 },
      );
    }

    if (otpRecord.codeHash !== code) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // Find or create user based on role
    let userId: string;

    // Find existing user with this phone number
    const existingUser = await prisma.user.findFirst({
      where: { phone: normalizedPhone },
    });

    if (existingUser) {
      // Verify role matches (convert string role to enum)
      const userRole = role.toUpperCase() as keyof typeof Role;
      if (existingUser.role !== userRole) {
        return NextResponse.json(
          {
            error: `This phone number is registered as a ${existingUser.role.toLowerCase()}, not a ${role}`,
          },
          { status: 400 },
        );
      }
      userId = existingUser.id;
    } else {
      // Create new user with this phone number
      const userRole = role.toUpperCase() as keyof typeof Role;
      const newUser = await prisma.user.create({
        data: {
          phone: normalizedPhone,
          role: userRole,
          name: `New ${role}`, // Default name
        },
      });

      // Create corresponding doctor or patient record
      if (role === "doctor") {
        await prisma.doctor.create({
          data: { 
            userId: newUser.id,
            specialization: "General" // Default specialization, can be updated later
          },
        });
      } else if (role === "patient") {
        await prisma.patient.create({
          data: { userId: newUser.id },
        });
      }

      userId = newUser.id;
    }

    // Consume the OTP by marking it as consumed
    await prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: { consumedAt: new Date() }
    });

    // Generate JWT token
    const token = signJwt({
      sub: userId,
      role,
      phone: normalizedPhone,
    });

    // Set cookie
    const response = NextResponse.json({ ok: true });
    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : "failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
