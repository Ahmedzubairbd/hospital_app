import type { Metadata } from "next";
import AppShell from "@/components/layout/AppShell";
import { I18nProvider } from "@/lib/i18n";
import { ThemeRegistry } from "@/lib/theme/ThemeRegistry";
import "@/styles/globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Amin Diagnostics",
  description: "Hospital & Diagnostics Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body>
        <ThemeRegistry>
          <I18nProvider>
            <AppShell>{children}</AppShell>
          </I18nProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
