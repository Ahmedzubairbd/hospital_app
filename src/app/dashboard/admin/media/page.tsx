"use client";
import * as React from "react";
import { Alert, Box, Button, Card, CardActionArea, CardContent, CardMedia, Stack, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

type Asset = { id: string; url: string; contentType?: string | null; sizeBytes?: number | null };

export default function MediaLibraryPage() {
  const [items, setItems] = React.useState<Asset[]>([]);
  const [err, setErr] = React.useState<string | null>(null);

  async function load() {
    setErr(null);
    const r = await fetch("/api/files", { cache: "no-store" });
    const j = await r.json();
    if (!r.ok) return setErr(j.error || "failed");
    setItems(j);
  }
  React.useEffect(() => { void load(); }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h4">Media Library</Typography>
        <Button href="/dashboard/admin" variant="outlined">Back</Button>
      </Stack>
      {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}
      <Grid container spacing={2}>
        {items.map((it) => (
          <Grid key={it.id} xs={12} sm={6} md={4} lg={3}>
            <Card variant="outlined">
              <CardActionArea href={it.url} target="_blank">
                <CardMedia component="img" height="160" image={it.url} alt={it.id} />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">{it.contentType || 'file'} — {(it.sizeBytes || 0)/1024|0} KB</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
