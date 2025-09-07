"use client";
import * as React from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

type Doctor = {
  id: string;
  specialization: string;
  bio: string | null;
  user: { name: string | null; phone: string | null; email: string | null };
  branch: { name: string | null; city: string | null } | null;
};

export default function FindDoctorPage() {
  const [all, setAll] = React.useState<Doctor[]>([]);
  const [q, setQ] = React.useState("");

  React.useEffect(() => {
    (async () => {
      const res = await fetch("/api/appointments/doctors", {
        cache: "no-store",
      });
      const data = (await res.json()) as Doctor[];
      setAll(data);
    })();
  }, []);

  const filtered = React.useMemo(() => {
    const n = q.toLowerCase().trim();
    if (!n) return all;
    return all.filter(
      (d) =>
        (d.user.name ?? "").toLowerCase().includes(n) ||
        (d.specialization ?? "").toLowerCase().includes(n) ||
        (d.branch?.name ?? "").toLowerCase().includes(n) ||
        (d.branch?.city ?? "").toLowerCase().includes(n),
    );
  }, [all, q]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Find a Doctor
      </Typography>
      <TextField
        label="Search"
        size="small"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Grid container gap={2}>
        {filtered.map((d) => (
          <Grid key={d.id} size={{ xs: 12, md: 6, lg: 4 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">{d.user.name ?? "Doctor"}</Typography>
                <Typography color="text.secondary">
                  {d.specialization}{" "}
                  {d.branch
                    ? `• ${d.branch.name}${d.branch.city ? `, ${d.branch.city}` : ""}`
                    : ""}
                </Typography>
                {d.user.phone && <Typography>Phone: {d.user.phone}</Typography>}
                {d.user.email && <Typography>Email: {d.user.email}</Typography>}
                {d.bio && <Typography sx={{ mt: 1 }}>{d.bio}</Typography>}
              </CardContent>
            </Card>
          </Grid>
        ))}

        {filtered.length === 0 && (
          <Grid size={12}>
            <Box
              component="img"
              src="/assets/amjad_hossain_pramanik.JPG"
              alt="Diagnostic Lab"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 1.5,
                mb: 1.5,
              }}
            />
            <Typography>No doctors found.</Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
