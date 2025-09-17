"use client";
import {
  Box,
  Button,
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
import { alpha } from "@mui/material/styles";
import Image from "next/image";
import * as React from "react";

type TestPrice = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  priceCents: number;
  active: boolean;
  department?: string | null;
  examType?: string | null;
  shortName?: string | null;
  serialNo?: string | null;
  deliveryType?: string | null;
  deliveryHour?: number | null;
};

export default function MedicalTestPricesPage() {
  const [items, setItems] = React.useState<TestPrice[]>([]);
  const [q, setQ] = React.useState("");

  async function load(query = "") {
    const url = query
      ? `/api/test-prices?q=${encodeURIComponent(query)}`
      : "/api/test-prices";
    const res = await fetch(url, { cache: "no-store" });
    const data = (await res.json()) as TestPrice[];
    setItems(data);
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: initial load only
  React.useEffect(() => {
    void load("");
  }, []);

  function handleSearch() {
    void load(q.trim());
  }

  return (
    <Box>
      <Paper
        variant="outlined"
        sx={(theme) => ({
          mb: 3,
          px: { xs: 2, sm: 3 },
          py: { xs: 2, sm: 3 },
          borderRadius: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.background.paper, 0.95)})`,
        })}
      >
        <Stack spacing={2.5}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <Box
              sx={(theme) => ({
                p: 1.5,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.12),
                boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.18)}`,
                display: "inline-flex",
              })}
            >
              <Image
                src="/assets/icons/faqs/ic_payment.svg"
                alt="Pricing icon"
                width={64}
                height={64}
                priority
              />
            </Box>
            <Box>
              <Typography
                variant="overline"
                color="primary"
                sx={{ fontWeight: 800, letterSpacing: 2 }}
              >
                Transparent Pricing
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 900 }} gutterBottom>
                Medical Test Prices
              </Typography>
              <Typography color="text.secondary">
                Search our most up-to-date laboratory and imaging fees for Amin
                Diagnostic.
              </Typography>
            </Box>
          </Stack>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            sx={{ width: "100%" }}
          >
            <TextField
              label="Search"
              size="small"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                }
              }}
              sx={{ flex: 1, minWidth: 0 }}
            />
            <Button
              variant="contained"
              size="medium"
              onClick={handleSearch}
              sx={{
                alignSelf: { xs: "stretch", sm: "center" },
                px: { xs: 2, sm: 4 },
              }}
            >
              Search
            </Button>
          </Stack>
        </Stack>
      </Paper>
      <Paper variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Short Name</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Exam Type</TableCell>
              <TableCell align="right">Price (৳)</TableCell>
              <TableCell>Delivery</TableCell>
              <TableCell align="center">Active</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((t) => (
              <TableRow key={t.id} hover>
                <TableCell>{t.code}</TableCell>
                <TableCell>{t.name}</TableCell>
                <TableCell>{t.shortName ?? "-"}</TableCell>
                <TableCell>{t.department ?? "-"}</TableCell>
                <TableCell>{t.examType ?? "-"}</TableCell>
                <TableCell align="right">
                  {(t.priceCents / 100).toLocaleString()}
                </TableCell>
                <TableCell>
                  {[
                    t.deliveryType,
                    t.deliveryHour ? `${t.deliveryHour}h` : null,
                  ]
                    .filter(Boolean)
                    .join(" / ") || "-"}
                </TableCell>
                <TableCell align="center">{t.active ? "Yes" : "No"}</TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No results
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
