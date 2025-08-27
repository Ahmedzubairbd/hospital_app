import { NextResponse } from "next/server";
import { verifyJwt } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const cookie = (req.headers.get("cookie") ?? "").toString();
    const m = /(?:^|; )token=([^;]+)/.exec(cookie);
    if (!m) return NextResponse.json({ authenticated: false }, { status: 401 });

    const payload = verifyJwt(decodeURIComponent(m[1]));
    if (!payload)
      return NextResponse.json({ authenticated: false }, { status: 401 });

    // Get user data based on role
    const { sub: userId, role } = payload;

    let userData;

    if (role === "admin" || role === "moderator") {
      userData = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });
    } else if (role === "doctor") {
      userData = await prisma.doctor.findUnique({
        where: { userId },
        select: {
          id: true,
          specialization: true,
          user: {
            select: {
              name: true,
              phone: true
            }
          }
        },
      });
    } else if (role === "patient") {
      userData = await prisma.patient.findUnique({
        where: { userId },
        select: {
          id: true,
          user: {
            select: {
              name: true,
              phone: true
            }
          }
        },
      });
    }

    if (!userData) {
      return NextResponse.json(
        { authenticated: false, error: "User not found" },
        { status: 404 },
      );
    }

    // Return user data with role
    return NextResponse.json({
      authenticated: true,
      ...userData,
      role,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { authenticated: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
