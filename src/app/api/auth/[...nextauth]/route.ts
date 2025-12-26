import NextAuth from "next-auth";
import { authOptions } from "@/lib/nextauth";

// NextAuth relies on Prisma and bcrypt which require a Node.js runtime.
export const runtime = "nodejs";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
