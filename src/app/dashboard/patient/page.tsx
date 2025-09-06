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
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Alert,
} from "@mui/material";

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

  return (
    <Box sx={{ p: 1 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          My Appointments
        </Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Book
        </Button>
      </Stack>

      {err && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {err}
        </Alert>
      )}
      {msg && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {msg}
        </Alert>
      )}
      <>

      <Grid container spacing={2}>
        {loading ? (
          <Grid xs={12}>
            <Typography>Loading…</Typography>
          </Grid>
        ) : appts.length > 0 ? (
          appts.map((a) => (
            <Grid item xs={12} md={6} lg={4} key={a.id}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6">
                    {a.doctor?.user?.name ?? "Doctor"}
                  </Typography>
                  <Typography color="text.secondary">
                    {new Date(a.scheduledAt).toLocaleString()}
                  </Typography>
                  <Typography>Status: {a.status}</Typography>
                  {a.reason && <Typography>Reason: {a.reason}</Typography>}
                  {a.status !== "CANCELLED" && a.status !== "COMPLETED" && (
                    <Button
                      size="small"
                      sx={{ mt: 1 }}
                      onClick={() => void cancel(a.id)}
                    >
                      Cancel
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography>No appointments yet.</Typography>
          </Grid>
        )}
      </Grid>
</>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Book appointment</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1, minWidth: 420 }}>
            <TextField
              select
              label="Doctor"
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
            >
              {docs.map((d) => (
                <MenuItem key={d.id} value={d.id}>
                  {d.user?.name ?? "Doctor"} — {d.specialization}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Date & time"
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Reason (optional)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
          <Button
            variant="contained"
            onClick={book}
            disabled={!doctorId || !scheduledAt}
          >
            Book
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}