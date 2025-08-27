"use client";

import * as React from "react";

export type Lang = "en" | "bn";

type Dict = Record<string, { en: string; bn: string }>;

const dict: Dict = {
  nav_home: { en: "Home", bn: "হোম" },
  nav_find: { en: "Find Doctor", bn: "ডাক্তার খুঁজুন" },
  nav_prices: { en: "Test Prices", bn: "টেস্টের মূল্য" },
  nav_services: { en: "Services", bn: "সেবাসমূহ" },
  portal: { en: "Portal", bn: "পোর্টাল" },
  admin_login: { en: "Admin Login", bn: "অ্যাডমিন লগইন" },
  dashboard: { en: "Dashboard", bn: "ড্যাশবোর্ড" },
  logout: { en: "Logout", bn: "লগআউট" },

  // Home hero
  hero_title: {
    en: "Trusted Diagnostics & Care",
    bn: "বিশ্বস্ত ডায়াগনস্টিক ও স্বাস্থ্যসেবা",
  },
  hero_sub: {
    en: "Book appointments, view reports, and explore services — all in one secure portal.",
    bn: "অ্যাপয়েন্টমেন্ট বুকিং, রিপোর্ট দেখা এবং সেবাসমূহ—সবকিছু এক নিরাপদ পোর্টালে।",
  },
  hero_cta: { en: "Find a Doctor", bn: "ডাক্তার খুঁজুন" },
  hero_cta2: { en: "View Test Prices", bn: "টেস্টের মূল্য দেখুন" },

  // Section title
  services_title: { en: "Our Services", bn: "আমাদের সেবাসমূহ" },
};

function t(key: keyof typeof dict, lang: Lang) {
  return dict[key][lang];
}

export const I18nContext = React.createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof dict) => string;
}>({
  lang: "en",
  setLang: () => {},
  t: () => "",
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = React.useState<Lang>("en");

  React.useEffect(() => {
    const stored = (typeof window !== "undefined" &&
      localStorage.getItem("lang")) as Lang | null;
    if (stored === "bn" || stored === "en") setLangState(stored);
  }, []);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("lang", lang);
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);

  return (
    <I18nContext.Provider value={{ lang, setLang, t: (k) => t(k, lang) }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return React.useContext(I18nContext);
}
