"use client";
import * as React from "react";
import {
  Box,
  Paper,
  TextField,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

type TestPrice = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  priceCents: number;
  active: boolean;
  department?: string | null;
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

  React.useEffect(() => {
    void load("");
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Medical Test Prices
      </Typography>
      <TextField
        label="Search"
        size="small"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && load(q)}
        sx={{ mb: 2 }}
      />
      <Paper variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Department</TableCell>
              <TableCell align="right">Price (৳)</TableCell>
              <TableCell>Delivery</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((t) => (
              <TableRow key={t.id} hover>
                <TableCell>{t.code}</TableCell>
                <TableCell>{t.name}</TableCell>
                <TableCell>{t.department ?? "-"}</TableCell>
                <TableCell align="right">
                  {(t.priceCents / 100).toLocaleString()}
                </TableCell>
                <TableCell>{[t.deliveryType, t.deliveryHour ? `${t.deliveryHour}h` : null].filter(Boolean).join(" / ") || "-"}</TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
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
