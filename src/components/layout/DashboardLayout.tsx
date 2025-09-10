"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Avatar,
  Box,
  CssBaseline,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Menu,
  SwipeableDrawer,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { styled, useTheme, type Theme, type CSSObject } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DashboardIcon from "@mui/icons-material/Dashboard";

import PriceChangeIcon from "@mui/icons-material/PriceChange";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import GroupsIcon from "@mui/icons-material/Groups";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Logo from "../common/Logo";
import type { AppRole } from "@/lib/auth";

// Align drawer dimensions with MUI CRUD Dashboard template
const DRAWER_WIDTH = 240; // expanded width
const MINI_DRAWER_WIDTH = 90; // collapsed width

const openedMixin = (theme: Theme): CSSObject => ({
  width: DRAWER_WIDTH,
  transition: theme.transitions.create("width", { easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.enteringScreen }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: MINI_DRAWER_WIDTH,
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const DesktopDrawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && { ...openedMixin(theme), "& .MuiDrawer-paper": openedMixin(theme) }),
  ...(!open && { ...closedMixin(theme), "& .MuiDrawer-paper": closedMixin(theme) }),
}));

// Styled AppBar to mirror template: no shadow, bottom border, above drawer
const HeaderAppBar = styled(MuiAppBar)(({ theme }) => ({
  borderWidth: 0,
  borderBottomWidth: 1,
  borderStyle: "solid",
  borderColor: (theme.vars ?? theme).palette.divider,
  boxShadow: "none",
  zIndex: theme.zIndex.drawer + 1,
}));

const navItems = [
  { title: "Dashboard", path: "/dashboard/admin", icon: <DashboardIcon />, roles: ["admin"] },
  { title: "Dashboard", path: "/dashboard/moderator", icon: <DashboardIcon />, roles: ["moderator"] },
  { title: "Dashboard", path: "/dashboard/patient", icon: <DashboardIcon />, roles: ["patient"] },
  { title: "Support Chat", path: "/dashboard/admin/support-chat", icon: <GroupsIcon />, roles: ["admin"] },
  { title: "Support Chat", path: "/dashboard/moderator/support-chat", icon: <GroupsIcon />, roles: ["moderator"] },
  { title: "CMS Pages", path: "/dashboard/admin/cms/pages", icon: <GroupsIcon />, roles: ["admin"] },
  { title: "CMS Pages", path: "/dashboard/moderator/cms/pages", icon: <GroupsIcon />, roles: ["moderator"] },
  { title: "CMS Sliders", path: "/dashboard/admin/cms/sliders", icon: <GroupsIcon />, roles: ["admin"] },
  { title: "CMS Sliders", path: "/dashboard/moderator/cms/sliders", icon: <GroupsIcon />, roles: ["moderator"] },
  // Admin-only doctor & pricing pages under admin namespace
  { title: "Doctors", path: "/dashboard/admin/doctors", icon: <GroupsIcon />, roles: ["admin"] },
  { title: "Test Prices", path: "/dashboard/admin/test-prices", icon: <PriceChangeIcon />, roles: ["admin"] },
  { title: "Patients", path: "/dashboard/admin/patients", icon: <GroupsIcon />, roles: ["admin"] },
  { title: "Media", path: "/dashboard/admin/media", icon: <GroupsIcon />, roles: ["admin"] },
  // Moderator mirrors to moderator namespace (re-exported pages)
  { title: "Doctors", path: "/dashboard/moderator/doctors", icon: <GroupsIcon />, roles: ["moderator"] },
  { title: "Test Prices", path: "/dashboard/moderator/test-prices", icon: <PriceChangeIcon />, roles: ["moderator"] },
  { title: "Patients", path: "/dashboard/moderator/patients", icon: <GroupsIcon />, roles: ["moderator"] },
  { title: "Media", path: "/dashboard/moderator/media", icon: <GroupsIcon />, roles: ["moderator"] },
  { title: "Profile", path: "/dashboard/profile", icon: <AccountCircleIcon />, roles: ["admin", "moderator", "patient"] },
  { title: "Settings", path: "/dashboard/settings", icon: <SettingsIcon />, roles: ["admin", "moderator", "patient"] },
];

export default function DashboardLayout({ children, role, userName = "User" }: { children: React.ReactNode; role: AppRole; userName?: string }) {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const [open, setOpen] = React.useState(true);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(isMdUp);
  }, [isMdUp]);

  const handleDrawerToggle = () => setOpen((v) => !v);
  const openMobileDrawer = () => setMobileOpen(true);
  const closeMobileDrawer = () => setMobileOpen(false);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleProfileMenuOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleProfileMenuClose = () => setAnchorEl(null);

  const handleNavigate = (path: string) => {
    handleProfileMenuClose();
    if (pathname !== path) router.push(path);
  };

  const handleLogout = async () => {
    handleProfileMenuClose();
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    const res = await fetch("/api/auth/logout", { method: "POST" });
    if (res.ok) router.push("/");
  };

  const filteredNavItems = React.useMemo(() => navItems.filter((item) => item.roles.includes(role)), [role]);

  const DrawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <DrawerHeader sx={{ justifyContent: "space-between" }}>
        <Logo size={32} sx={{ ml: 1 }} />
        <IconButton
          onClick={isMdUp ? handleDrawerToggle : closeMobileDrawer}
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
        >
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List sx={{ flexGrow: 1, overflowY: "auto" }}>
        {filteredNavItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ display: "block" }}>
            <Tooltip title={item.title} placement="right" arrow disableHoverListener={open}>
              <ListItemButton
                selected={pathname === item.path}
                onClick={() => {
                  if (pathname !== item.path) router.push(item.path);
                  if (!isMdUp) closeMobileDrawer();
                }}
                sx={{
                  minHeight: 48,
                  px: 2,
                  ...(open ? { pl: 2.5 } : { pl: 1.5, justifyContent: "center" }),
                }}
              >
                <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 0, justifyContent: "center" }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.title} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        overflow: "hidden",
        minHeight: "100dvh",
        width: "100%",
      }}
    >
      <CssBaseline />
      <HeaderAppBar color="inherit" position="absolute" sx={{ displayPrint: "none" }}>
        <Toolbar sx={{ backgroundColor: "inherit", mx: { xs: -0.75, sm: -1 } }}>
          <IconButton
            color="inherit"
            aria-label={open ? "Collapse navigation" : "Expand navigation"}
            onClick={isMdUp ? handleDrawerToggle : openMobileDrawer}
            edge="start"
            sx={{ mr: 1 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <Tooltip title="Account settings">
            <IconButton onClick={handleProfileMenuOpen} size="small">
              <Avatar sx={{ width: 32, height: 32 }}>{userName.charAt(0).toUpperCase()}</Avatar>
            </IconButton>
          </Tooltip>
        </Toolbar>
      </HeaderAppBar>

      {isMdUp ? (
        <DesktopDrawer variant="permanent" open={open}>
          {DrawerContent}
        </DesktopDrawer>
      ) : (
        <SwipeableDrawer
          anchor="left"
          open={mobileOpen}
          onOpen={openMobileDrawer}
          onClose={closeMobileDrawer}
          // Unmount when closed to remove focusable content from DOM for a11y
          ModalProps={{ keepMounted: false }}
          sx={{ "& .MuiDrawer-paper": { boxSizing: "border-box", width: DRAWER_WIDTH } }}
        >
          {DrawerContent}
        </SwipeableDrawer>
      )}

      <Box
        component="main"
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minWidth: 0,
          p: 3,
        }}
      >
        <Toolbar sx={{ displayPrint: "none" }} />
        <Box sx={{ flexGrow: 1, overflow: "auto" }}>{children}</Box>
        <Box component="footer" sx={{ pt: 2, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Amin Diagnostics
          </Typography>
        </Box>
      </Box>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleProfileMenuClose} sx={{ mt: 1 }}>
        <MenuItem onClick={() => handleNavigate("/dashboard/profile")}>Profile</MenuItem>
        <MenuItem onClick={() => handleNavigate("/dashboard/settings")}>Settings</MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </Box>
  );
}
