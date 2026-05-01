"use client";

export type Locale = "fr" | "ar" | "en";

export function getLocale(): Locale {
  if (typeof document === "undefined") return "fr";
  const match = document.cookie.match(/locale=([^;]+)/);
  return (match?.[1] as Locale) || "fr";
}

export function setLocale(locale: Locale) {
  document.cookie = `locale=${locale}; path=/; max-age=${365 * 24 * 3600}`;
  window.location.reload();
}

export function isRTL(locale: Locale) {
  return locale === "ar";
}