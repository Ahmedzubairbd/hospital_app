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
  Switch,
  FormControlLabel,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

type Price = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  priceCents: number;
  active: boolean;
  examType?: string | null;
  department?: string | null;
  serialNo?: string | null;
  shortName?: string | null;
  deliveryType?: string | null;
  deliveryHour?: number | null;
};

type FormState = Omit<Price, "id">;

const emptyForm: FormState = {
  code: "",
  name: "",
  description: "",
  priceCents: 0,
  active: true,
  examType: "",
  department: "",
  serialNo: "",
  shortName: "",
  deliveryType: "",
  deliveryHour: 0,
};

export default function AdminTestPricesPage() {
  const [rows, setRows] = React.useState<Price[]>([]);
  const [q, setQ] = React.useState("");
  const [includeInactive, setIncludeInactive] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Price | null>(null);
  const [form, setForm] = React.useState<FormState>(emptyForm);
  const [err, setErr] = React.useState<string | null>(null);
  const [msg, setMsg] = React.useState<string | null>(null);
  const [importing, setImporting] = React.useState(false);

  async function load() {
    const url = `/api/test-prices?${new URLSearchParams({
      q: q.trim(),
      includeInactive: includeInactive ? "1" : "0",
    })}`;
    const res = await fetch(url, { cache: "no-store" });
    const data = (await res.json()) as Price[];
    setRows(data);
  }

  React.useEffect(() => {
    void load();
  }, []);
  React.useEffect(() => {
    void load();
  }, [includeInactive]); // toggle refresh

  function startCreate() {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  }
  function startEdit(p: Price) {
    setEditing(p);
    setForm({
      code: p.code,
      name: p.name,
      description: p.description,
      priceCents: p.priceCents,
      active: p.active,
      examType: p.examType ?? "",
      department: p.department ?? "",
      serialNo: p.serialNo ?? "",
      shortName: p.shortName ?? "",
      deliveryType: p.deliveryType ?? "",
      deliveryHour: (p.deliveryHour ?? 0) as any,
    });
    setOpen(true);
  }

  async function save() {
    setErr(null);
    setMsg(null);
    const body = { ...form, priceCents: Number(form.priceCents), deliveryHour: form.deliveryHour ? Number(form.deliveryHour) : null } as any;
    const headers = { "Content-Type": "application/json" };

    let res: Response;
    if (editing) {
      res = await fetch(`/api/test-prices/${editing.id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(body),
      });
    } else {
      res = await fetch("/api/test-prices", {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
    }

    const j = await res.json();
    if (!res.ok) {
      setErr(j.error || "failed");
      return;
    }

    setOpen(false);
    setMsg(editing ? "Updated" : "Created");
    await load();
  }

  async function importCsv() {
    setErr(null);
    setMsg(null);
    setImporting(true);
    try {
      const r = await fetch("/api/test-prices/import", { method: "POST" });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "import failed");
      setMsg(`Imported: ${j.imported}, Updated: ${j.updated}`);
      await load();
    } catch (e: unknown) {
      const m = e instanceof Error ? e.message : "import failed";
      setErr(m);
    } finally {
      setImporting(false);
    }
  }

  async function softDelete(p: Price) {
    setErr(null);
    setMsg(null);
    const r = await fetch(`/api/test-prices/${p.id}`, { method: "DELETE" });
    const j = await r.json();
    if (!r.ok) {
      setErr(j.error || "failed");
      return;
    }
    setMsg("Deactivated");
    await load();
  }

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h4" gutterBottom>
        Manage Test Prices
      </Typography>

      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <TextField
          size="small"
          label="Search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
        />
        <Button variant="outlined" onClick={load}>
          Search
        </Button>
        <FormControlLabel
          control={
            <Switch
              checked={includeInactive}
              onChange={(e) => setIncludeInactive(e.target.checked)}
            />
          }
          label="Show inactive"
        />
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="outlined" onClick={importCsv} disabled={importing}>
          {importing ? "Importing..." : "Import CSV"}
        </Button>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={startCreate}
        >
          Add Price
        </Button>
      </Stack>

      {err && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {err}
        </Alert>
      )}
      {msg && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {msg}
        </Alert>
      )}

      <Paper variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Short Name</TableCell>
              <TableCell align="right">Price (৳)</TableCell>
              <TableCell align="center">Active</TableCell>
              <TableCell>Delivery</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id} hover>
                <TableCell>{r.code}</TableCell>
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.department ?? "-"}</TableCell>
                <TableCell>{r.shortName ?? "-"}</TableCell>
                <TableCell align="right">
                  {(r.priceCents / 100).toLocaleString()}
                </TableCell>
                <TableCell align="center">{r.active ? "Yes" : "No"}</TableCell>
                <TableCell>{[r.deliveryType, r.deliveryHour ? `${r.deliveryHour}h` : null].filter(Boolean).join(" / ") || "-"}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => startEdit(r)} aria-label="Edit">
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => softDelete(r)}
                    aria-label="Deactivate"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editing ? "Edit price" : "Add price"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1, minWidth: 420 }}>
            <TextField
              label="Code"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
            />
            <TextField
              label="Short Name"
              value={form.shortName ?? ""}
              onChange={(e) => setForm({ ...form, shortName: e.target.value })}
            />
            <TextField
              label="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <TextField
              label="Department"
              value={form.department ?? ""}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
            />
            <TextField label="Exam Type" value={form.examType ?? ""} onChange={(e) => setForm({ ...form, examType: e.target.value })} />
            <TextField label="Serial No" value={form.serialNo ?? ""} onChange={(e) => setForm({ ...form, serialNo: e.target.value })} />
            <TextField
              label="Price (৳)"
              type="number"
              value={form.priceCents}
              onChange={(e) =>
                setForm({ ...form, priceCents: Number(e.target.value) })
              }
              helperText="Stored as cents (৳ -> ×100 handled by you)"
            />
            <TextField label="Delivery Type" value={form.deliveryType ?? ""} onChange={(e) => setForm({ ...form, deliveryType: e.target.value })} />
            <TextField label="Delivery Hour" type="number" value={form.deliveryHour ?? 0} onChange={(e) => setForm({ ...form, deliveryHour: Number(e.target.value) })} />
            <FormControlLabel
              control={
                <Switch
                  checked={form.active}
                  onChange={(e) =>
                    setForm({ ...form, active: e.target.checked })
                  }
                />
              }
              label="Active"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={save}>
            {editing ? "Save" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
