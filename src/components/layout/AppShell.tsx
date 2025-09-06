// src/components/layout/AppShell.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  IconButton,
  Button,
  Typography,
  Stack,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Tooltip,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { motion, LayoutGroup } from "framer-motion";
import TranslateIcon from "@mui/icons-material/Translate";
import { useI18n } from "@/lib/i18n";
import { getNavItems } from "./NavItems";

import Logo from "@/components/common/Logo";
import BackgroundFX from "./BackgroundFX";
import { useColorMode } from "@/lib/theme/ThemeRegistry";
import { useSession, signOut } from "next-auth/react";

export type AppRole = "admin" | "moderator" | "doctor" | "patient";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { mode, toggle } = useColorMode();
  const { data: session } = useSession();
  const { lang, setLang } = useI18n();
  const authed = Boolean(session);
  const role = (session?.user as any)?.role as AppRole | null;

  const dashboardHref =
    role === "admin" || role === "moderator"
      ? "/dashboard/admin"
      : role === "doctor"
        ? "/dashboard/doctor"
        : "/dashboard/patient";

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const toggleMobile = (open: boolean) => () => setMobileOpen(open);

  const logout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <>
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Background FX behind everything */}
      <BackgroundFX />

      {/* Top Navbar */}
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={(t) => ({
          zIndex: 10,
          borderBottom: `1px solid ${t.palette.divider}`,
          backgroundColor: alpha(t.palette.background.paper, 0.65),
          backdropFilter: "blur(10px)",
        })}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ gap: 1, minHeight: 64 }}>
            <Logo />
            {/* Desktop nav */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 0.5,
                flexGrow: 1,
              }}
            >
              <LayoutGroup id="topnav">
                {getNavItems(lang).map((it) => {
                  const active = pathname === it.href;
                  return (
                    <Box key={it.href} sx={{ position: "relative" }}>
                      <Button
                        component={Link}
                        href={it.href}
                        color={active ? "primary" : "inherit"}
                        sx={{ fontWeight: active ? 700 : 500 }}
                      >
                        {it.label}
                      </Button>
                      {active && (
                        <motion.div
                          layoutId="nav-underline"
                          style={{
                            height: 2,
                            position: "absolute",
                            left: 12,
                            right: 12,
                            bottom: -2,
                          }}
                        />
                      )}
                    </Box>
                  );
                })}
              </LayoutGroup>
            </Box>
            {/* Spacer on mobile so brand centers */}
            <Box sx={{ flexGrow: { xs: 1, md: 0 } }} />

            {/* Right actions (desktop) */}
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              <Tooltip
                title={mode === "dark" ? "Switch to light" : "Switch to dark"}
              >
                <IconButton
                  color="inherit"
                  onClick={toggle}
                  aria-label="Toggle color mode"
                >
                  {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip>
               {/* Language Switch Toogle Button */}
              <Tooltip title={lang === "en" ? "Switch to বাংলা" : "Switch to English"}>
              <IconButton
                color="inherit"
                onClick={() => setLang(lang === "en" ? "bn" : "en")}
                aria-label="Toggle language"
              >
                <TranslateIcon />
              </IconButton>
            </Tooltip>
              {authed ? (
                <>
                  <Tooltip title="Dashboard">
                    <IconButton
                      color="inherit"
                      component={Link}
                      href={dashboardHref}
                      aria-label="Dashboard"
                    >
                      <DashboardIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Logout">
                    <IconButton
                      color="inherit"
                      onClick={logout}
                      aria-label="Logout"
                    >
                      <LogoutIcon />
                    </IconButton>
                  </Tooltip>
                </>
              ) : (
                <>
                  <Button
                    component={Link}
                    href="/auth/portal/login"
                    color="inherit"
                    startIcon={<LoginIcon />}
                    sx={{ fontWeight: 600 }}
                  >
                    Portal
                  </Button>
                  <Button
                    component={Link}
                    href="/auth/admin/login"
                    variant="contained"
                    sx={{ fontWeight: 700 }}
                  >
                    Admin Login
                  </Button>
                </>
              )}
            </Stack>

            {/* Mobile menu button */}
            <IconButton
              color="inherit"
              onClick={toggleMobile(true)}
              aria-label="Open navigation"
              sx={{ display: { xs: "inline-flex", md: "none" }, ml: 1 }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile top drawer */}
      <Drawer
        anchor="top"
        open={mobileOpen}
        onClose={toggleMobile(false)}
        PaperProps={{
          sx: { borderBottomLeftRadius: 12, borderBottomRightRadius: 12 },
        }}
      >
        <Box
          role="presentation"
          onClick={toggleMobile(false)}
          onKeyDown={toggleMobile(false)}
        >
          <List>
            {getNavItems(lang).map((it) => {
              const active = pathname === it.href;
              return (
                <Box key={it.href} sx={{ position: "relative" }}>
                  <Button
                    component={Link}
                    href={it.href}
                    color={active ? "primary" : "inherit"}
                    sx={{ fontWeight: active ? 700 : 500 }}
                  >
                    {it.label}
                  </Button>
                  {active && (
                    <motion.div
                      layoutId="nav-underline"
                      style={{
                        height: 2,
                        position: "absolute",
                        left: 12,
                        right: 12,
                        bottom: -2,
                      }}
                    />
                  )}
                </Box>
              );
            })}
          </List>
          <Divider component="li" />
          <List>
            <ListItemButton
              onClick={() => {
                setLang(lang === "en" ? "bn" : "en");
              }}
            >
              <ListItemText
                primary={`Language: ${lang === "bn" ? "বাংলা" : "English"}`}
              />
            </ListItemButton>

            <ListItemButton onClick={toggle}>
              <ListItemText
                primary={mode === "dark" ? "Light mode" : "Dark mode"}
              />
            </ListItemButton>
            {authed ? (
              <>
                <ListItemButton component={Link} href={dashboardHref}>
                  <ListItemText primary="Dashboard" />
                </ListItemButton>
                <ListItemButton onClick={logout}>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </>
            ) : (
              <>
                <ListItemButton component={Link} href="/auth/portal/login">
                  <ListItemText primary="Portal Login" />
                </ListItemButton>
                <ListItemButton component={Link} href="/auth/admin/login">
                  <ListItemText primary="Admin Login" />
                </ListItemButton>
              </>
            )}
          </List>
        </Box>
      </Drawer>

      {/* Page content */}
      <Container
        maxWidth="lg"
        sx={{ flex: 1, py: 3, position: "relative", zIndex: 1 }}
      >
        {children}
      </Container>
    </Box>
    <Box
      component="footer"
      sx={{
        borderTop: (t) => `1px solid ${t.palette.divider}`,
        py: 3,
        mt: "auto",
        position: "relative",
        zIndex: 1,
      }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Amin Diagnostics • All rights reserved.
          </Typography>
        </Container>
      </Box>
    </>
  );
   
}
