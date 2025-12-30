"use client";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import * as React from "react";

export default function VerifyEmailPage() {
  const [state, setState] = React.useState<"loading" | "ok" | "error">(
    "loading",
  );
  const [msg, setMsg] = React.useState<string>("Verifying...");

  React.useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const token = sp.get("token");
    if (!token) {
      setState("error");
      setMsg("Missing token");
      return;
    }
    (async () => {
      const r = await fetch("/api/auth/admin/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const j = await r.json();
      if (!r.ok) {
        setState("error");
        setMsg(j.error || "Verification failed");
        return;
      }
      setState("ok");
      setMsg("Email verified. You can log in now.");
    })();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2, maxWidth: 520 }}>
        {state === "loading" && (
          <Typography>
            <CircularProgress size={20} sx={{ mr: 1 }} /> {msg}
          </Typography>
        )}
        {state === "ok" && <Alert severity="success">{msg}</Alert>}
        {state === "error" && <Alert severity="error">{msg}</Alert>}
        {state !== "loading" && (
          <Button sx={{ mt: 2 }} variant="contained" href="/auth/admin/login">
            Go to Login
          </Button>
        )}
      </Paper>
    </Box>
  );
}
