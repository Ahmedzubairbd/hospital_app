"use client";
import * as React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
  Alert,
} from "@mui/material";

type Appointment = {
  id: string;
  scheduledAt: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  patient: { user: { name: string | null } };
};

export default function DoctorDashboard() {
  const [items, setItems] = React.useState<Appointment[]>([]);
  const [msg, setMsg] = React.useState<string | null>(null);
  const [err, setErr] = React.useState<string | null>(null);

  async function load() {
    const r = await fetch("/api/appointments", { cache: "no-store" });
    setItems(await r.json());
  }
  React.useEffect(() => {
    void load();
  }, []);

  async function update(id: string, status: Appointment["status"]) {
    setErr(null);
    setMsg(null);
    const r = await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const j = await r.json();
    if (!r.ok) {
      setErr(j.error || "failed");
      return;
    }
    setMsg("Updated");
    await load();
  }

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h4" gutterBottom>
        My Appointments (Doctor)
      </Typography>
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

      <Grid container gap={2}>
        {items.map((a) => (
          <Grid key={a.id} size={{ xs: 12, md: 6, lg: 4 }}>
            <Card variant="outlined">
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="h6">
                    {a.patient.user.name ?? "Patient"}
                  </Typography>
                  <Typography color="text.secondary">
                    {new Date(a.scheduledAt).toLocaleString()}
                  </Typography>
                  <Typography>Status: {a.status}</Typography>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ mt: 1, flexWrap: "wrap" }}
                  >
                    {a.status === "PENDING" && (
                      <Button
                        size="small"
                        onClick={() => void update(a.id, "CONFIRMED")}
                      >
                        Confirm
                      </Button>
                    )}
                    {a.status !== "COMPLETED" && a.status !== "CANCELLED" && (
                      <>
                        <Button
                          size="small"
                          onClick={() => void update(a.id, "COMPLETED")}
                        >
                          Complete
                        </Button>
                        <Button
                          size="small"
                          onClick={() => void update(a.id, "CANCELLED")}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {items.length === 0 && (
          <Grid size={12}>
            <Typography>No appointments found.</Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
