// src/components/layout/BackgroundFX.tsx
"use client";

import * as React from "react";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";
import { motion, useReducedMotion } from "framer-motion";

/**
 * GPU-friendly backdrop: animated gradient blobs + soft grid.
 * Respects prefers-reduced-motion.
 */
export default function BackgroundFX() {
  const theme = useTheme();
  const reduce = useReducedMotion();

  const blob = (delay = 0) => (
    <motion.div
      initial={{ x: 0, y: 0, scale: 1, opacity: 0.7 }}
      animate={
        reduce
          ? { opacity: 0.6 }
          : {
              x: [0, 20, -20, 0],
              y: [0, -25, 30, 0],
              scale: [1, 1.08, 0.96, 1],
              opacity: [0.6, 0.75, 0.6, 0.6],
            }
      }
      transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay }}
      style={{
        position: "absolute",
        width: 420,
        height: 420,
        borderRadius: "50%",
        filter: "blur(60px)",
        opacity: 0.5,
        willChange: "transform, opacity",
        background:
          theme.palette.mode === "dark"
            ? "radial-gradient(closest-side, rgba(5, 94, 82, 0.81), rgba(0,0,0,0.4))"
            : "radial-gradient(closest-side, rgba(21, 128, 115, 0.81), rgba(27, 255, 202, 0.37))",
      }}
    />
  );

  return (
    <Box
      aria-hidden
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        "&::before": {
          // subtle grid
          content: '""',
          position: "absolute",
          inset: 0,
          backgroundImage:
            theme.palette.mode === "dark"
              ? "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)"
              : "linear-gradient(rgba(3, 59, 0, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px, 48px 48px",
        },
      }}
    >
      {/* blobs container */}
      <Box
        sx={{
          position: "absolute",
          inset: "-10% -10% -10% -10%",
          transform: "translateZ(0)", // force composite layer
        }}
      >
        <Box sx={{ position: "absolute", top: "10%", left: "8%" }}>
          {blob(0)}
        </Box>
        <Box sx={{ position: "absolute", bottom: "10%", right: "12%" }}>
          {blob(4)}
        </Box>
        <Box sx={{ position: "absolute", top: "40%", right: "30%" }}>
          {blob(8)}
        </Box>
      </Box>
    </Box>
  );
}
