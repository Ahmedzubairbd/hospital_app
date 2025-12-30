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

export default function MediaLibraryPage() {
  const [items, setItems] = React.useState<Asset[]>([]);
  const [err, setErr] = React.useState<string | null>(null);
  const [file, setFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [typePolicy, setTypePolicy] = React.useState<"images" | "images-pdf">(
    "images-pdf",
  );
  const [maxMB, setMaxMB] = React.useState<number>(20);
  const [kindFilter, setKindFilter] = React.useState<"all" | "images" | "pdfs">(
    "all",
  );
  const [minKB, setMinKB] = React.useState<number | "">("");
  const [maxKB, setMaxKB] = React.useState<number | "">("");

  async function load() {
    setErr(null);
    const r = await fetch("/api/files", { cache: "no-store" });
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
      await upload(`uploads/${Date.now()}-${safeName}`, file, {
        access: "public",
        handleUploadUrl: "/api/files",
        onUploadProgress: (e) => setProgress(e.percentage),
        clientPayload: JSON.stringify({ allow: typePolicy, maxMB }),
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
    const r = await fetch(`/api/files/${id}`, { method: "DELETE" });
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      setErr(j.error || "delete failed");
    } else {
      await load();
    }
  }

  const filtered = React.useMemo(() => {
    return items.filter((it) => {
      const t = (it.contentType || "").toLowerCase();
      if (kindFilter === "images" && !t.startsWith("image/")) return false;
      if (kindFilter === "pdfs" && t !== "application/pdf") return false;
      const kb = ((it.sizeBytes || 0) / 1024) | 0;
      if (minKB !== "" && kb < minKB) return false;
      if (maxKB !== "" && kb > maxKB) return false;
      return true;
    });
  }, [items, kindFilter, minKB, maxKB]);

  return (
    <Box sx={{ p: 2 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h4">Media Library</Typography>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ flexWrap: "wrap", rowGap: 1 }}
        >
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            accept={
              typePolicy === "images" ? "image/*" : "image/*,application/pdf"
            }
          />
          <Select
            size="small"
            value={typePolicy}
            onChange={(e) => setTypePolicy(e.target.value as any)}
          >
            <MenuItem value="images">Images only</MenuItem>
            <MenuItem value="images-pdf">Images + PDF</MenuItem>
          </Select>
          <TextField
            size="small"
            type="number"
            label="Max MB"
            value={maxMB}
            onChange={(e) =>
              setMaxMB(Math.max(1, Math.min(100, Number(e.target.value) || 1)))
            }
            sx={{ width: 110 }}
          />
          <Button
            disabled={!file || uploading}
            onClick={doUpload}
            variant="contained"
          >
            {uploading ? `Uploading ${progress | 0}%` : "Upload"}
          </Button>
          <Button href="/dashboard/admin" variant="outlined">
            Back
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
        <Select
          size="small"
          value={kindFilter}
          onChange={(e) => setKindFilter(e.target.value as any)}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="images">Images</MenuItem>
          <MenuItem value="pdfs">PDFs</MenuItem>
        </Select>
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
            setKindFilter("all");
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
                  <Image
                    src={it.url.startsWith("//") ? `https:${it.url}` : it.url}
                    alt={it.id}
                    fill
                    sizes="(max-width: 600px) 100vw, 33vw"
                    quality={80}
                    style={{ objectFit: "cover" }}
                    unoptimized={it.url.startsWith("data:")}
                  />
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
