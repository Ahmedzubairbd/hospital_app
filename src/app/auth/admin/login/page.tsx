"use client";

import {
  Alert,
  Box,
  Button,
  Link as MLink,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import * as React from "react";

export default function AdminLoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [err, setErr] = React.useState<string | null>(null);

  const submit = async () => {
    setErr(null);
    const r = await fetch("/api/auth/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const j = await r.json();
    if (!r.ok) return setErr(j.error || "Failed");
    window.location.href = "/dashboard/admin";
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        color: "white",
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
          width: { xs: "100%", md: 420 },
          bgcolor: "#1f2937",
          p: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h6">Sign in to Admin Portal</Typography>
          <Alert
            severity="info"
            sx={{
              bgcolor: "#0f766e",
              color: "#ecfeff",
            }}
          >
            Use email: admin@gmail.com | password: 123456
          </Alert>
          <TextField
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            InputLabelProps={{ sx: { color: "#94a3b8" } }}
            inputProps={{ style: { color: "white" } }}
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "#0f172a",
                "& fieldset": { borderColor: "#334155" },
                "&:hover fieldset": { borderColor: "#38bdf8" },
                "&.Mui-focused fieldset": { borderColor: "#38bdf8" },
              },
            }}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            InputLabelProps={{ sx: { color: "#94a3b8" } }}
            inputProps={{ style: { color: "white" } }}
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "#0f172a",
                "& fieldset": { borderColor: "#334155" },
                "&:hover fieldset": { borderColor: "#38bdf8" },
                "&.Mui-focused fieldset": { borderColor: "#38bdf8" },
              },
            }}
          />
          <Button
            variant="contained"
            onClick={submit}
            sx={{
              bgcolor: "#0ea5e9",
              "&:hover": { bgcolor: "#0284c7" },
            }}
          >
            Login
          </Button>
          <MLink href="/auth/admin/forgot-password" sx={{ color: "#38bdf8" }}>
            Forgot password?
          </MLink>
          {err && <Alert severity="error">{err}</Alert>}
        </Stack>
      </Box>
    </Box>
  );
}
