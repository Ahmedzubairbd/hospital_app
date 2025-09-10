"use client";
import * as React from "react";
import { Alert, Box, Button, Card, CardActions, CardContent, CardMedia, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";

type SliderItem = { imageUrl: string; title?: string; link?: string };

export default function CmsSlidersAdmin() {
  const [items, setItems] = React.useState<SliderItem[]>([]);
  const [open, setOpen] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [link, setLink] = React.useState("");
  const [err, setErr] = React.useState<string | null>(null);

  async function load() {
    const r = await fetch("/api/cms/pages?" + new URLSearchParams({ q: "home-sliders" }), { cache: "no-store" });
    const j = await r.json();
    const page = Array.isArray(j) ? j.find((p: any) => p.slug === "home-sliders") : null;
    if (page) {
      try { setItems(JSON.parse(page.body)); } catch { setItems([]); }
    }
  }
  React.useEffect(() => { void load(); }, []);

  async function saveAll() {
    setErr(null);
    // Upsert page
    // Try get or create
    let page = null;
    {
      const r = await fetch("/api/cms/pages?" + new URLSearchParams({ q: "home-sliders" }), { cache: "no-store" });
      const j = await r.json();
      page = Array.isArray(j) ? j.find((p: any) => p.slug === "home-sliders") : null;
    }
    const payload = { slug: "home-sliders", title: "Home Sliders", body: JSON.stringify(items), excerpt: "Slider items", published: true };
    if (!page) {
      const r = await fetch("/api/cms/pages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!r.ok) { const j = await r.json(); return setErr(j.error || "failed"); }
    } else {
      const r = await fetch(`/api/cms/pages/${page.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ body: JSON.stringify(items) }) });
      if (!r.ok) { const j = await r.json(); return setErr(j.error || "failed"); }
    }
  }

  function addItem() {
    setOpen(true);
  }
  function confirmAdd() {
    const newItem: SliderItem = { imageUrl, title: title || undefined, link: link || undefined };
    setItems((prev) => [...prev, newItem]);
    setOpen(false); setImageUrl(""); setTitle(""); setLink("");
  }
  function remove(idx: number) { setItems((prev) => prev.filter((_, i) => i !== idx)); }

  return (
    <Box sx={{ p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h4">Home Sliders</Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={addItem}>Add</Button>
          <Button variant="contained" onClick={saveAll}>Save</Button>
        </Stack>
      </Stack>
      {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}
      <Grid container spacing={2}>
        {items.map((it, idx) => (
          <Grid key={idx} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              {it.imageUrl && <CardMedia component="img" height="160" image={it.imageUrl} alt={it.title || `Slide ${idx+1}`} />}
              <CardContent>
                <Typography variant="subtitle1">{it.title || 'Untitled'}</Typography>
                <Typography variant="body2" color="text.secondary">{it.link || ''}</Typography>
              </CardContent>
              <CardActions>
                <Button color="error" onClick={() => remove(idx)}>Remove</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>New Slide</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1, minWidth: 420 }}>
            <TextField label="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
            <TextField label="Title (optional)" value={title} onChange={(e) => setTitle(e.target.value)} />
            <TextField label="Link (optional)" value={link} onChange={(e) => setLink(e.target.value)} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={confirmAdd}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
