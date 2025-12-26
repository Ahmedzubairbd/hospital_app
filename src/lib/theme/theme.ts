// src/lib/theme/theme.ts

import type { ThemeOptions } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";

export type Mode = "light" | "dark";

export function getTheme(mode: Mode) {
  const isDark = mode === "dark";

  const common: ThemeOptions = {
    shape: { borderRadius: 14 },
    typography: {
      fontFamily:
        'var(--font-inter), Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"',
      h1: { fontWeight: 800, letterSpacing: -0.5 },
      h2: { fontWeight: 800, letterSpacing: -0.3 },
      h3: { fontWeight: 700 },
      button: { textTransform: "none", fontWeight: 700 },
    },
    components: {
      MuiPaper: { defaultProps: { elevation: 0 } },
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 999, paddingInline: 18 },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backdropFilter: "blur(10px)",
          },
        },
      },
    },
  };

  return createTheme({
    ...common,
    palette: {
      mode,
      primary: { main: isDark ? "#00BFA5" : "#00695c" }, // medical teal
      secondary: { main: isDark ? "#6CA7FF" : "#0066cc" },
      background: {
        default: isDark ? "#0b1115" : "#f7fafc",
        paper: isDark ? "#11181c" : "#ffffff",
      },
      divider: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
    },
  });
}
