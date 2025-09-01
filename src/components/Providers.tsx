"use client";

import { SessionProvider } from "next-auth/react";
import { I18nProvider } from "@/lib/i18n";
import { ThemeRegistry } from "@/lib/theme/ThemeRegistry";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeRegistry>
      <I18nProvider>
        <SessionProvider>{children}</SessionProvider>
      </I18nProvider>
    </ThemeRegistry>
  );
}
