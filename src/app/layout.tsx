"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    // إخفاء شريط Google Translate العلوي
    const removeGoogleTranslateBanner = () => {
      const banner = document.querySelector('.goog-te-banner-frame');
      if (banner) {
        (banner as HTMLElement).style.display = 'none';
      }
      document.body.style.top = '0px';
    };
    
    removeGoogleTranslateBanner();
    const interval = setInterval(removeGoogleTranslateBanner, 500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <html lang="fr" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster position="top-right" />
        </QueryClientProvider>
      </body>
    </html>
  );
}