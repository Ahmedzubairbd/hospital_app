"use client";
import {
  Alert,
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
  Autocomplete,
  TableContainer,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import Image from "next/image";
import * as React from "react";

type TestPrice = {
  // id: string;
  name: string;
  // description: string | null;
  department?: string | null;
  priceCents: number;
  // serialNo?: string | null;
};

export default function MedicalTestPricesPage() {
  const [items, setItems] = React.useState<TestPrice[]>([]);
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const abortRef = React.useRef<AbortController | null>(null);

  const handleSearchHaystack = (item: TestPrice) => {
    return [item.name, item.department ?? "", item.priceCents.toString()].join(
      " "
    );
  };

  const load = React.useCallback(async (query = "") => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(null);

    const url = query
      ? `/api/test-prices?q=${encodeURIComponent(query)}`
      : "/api/test-prices";

    try {
      const res = await fetch(url, {
        cache: "no-store",
        signal: controller.signal,
      });
      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`);
      }
      const data = (await res.json()) as TestPrice[];
      if (!controller.signal.aborted) {
        setItems(Array.isArray(data) ? data : []);
      }
    } catch (_error) {
      if (controller.signal.aborted) {
        return;
      }
      setItems([]);
      setError("Unable to load pricing details. Please try again.");
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  React.useEffect(() => {
    void load("");
    return () => abortRef.current?.abort();
  }, [load]);

  function handleSearch() {
    void load(query);
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
          position: "relative",
          overflow: "hidden",
          borderColor: alpha(theme.palette.primary.main, 0.8),
          backgroundColor: alpha(theme.palette.background.paper, 0.7),
          backgroundImage: `linear-gradient(135deg, ${alpha(
            theme.palette.primary.main,
            0.18
          )} 0%, ${alpha(theme.palette.background.paper, 0.65)} 45%, ${alpha(
            theme.palette.background.default,
            0.92
          )} 100%), url("/assets/clinical.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "soft-light",
          boxShadow: `0 20px 42px ${alpha(theme.palette.primary.main, 0.12)}`,
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            background: `linear-gradient(180deg, ${alpha(
              theme.palette.background.default,
              0.08
            )} 0%, ${alpha(theme.palette.background.default, 0.55)} 60%, ${
              theme.palette.background.default
            } 100%)`,
            zIndex: 0,
          },
        })}
      >
        <Box sx={{ position: "relative", zIndex: 1 }}>
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
                  boxShadow: `0 12px 24px ${alpha(
                    theme.palette.primary.main,
                    0.18
                  )}`,
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
                  Search our most up-to-date laboratory and imaging fees for
                  Amin Diagnostic.
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
                value={query}
                onChange={(event) => setQuery(event.target.value)}
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
                onClick={() => handleSearch()}
                disabled={loading}
                sx={{
                  alignSelf: { xs: "stretch", sm: "center" },
                  px: { xs: 2, sm: 4 },
                }}
              >
                Search
              </Button>
            </Stack>
            {error && <Alert severity="error">{error}</Alert>}
          </Stack>
        </Box>
      </Paper>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ width: "100%" }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>NAME</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>DEPARTMENT</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  PRICE (৳)
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items
                .filter((t) => handleSearchHaystack(t).includes(query))
                .map((t) => (
                  <TableRow
                    key={`${t.name}-${t.department}-${t.priceCents}`}
                    hover
                  >
                    <TableCell>{t.name ?? ""}</TableCell>
                    <TableCell>{t.department ?? ""}</TableCell>
                    <TableCell align="right">
                      {(t.priceCents / 100).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              {loading && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    align="center"
                    aria-label="loading"
                    sx={{ fontWeight: 700, textTransform: "uppercase" }}
                  >
                    Loading…
                  </TableCell>
                </TableRow>
              )}
              {!loading && items.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    align="center"
                    aria-label="no results"
                    sx={{ fontWeight: 700, textTransform: "uppercase" }}
                  >
                    No results
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
