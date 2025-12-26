import type { Metadata } from "next";
import AppShell from "@/components/layout/AppShell";
import Providers from "@/components/Providers";
import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { listPublishedCmsPages } from "@/lib/cms";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Amin Diagnostics",
  description: "Hospital & Diagnostics Platform",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cmsPages = await listPublishedCmsPages();
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body>
        <Providers>
          <AppShell cmsPages={cmsPages}>
            {children}
            <Analytics />
          </AppShell>
        </Providers>
      </body>
    </html>
  );
}
