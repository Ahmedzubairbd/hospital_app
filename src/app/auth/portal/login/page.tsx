"use client";
import * as React from "react";
import {
  Alert,
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
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
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        // background: "linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)",
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Stack spacing={3} alignItems="center">
          <Typography variant="h4">Hi, Welcome back</Typography>
          <Box
            component="img"
            src="/assets/illustrations/illustration_dashboard.png"
            alt="welcome"
            sx={{ maxWidth: 480, width: "100%" }}
          />
        </Stack>
      </Box>
      <Box
        sx={{
          width: { xs: "50%", md: 420 },
          p: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          boxShadow: 3,
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h6">Portal Login (SMS OTP)</Typography>
          <TextField
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
          />
          <TextField
            select
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value as "patient" | "doctor")}
            fullWidth
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
            fullWidth
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
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{" "}
            <a href="/auth/portal/register">Register</a>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
