"use client";
import * as React from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Image from "next/image";
import { upload } from "@vercel/blob/client";
import DeleteIcon from "@mui/icons-material/Delete";

type Asset = {
  id: string;
  url: string;
  contentType?: string | null;
  sizeBytes?: number | null;
};

export default function PatientFilesPage() {
  const [items, setItems] = React.useState<Asset[]>([]);
  const [err, setErr] = React.useState<string | null>(null);
  const [file, setFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [minKB, setMinKB] = React.useState<number | "">("");
  const [maxKB, setMaxKB] = React.useState<number | "">("");

  async function load() {
    setErr(null);
    const r = await fetch("/api/patient/files", { cache: "no-store" });
    const j = await r.json();
    if (!r.ok) return setErr(j.error || "failed");
    setItems(j);
  }
  React.useEffect(() => {
    void load();
  }, []);

  async function doUpload() {
    if (!file) return;
    setErr(null);
    setUploading(true);
    setProgress(0);
    try {
      const safeName = file.name.replace(/\s+/g, "_");
      await upload(`user/${Date.now()}-${safeName}`, file, {
        access: "public",
        handleUploadUrl: "/api/patient/files",
        onUploadProgress: (e) => setProgress(e.percentage),
        clientPayload: JSON.stringify({ allow: "images" }),
      });
      setFile(null);
      await load();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "upload failed";
      setErr(msg);
    } finally {
      setUploading(false);
    }
  }

  async function remove(id: string) {
    setErr(null);
    const r = await fetch(`/api/patient/files/${id}`, { method: "DELETE" });
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      setErr(j.error || "delete failed");
    } else {
      await load();
    }
  }

  const filtered = React.useMemo(() => {
    return items.filter((it) => {
      const kb = ((it.sizeBytes || 0) / 1024) | 0;
      if (minKB !== "" && kb < minKB) return false;
      if (maxKB !== "" && kb > maxKB) return false;
      return true;
    });
  }, [items, minKB, maxKB]);

  return (
    <Box sx={{ p: 2 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h4">My Files</Typography>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ flexWrap: "wrap", rowGap: 1 }}
        >
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            accept="image/*"
          />
          <Button
            disabled={!file || uploading}
            onClick={doUpload}
            variant="contained"
          >
            {uploading ? `Uploading ${progress | 0}%` : "Upload"}
          </Button>
        </Stack>
      </Stack>
      {err && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {err}
        </Alert>
      )}
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{ mb: 1, flexWrap: "wrap", rowGap: 1 }}
      >
        <Typography variant="body2">Filter:</Typography>
        <TextField
          size="small"
          type="number"
          label="Min KB"
          value={minKB}
          onChange={(e) =>
            setMinKB(e.target.value === "" ? "" : Number(e.target.value))
          }
          sx={{ width: 120 }}
        />
        <TextField
          size="small"
          type="number"
          label="Max KB"
          value={maxKB}
          onChange={(e) =>
            setMaxKB(e.target.value === "" ? "" : Number(e.target.value))
          }
          sx={{ width: 120 }}
        />
        <Button
          size="small"
          onClick={() => {
            setMinKB("");
            setMaxKB("");
          }}
        >
          Reset
        </Button>
      </Stack>
      <Grid container spacing={2}>
        {filtered.map((it) => (
          <Grid key={it.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Card variant="outlined">
              <CardActionArea href={it.url} target="_blank">
                <Box sx={{ position: "relative", height: 160 }}>
                  {/^(https?:)?\/\//.test(it.url) ? (
                    <Image
                      src={it.url}
                      alt={it.id}
                      fill
                      sizes="(max-width: 600px) 100vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <img
                      src={it.url}
                      alt={it.id}
                      height={160}
                      style={{ width: "100%", objectFit: "cover" }}
                    />
                  )}
                </Box>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {it.contentType || "file"} —{" "}
                    {((it.sizeBytes || 0) / 1024) | 0} KB
                  </Typography>
                </CardContent>
              </CardActionArea>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  pr: 1,
                  pb: 1,
                }}
              >
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => remove(it.id)}
                  aria-label="Delete"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
