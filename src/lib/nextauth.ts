import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcrypt";
import type { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  // Use NEXTAUTH_SECRET if set, otherwise fall back to the JWT secret.
  // Ensures NextAuth has a secret in production to avoid runtime errors.
  secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.passwordHash) return null;
        // Restrict to admin/moderator accounts only
        if (user.role !== "ADMIN" && user.role !== "MODERATOR") return null;
        // Require verified email
        if (!user.emailVerifiedAt) return null;
        const valid = await compare(credentials.password, user.passwordHash);
        if (!valid) return null;
        // Map Prisma role enum to lowercase AppRole
        const appRole = user.role.toLowerCase() as any;
        return {
          id: user.id,
          name: user.name ?? undefined,
          email: user.email ?? undefined,
          role: appRole,
        } as User & { role: string };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    // Session expiry for dashboards (sliding window)
    maxAge: 60 * 60 * 2, // 2 hours
    updateAge: 60 * 30, // refresh token age every 30 minutes of activity
  },
  callbacks: {
    async jwt({ token, user }) {
      // Persist role and id in the token for session
      if (user) token.role = (user as any).role; // already lowercase from authorize
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // NextAuth puts user id in token.sub
        (session.user as any).id = token.sub as string | undefined;
        (session.user as any).role =
          (token.role as string | undefined) ?? undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/admin/login",
  },
};
