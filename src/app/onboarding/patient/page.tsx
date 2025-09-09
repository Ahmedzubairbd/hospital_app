"use client";
import * as React from "react";
import { Alert, Box, Button, MenuItem, Stack, TextField, Typography } from "@mui/material";

export default function PatientOnboardingPage() {
  const [step, setStep] = React.useState(1);
  const [name, setName] = React.useState("");
  const [dob, setDob] = React.useState("");
  const [gender, setGender] = React.useState<"MALE" | "FEMALE" | "OTHER" | "UNSPECIFIED" | "">("");
  const [insuranceNo, setInsuranceNo] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [err, setErr] = React.useState<string | null>(null);
  const [msg, setMsg] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      const r = await fetch("/api/patient/profile", { cache: "no-store" });
      if (!r.ok) return;
      const j = await r.json();
      setName(j.user?.name ?? "");
      setInsuranceNo(j.patient?.insuranceNo ?? "");
      if (j.patient?.dateOfBirth) setDob(new Date(j.patient.dateOfBirth).toISOString().slice(0,10));
      if (j.patient?.gender) setGender(j.patient.gender);
    })();
  }, []);

  const next = () => setStep((s) => Math.min(2, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const save = async () => {
    setErr(null);
    setMsg(null);
    if (!name.trim()) return setErr("Please enter your full name.");
    if (!dob) return setErr("Please select your date of birth.");
    if (!gender) return setErr("Please select your gender.");
    if (password && password !== confirm) return setErr("Passwords do not match.");
    const body: any = { name, dateOfBirth: new Date(dob).toISOString(), gender, insuranceNo: insuranceNo || undefined };
    if (password) body.password = password;
    const r = await fetch("/api/patient/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const j = await r.json();
    if (!r.ok) return setErr(j.error || "Failed to save");
    setMsg("Profile completed. Redirecting…");
    window.location.href = "/dashboard/patient";
  };

  return (
    <Box sx={{ maxWidth: 560, mx: "auto", p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Complete Your Profile</Typography>
      {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}
      {msg && <Alert severity="success" sx={{ mb: 2 }}>{msg}</Alert>}

      {step === 1 && (
        <Stack spacing={2}>
          <TextField label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          <TextField type="date" label="Date of birth" value={dob} onChange={(e) => setDob(e.target.value)} InputLabelProps={{ shrink: true }} />
          <TextField select label="Gender" value={gender} onChange={(e) => setGender(e.target.value as any)}>
            <MenuItem value="MALE">Male</MenuItem>
            <MenuItem value="FEMALE">Female</MenuItem>
            <MenuItem value="OTHER">Other</MenuItem>
            <MenuItem value="UNSPECIFIED">Prefer not to say</MenuItem>
          </TextField>
          <TextField label="Insurance No (optional)" value={insuranceNo} onChange={(e) => setInsuranceNo(e.target.value)} />
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button variant="contained" onClick={next}>Next</Button>
          </Stack>
        </Stack>
      )}

      {step === 2 && (
        <Stack spacing={2}>
          <Typography variant="subtitle1">Set a password (optional)</Typography>
          <TextField type="password" label="New password" value={password} onChange={(e) => setPassword(e.target.value)} helperText="If set, you can log in with phone + password next time." />
          <TextField type="password" label="Confirm password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          <Stack direction="row" spacing={1} justifyContent="space-between">
            <Button onClick={back}>Back</Button>
            <Button variant="contained" onClick={save}>Finish</Button>
          </Stack>
        </Stack>
      )}
    </Box>
  );
}

