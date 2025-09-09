import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/nextauth";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default async function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/admin/login");
  }

  if (String(session.user.role || '').toLowerCase() !== "admin") {
    redirect("/access-denied");
  }

  return (
    <DashboardLayout role="admin" userName={session.user.name ?? "Admin"}>
      {children}
    </DashboardLayout>
  );
}
