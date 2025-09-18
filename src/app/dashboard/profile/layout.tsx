import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { authOptions } from "@/lib/nextauth";
import type { AppRole } from "@/lib/auth";

const allowedRoles: AppRole[] = ["admin", "moderator", "patient"];

export default async function ProfileLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/auth/portal/login");
  }

  const normalizedRole = String(session.user.role ?? "").toLowerCase();
  const role = allowedRoles.find((r) => r === normalizedRole);
  if (!role) {
    redirect("/access-denied");
  }

  return (
    <DashboardLayout role={role} userName={session.user.name ?? "User"}>
      {children}
    </DashboardLayout>
  );
}
