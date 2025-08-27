// src/lib/theme/ThemeRegistry.tsx
"use client";

import { CssBaseline, ThemeProvider } from "@mui/material";
import * as React from "react";
import { getTheme, Mode } from "./theme";

export const ColorModeContext = React.createContext<{
  mode: Mode;
  toggle: () => void;
  set: (m: Mode) => void;
}>({ mode: "light", toggle: () => {}, set: () => {} });

export function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = React.useState<Mode>("light");

  // initial: restore from localStorage or system preference
  React.useEffect(() => {
    const stored =
      typeof window !== "undefined"
        ? (localStorage.getItem("mui-mode") as Mode | null)
        : null;
    if (stored === "light" || stored === "dark") setMode(stored);
    else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    )
      setMode("dark");
  }, []);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("mui-mode", mode);
      document.documentElement.setAttribute("data-color-scheme", mode);
    }
  }, [mode]);

  const ctx = React.useMemo(
    () => ({
      mode,
      toggle: () => setMode((m) => (m === "light" ? "dark" : "light")),
      set: (m: Mode) => setMode(m),
    }),
    [mode],
  );

  const theme = React.useMemo(() => getTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={ctx}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export function useColorMode() {
  return React.useContext(ColorModeContext);
}
