"use client";

import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import * as React from "react";

export default function AdminNewPasswordPage() {
  const [pwd, setPwd] = React.useState("");
  const [msg, setMsg] = React.useState<string | null>(null);
  const [err, setErr] = React.useState<string | null>(null);

  const submit = async () => {
    setMsg(null);
    setErr(null);
    const sp = new URLSearchParams(window.location.search);
    const token = sp.get("token");
    if (!token) {
      setErr("Missing token");
      return;
    }
    const r = await fetch("/api/auth/admin/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password: pwd }),
    });
    const j = await r.json();
    if (!r.ok) return setErr(j.error || "Failed");
    setMsg("Password updated. You can log in.");
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Set New Password
      </Typography>
      <Paper sx={{ p: 2, maxWidth: 520 }}>
        <Stack spacing={2}>
          <TextField
            label="New password"
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
          />
          <Button variant="contained" onClick={submit}>
            Update
          </Button>
          {err && <Alert severity="error">{err}</Alert>}
          {msg && <Alert severity="success">{msg}</Alert>}
        </Stack>
      </Paper>
    </Box>
  );
}
