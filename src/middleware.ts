import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Protect dashboards with centralized middleware and session expiry checks.
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Admin area (NextAuth)
  if (pathname.startsWith("/dashboard/admin")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET });
    if (!token) return NextResponse.redirect(new URL("/auth/admin/login", req.url));
    const role = String((token as any).role || "").toLowerCase();
    if (role !== "admin") return NextResponse.redirect(new URL("/access-denied", req.url));
    return NextResponse.next();
  }

  // Moderator area (NextAuth)
  if (pathname.startsWith("/dashboard/moderator")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET });
    if (!token) return NextResponse.redirect(new URL("/auth/admin/login", req.url));
    const role = String((token as any).role || "").toLowerCase();
    if (role !== "admin" && role !== "moderator")
      return NextResponse.redirect(new URL("/access-denied", req.url));
    return NextResponse.next();
  }

  // Patient area (custom JWT cookie: token)
  if (pathname.startsWith("/dashboard/patient")) {
    const cookie = req.cookies.get("token")?.value;
    if (!cookie) return NextResponse.redirect(new URL("/auth/portal/login", req.url));
    // Detailed JWT verification is done in the page layout on the server.
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/admin/:path*",
    "/dashboard/moderator/:path*",
    "/dashboard/patient/:path*",
  ],
};
