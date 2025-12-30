"use client";

import {
  Alert,
  Box,
  Button,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import * as React from "react";

export default function AdminRegisterPage() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState<"ADMIN" | "MODERATOR">("ADMIN");
  const [msg, setMsg] = React.useState<string | null>(null);
  const [err, setErr] = React.useState<string | null>(null);

  const submit = async () => {
    setErr(null);
    setMsg(null);
    const r = await fetch("/api/auth/admin/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });
    const j = await r.json();
    if (!r.ok) return setErr(j.error || "Failed");
    setMsg("Registration successful. Check your email to verify your account.");
  };

  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Typography variant="h4" gutterBottom>
          Admin/Moderator Registration
        </Typography>
        <Paper sx={{ p: 2, maxWidth: 520 }}>
          <Stack spacing={2}>
            <TextField
              label="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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
            <TextField
              select
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value as "ADMIN" | "MODERATOR")}
            >
              <MenuItem value="ADMIN">ADMIN</MenuItem>
              <MenuItem value="MODERATOR">MODERATOR</MenuItem>
            </TextField>
            <Button variant="contained" onClick={submit}>
              Register
            </Button>
            {err && <Alert severity="error">{err}</Alert>}
            {msg && <Alert severity="success">{msg}</Alert>}
          </Stack>
        </Paper>
      </motion.div>
    </Box>
  );
}
