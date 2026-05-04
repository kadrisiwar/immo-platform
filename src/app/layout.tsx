"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import { getLocale, isRTL } from "@/lib/i18n";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [dir, setDir] = useState("ltr");
  const [lang, setLang] = useState("fr");

  useEffect(() => {
    const locale = getLocale();
    setLang(locale);
    setDir(isRTL(locale) ? "rtl" : "ltr");
  }, []);

  return (
    <html lang={lang} dir={dir} suppressHydrationWarning>
      <head>
        <title>ImmoPlat — Location immobilière en Tunisie</title>
        <meta name="description" content="Trouvez votre logement idéal en Tunisie" />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryClientProvider client={queryClient}>
            {children}
            <Toaster position="top-right" />
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}