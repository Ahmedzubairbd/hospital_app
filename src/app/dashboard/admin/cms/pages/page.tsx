"use client";
import * as React from "react";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, Stack, Switch, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

type Page = { id: string; slug: string; title: string; excerpt?: string | null; published: boolean };

export default function CmsPagesAdmin() {
  const [rows, setRows] = React.useState<Page[]>([]);
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Page | null>(null);
  const [slug, setSlug] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [excerpt, setExcerpt] = React.useState("");
  const [err, setErr] = React.useState<string | null>(null);

  async function load() {
    const r = await fetch("/api/cms/pages", { cache: "no-store" });
    const j = await r.json();
    setRows(Array.isArray(j) ? j : []);
  }
  React.useEffect(() => { void load(); }, []);

  function startCreate() {
    setEditing(null);
    setSlug(""); setTitle(""); setBody(""); setExcerpt("");
    setOpen(true);
  }
  function startEdit(p: Page) {
    setEditing(p);
    setSlug(p.slug); setTitle(p.title); setBody(""); setExcerpt(p.excerpt ?? "");
    setOpen(true);
  }
  async function togglePublish(p: Page) {
    const r = await fetch(`/api/cms/pages/${p.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ published: !p.published }) });
    if (r.ok) void load();
  }
  async function save() {
    setErr(null);
    const payload: any = editing ? { slug, title, body: body || undefined, excerpt } : { slug, title, body, excerpt };
    const url = editing ? `/api/cms/pages/${editing.id}` : "/api/cms/pages";
    const method = editing ? "PATCH" : "POST";
    const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const j = await r.json();
    if (!r.ok) return setErr(j.error || "failed");
    setOpen(false);
    await load();
  }

  return (
    <Box sx={{ p: 1 }}>
      <Stack direction="row" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>CMS Pages</Typography>
        <Button startIcon={<AddIcon />} variant="contained" onClick={startCreate}>New Page</Button>
      </Stack>
      <Paper variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Slug</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Published</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.slug}</TableCell>
                <TableCell>{r.title}</TableCell>
                <TableCell><Switch checked={r.published} onChange={() => togglePublish(r)} /></TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => startEdit(r)}><EditIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editing ? "Edit Page" : "Create Page"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField label="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} helperText="example: about, privacy-policy" />
            <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            {!editing && (
              <TextField label="Body (HTML/Markdown)" value={body} onChange={(e) => setBody(e.target.value)} multiline rows={8} />
            )}
            <TextField label="Excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
            {err && <Alert severity="error">{err}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={save}>{editing ? "Save" : "Create"}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
