"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  AppBar,
  Avatar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Container,
  CssBaseline,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  SwipeableDrawer,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  Fab,
} from "@mui/material";
import { styled, useTheme, type Theme, type CSSObject } from "@mui/material/styles";
import MuiDrawer, { type DrawerProps as MuiDrawerProps } from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AddIcon from "@mui/icons-material/Add";
import { motion } from "framer-motion";
import Logo from "@/components/common/Logo";
import type { AppRole } from "@/lib/auth";

/**
 * CRUD Dashboard – Material UI style layout
 *
 * This mirrors MUI's official Dashboard template patterns:
 * - Styled Drawer with opened/closed mixins
 * - AppBar that shifts when drawer is open (desktop only)
 * - Responsive: swipeable drawer + bottom nav on mobile
 * - Floating "Add" FAB on mobile to encourage CRUD flows
 */

const DRAWER_WIDTH = 240;
const MOBILE_BOTTOM_NAV_HEIGHT = 64;

// --- Drawer mixins from MUI Dashboard template (typed) ---
const openedMixin = (theme: Theme): CSSObject => ({
  width: DRAWER_WIDTH,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

// NOTE: Correctly typed styled Drawer to avoid TS overload issues
const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open?: boolean }>(({ theme, open }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme as Theme),
    "& .MuiDrawer-paper": openedMixin(theme as Theme),
  }),
  ...(!open && {
    ...closedMixin(theme as Theme),
    "& .MuiDrawer-paper": closedMixin(theme as Theme),
  }),
}));

// Navigation config
export type DashboardNavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  roles: AppRole[];
};

const navItems: DashboardNavItem[] = [
  { title: "Dashboard", path: "/dashboard/admin", icon: <DashboardIcon />, roles: ["admin"] },
  { title: "Dashboard", path: "/dashboard/moderator", icon: <DashboardIcon />, roles: ["moderator"] },
  { title: "Dashboard", path: "/dashboard/doctor", icon: <DashboardIcon />, roles: ["doctor"] },
  { title: "Dashboard", path: "/dashboard/patient", icon: <DashboardIcon />, roles: ["patient"] },
  { title: "Test Prices", path: "/dashboard/admin/test-prices", icon: <PriceChangeIcon />, roles: ["admin", "moderator"] },
  { title: "Appointments", path: "/dashboard/doctor/appointments", icon: <CalendarMonthIcon />, roles: ["doctor"] },
  { title: "Medical Tests", path: "/dashboard/patient/tests", icon: <CalendarMonthIcon />, roles: ["patient"] },
];

export interface DashboardLayoutProps {
  children: React.ReactNode;
  role: AppRole;
  userName?: string;
}

export default function DashboardLayout({ children, role, userName = "User" }: DashboardLayoutProps) {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  // desktop (mini-variant) & mobile drawer states
  const [open, setOpen] = React.useState(true);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(isMdUp); // auto-open on desktop, auto-mini on mobile
  }, [isMdUp]);

  const toggleDesktopDrawer = () => setOpen((v) => !v);
  const openMobileDrawer = () => setMobileOpen(true);
  const closeMobileDrawer = () => setMobileOpen(false);

  // profile menu
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleProfileMenuOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleProfileMenuClose = () => setAnchorEl(null);

  // filter by role
  const filteredNavItems = React.useMemo(() => navItems.filter((i) => i.roles.includes(role)), [role]);

  const handleNavigate = (path: string) => {
    if (pathname !== path) router.push(path);
    if (!isMdUp) closeMobileDrawer();
  };

  const handleLogout = async () => {
    handleProfileMenuClose();
    try {
      const res = await fetch("/api/auth/logout", { method: "POST", headers: { "Content-Type": "application/json" } });
      if (res.ok) router.push("/");
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  // --- Drawer content (shared) ---
  const DrawerContent = (
    <>
      <DrawerHeader>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, overflow: "hidden" }}>
          {open ? <Logo size={32} /> : <Box sx={{ width: 32, height: 32 }} />}
          {open && (
            <Typography variant="subtitle1" noWrap>
              Amin Diagnostic Center
            </Typography>
          )}
        </Box>
        {isMdUp && (
          <IconButton onClick={toggleDesktopDrawer} aria-label={open ? "Collapse sidebar" : "Expand sidebar"}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </DrawerHeader>
      <Divider />

      <List component="nav" sx={{ py: 0 }}>
        {filteredNavItems.map((item) => {
          const selected = pathname === item.path;
          const ButtonInner = (
            <ListItemButton
              component={motion.div as any}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleNavigate(item.path)}
              selected={selected}
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2,
                "&.Mui-selected": { bgcolor: "action.selected" },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : 0,
                  justifyContent: "center",
                  color: selected ? "primary.main" : "inherit",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.title}
                sx={{
                  opacity: open ? 1 : 0,
                  color: selected ? "primary.main" : "inherit",
                  whiteSpace: "nowrap",
                }}
              />
            </ListItemButton>
          );

          return (
            <ListItem key={item.path} disablePadding sx={{ display: "block" }}>
              {open ? (
                ButtonInner
              ) : (
                <Tooltip title={item.title} placement="right" arrow>
                  {ButtonInner}
                </Tooltip>
              )}
            </ListItem>
          );
        })}
      </List>
    </>
  );

  // --- Smart Mobile Bottom Nav (top 4 role routes) ---
  const mobileNavItems = React.useMemo(() => {
    const unique: DashboardNavItem[] = [];
    for (const i of filteredNavItems) {
      if (!unique.find((u) => u.path === i.path)) unique.push(i);
      if (unique.length >= 4) break;
    }
    return unique;
  }, [filteredNavItems]);

  const bottomNavIndex = React.useMemo(() => mobileNavItems.findIndex((i) => i.path === pathname), [mobileNavItems, pathname]);

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <CssBaseline />

      {/* AppBar (shifts on desktop when drawer open) */}
      <AppBar
        position="fixed"
        color="primary"
        enableColorOnDark
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(isMdUp && open && {
            ml: `${DRAWER_WIDTH}px`,
            width: `calc(100% - ${DRAWER_WIDTH}px)`,
            transition: theme.transitions.create(["width", "margin"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        }}
      >
        <Toolbar>
          {!isMdUp && (
            <IconButton color="inherit" aria-label="open navigation" onClick={openMobileDrawer} edge="start" sx={{ mr: 1 }}>
              <MenuIcon />
            </IconButton>
          )}

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Amin Diagnostic Center
          </Typography>

          <Tooltip title="Account settings">
            <IconButton
              onClick={handleProfileMenuOpen}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={Boolean(anchorEl) ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={Boolean(anchorEl) ? "true" : undefined}
            >
              <Avatar sx={{ width: 32, height: 32 }}>{userName.charAt(0).toUpperCase()}</Avatar>
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": { width: 32, height: 32, ml: -0.5, mr: 1 },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem>
          <Avatar /> Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>

      {/* Mobile Swipeable Drawer */}
      <SwipeableDrawer
        anchor="left"
        disableBackdropTransition={false}
        disableDiscovery={false}
        open={mobileOpen}
        onOpen={openMobileDrawer}
        onClose={closeMobileDrawer}
        sx={{ display: { xs: "block", md: "none" }, "& .MuiDrawer-paper": { width: DRAWER_WIDTH } }}
      >
        {DrawerContent}
      </SwipeableDrawer>

      {/* Desktop Styled Drawer (mini-variant) */}
      <Drawer variant="permanent" open={open} sx={{ display: { xs: "none", md: "block" } }}>
        {DrawerContent}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: "100%",
          ...(isMdUp && open ? { ml: `${DRAWER_WIDTH}px`, width: `calc(100% - ${DRAWER_WIDTH}px)` } : {}),
          pb: { xs: `${MOBILE_BOTTOM_NAV_HEIGHT + 16}px`, md: 0 },
        }}
      >
        {/* spacer below AppBar */}
        <Toolbar />
        <Container maxWidth="lg" sx={{ py: 2 }}>{children}</Container>
      </Box>

      {/* Bottom Navigation (mobile) */}
      <Paper elevation={3} sx={{ position: "fixed", bottom: 0, left: 0, right: 0, display: { xs: "block", md: "none" } }}>
        <BottomNavigation
          showLabels
          value={bottomNavIndex === -1 ? false : bottomNavIndex}
          onChange={(_, newIndex) => {
            const target = mobileNavItems[newIndex];
            if (target) handleNavigate(target.path);
          }}
          sx={{ height: MOBILE_BOTTOM_NAV_HEIGHT }}
        >
          {mobileNavItems.map((item) => (
            <BottomNavigationAction key={item.path} label={item.title} icon={item.icon} />
          ))}
        </BottomNavigation>
      </Paper>

      {/* Floating Add (mobile) for quick CRUD */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: "fixed",
          bottom: MOBILE_BOTTOM_NAV_HEIGHT + 16,
          right: 16,
          display: { xs: "inline-flex", md: "none" },
        }}
        onClick={() => {
          // Stub: navigate to a create route depending on role
          const target = filteredNavItems[0]?.path ?? "/dashboard";
          router.push(`${target}/create`);
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}
