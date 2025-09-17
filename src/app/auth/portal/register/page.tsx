"use client";
import * as React from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export default function PortalRegisterPage() {
  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const role = "patient";
  const [code, setCode] = React.useState("");
  const [normalized, setNormalized] = React.useState<string | undefined>();

  const [agree, setAgree] = React.useState(false);

  const [msg, setMsg] = React.useState<string | null>(null);
  const [err, setErr] = React.useState<string | null>(null);
  const [devOtp, setDevOtp] = React.useState<string | undefined>();
  const [sending, setSending] = React.useState(false);
  const [verifying, setVerifying] = React.useState(false);

  // resend cooldown
  const [cooldown, setCooldown] = React.useState(0);
  React.useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const validateBasics = () => {
    if (!fullName.trim()) return "Please enter your full name.";
    if (!phone.trim()) return "Please enter your phone number.";
    if (!/^\+?\d{8,15}$/.test(phone.replace(/\s+/g, "")))
      return "Please enter a valid phone number (include country code if needed).";
    if (!agree) return "You must agree to the Terms to continue.";
    return null;
  };

  const send = async () => {
    setErr(null);
    setMsg(null);
    const v = validateBasics();
    if (v) return setErr(v);

    try {
      setSending(true);
      const r = await fetch("/api/auth/sms-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const j = await r.json();
      if (!r.ok) {
        setErr(j.error || "Failed to send OTP");
        return;
      }
      setNormalized(j.normalized_phone || phone);
      setDevOtp(j.dev_otp);
      setMsg("OTP sent. Please check SMS.");
      setCooldown(45); // 45s cooldown before resend
    } catch (e: any) {
      setErr("Failed to send OTP.");
    } finally {
      setSending(false);
    }
  };

  const verifyAndRegister = async () => {
    setErr(null);
    setMsg(null);
    if (!code.trim()) return setErr("Enter the OTP you received.");

    try {
      setVerifying(true);
      const r = await fetch("/api/auth/sms-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: normalized ?? phone,
          code,
          role,
          name: fullName.trim(),
        }),
      });
      const j = await r.json();
      if (!r.ok) {
        setErr(j.error || "OTP verification failed");
        return;
      }
      setMsg("Registration complete. Redirecting…");
      window.location.href = "/dashboard/patient";
    } catch (e: any) {
      setErr("OTP verification failed.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      {/* Left visual / welcome */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Stack spacing={3} alignItems="center">
          <Typography variant="h4">Create your account</Typography>
          <Box
            component="img"
            src="/assets/illustrations/illustration_dashboard.png"
            alt="welcome"
            sx={{ maxWidth: 480, width: "100%" }}
          />
        </Stack>
      </Box>

      {/* Right form panel */}
      <Box
        sx={{
          width: { xs: "100%", md: 420 },
          p: { xs: 3, md: 4 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          boxShadow: { md: 3 },
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h6">Patient Registration (SMS OTP)</Typography>

          <TextField
            label="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            fullWidth
          />

          <TextField
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            helperText={
              normalized && normalized !== phone
                ? `Normalized: ${normalized}`
                : " "
            }
            fullWidth
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
            }
            label={
              <Typography variant="body2" color="text.secondary">
                I agree to the Terms & Privacy Policy
              </Typography>
            }
          />

          <Stack direction="row" spacing={1.5}>
            <Button
              variant="contained"
              onClick={send}
              disabled={sending || cooldown > 0}
            >
              {sending
                ? "Sending…"
                : cooldown > 0
                  ? `Resend in ${cooldown}s`
                  : "Send OTP"}
            </Button>

            <TextField
              label="OTP"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              sx={{ minWidth: 160 }}
            />
            <Button
              variant="contained"
              onClick={verifyAndRegister}
              disabled={verifying}
            >
              {verifying ? "Verifying…" : "Verify & Register"}
            </Button>
          </Stack>

          {devOtp && process.env.NODE_ENV !== "production" && (
            <Alert severity="info">Dev OTP: {devOtp}</Alert>
          )}
          {err && <Alert severity="error">{err}</Alert>}
          {msg && <Alert severity="success">{msg}</Alert>}

          <Typography variant="body2" color="text.secondary">
            Already have an account? <a href="/auth/portal/login">Log in</a>
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}
