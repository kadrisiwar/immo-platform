export type Locale = "fr" | "ar" | "en";

// تحميل الترجمات
const cache: Record<string, Record<string, any>> = {};

export async function loadTranslations(locale: Locale) {
  if (cache[locale]) return cache[locale];
  try {
    const data = await import(`../../messages/${locale}.json`);
    cache[locale] = data.default;
    return data.default;
  } catch {
    const fallback = await import("../../messages/fr.json");
    return fallback.default;
  }
}

// ✅ Auto-detect language (cookie > browser > default)
export function getLocale(): Locale {
  // SSR - pas de window
  if (typeof window === "undefined") return "fr";

  // 1. Vérifier le cookie (préférence utilisateur)
  const match = document.cookie.match(/(?:^|;\s*)locale=([^;]+)/);
  const cookieLocale = match?.[1] as Locale;
  if (["fr", "ar", "en"].includes(cookieLocale)) {
    return cookieLocale;
  }

  // 2. Auto-detect via navigateur
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith("fr")) return "fr";
  if (browserLang.startsWith("ar")) return "ar";
  if (browserLang.startsWith("en")) return "en";

  // 3. Default
  return "fr";
}

// Sauvegarder la préférence utilisateur
export function setLocale(locale: Locale) {
  document.cookie = `locale=${locale}; path=/; max-age=${365 * 24 * 3600}; SameSite=Lax`;
  window.location.reload();
}

export function isRTL(locale: Locale) {
  return locale === "ar";
}

// Helper pour les clés imbriquées: "home.hero_title" → value
export function getNestedValue(obj: any, path: string): string {
  return path.split(".").reduce((acc, key) => acc?.[key], obj) ?? path;
}