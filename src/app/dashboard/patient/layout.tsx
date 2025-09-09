import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { prisma } from "@/lib/db";

export default async function PatientDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const payload = token ? verifyJwt(token) : null;

  if (!payload) {
    redirect("/auth/portal/login");
  }
  if (payload.role !== "patient") {
    redirect("/access-denied");
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  const patient = await prisma.patient.findUnique({ where: { userId: payload.sub } });

  // Require onboarding if basic profile incomplete
  const needOnboarding = !user?.name || !patient?.dateOfBirth || !patient?.gender;
  if (needOnboarding) {
    redirect("/onboarding/patient");
  }

  return (
    <DashboardLayout role="patient" userName={user?.name ?? "Patient"}>
      {children}
    </DashboardLayout>
  );
}
