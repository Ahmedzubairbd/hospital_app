"use client";
import * as React from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

type Patient = {
  id: string;
  user: { name: string | null; email: string | null; phone: string | null };
};

export default function PatientsAdminPage() {
  const [rows, setRows] = React.useState<Patient[]>([]);
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [err, setErr] = React.useState<string | null>(null);

  async function load() {
    const r = await fetch("/api/patients", { cache: "no-store" });
    const j = await r.json();
    setRows(Array.isArray(j) ? j : []);
  }
  React.useEffect(() => {
    void load();
  }, []);

  async function create() {
    setErr(null);
    const r = await fetch("/api/patients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        phone,
        password: password || undefined,
      }),
    });
    const j = await r.json();
    if (!r.ok) return setErr(j.error || "failed");
    setOpen(false);
    setName("");
    setEmail("");
    setPhone("");
    setPassword("");
    await load();
  }

  return (
    <Box sx={{ p: 1 }}>
      <Stack direction="row" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Patients
        </Typography>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={() => setOpen(true)}
        >
          Add Patient
        </Button>
      </Stack>
      <Paper variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.user.name ?? "-"}</TableCell>
                <TableCell>{r.user.email ?? "-"}</TableCell>
                <TableCell>{r.user.phone ?? "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>New Patient</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1, minWidth: 420 }}>
            <TextField
              label="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <TextField
              label="Password (optional)"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {err && <Alert severity="error">{err}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={create}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
