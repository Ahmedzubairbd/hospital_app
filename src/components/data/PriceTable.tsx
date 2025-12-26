"use client";

import * as React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableSortLabel,
  Box,
  Typography,
} from "@mui/material";

export type PriceRow = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  priceCents: number;
  active: boolean;
};

type Order = "asc" | "desc";

type PriceTableProps = {
  rows: PriceRow[];
  currencySymbol?: string; // defaults to BDT "৳"
  locale?: string; // e.g. "en-US" for US formatting
  fractionDigits?: number; // e.g. 2 for USD, 0 for BDT
  onRowClick?: (row: PriceRow) => void;
  dense?: boolean;
};

/**
 * Reusable price table with simple client-side sorting.
 * Tip: keep rows <= ~500 for client rendering; paginate server-side if larger.
 */
export default function PriceTable({
  rows,
  currencySymbol = "৳",
  locale,
  fractionDigits = 0,
  onRowClick,
  dense = false,
}: PriceTableProps) {
  const [orderBy, setOrderBy] = React.useState<keyof PriceRow>("name");
  const [order, setOrder] = React.useState<Order>("asc");

  const handleSort = (key: keyof PriceRow) => () => {
    if (orderBy === key) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setOrderBy(key);
      setOrder("asc");
    }
  };

  const sorted = React.useMemo(() => {
    const arr = [...rows];
    arr.sort((a, b) => {
      const va = a[orderBy];
      const vb = b[orderBy];
      if (typeof va === "number" && typeof vb === "number") {
        return order === "asc" ? va - vb : vb - va;
      }
      const sa = String(va ?? "").toLowerCase();
      const sb = String(vb ?? "").toLowerCase();
      if (sa < sb) return order === "asc" ? -1 : 1;
      if (sa > sb) return order === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [rows, orderBy, order]);

  return (
    <Table size={dense ? "small" : "medium"}>
      <TableHead>
        <TableRow>
          <TableCell sortDirection={orderBy === "code" ? order : false}>
            <TableSortLabel
              active={orderBy === "code"}
              direction={orderBy === "code" ? order : "asc"}
              onClick={handleSort("code")}
            >
              Code
            </TableSortLabel>
          </TableCell>
          <TableCell sortDirection={orderBy === "name" ? order : false}>
            <TableSortLabel
              active={orderBy === "name"}
              direction={orderBy === "name" ? order : "asc"}
              onClick={handleSort("name")}
            >
              Name
            </TableSortLabel>
          </TableCell>
          <TableCell>Description</TableCell>
          <TableCell
            align="right"
            sortDirection={orderBy === "priceCents" ? order : false}
          >
            <TableSortLabel
              active={orderBy === "priceCents"}
              direction={orderBy === "priceCents" ? order : "asc"}
              onClick={handleSort("priceCents")}
            >
              Price ({currencySymbol})
            </TableSortLabel>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sorted.map((r) => {
          const priceNumber = r.priceCents / 100;
          const price = locale
            ? priceNumber.toLocaleString(locale, {
                minimumFractionDigits: fractionDigits,
                maximumFractionDigits: fractionDigits,
              })
            : priceNumber.toLocaleString(undefined, {
                minimumFractionDigits: fractionDigits,
                maximumFractionDigits: fractionDigits,
              });
          const rowEl = (
            <>
              <TableCell>{r.code}</TableCell>
              <TableCell>{r.name}</TableCell>
              <TableCell>{r.description ?? "-"}</TableCell>
              <TableCell align="right">
                {currencySymbol}
                {price}
              </TableCell>
            </>
          );
          return (
            <TableRow
              key={r.id}
              hover
              sx={{ cursor: onRowClick ? "pointer" : "default" }}
              onClick={onRowClick ? () => onRowClick(r) : undefined}
            >
              {rowEl}
            </TableRow>
          );
        })}
        {rows.length === 0 && (
          <TableRow>
            <TableCell colSpan={4} align="center">
              <Box sx={{ py: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  No results
                </Typography>
              </Box>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
