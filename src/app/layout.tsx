import type { Metadata } from "next";
import { ThemeRegistry } from "@/lib/theme/ThemeRegistry";
import { I18nProvider } from "@/lib/i18n";
import AppShell from "@/components/layout/AppShell";
import "@/styles/globals.css";
import { Inter, Hind_Siliguri } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bn",
  display: "swap",
});

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
    <html lang="en" className={`${inter.variable} ${hindSiliguri.variable}`}>
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
