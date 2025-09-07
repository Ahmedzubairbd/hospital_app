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
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import * as React from "react";

export default function AdminLoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [err, setErr] = React.useState<string | null>(null);
  const router = useRouter();

  const submit = async () => {
    setErr(null);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (!res)
        throw new Error("No response from server. Please try again later.");
      if (res.error) {
        setErr(
          res.error === "CredentialsSignin"
            ? "Invalid email or password"
            : res.error,
        );
        return;
      }
      router.push("/dashboard/admin");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Login failed");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        // background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        // color: "white",
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
            Use email: admin@example.com | password: Admin123
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
