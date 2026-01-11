"use client";

import * as React from "react";
import Badge from "@mui/material/Badge";
import Stack from "@mui/material/Stack";
import MailIcon from "@mui/icons-material/Mail";
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
  Menu,
  MenuItem,
  SwipeableDrawer,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  alpha,
  createTheme,
  styled,
  ThemeProvider,
  useTheme,
  type CSSObject,
  type Theme,
} from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import SpaceDashboardRoundedIcon from "@mui/icons-material/SpaceDashboardRounded";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import ViewCarouselRoundedIcon from "@mui/icons-material/ViewCarouselRounded";
import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import PersonalInjuryRoundedIcon from "@mui/icons-material/PersonalInjuryRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import PermMediaRoundedIcon from "@mui/icons-material/PermMediaRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import FileCopyRoundedIcon from "@mui/icons-material/FileCopyRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import { signOut } from "next-auth/react";
import Logo from "../common/Logo";
import type { AppRole } from "@/lib/auth";
import { useColorMode } from "@/lib/theme/ThemeRegistry";

// Align drawer dimensions with the reference dashboard layout.
const DRAWER_WIDTH = 260; // expanded width
const MINI_DRAWER_WIDTH = 76; // collapsed width
const SIDEBAR_BG = "#0f151d";
const SIDEBAR_BORDER = "rgba(255,255,255,0.08)";
type ThemeCallbackProps = { theme: Theme };
const getCardRadius = (theme: Theme) =>
  typeof theme.shape.borderRadius === "number"
    ? theme.shape.borderRadius + 4
    : `calc(${theme.shape.borderRadius} + 4px)`;

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
  width: MINI_DRAWER_WIDTH,
});

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 22,
  height: 22,
  border: `2px solid ${theme.palette.background.paper}`,
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const DesktopDrawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": {
      ...openedMixin(theme),
      backgroundColor: SIDEBAR_BG,
      borderRight: `1px solid ${SIDEBAR_BORDER}`,
      color: "#e7eef7",
    },
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": {
      ...closedMixin(theme),
      backgroundColor: SIDEBAR_BG,
      borderRight: `1px solid ${SIDEBAR_BORDER}`,
      color: "#e7eef7",
    },
  }),
}));

// Styled AppBar to mirror template: no shadow, bottom border, above drawer
const HeaderAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "desktopOpen",
})<{ desktopOpen: boolean }>(({ theme, desktopOpen }) => ({
  borderWidth: 0,
  borderBottomWidth: 1,
  borderStyle: "solid",
  borderColor: (theme.vars ?? theme).palette.divider,
  boxShadow: "none",
  backgroundColor: alpha(
    theme.palette.background.default,
    theme.palette.mode === "dark" ? 0.9 : 0.8
  ),
  backdropFilter: "blur(18px)",
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(desktopOpen && {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  [theme.breakpoints.up("md")]: {
    marginLeft: desktopOpen ? DRAWER_WIDTH : MINI_DRAWER_WIDTH,
    width: `calc(100% - ${desktopOpen ? DRAWER_WIDTH : MINI_DRAWER_WIDTH}px)`,
  },
}));

type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  roles: AppRole[];
  label?: string;
  section: "Overview" | "Management" | "Account";
};

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    path: "/dashboard/admin",
    icon: <SpaceDashboardRoundedIcon />,
    roles: ["admin"],
    label: "Welcome to Admin Diagnostic Dashboard",
    section: "Overview",
  },
  {
    title: "Dashboard",
    path: "/dashboard/moderator",
    icon: <SpaceDashboardRoundedIcon />,
    roles: ["moderator"],
    label: "Moderator Dashboard",
    section: "Overview",
  },
  {
    title: "Dashboard",
    path: "/dashboard/patient",
    icon: <PersonalInjuryRoundedIcon />,
    roles: ["patient"],
    label: "Welcome to Admin Diagnostic Patient Portal",
    section: "Overview",
  },
  {
    title: "Dashboard",
    path: "/dashboard/doctor",
    icon: <LocalHospitalRoundedIcon />,
    roles: ["doctor"],
    label: "Manage Doctors",
    section: "Overview",
  },
  {
    title: "Support Chat",
    path: "/dashboard/admin/support-chat",
    icon: <ForumRoundedIcon />,
    roles: ["admin"],
    label: "Manage Support Chat",
    section: "Management",
  },
  {
    title: "Support Chat",
    path: "/dashboard/moderator/support-chat",
    icon: <ForumRoundedIcon />,
    roles: ["moderator"],
    label: "Manage Support Chat",
    section: "Management",
  },
  {
    title: "CMS Pages",
    path: "/dashboard/admin/cms/pages",
    icon: <DescriptionRoundedIcon />,
    roles: ["admin"],
    label: "Manage CMS Pages",
    section: "Management",
  },
  {
    title: "CMS Pages",
    path: "/dashboard/moderator/cms/pages",
    icon: <DescriptionRoundedIcon />,
    roles: ["moderator"],
    label: "Manage CMS Pages",
    section: "Management",
  },
  {
    title: "CMS Sliders",
    path: "/dashboard/admin/cms/sliders",
    icon: <ViewCarouselRoundedIcon />,
    roles: ["admin"],
    label: "Manage CMS Sliders",
    section: "Management",
  },
  {
    title: "CMS Sliders",
    path: "/dashboard/moderator/cms/sliders",
    icon: <ViewCarouselRoundedIcon />,
    roles: ["moderator"],
    label: "Manage CMS Sliders",
    section: "Management",
  },
  {
    title: "Manage Doctors",
    path: "/dashboard/admin/doctors",
    icon: <MedicalServicesRoundedIcon />,
    roles: ["admin"],
    section: "Management",
  },
  {
    title: "Medical Test Prices",
    path: "/dashboard/admin/test-prices",
    icon: <QueryStatsRoundedIcon />,
    roles: ["admin"],
    section: "Management",
  },
  {
    title: "Manage Patients",
    path: "/dashboard/admin/patients",
    icon: <GroupsRoundedIcon />,
    roles: ["admin"],
    section: "Management",
  },
  {
    title: "Media",
    path: "/dashboard/admin/media",
    icon: <PermMediaRoundedIcon />,
    roles: ["admin"],
    section: "Management",
  },
  // Moderator mirrors to moderator namespace (re-exported pages)
  {
    title: "Doctors",
    path: "/dashboard/moderator/doctors",
    icon: <MedicalServicesRoundedIcon />,
    roles: ["moderator"],
    section: "Management",
  },
  {
    title: "Test Prices",
    path: "/dashboard/moderator/test-prices",
    icon: <QueryStatsRoundedIcon />,
    roles: ["moderator"],
    section: "Management",
  },
  {
    title: "Patients",
    path: "/dashboard/moderator/patients",
    icon: <GroupsRoundedIcon />,
    roles: ["moderator"],
    section: "Management",
  },
  {
    title: "Media",
    path: "/dashboard/moderator/media",
    icon: <PermMediaRoundedIcon />,
    roles: ["moderator"],
    section: "Management",
  },
  // Patient files
  {
    title: "Tests & Reports",
    path: "/dashboard/patient/files",
    icon: <FileCopyRoundedIcon />,
    roles: ["patient"],
    section: "Management",
  },
  {
    title: "Profile",
    path: "/dashboard/profile",
    icon: <AccountCircleRoundedIcon />,
    roles: ["admin", "moderator", "patient"],
    section: "Account",
  },
  {
    title: "Settings",
    path: "/dashboard/settings",
    icon: <SettingsRoundedIcon />,
    roles: ["admin", "moderator", "patient"],
    section: "Account",
  },
];

function DashboardScaffold({
  children,
  role,
  userName = "User",
}: {
  children: React.ReactNode;
  role: AppRole;
  userName?: string;
}) {
  const theme = useTheme();
  const { mode, toggle } = useColorMode();
  const router = useRouter();
  const pathname = usePathname();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const isPatient = role === "patient";
  const isDarkMode = theme.palette.mode === "dark";

  const [open, setOpen] = React.useState(true);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(isMdUp);
  }, [isMdUp]);

  const handleDrawerToggle = () => setOpen((v) => !v);
  const openMobileDrawer = () => setMobileOpen(true);
  const closeMobileDrawer = () => setMobileOpen(false);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleProfileMenuOpen = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const handleProfileMenuClose = () => setAnchorEl(null);

  const handleNavigate = (path: string) => {
    handleProfileMenuClose();
    if (pathname !== path) router.push(path);
  };

  const handleLogout = async () => {
    handleProfileMenuClose();
    const isNextAuthRole =
      role === "admin" || role === "moderator" || role === "doctor";
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Best-effort cookie cleanup; fall through to redirect.
    }
    if (isNextAuthRole) {
      await signOut({ callbackUrl: "/auth/admin/login" });
      return;
    }
    router.push("/auth/portal/login");
  };

  const filteredNavItems = React.useMemo(
    () => navItems.filter((item) => item.roles.includes(role)),
    [role]
  );

  const groupedNavItems = React.useMemo(() => {
    const groups: { section: NavItem["section"]; items: NavItem[] }[] = [];
    filteredNavItems.forEach((item) => {
      const existing = groups.find((group) => group.section === item.section);
      if (existing) {
        existing.items.push(item);
      } else {
        groups.push({ section: item.section, items: [item] });
      }
    });
    return groups;
  }, [filteredNavItems]);

  const sidebarText = "#c8d2de";
  const sidebarMuted = "#7f8a98";
  const sidebarAccent = isPatient ? "#37c5a7" : "#2dd4bf";
  const primaryGlow = alpha(
    isPatient ? "#38bdf8" : "#2dd4bf",
    isDarkMode ? 0.18 : 0.1
  );
  const secondaryGlow = alpha(
    isPatient ? "#0ea5e9" : "#3b82f6",
    isDarkMode ? 0.16 : 0.08
  );

  const DrawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <DrawerHeader sx={{ justifyContent: "space-between", px: 2 }}>
        <Logo size={32} />
        <IconButton
          onClick={isMdUp ? handleDrawerToggle : closeMobileDrawer}
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
          sx={{ color: sidebarMuted }}
        >
          <ChevronLeftRoundedIcon
            sx={{
              transform: open ? "rotate(0deg)" : "rotate(180deg)",
              transition: "transform 0.2s ease",
            }}
          />
        </IconButton>
      </DrawerHeader>
      <Divider sx={{ borderColor: SIDEBAR_BORDER }} />
      <List sx={{ flexGrow: 1, overflowY: "auto", py: 2 }}>
        {groupedNavItems.map((group, groupIndex) => (
          <Box key={group.section} sx={{ mt: groupIndex ? 2 : 0 }}>
            <Typography
              variant="overline"
              sx={{
                px: open ? 2 : 1.5,
                color: sidebarMuted,
                letterSpacing: "0.18em",
                display: open ? "block" : "open",
              }}
            >
              {group.section}
            </Typography>
            {group.items.map((item) => (
              <ListItem
                key={item.path}
                disablePadding
                sx={{ display: "block" }}
              >
                <Tooltip
                  title={item.label ?? item.title}
                  placement="right"
                  arrow
                  disableHoverListener={open}
                >
                  <ListItemButton
                    selected={pathname === item.path}
                    onClick={() => {
                      if (pathname !== item.path) router.push(item.path);
                      if (!isMdUp) closeMobileDrawer();
                    }}
                    sx={{
                      position: "relative",
                      minHeight: 48,
                      mx: open ? 1 : 0.5,
                      my: 0.4,
                      px: 1.5,
                      borderRadius: 2,
                      color: sidebarText,
                      justifyContent: open ? "flex-start" : "center",
                      transition:
                        "background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 4,
                        height: 22,
                        borderRadius: 999,
                        backgroundColor: "transparent",
                        transition: "all 0.2s ease",
                      },
                      "& .MuiListItemIcon-root": {
                        transition: "transform 0.2s ease, color 0.2s ease",
                      },
                      "& .MuiListItemText-root": {
                        transition: "opacity 0.2s ease, transform 0.2s ease",
                        transform: open ? "translateX(0)" : "translateX(-6px)",
                      },
                      "&:hover": {
                        backgroundColor: alpha(sidebarAccent, 0.12),
                        transform: open ? "translateX(6px)" : "scale(1.03)",
                      },
                      "&.Mui-selected": {
                        backgroundColor: alpha(sidebarAccent, 0.2),
                        color: "#ecfff8",
                        boxShadow: `0 12px 24px ${alpha(sidebarAccent, 0.12)}`,
                        "&::before": {
                          backgroundColor: sidebarAccent,
                          height: 28,
                        },
                        "& .MuiListItemIcon-root": {
                          color: "#ecfff8",
                          transform: "scale(1.08)",
                        },
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 2 : 0,
                        justifyContent: "center",
                        color: sidebarText,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.title}
                      sx={{
                        opacity: open ? 1 : 0,
                        "& .MuiListItemText-primary": {
                          fontSize: "0.95rem",
                          fontWeight: pathname === item.path ? 700 : 500,
                        },
                      }}
                    />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            ))}
          </Box>
        ))}
      </List>
    </Box>
  );

  const desktopOpen = isMdUp ? open : false;

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        overflow: "hidden",
        minHeight: "100vh",
        width: "100%",
        backgroundColor: theme.palette.background.default,
        backgroundImage: isPatient
          ? `radial-gradient(circle at 20% 10%, ${primaryGlow}, transparent 55%), radial-gradient(circle at 90% 0%, ${secondaryGlow}, transparent 45%)`
          : `radial-gradient(circle at 20% 0%, ${primaryGlow}, transparent 50%), radial-gradient(circle at 80% 10%, ${secondaryGlow}, transparent 45%)`,
        color: theme.palette.text.primary,
      }}
    >
      <CssBaseline />
      <HeaderAppBar
        color="inherit"
        position="fixed"
        desktopOpen={desktopOpen}
        sx={{ displayPrint: "none" }}
      >
        <Toolbar sx={{ backgroundColor: "inherit", mx: { xs: -0.75, sm: -1 } }}>
          <IconButton
            color="inherit"
            aria-label={open ? "Collapse navigation" : "Expand navigation"}
            onClick={isMdUp ? handleDrawerToggle : openMobileDrawer}
            edge="start"
            sx={{ mr: 1 }}
          >
            <MenuRoundedIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <Tooltip
            title={
              mode === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            <IconButton
              onClick={toggle}
              size="small"
              sx={{
                mr: 1,
                border: `1px solid ${alpha(theme.palette.text.primary, 0.2)}`,
                backgroundColor: alpha(theme.palette.text.primary, 0.08),
              }}
              aria-label="Toggle color mode"
            >
              {mode === "dark" ? (
                <LightModeRoundedIcon fontSize="small" />
              ) : (
                <DarkModeRoundedIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip title="Notifications">
            <Badge badgeContent={3} color="success">
              <IconButton size="small">
                <MailIcon color="action" sx={{ width: 34, height: 34 }} />
              </IconButton>
            </Badge>
          </Tooltip>
          <Tooltip title="Account settings">
            <StyledBadge
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              variant="dot"
            >
              <IconButton onClick={handleProfileMenuOpen} size="small">
                <SmallAvatar sx={{ width: 34, height: 34 }}>
                  {userName.charAt(0).toUpperCase()}
                </SmallAvatar>
              </IconButton>
            </StyledBadge>
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
          ModalProps={{ keepMounted: false }}
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
              backgroundColor: SIDEBAR_BG,
              borderRight: `1px solid ${SIDEBAR_BORDER}`,
              color: "#e7eef7",
            },
          }}
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
          p: { xs: 2.5, md: 3 },
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

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        sx={{ mt: 1 }}
      >
        <MenuItem onClick={() => handleNavigate("/dashboard/profile")}>
          Profile
        </MenuItem>
        <MenuItem onClick={() => handleNavigate("/dashboard/settings")}>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </Box>
  );
}

export default function DashboardLayout({
  children,
  role,
  userName = "User",
}: {
  children: React.ReactNode;
  role: AppRole;
  userName?: string;
}) {
  const baseTheme = useTheme();
  const isPatient = role === "patient";
  const isDarkMode = baseTheme.palette.mode === "dark";

  const dashboardTheme = React.useMemo(
    () =>
      createTheme(baseTheme, {
        shape: { borderRadius: isPatient ? 18 : 16 },
        palette: {
          primary: {
            main: isPatient
              ? isDarkMode
                ? "#2dd4bf"
                : "#0f766e"
              : isDarkMode
              ? "#38bdf8"
              : "#2563eb",
          },
          secondary: {
            main: isDarkMode ? "#f59e0b" : "#f97316",
          },
          background: {
            default: isDarkMode ? "#0b0f14" : "#f5f7fb",
            paper: isDarkMode ? "#121922" : "#ffffff",
          },
          text: {
            primary: isDarkMode ? "#e6edf7" : "#1c2430",
            secondary: isDarkMode ? "#9aa6b2" : "#5b6b7f",
          },
          divider: isDarkMode
            ? "rgba(255,255,255,0.08)"
            : "rgba(12,24,38,0.12)",
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: ({ theme }: ThemeCallbackProps) => ({
                backgroundImage: "none",
                border: `1px solid ${alpha(
                  theme.palette.mode === "dark"
                    ? theme.palette.common.white
                    : theme.palette.common.black,
                  theme.palette.mode === "dark" ? 0.06 : 0.08
                )}`,
                boxShadow:
                  theme.palette.mode === "dark"
                    ? "0 18px 40px rgba(2, 10, 20, 0.45)"
                    : "0 12px 28px rgba(15, 23, 42, 0.08)",
              }),
            },
          },
          MuiCard: {
            styleOverrides: {
              root: ({ theme }: ThemeCallbackProps) => ({
                borderRadius: getCardRadius(theme),
              }),
            },
          },
          MuiDivider: {
            styleOverrides: {
              root: ({ theme }: ThemeCallbackProps) => ({
                borderColor: theme.palette.divider,
              }),
            },
          },
          MuiTableCell: {
            styleOverrides: {
              head: ({ theme }: ThemeCallbackProps) => ({
                fontWeight: 700,
                color: theme.palette.text.secondary,
                borderColor: theme.palette.divider,
              }),
              body: ({ theme }: ThemeCallbackProps) => ({
                borderColor: theme.palette.divider,
              }),
            },
          },
        },
      }),
    [baseTheme, isPatient, isDarkMode]
  );

  return (
    <ThemeProvider theme={dashboardTheme}>
      <DashboardScaffold role={role} userName={userName}>
        {children}
      </DashboardScaffold>
    </ThemeProvider>
  );
}
