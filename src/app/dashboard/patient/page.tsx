"use client";
import * as React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid";


type Doctor = {
  id: string;
  specialization: string;
  user: { name: string | null };
};
type Appointment = {
  id: string;
  doctorId: string;
  patientId: string;
  scheduledAt: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  reason: string | null;
  doctor: { user: { name: string | null } };
};

export default function PatientDashboard() {
  const [docs, setDocs] = React.useState<Doctor[]>([]);
  const [appts, setAppts] = React.useState<Appointment[]>([]);
  const [open, setOpen] = React.useState(false);
  const [doctorId, setDoctorId] = React.useState("");
  const [scheduledAt, setScheduledAt] = React.useState("");
  const [reason, setReason] = React.useState("");
  const [msg, setMsg] = React.useState<string | null>(null);
  const [err, setErr] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const [r1, r2] = await Promise.all([
        fetch("/api/appointments/doctors", { cache: "no-store" }),
        fetch("/api/appointments", { cache: "no-store" }),
      ]);

      // --- doctors ---
      let j1: unknown = await r1.json().catch(() => []);
      const docsArr = Array.isArray(j1) ? j1 : (j1 as any)?.data ?? [];
      setDocs(docsArr);

      // --- appointments ---
      let j2: unknown = await r2.json().catch(() => []);
      const apptsArr = Array.isArray(j2) ? j2 : (j2 as any)?.data ?? [];
      if (!Array.isArray(apptsArr)) throw new Error("Bad appointments payload");
      setAppts(apptsArr);
    } catch (e: any) {
      setErr(e?.message || "Failed to load data");
      setDocs([]);
      setAppts([]);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    void load();
  }, []);

  async function book() {
    setErr(null);
    setMsg(null);
    const r = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        doctorId,
        scheduledAt: new Date(scheduledAt).toISOString(),
        reason,
      }),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) {
      setErr((j as any).error || "failed");
      return;
    }
    setMsg("Appointment requested");
    setOpen(false);
    await load();
  }

  async function cancel(id: string) {
    setErr(null);
    setMsg(null);
    const r = await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CANCELLED" }),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) {
      setErr((j as any).error || "failed");
      return;
    }
    setMsg("Cancelled");
    await load();
  }
}