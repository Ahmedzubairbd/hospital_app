"use client";

import type { ReactNode } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function PatientDashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardLayout role="patient" userName="Patient">{children}</DashboardLayout>;
}
