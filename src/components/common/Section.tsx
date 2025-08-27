import * as React from "react";
import { Paper } from "@mui/material";

type SectionProps = {
  children: React.ReactNode;
  /** Optional extra padding (default 3) */
  p?: number;
  /** Optional margin bottom (default 3) */
  mb?: number;
};

/** Uniform section wrapper used across pages to keep spacing consistent. */
export default function Section({ children, p = 3, mb = 3 }: SectionProps) {
  return (
    <Paper variant="outlined" sx={{ p, mb }}>
      {children}
    </Paper>
  );
}
