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

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [msg, setMsg] = React.useState<string | null>(null);

  const submit = async () => {
    setMsg(null);
    await fetch("/api/auth/admin/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setMsg("If the email exists, a reset link has been sent.");
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Forgot Password
      </Typography>
      <Paper sx={{ p: 2, maxWidth: 520 }}>
        <Stack spacing={2}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button variant="contained" onClick={submit}>
            Send reset link
          </Button>
          {msg && <Alert severity="success">{msg}</Alert>}
        </Stack>
      </Paper>
    </Box>
  );
}
