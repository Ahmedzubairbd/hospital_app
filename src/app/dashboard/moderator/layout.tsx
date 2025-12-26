import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/nextauth";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default async function ModeratorDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/admin/login");
  }

  const userRole = String(session.user.role || "").toLowerCase();

  if (userRole !== "moderator" && userRole !== "admin") {
    redirect("/access-denied");
  }

  return (
    <DashboardLayout
      role="moderator"
      userName={session.user.name ?? "Moderator"}
    >
      {children}
    </DashboardLayout>
  );
}
