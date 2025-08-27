import * as React from "react";
import HomeIcon from "@mui/icons-material/Home";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import GroupsIcon from "@mui/icons-material/Groups";
import type { Lang } from "@/lib/i18n";

export type NavItem = { href: string; label: string; icon?: React.ReactNode };

export function getNavItems(lang: Lang): NavItem[] {
  // Labels localized manually (kept close to the nav)
  const L = {
    home: lang === "bn" ? "হোম" : "Home",
    find: lang === "bn" ? "ডাক্তার খুঁজুন" : "Find Doctor",
    prices: lang === "bn" ? "টেস্টের মূল্য" : "Test Prices",
    services: lang === "bn" ? "সেবাসমূহ" : "Services",
  };
  return [
    { href: "/", label: L.home, icon: <HomeIcon /> },
    { href: "/find-doctor", label: L.find, icon: <GroupsIcon /> },
    {
      href: "/medical-test-prices",
      label: L.prices,
      icon: <PriceChangeIcon />,
    },
    { href: "/services", label: L.services, icon: <LocalHospitalIcon /> },
  ];
}
