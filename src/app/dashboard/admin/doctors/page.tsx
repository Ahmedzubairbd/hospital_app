"use client";
import * as React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Image from "next/image";
import { compressImageFile } from "@/lib/images";

type Doctor = {
  id: string;
  specialization: string;
  bio: string | null;
  schedule: string | null;
  sliderPictureUrl: string | null;
  branchId: string | null;
  user: { name: string | null; email: string | null; phone: string | null };
  branch: { name: string | null; city: string | null } | null;
};

type Branch = {
  id: string;
  name: string;
};

type FormState = {
  name: string;
  email: string;
  phone: string;
  password: string;
  specialization: string;
  bio: string;
  schedule: string;
  sliderPictureUrl: string;
  branchId: string;
};

const emptyForm: FormState = {
  name: "",
  email: "",
  phone: "",
  password: "",
  specialization: "",
  bio: "",
  schedule: "",
  sliderPictureUrl: "",
  branchId: "",
};

export default function AdminDoctorsPage() {
  const [rows, setRows] = React.useState<Doctor[]>([]);
  const [branches, setBranches] = React.useState<Branch[]>([]);
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Doctor | null>(null);
  const [form, setForm] = React.useState<FormState>(emptyForm);
  const [err, setErr] = React.useState<string | null>(null);
  const [msg, setMsg] = React.useState<string | null>(null);

  async function load() {
    try {
      const [docsRes, branchesRes] = await Promise.all([
        fetch("/api/doctors", { cache: "no-store" }),
        fetch("/api/branches", { cache: "no-store" }),
      ]);
      const docsData = await docsRes.json();
      const branchesData = await branchesRes.json();
      setRows(Array.isArray(docsData) ? docsData : []);
      setBranches(Array.isArray(branchesData) ? branchesData : []);
    } catch (error) {
      setErr("Failed to load data");
    }
  }

  React.useEffect(() => {
    void load();
  }, []);

  function startCreate() {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function startEdit(d: Doctor) {
    setEditing(d);
    setForm({
      name: d.user.name ?? "",
      email: d.user.email ?? "",
      phone: d.user.phone ?? "",
      password: "", // not editing password here
      specialization: d.specialization,
      bio: d.bio ?? "",
      schedule: d.schedule ?? "",
      sliderPictureUrl: d.sliderPictureUrl ?? "",
      branchId: d.branchId ?? "",
    });
    setOpen(true);
  }

  async function save() {
    setErr(null);
    setMsg(null);
    const body = { ...form };
    if (editing && !body.password) {
      delete (body as any).password;
    }

    const headers = { "Content-Type": "application/json" };

    let res: Response;
    if (editing) {
      res = await fetch(`/api/doctors/${editing.id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(body),
      });
    } else {
      res = await fetch("/api/doctors", {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
    }

    const j = await res.json();
    if (!res.ok) {
      setErr(j.error || "Failed to save doctor");
      return;
    }

    setOpen(false);
    setMsg(editing ? "Doctor updated" : "Doctor created");
    await load();
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    setErr(null);
    setMsg(null);
    const res = await fetch(`/api/doctors/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const j = await res.json();
      setErr(j.error || "Failed to delete doctor");
      return;
    }
    setMsg("Doctor deleted");
    await load();
  }

  return (
    <Box sx={{ p: 1 }}>
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ flexGrow: 1 }}>
          Manage Doctors
        </Typography>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={startCreate}
        >
          Add Doctor
        </Button>
      </Stack>

      {err && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErr(null)}>
          {err}
        </Alert>
      )}
      {msg && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setMsg(null)}>
          {msg}
        </Alert>
      )}

      <Paper variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Specialization</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id} hover>
                <TableCell>{r.user.name}</TableCell>
                <TableCell>{r.specialization}</TableCell>
                <TableCell>{r.branch?.name ?? "-"}</TableCell>
                <TableCell>{r.user.email ?? "-"}</TableCell>
                <TableCell>{r.user.phone ?? "-"}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => startEdit(r)} aria-label="Edit">
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(r.id)}
                    aria-label="Delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No doctors found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editing ? "Edit Doctor" : "Add Doctor"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <TextField
              label="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <TextField
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              helperText={editing ? "Leave blank to keep current password" : ""}
            />
            <TextField
              label="Specialization"
              value={form.specialization}
              onChange={(e) =>
                setForm({ ...form, specialization: e.target.value })
              }
            />
            <TextField
              select
              label="Branch"
              value={form.branchId}
              onChange={(e) => setForm({ ...form, branchId: e.target.value })}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {branches.map((b) => (
                <MenuItem key={b.id} value={b.id}>
                  {b.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Schedule"
              value={form.schedule}
              onChange={(e) => setForm({ ...form, schedule: e.target.value })}
              helperText="e.g., Mon-Fri 9am-5pm, Sat 10am-2pm"
            />
            <TextField
              label="Slider Picture URL"
              value={form.sliderPictureUrl}
              onChange={(e) =>
                setForm({ ...form, sliderPictureUrl: e.target.value })
              }
            />
            {/* Optional: upload and auto-optimize image */}
            <Stack spacing={1}>
              <Button component="label" variant="outlined">
                Upload Slider Image
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const dataUrl = await compressImageFile(file, {
                      maxWidth: 1600,
                      maxHeight: 900,
                      quality: 0.8,
                    });
                    setForm({ ...form, sliderPictureUrl: dataUrl });
                  }}
                />
              </Button>
              {form.sliderPictureUrl && (
                <Box sx={{ position: "relative", width: "100%", height: 160 }}>
                  {/* next/image optimizes delivery when served from URL; data URL shown as-is */}
                  <Image
                    src={form.sliderPictureUrl}
                    alt="Preview"
                    fill
                    style={{ objectFit: "cover", borderRadius: 8 }}
                    sizes="(max-width: 600px) 100vw, 600px"
                  />
                </Box>
              )}
            </Stack>
            <TextField
              label="Bio"
              multiline
              rows={3}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={save}>
            {editing ? "Save Changes" : "Create Doctor"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
