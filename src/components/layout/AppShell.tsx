"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  ListItemIcon,
  ListSubheader,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import { NavBar } from "@/components/layout/tubelight-navbar";
import LoginIcon from "@mui/icons-material/Login";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import TranslateIcon from "@mui/icons-material/Translate";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { motion, LayoutGroup } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { getNavItems } from "./NavItems";
import Logo from "@/components/common/Logo";
import BackgroundFX from "./BackgroundFX";
import { useColorMode } from "@/lib/theme/ThemeRegistry";
import { signOut } from "next-auth/react";
import SupportChatWidget from "@/components/chat/SupportChatWidget";

// import MapComponent from "@/components/MapComponent";

const FOOTER_PRIORITY_TITLES = [
  "FAQs - সাধারণ প্রশ্নোত্তর",
  "হেলথ ব্লগ এবং টিপস",
  "সহযোগী সেবা",
  "হোম/অফিস স্যাম্পল কালেকশন",
  "আমিন ডায়াগনস্টিক: কুষ্টিয়ার প্রাণকেন্দ্রে নির্ভরযোগ্য স্বাস্থ্যসেবা কম খরচে, সেরা সেবা",
  "আমিন ডায়াগনস্টিক এন্ড মেডিকেল সার্ভিসেস-এ আপনাকে স্বাগতম।",
] as const;

const FOOTER_EXCLUDED_TITLES = [
  "Book An Appointment",
  "আমাদের সেবাসমূহ",
  "ইমেজিং ও বিশেষ পরীক্ষা",
] as const;

const AMIN_DIAGNOSTIC_LOCATION = {
  lat: 23.9037,
  lng: 89.122,
};

type FooterPage = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
};

const normalizeTitle = (value: string) => value.trim().toLowerCase();

const toCmsHref = (slug: string) => {
  const normalized = slug
    .trim()
    .replace(/^[\\/]+/, "")
    .replace(/[\\/]+$/, "");
  return normalized ? `/${normalized}` : "/";
};

const footerWeight = (title: string) => {
  const lower = title.trim().toLowerCase();
  const idx = FOOTER_PRIORITY_TITLES.findIndex((priority) =>
    lower.includes(priority.toLowerCase())
  );
  return idx === -1 ? FOOTER_PRIORITY_TITLES.length : idx;
};

export default function AppShell({
  children,
  cmsPages,
}: {
  children: React.ReactNode;
  cmsPages: FooterPage[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { mode, toggle } = useColorMode();
  const { lang, setLang } = useI18n();

  const isDashboard = pathname.startsWith("/dashboard");

  const [currentUser, setCurrentUser] = React.useState<{
    name: string;
    role: string;
  } | null>(null);
  const [authLoading, setAuthLoading] = React.useState(true);

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/user/me");
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data);
        }
      } catch (e) {
        // ignore
      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();
  }, [pathname]); // Re-check on path change

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const toggleMobile = (open: boolean) => () => setMobileOpen(open);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleNavigate = (path: string) => {
    router.push(path);
    handleMenuClose();
  };

  const handleMobileNavigate = (path: string) => () => {
    router.push(path);
    setMobileOpen(false);
  };

  const logout = async () => {
    handleMenuClose();
    await signOut({ callbackUrl: "/" });
    setCurrentUser(null);
  };

  const dashboardHref = `/dashboard/${currentUser?.role}`;

  const footerPages = React.useMemo(
    () =>
      cmsPages
        ?.map((page) => ({
          ...page,
          href: toCmsHref(page.slug),
        }))
        .filter(
          (page) =>
            !FOOTER_EXCLUDED_TITLES.some(
              (excluded) =>
                normalizeTitle(page.title) === normalizeTitle(excluded)
            )
        )
        .sort((a, b) => {
          const weightDiff = footerWeight(a.title) - footerWeight(b.title);
          if (weightDiff !== 0) return weightDiff;
          return a.title.localeCompare(b.title, undefined, {
            sensitivity: "accent",
          });
        }) ?? [],
    [cmsPages]
  );

  const footerColumns = React.useMemo(() => {
    if (!footerPages.length) return [];
    const mid = Math.ceil(footerPages.length / 2);
    return [
      footerPages.slice(0, mid),
      footerPages.slice(mid).filter(Boolean),
    ].filter((col) => col.length > 0);
  }, [footerPages]);

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <BackgroundFX />
      <AppBar
        position="sticky"
        color="inherit"
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
            <Box sx={{ flexGrow: { xs: 1, md: 0 } }} />
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
              <Tooltip
                title={lang === "en" ? "Switch to বাংলা" : "Switch to English"}
              >
                <IconButton
                  color="inherit"
                  onClick={() => setLang(lang === "en" ? "bn" : "en")}
                  aria-label="Toggle language"
                >
                  <TranslateIcon />
                </IconButton>
              </Tooltip>
              {!authLoading && currentUser ? (
                <>
                  <Tooltip title="Account settings">
                    <IconButton onClick={handleMenuOpen} size="small">
                      <Avatar sx={{ width: 32, height: 32 }}>
                        {currentUser.name?.charAt(0).toUpperCase()}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    <MenuItem onClick={() => handleNavigate(dashboardHref)}>
                      Dashboard
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleNavigate("/dashboard/profile")}
                    >
                      Profile
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleNavigate("/dashboard/settings")}
                    >
                      Settings
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={logout}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    component={Link}
                    href="/auth/portal/login"
                    color="inherit"
                    startIcon={<LoginIcon />}
                  >
                    Portal
                  </Button>
                  <Button
                    component={Link}
                    href="/auth/admin/login"
                    variant="contained"
                  >
                    Admin Login
                  </Button>
                </>
              )}
            </Stack>

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

      <Drawer anchor="top" open={mobileOpen} onClose={toggleMobile(false)}>
        <Box role="menu" sx={{ width: "100vw", maxWidth: 560, mx: "auto" }}>
          <List
            subheader={<ListSubheader disableSticky>Navigation</ListSubheader>}
            sx={{ py: 0 }}
          >
            {getNavItems(lang).map((it) => {
              const active = pathname === it.href;
              return (
                <ListItemButton
                  key={it.href}
                  selected={active}
                  onClick={handleMobileNavigate(it.href)}
                >
                  {it.icon ? <ListItemIcon>{it.icon}</ListItemIcon> : null}
                  <ListItemText primary={it.label} />
                </ListItemButton>
              );
            })}
          </List>
          <Divider />
          {currentUser ? (
            <List
              subheader={<ListSubheader disableSticky>Account</ListSubheader>}
              sx={{ py: 0 }}
            >
              <ListItemButton onClick={handleMobileNavigate(dashboardHref)}>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
              <ListItemButton
                onClick={handleMobileNavigate("/dashboard/profile")}
              >
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItemButton>
              <ListItemButton
                onClick={handleMobileNavigate("/dashboard/settings")}
              >
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItemButton>
              <ListItemButton
                onClick={async () => {
                  setMobileOpen(false);
                  await logout();
                }}
              >
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </List>
          ) : (
            <List
              sx={{ py: 0 }}
              subheader={<ListSubheader disableSticky>Sign in</ListSubheader>}
            >
              <ListItemButton
                onClick={handleMobileNavigate("/auth/portal/login")}
              >
                <ListItemIcon>
                  <LoginIcon />
                </ListItemIcon>
                <ListItemText primary="Portal" />
              </ListItemButton>
              <ListItemButton
                onClick={handleMobileNavigate("/auth/admin/login")}
              >
                <ListItemText primary="" />
              </ListItemButton>
            </List>
          )}
          <Divider />
          <List
            sx={{ py: 0 }}
            subheader={<ListSubheader disableSticky>Preferences</ListSubheader>}
          >
            <ListItemButton
              onClick={() => {
                toggle();
                setMobileOpen(false);
              }}
            >
              <ListItemIcon>
                {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
              </ListItemIcon>
              <ListItemText
                primary={mode === "dark" ? "Light Mode" : "Dark Mode"}
              />
            </ListItemButton>
            <ListItemButton
              onClick={() => {
                setLang(lang === "en" ? "bn" : "en");
                setMobileOpen(false);
              }}
            >
              <ListItemIcon>
                <TranslateIcon />
              </ListItemIcon>
              <ListItemText primary={lang === "en" ? "বাংলা" : "English"} />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
      <Container
        component="main"
        maxWidth="lg"
        sx={{ flex: "1 0 auto", py: 3, position: "relative", zIndex: 2 }}
      >
        {children}
      </Container>
      <Box
        component="footer"
        sx={{
          borderTop: (t) => `1px solid ${t.palette.divider}`,
          py: 1,
          zIndex: 1,
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 2, md: 4 }}
            alignItems="stretch"
          >
            {footerPages.length > 0 ? (
              <Box component="nav" aria-label="CMS pages" sx={{ flex: 1 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, mb: 1.5 }}
                >
                  {lang === "bn" ? "পেজসমূহ" : "Pages"}
                </Typography>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={{ xs: 1.5, sm: 4 }}
                  alignItems="flex-start"
                >
                  {footerColumns.map((column, columnIndex) => (
                    <Stack
                      key={columnIndex}
                      component="ul"
                      spacing={0.75}
                      sx={{
                        listStyle: "none",
                        m: 0,
                        p: 0,
                        minWidth: { sm: "220px" },
                        flex: 1,
                      }}
                    >
                      {column.map((page) => (
                        <Box component="li" key={page.id}>
                          <Typography
                            component={Link}
                            href={page.href}
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              textDecoration: "none",
                              display: "inline-block",
                              "&:hover": { color: "primary.main" },
                            }}
                          >
                            {page.title}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  ))}
                </Stack>
              </Box>
            ) : null}
            <Box
              sx={{
                flex: 1,
                minWidth: { md: 320 },
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
                {lang === "bn" ? "আমাদের অবস্থান" : "Our Location"}
              </Typography>
              <Box
                sx={{
                  borderRadius: 1,
                  overflow: "hidden",
                  height: "100%",
                  minHeight: 200,
                  boxShadow: (t) =>
                    mode === "dark"
                      ? `0 0 0 1px ${t.palette.divider}`
                      : t.shadows[1],
                }}
              >
                {/* <MapComponent location={AMIN_DIAGNOSTIC_LOCATION} /> */}
              </Box>
            </Box>
          </Stack>
        </Container>
      </Box>
      <Box sx={{ textAlign: "center", py: 1 }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Amin Diagnostics • All rights reserved.
        </Typography>
      </Box>
      <SupportChatWidget />
    </Box>
  );
}
