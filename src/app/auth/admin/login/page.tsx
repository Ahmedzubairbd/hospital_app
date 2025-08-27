"use client";

import {
  Alert,
  Box,
  Button,
  Link as MLink,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
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
    <Box sx={{ p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Typography variant="h4" gutterBottom>
          Admin Login
        </Typography>
        <Paper sx={{ p: 2, maxWidth: 520 }}>
          <Stack spacing={2}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button variant="contained" onClick={submit}>
              Login
            </Button>
            <MLink href="/auth/admin/forgot-password">Forgot password?</MLink>
            {err && <Alert severity="error">{err}</Alert>}
          </Stack>
        </Paper>
      </motion.div>
    </Box>
  );
}
