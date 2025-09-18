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
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Image from "next/image";
import { compressImageFile } from "@/lib/images";

type LocaleText = { en: string; bn: string };

type DirectoryProfile = {
  name?: LocaleText;
  department?: LocaleText;
  specialization?: LocaleText;
  visitingHours?: LocaleText;
  description?: LocaleText;
  qualifications?: LocaleText[];
  workplaces?: LocaleText[];
  focusAreas?: LocaleText[];
  image?: string | null;
} | null;

type Doctor = {
  id: string;
  specialization: string;
  department: string;
  bio: string | null;
  schedule: string | null;
  visitingHours: string | null;
  sliderPictureUrl: string | null;
  keywords: string[];
  branchId: string | null;
  availableFrom: string | null;
  availableTo: string | null;
  weekdays: string | null;
  directoryProfile: DirectoryProfile;
  user: { name: string | null; email: string | null; phone: string | null };
  branch: { name: string | null; city: string | null } | null;
};

type Branch = {
  id: string;
  name: string;
};

type FormState = {
  name: string;
  nameBn: string;
  email: string;
  phone: string;
  password: string;
  specialization: string;
  specializationBn: string;
  department: string;
  departmentBn: string;
  bio: string;
  schedule: string;
  visitingHours: string;
  visitingHoursBn: string;
  sliderPictureUrl: string;
  branchId: string;
  description: string;
  descriptionBn: string;
  qualificationsEn: string;
  qualificationsBn: string;
  workplacesEn: string;
  workplacesBn: string;
  focusAreasEn: string;
  focusAreasBn: string;
  keywords: string;
  availableFrom: string;
  availableTo: string;
  weekdays: string;
};

const emptyForm: FormState = {
  name: "",
  nameBn: "",
  email: "",
  phone: "",
  password: "",
  specialization: "",
  specializationBn: "",
  department: "",
  departmentBn: "",
  bio: "",
  schedule: "",
  visitingHours: "",
  visitingHoursBn: "",
  sliderPictureUrl: "",
  branchId: "",
  description: "",
  descriptionBn: "",
  qualificationsEn: "",
  qualificationsBn: "",
  workplacesEn: "",
  workplacesBn: "",
  focusAreasEn: "",
  focusAreasBn: "",
  keywords: "",
  availableFrom: "",
  availableTo: "",
  weekdays: "",
};

const localeValue = (value: LocaleText | undefined | null, key: "en" | "bn") =>
  value?.[key]?.trim() ?? "";

const localeArrayToMultiline = (
  values: LocaleText[] | undefined,
  key: "en" | "bn",
) => {
  if (!values) return "";
  return values
    .map((item) => item?.[key]?.trim() ?? item?.en?.trim() ?? "")
    .filter((line) => line.length > 0)
    .join("\n");
};

const parseLines = (value: string) =>
  value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

const buildLocaleText = (enRaw: string, bnRaw: string): LocaleText | undefined => {
  const en = enRaw.trim();
  const bn = bnRaw.trim();
  if (!en && !bn) return undefined;
  if (!en && bn) return { en: bn, bn };
  if (!bn && en) return { en, bn: en };
  return { en, bn };
};

const buildLocaleArray = (enRaw: string, bnRaw: string): LocaleText[] => {
  const enLines = parseLines(enRaw);
  const bnLines = parseLines(bnRaw);
  const length = Math.max(enLines.length, bnLines.length);
  const result: LocaleText[] = [];
  for (let i = 0; i < length; i += 1) {
    const en = enLines[i] ?? "";
    const bn = bnLines[i] ?? "";
    const item = buildLocaleText(en, bn);
    if (item) result.push(item);
  }
  return result;
};

const parseKeywords = (value: string) => {
  const items = value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
  return Array.from(new Set(items));
};

const nullable = (value: string) => {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
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
    const profile = d.directoryProfile ?? null;
    setForm({
      name: profile?.name?.en ?? d.user.name ?? "",
      nameBn: localeValue(profile?.name ?? undefined, "bn"),
      email: d.user.email ?? "",
      phone: d.user.phone ?? "",
      password: "", // not editing password here
      specialization: profile?.specialization?.en ?? d.specialization,
      specializationBn: localeValue(profile?.specialization ?? undefined, "bn"),
      department: profile?.department?.en ?? d.department ?? "",
      departmentBn: localeValue(profile?.department ?? undefined, "bn"),
      bio: d.bio ?? "",
      schedule: d.schedule ?? "",
      visitingHours: profile?.visitingHours?.en ?? d.visitingHours ?? "",
      visitingHoursBn: localeValue(profile?.visitingHours ?? undefined, "bn"),
      sliderPictureUrl: profile?.image ?? d.sliderPictureUrl ?? "",
      branchId: d.branchId ?? "",
      description: profile?.description?.en ?? "",
      descriptionBn: localeValue(profile?.description ?? undefined, "bn"),
      qualificationsEn: localeArrayToMultiline(profile?.qualifications ?? undefined, "en"),
      qualificationsBn: localeArrayToMultiline(profile?.qualifications ?? undefined, "bn"),
      workplacesEn: localeArrayToMultiline(profile?.workplaces ?? undefined, "en"),
      workplacesBn: localeArrayToMultiline(profile?.workplaces ?? undefined, "bn"),
      focusAreasEn: localeArrayToMultiline(profile?.focusAreas ?? undefined, "en"),
      focusAreasBn: localeArrayToMultiline(profile?.focusAreas ?? undefined, "bn"),
      keywords: d.keywords.join("\n"),
      availableFrom: d.availableFrom ?? "",
      availableTo: d.availableTo ?? "",
      weekdays: d.weekdays ?? "",
    });
    setOpen(true);
  }

  async function save() {
    setErr(null);
    setMsg(null);
    const nameLocale = buildLocaleText(form.name, form.nameBn) ?? {
      en: form.name.trim(),
      bn: form.nameBn.trim() || form.name.trim(),
    };
    const departmentLocale = buildLocaleText(form.department, form.departmentBn) ?? {
      en: form.department.trim(),
      bn: form.departmentBn.trim() || form.department.trim(),
    };
    const specializationLocale =
      buildLocaleText(form.specialization, form.specializationBn) ?? {
        en: form.specialization.trim(),
        bn: form.specializationBn.trim() || form.specialization.trim(),
      };
    const visitingHoursLocale = buildLocaleText(
      form.visitingHours,
      form.visitingHoursBn,
    );
    const descriptionLocale = buildLocaleText(form.description, form.descriptionBn);
    const qualifications = buildLocaleArray(
      form.qualificationsEn,
      form.qualificationsBn,
    );
    const workplaces = buildLocaleArray(form.workplacesEn, form.workplacesBn);
    const focusAreas = buildLocaleArray(form.focusAreasEn, form.focusAreasBn);
    const keywords = parseKeywords(form.keywords);

    const profilePayload: Record<string, unknown> = {
      name: nameLocale,
      department: departmentLocale,
      specialization: specializationLocale,
      image: nullable(form.sliderPictureUrl),
    };

    if (visitingHoursLocale || form.visitingHours || form.visitingHoursBn) {
      profilePayload.visitingHours = visitingHoursLocale ?? null;
    }
    profilePayload.qualifications = qualifications;
    profilePayload.workplaces = workplaces;
    profilePayload.focusAreas = focusAreas;
    if (descriptionLocale || form.description || form.descriptionBn) {
      profilePayload.description = descriptionLocale ?? null;
    }

    const directoryProfile = Object.fromEntries(
      Object.entries(profilePayload).filter(([, value]) => value !== undefined),
    );

    const branchIdValue = form.branchId.trim();
    const availableFrom = nullable(form.availableFrom);
    const availableTo = nullable(form.availableTo);
    const weekdays = nullable(form.weekdays);

    const payload: Record<string, unknown> = {
      name: form.name.trim(),
      email: nullable(form.email),
      phone: nullable(form.phone),
      password: form.password.trim(),
      specialization: form.specialization.trim(),
      department: form.department.trim(),
      bio: nullable(form.bio),
      schedule: nullable(form.schedule),
      sliderPictureUrl: nullable(form.sliderPictureUrl),
      branchId: branchIdValue.length > 0 ? branchIdValue : null,
      visitingHours: nullable(form.visitingHours),
      keywords,
      directoryProfile,
      availableFrom,
      availableTo,
      weekdays,
    };

    if (editing) {
      if (!form.password.trim()) {
        delete payload.password;
      }
      payload.name = form.name.trim();
    }

    const headers = { "Content-Type": "application/json" };

    let res: Response;
    if (editing) {
      res = await fetch(`/api/doctors/${editing.id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(payload),
      });
    } else {
      res = await fetch("/api/doctors", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
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
              <TableCell>Department</TableCell>
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
                <TableCell>
                  {r.directoryProfile?.specialization?.en ?? r.specialization}
                </TableCell>
                <TableCell>
                  {r.directoryProfile?.department?.en ?? r.department ?? "-"}
                </TableCell>
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
                <TableCell colSpan={7} align="center">
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
            <Typography variant="subtitle2" color="text.secondary">
              Basic Details
            </Typography>
            <TextField
              label="Display Name (English)"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <TextField
              label="Display Name (Bangla)"
              value={form.nameBn}
              onChange={(e) => setForm({ ...form, nameBn: e.target.value })}
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
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2" color="text.secondary">
              Professional Summary
            </Typography>
            <TextField
              label="Department (English)"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
            />
            <TextField
              label="Department (Bangla)"
              value={form.departmentBn}
              onChange={(e) =>
                setForm({ ...form, departmentBn: e.target.value })
              }
            />
            <TextField
              label="Specialization (English)"
              value={form.specialization}
              onChange={(e) =>
                setForm({ ...form, specialization: e.target.value })
              }
            />
            <TextField
              label="Specialization (Bangla)"
              value={form.specializationBn}
              onChange={(e) =>
                setForm({ ...form, specializationBn: e.target.value })
              }
            />
            <TextField
              label="Visiting Hours (English)"
              value={form.visitingHours}
              onChange={(e) =>
                setForm({ ...form, visitingHours: e.target.value })
              }
            />
            <TextField
              label="Visiting Hours (Bangla)"
              value={form.visitingHoursBn}
              onChange={(e) =>
                setForm({ ...form, visitingHoursBn: e.target.value })
              }
            />
            <TextField
              label="Available From"
              value={form.availableFrom}
              onChange={(e) => setForm({ ...form, availableFrom: e.target.value })}
              helperText="Time range or start time (e.g., 10:00 AM)"
            />
            <TextField
              label="Available To (Branch)"
              value={form.availableTo}
              onChange={(e) => setForm({ ...form, availableTo: e.target.value })}
              helperText="Specify branch name(s), e.g., Kushtia Branch"
            />
            <TextField
              label="Weekdays"
              value={form.weekdays}
              onChange={(e) => setForm({ ...form, weekdays: e.target.value })}
              helperText="Comma separated days, e.g., Mon, Tue, Wed"
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
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2" color="text.secondary">
              Media & Description
            </Typography>
            <TextField
              label="Slider Picture URL"
              value={form.sliderPictureUrl}
              onChange={(e) =>
                setForm({ ...form, sliderPictureUrl: e.target.value })
              }
            />
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
              label="Directory Description (English)"
              multiline
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <TextField
              label="Directory Description (Bangla)"
              multiline
              rows={3}
              value={form.descriptionBn}
              onChange={(e) =>
                setForm({ ...form, descriptionBn: e.target.value })
              }
            />
            <TextField
              label="Bio (internal)"
              multiline
              rows={3}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2" color="text.secondary">
              Directory Lists
            </Typography>
            <TextField
              label="Qualifications (English)"
              multiline
              rows={3}
              value={form.qualificationsEn}
              onChange={(e) =>
                setForm({ ...form, qualificationsEn: e.target.value })
              }
              helperText="One entry per line"
            />
            <TextField
              label="Qualifications (Bangla)"
              multiline
              rows={3}
              value={form.qualificationsBn}
              onChange={(e) =>
                setForm({ ...form, qualificationsBn: e.target.value })
              }
              helperText="Bangla translation, one entry per line"
            />
            <TextField
              label="Workplaces (English)"
              multiline
              rows={3}
              value={form.workplacesEn}
              onChange={(e) =>
                setForm({ ...form, workplacesEn: e.target.value })
              }
              helperText="One entry per line"
            />
            <TextField
              label="Workplaces (Bangla)"
              multiline
              rows={3}
              value={form.workplacesBn}
              onChange={(e) =>
                setForm({ ...form, workplacesBn: e.target.value })
              }
            />
            <TextField
              label="Focus Areas (English)"
              multiline
              rows={3}
              value={form.focusAreasEn}
              onChange={(e) =>
                setForm({ ...form, focusAreasEn: e.target.value })
              }
              helperText="Optional; one entry per line"
            />
            <TextField
              label="Focus Areas (Bangla)"
              multiline
              rows={3}
              value={form.focusAreasBn}
              onChange={(e) =>
                setForm({ ...form, focusAreasBn: e.target.value })
              }
            />
            <TextField
              label="Search Keywords"
              multiline
              rows={2}
              value={form.keywords}
              onChange={(e) => setForm({ ...form, keywords: e.target.value })}
              helperText="Comma or newline separated"
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
