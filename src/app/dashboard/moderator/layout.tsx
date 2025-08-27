"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { CircularProgress, Box } from "@mui/material";

export default function ModeratorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Moderator");

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.role !== "moderator") {
            router.push("/");
            return;
          }
          setUserName(data.name || "Moderator");
        } else {
          router.push("/auth/admin/login");
          return;
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/auth/admin/login");
        return;
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <DashboardLayout role="moderator" userName={userName}>
      {children}
    </DashboardLayout>
  );
}
