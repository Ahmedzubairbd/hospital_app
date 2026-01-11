"use client";

import * as React from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Collapse,
  Divider,
  Fade,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { keyframes } from "@mui/system";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Method = "otp" | "password";

const RESEND_SECONDS = 30;

const floatSlow = keyframes`
  0%   { transform: translate3d(-10px,-8px,0) scale(1) rotate(0deg);   }
  50%  { transform: translate3d(12px,10px,0)  scale(1.04) rotate(6deg); }
  100% { transform: translate3d(-10px,-8px,0) scale(1) rotate(0deg);   }
`;

const floatFast = keyframes`
  0%   { transform: translate3d(8px,10px,0) scale(1) rotate(0deg);     }
  50%  { transform: translate3d(-12px,-10px,0) scale(0.98) rotate(-7deg); }
  100% { transform: translate3d(8px,10px,0) scale(1) rotate(0deg);     }
`;

const shimmer = keyframes`
  0%   { transform: translateX(-140%); opacity: 0; }
  30%  { opacity: 0.55; }
  60%  { opacity: 0.35; }
  100% { transform: translateX(140%); opacity: 0; }
`;

const drawLine = keyframes`
  to { stroke-dashoffset: 0; }
`;

const shake = keyframes`
  0%   { transform: translateX(0); }
  25%  { transform: translateX(-6px); }
  50%  { transform: translateX(6px); }
  75%  { transform: translateX(-4px); }
  100% { transform: translateX(0); }
`;

function PulseMark() {
  const theme = useTheme();
  return (
    <Box
      component="svg"
      viewBox="0 0 140 26"
      aria-hidden
      sx={{
        width: 140,
        height: 26,
        opacity: 0.9,
        "& path": {
          stroke: theme.palette.primary.main,
          strokeWidth: 3,
          fill: "none",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeDasharray: 240,
          strokeDashoffset: 240,
          animation: `${drawLine} 1.4s ease forwards`,
        },
        "@media (prefers-reduced-motion: reduce)": {
          "& path": { animation: "none", strokeDashoffset: 0 },
        },
      }}
    >
      {/* A little “heartbeat-ish” line */}
      <path d="M2 13h22l8-10 14 20 14-28 14 34 12-16h38" />
    </Box>
  );
}

function AnimatedBackdrop() {
  const theme = useTheme();
  const c1 = alpha(theme.palette.primary.main, 0.22);
  const c2 = alpha(theme.palette.primary.light, 0.18);
  const c3 = alpha(theme.palette.primary.dark, 0.16);
  const fade = "rgba(0,0,0,0)";

  return (
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",

        "& .orb": {
          transformOrigin: "center",
          filter: "blur(18px)",
          opacity: 0.85,
        },
        "& .orb1": { animation: `${floatSlow} 14s ease-in-out infinite` },
        "& .orb2": { animation: `${floatFast} 11s ease-in-out infinite` },
        "& .orb3": {
          animation: `${floatSlow} 18s ease-in-out infinite reverse`,
        },

        "@media (prefers-reduced-motion: reduce)": {
          "& .orb1, & .orb2, & .orb3": { animation: "none" },
        },
      }}
    >
      <Box
        component="svg"
        viewBox="0 0 1200 800"
        preserveAspectRatio="none"
        sx={{ width: "100%", height: "100%" }}
      >
        <defs>
          <radialGradient id="g1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={c1} />
            <stop offset="100%" stopColor={fade} />
          </radialGradient>
          <radialGradient id="g2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={c2} />
            <stop offset="100%" stopColor={fade} />
          </radialGradient>
          <radialGradient id="g3" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor={c3} />
            <stop offset="100%" stopColor={fade} />
          </radialGradient>
        </defs>

        <circle
          className="orb orb1"
          cx="220"
          cy="220"
          r="240"
          fill="url(#g1)"
        />
        <circle
          className="orb orb2"
          cx="980"
          cy="240"
          r="270"
          fill="url(#g2)"
        />
        <circle
          className="orb orb3"
          cx="680"
          cy="720"
          r="340"
          fill="url(#g3)"
        />
      </Box>
    </Box>
  );
}

export default function PortalLoginPage() {
  const theme = useTheme();
  const router = useRouter();

  const role = "patient";

  const [method, setMethod] = React.useState<Method>("otp");

  const [phone, setPhone] = React.useState("");
  const [code, setCode] = React.useState("");
  const [normalized, setNormalized] = React.useState<string | undefined>();

  const [password, setPassword] = React.useState("");

  const [msg, setMsg] = React.useState<string | null>(null);
  const [err, setErr] = React.useState<string | null>(null);
  const [devOtp, setDevOtp] = React.useState<string | undefined>();

  const [otpSent, setOtpSent] = React.useState(false);
  const [cooldown, setCooldown] = React.useState(0);

  const [sending, setSending] = React.useState(false);
  const [verifying, setVerifying] = React.useState(false);
  const [pwLoading, setPwLoading] = React.useState(false);

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const resetFeedback = () => {
    setErr(null);
    setMsg(null);
  };

  const send = async () => {
    resetFeedback();

    if (!phone.trim()) {
      setErr("Please enter your phone number.");
      return;
    }
    if (sending) return;

    setSending(true);
    try {
      const r = await fetch("/api/auth/sms-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const j = await r.json().catch(() => ({} as any));
      if (!r.ok) {
        setErr(j.error || "Failed to send OTP.");
        return;
      }

      setNormalized(j.normalized_phone || phone);
      setDevOtp(j.dev_otp);
      setOtpSent(true);
      setCooldown(RESEND_SECONDS);
      setMsg("OTP sent. Please check your SMS.");
    } catch {
      setErr("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const verify = async () => {
    resetFeedback();

    const effectivePhone = normalized ?? phone;
    if (!effectivePhone.trim()) {
      setErr("Phone number is required.");
      return;
    }
    if (!code.trim()) {
      setErr("Please enter the OTP code.");
      return;
    }
    if (verifying) return;

    setVerifying(true);
    try {
      const r = await fetch("/api/auth/sms-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: effectivePhone, code, role }),
      });

      const j = await r.json().catch(() => ({} as any));
      if (!r.ok) {
        setErr(j.error || "OTP verification failed.");
        return;
      }

      setMsg("Logged in. Redirecting…");
      router.replace("/dashboard/patient");
    } catch {
      setErr("Network error. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const loginWithPassword = async () => {
    resetFeedback();

    if (!phone.trim()) {
      setErr("Please enter your phone number.");
      return;
    }
    if (!password.trim()) {
      setErr("Please enter your password.");
      return;
    }
    if (pwLoading) return;

    setPwLoading(true);
    try {
      const r = await fetch("/api/auth/portal/password-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });

      const j = await r.json().catch(() => ({} as any));
      if (!r.ok) {
        setErr(j.error || "Password login failed.");
        return;
      }

      setMsg("Logged in. Redirecting…");
      router.replace("/dashboard/patient");
    } catch {
      setErr("Network error. Please try again.");
    } finally {
      setPwLoading(false);
    }
  };
  function normalizeBDPhone(input: string) {
    const digits = input.replace(/\D/g, "");

    if (digits.startsWith("880")) return `+${digits}`;
    if (digits.startsWith("0")) return `+880${digits.slice(1)}`;
    if (digits.length === 10 && digits.startsWith("1")) return `+880${digits}`;

    return `+880${digits}`;
  }

  const primaryButtonSx = {
    borderRadius: 2,
    py: 1.15,
    textTransform: "none",
    fontWeight: 800,
    position: "relative",
    overflow: "hidden",
    "&::after": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      height: "100%",
      width: "40%",
      background:
        "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0) 100%)",
      transform: "translateX(-140%)",
      opacity: 0,
      pointerEvents: "none",
      animation: `${shimmer} 2.8s ease-in-out infinite`,
    },
    "@media (prefers-reduced-motion: reduce)": {
      "&::after": { animation: "none" },
    },
  } as const;

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      transition: "box-shadow 180ms ease, transform 180ms ease",
      "&.Mui-focused": {
        boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.12)}`,
      },
    },
  } as const;

  const showShake = Boolean(err);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        position: "relative",
        overflow: "hidden",
        // bgcolor: "background.default",

        // Gentle base gradient + texture-like shine
        backgroundImage: `
          radial-gradient(1200px 700px at 10% 10%, ${alpha(
            theme.palette.primary.main,
            0.08
          )} 0%, transparent 60%),
          radial-gradient(900px 600px at 90% 15%, ${alpha(
            theme.palette.primary.light,
            0.08
          )} 0%, transparent 55%),
          radial-gradient(1000px 700px at 50% 95%, ${alpha(
            theme.palette.primary.dark,
            0.06
          )} 0%, transparent 60%)
        `,
      }}
    >
      <AnimatedBackdrop />

      <Fade in={mounted} timeout={650}>
        <Paper
          elevation={0}
          sx={{
            position: "relative",
            zIndex: 1,
            width: "min(1100px, calc(100% - 32px))",
            borderRadius: 4,
            overflow: "hidden",
            border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
            backgroundColor: alpha(theme.palette.background.paper, 0.72),
            backdropFilter: "blur(14px)",
            boxShadow: `0 22px 70px ${alpha("#000", 0.14)}`,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.1fr 0.9fr" },
            transform: "translateZ(0)",

            // quick “error shake” (plays whenever err becomes truthy)
            animation: showShake ? `${shake} 360ms ease` : "none",

            "@media (prefers-reduced-motion: reduce)": {
              animation: "none",
            },
          }}
        >
          {/* LEFT: Hero / Illustration */}
          <Box
            sx={{
              p: { xs: 3, md: 5 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRight: {
                xs: "none",
                md: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
              },
              background: `
                linear-gradient(135deg,
                  ${alpha(theme.palette.primary.main, 0.1)} 0%,
                  ${alpha(theme.palette.primary.light, 0.06)} 45%,
                  ${alpha(theme.palette.primary.dark, 0.05)} 100%
                )
              `,
            }}
          >
            <Stack spacing={2.2} sx={{ maxWidth: 520, width: "100%" }}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Stack spacing={0.4}>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 900, letterSpacing: -0.6 }}
                  >
                    Hi, welcome back
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Secure access to your patient portal.
                  </Typography>
                </Stack>

                <Chip
                  label="Patient"
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 800 }}
                />
              </Stack>

              <PulseMark />

              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  borderRadius: 3,
                  overflow: "hidden",
                  border: `1px solid ${alpha(theme.palette.divider, 0.55)}`,
                  background: alpha(theme.palette.background.paper, 0.35),
                  boxShadow: `0 18px 50px ${alpha("#000", 0.12)}`,
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    background:
                      "radial-gradient(800px 200px at 20% 0%, rgba(255,255,255,0.35) 0%, transparent 60%)",
                    pointerEvents: "none",
                  },
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    p: { xs: 2, md: 2.5 },
                    animation: `${floatSlow} 12s ease-in-out infinite`,
                    "@media (prefers-reduced-motion: reduce)": {
                      animation: "none",
                    },
                  }}
                >
                  <Image
                    src="/assets/illustrations/illustration_dashboard.png"
                    alt="Welcome illustration"
                    width={900}
                    height={650}
                    quality={90}
                    priority
                    sizes="(max-width: 900px) 92vw, 520px"
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                </Box>
              </Box>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip size="small" label="Fast OTP" sx={{ fontWeight: 700 }} />
                <Chip
                  size="small"
                  label="Password option"
                  sx={{ fontWeight: 700 }}
                />
                <Chip
                  size="small"
                  label="Animated UI"
                  sx={{ fontWeight: 700 }}
                />
              </Stack>
            </Stack>
          </Box>

          {/* RIGHT: Form */}
          <Box
            sx={{
              p: { xs: 3, md: 5 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Stack spacing={2.2} sx={{ width: "100%", maxWidth: 420 }}>
              <Stack spacing={0.5}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 900, letterSpacing: -0.2 }}
                >
                  Patient Portal Login
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Choose a sign-in method, then continue.
                </Typography>
              </Stack>

              {/* Method switch with built-in MUI animations */}
              <Tabs
                value={method}
                onChange={(_, v) => {
                  const next = v as Method;
                  if (!next) return;

                  setMethod(next);
                  resetFeedback();

                  // Reset method-specific state for clean transitions
                  setCode("");
                  setPassword("");
                  setOtpSent(false);
                  setCooldown(0);
                  setDevOtp(undefined);
                  setNormalized(undefined);
                }}
                variant="fullWidth"
                sx={{
                  minHeight: 44,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.action.hover, 0.6),
                  border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
                  "& .MuiTabs-indicator": {
                    height: "100%",
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.primary.main, 0.14),
                  },
                  "& .MuiTab-root": {
                    zIndex: 1,
                    minHeight: 44,
                    textTransform: "none",
                    fontWeight: 800,
                  },
                }}
              >
                <Tab value="otp" label="SMS OTP" />
                <Tab value="password" label="Password" />
              </Tabs>

              <Divider sx={{ opacity: 0.7 }} />

              <Fade in key={method} timeout={220}>
                <Box>
                  <Stack spacing={1.6}>
                    <TextField
                      label="Phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      fullWidth
                      inputMode="tel"
                      autoComplete="tel"
                      sx={fieldSx}
                      onKeyDown={(e) => {
                        if (e.key !== "Enter") return;
                        if (method === "otp") {
                          if (!otpSent) send();
                          else verify();
                        } else {
                          loginWithPassword();
                        }
                      }}
                      helperText={
                        normalized && otpSent
                          ? `Using: ${normalized}`
                          : "Include country code if applicable (e.g. +1…)."
                      }
                    />

                    {method === "password" ? (
                      <>
                        <TextField
                          label="Password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          fullWidth
                          autoComplete="current-password"
                          sx={fieldSx}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") loginWithPassword();
                          }}
                        />

                        <Button
                          variant="contained"
                          onClick={loginWithPassword}
                          disabled={
                            pwLoading || !phone.trim() || !password.trim()
                          }
                          sx={primaryButtonSx}
                        >
                          {pwLoading ? "Logging in…" : "Login"}
                        </Button>

                        <Typography variant="caption" color="text.secondary">
                          Tip: Add rate-limiting + lockout on the backend for
                          password attempts.
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="contained"
                          onClick={send}
                          disabled={sending || !phone.trim() || cooldown > 0}
                          sx={primaryButtonSx}
                        >
                          {sending
                            ? "Sending…"
                            : otpSent
                            ? cooldown > 0
                              ? `Resend in ${cooldown}s`
                              : "Resend OTP"
                            : "Send OTP"}
                        </Button>

                        <Collapse in={otpSent} timeout={250} unmountOnExit>
                          <Stack spacing={1.4}>
                            <TextField
                              label="OTP code"
                              value={code}
                              onChange={(e) => setCode(e.target.value)}
                              fullWidth
                              inputMode="numeric"
                              autoComplete="one-time-code"
                              sx={fieldSx}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") verify();
                              }}
                              helperText="Enter the code you received via SMS."
                            />

                            <Button
                              variant="contained"
                              onClick={verify}
                              disabled={verifying || !code.trim()}
                              sx={primaryButtonSx}
                            >
                              {verifying ? "Verifying…" : "Verify & Login"}
                            </Button>

                            <Button
                              variant="text"
                              onClick={() => {
                                resetFeedback();
                                setOtpSent(false);
                                setCode("");
                                setDevOtp(undefined);
                                setNormalized(undefined);
                                setCooldown(0);
                              }}
                              sx={{
                                textTransform: "none",
                                fontWeight: 800,
                                alignSelf: "flex-start",
                              }}
                            >
                              Change number / start over
                            </Button>
                          </Stack>
                        </Collapse>
                      </>
                    )}

                    {/* Animated alerts */}
                    <Collapse
                      in={
                        Boolean(devOtp) && process.env.NODE_ENV !== "production"
                      }
                      timeout={220}
                    >
                      <Alert severity="info" sx={{ mt: 0.5 }}>
                        Dev OTP: <b>{devOtp}</b>
                      </Alert>
                    </Collapse>

                    <Collapse in={Boolean(err)} timeout={220}>
                      <Alert severity="error" sx={{ mt: 0.5 }}>
                        {err}
                      </Alert>
                    </Collapse>

                    <Collapse in={Boolean(msg)} timeout={220}>
                      <Alert severity="success" sx={{ mt: 0.5 }}>
                        {msg}
                      </Alert>
                    </Collapse>
                  </Stack>
                </Box>
              </Fade>

              <Divider sx={{ opacity: 0.7 }} />

              <Typography variant="body2" color="text.secondary">
                Don&apos;t have an account?{" "}
                <Link href="/auth/portal/register" style={{ fontWeight: 800 }}>
                  Register
                </Link>
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ lineHeight: 1.4 }}
              >
                Security note: On the backend, enforce OTP expiry, attempt
                limits, and per-phone rate limits to stop brute-force and SMS
                abuse.
              </Typography>
            </Stack>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
}
