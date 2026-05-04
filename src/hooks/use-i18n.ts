"use client";

import { useState, useEffect, useCallback } from "react";
import { loadTranslations, getNestedValue, type Locale } from "@/lib/i18n";

export function useI18n() {
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [locale, setLocaleState] = useState<Locale>("fr");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let detected: Locale = "fr";

    // 1. Vérifier le cookie
    const match = document.cookie.match(/(?:^|;\s*)locale=([^;]+)/);
    const cookieLocale = match?.[1] as Locale;

    if (["fr", "ar", "en"].includes(cookieLocale)) {
      detected = cookieLocale;
    } else {
      // 2. Auto-detect via navigateur
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith("ar")) detected = "ar";
      else if (browserLang.startsWith("en")) detected = "en";
      else detected = "fr";
      
      // Sauvegarder dans cookie
      document.cookie = `locale=${detected}; path=/; max-age=${365 * 24 * 3600}; SameSite=Lax`;
    }

    setLocaleState(detected);
    
    loadTranslations(detected).then(data => {
      setTranslations(data);
      setLoaded(true);
    });
  }, []);

  const t = useCallback((key: string, values?: Record<string, string | number>): string => {
    let str = getNestedValue(translations, key);
    if (!str || str === key) return key;
    if (values) {
      Object.entries(values).forEach(([k, v]) => {
        str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
      });
    }
    return str;
  }, [translations]);

  const changeLocale = useCallback((newLocale: Locale) => {
    if (newLocale === locale) return;
    document.cookie = `locale=${newLocale}; path=/; max-age=${365 * 24 * 3600}; SameSite=Lax`;
    window.location.reload();
  }, [locale]);

  return { t, locale, loaded, isRTL: locale === "ar", changeLocale };
}