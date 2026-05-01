"use client";

import { useEffect, useState } from "react";
import { getLocale } from "@/lib/locale";

// Translations cache
const cache: Record<string, Record<string, string>> = {};

async function loadTranslations(locale: string) {
  if (cache[locale]) return cache[locale];
  try {
    const data = await import(`../../../messages/${locale}.json`);
    // Flatten nested object
    const flat: Record<string, string> = {};
    function flatten(obj: any, prefix = "") {
      for (const key of Object.keys(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === "object") {
          flatten(obj[key], fullKey);
        } else {
          flat[fullKey] = obj[key];
        }
      }
    }
    flatten(data.default);
    cache[locale] = flat;
    return flat;
  } catch {
    return {};
  }
}

interface TProps {
  k: string;
  values?: Record<string, string | number>;
  fallback?: string;
}

export function T({ k, values, fallback }: TProps) {
  const [text, setText] = useState(fallback || k);

  useEffect(() => {
    const locale = getLocale();
    loadTranslations(locale).then(translations => {
      let str = translations[k] || fallback || k;
      if (values) {
        for (const [key, val] of Object.entries(values)) {
          str = str.replace(`{${key}}`, String(val));
        }
      }
      setText(str);
    });
  }, [k, fallback, JSON.stringify(values)]);

  return <>{text}</>;
}

// Hook version
export function useT() {
  const [translations, setTranslations] = useState<Record<string, string>>({});

  useEffect(() => {
    const locale = getLocale();
    loadTranslations(locale).then(setTranslations);
  }, []);

  return (k: string, values?: Record<string, string | number>) => {
    let str = translations[k] || k;
    if (values) {
      for (const [key, val] of Object.entries(values)) {
        str = str.replace(`{${key}}`, String(val));
      }
    }
    return str;
  };
}