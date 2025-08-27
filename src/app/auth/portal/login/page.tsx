"use client";
import * as React from "react";
import {
  Box,
  Button,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  Alert,
} from "@mui/material";

export default function PortalLoginPage() {
  const [phone, setPhone] = React.useState("");
  const [code, setCode] = React.useState("");
  const [normalized, setNormalized] = React.useState<string | undefined>();
  const [role, setRole] = React.useState<"patient" | "doctor">("patient");
  const [msg, setMsg] = React.useState<string | null>(null);
  const [err, setErr] = React.useState<string | null>(null);
  const [devOtp, setDevOtp] = React.useState<string | undefined>();

  const send = async () => {
    setErr(null);
    setMsg(null);
    const r = await fetch("/api/auth/sms-send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    const j = await r.json();
    if (!r.ok) return setErr(j.error || "Failed");
    setNormalized(j.normalized_phone || phone);
    setDevOtp(j.dev_otp);
    setMsg("OTP sent. Please check SMS.");
  };

  const verify = async () => {
    setErr(null);
    setMsg(null);
    const r = await fetch("/api/auth/sms-verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: normalized ?? phone, code, role }),
    });
    const j = await r.json();
    if (!r.ok) return setErr(j.error || "Failed");
    setMsg("Logged in. Redirecting...");
    window.location.href =
      role === "doctor" ? "/dashboard/doctor" : "/dashboard/patient";
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Portal Login (SMS OTP)
      </Typography>
      <Paper sx={{ p: 2, maxWidth: 520 }}>
        <Stack spacing={2}>
          <TextField
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <TextField
            select
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value as "patient" | "doctor")}
          >
            <MenuItem value="patient">Patient</MenuItem>
            <MenuItem value="doctor">Doctor</MenuItem>
          </TextField>
          <Button variant="contained" onClick={send}>
            Send OTP
          </Button>
          <TextField
            label="OTP"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button variant="contained" onClick={verify}>
            Verify & Login
          </Button>
          {devOtp && process.env.NODE_ENV !== "production" && (
            <Alert severity="info">Dev OTP: {devOtp}</Alert>
          )}
          {err && <Alert severity="error">{err}</Alert>}
          {msg && <Alert severity="success">{msg}</Alert>}
        </Stack>
      </Paper>
    </Box>
  );
}
