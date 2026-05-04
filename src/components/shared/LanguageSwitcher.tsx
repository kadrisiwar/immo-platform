"use client";

import { useI18n } from "@/hooks/use-i18n";

const LANGUAGES = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "ar", label: "العربية", flag: "🇹🇳" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

export function LanguageSwitcher() {
  const { locale, changeLocale, loaded } = useI18n();

  if (!loaded) return null; // لا نعرض الزر حتى تكتمل الترجمة

  return (
    <div className="flex gap-2">
      {LANGUAGES.map(lang => (
        <button
          key={lang.code}
          onClick={() => changeLocale(lang.code as any)}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            locale === lang.code
              ? "bg-primary text-primary-foreground"
              : "bg-secondary hover:bg-secondary/80"
          }`}
        >
          <span className="mr-1">{lang.flag}</span>
          {lang.label}
        </button>
      ))}
    </div>
  );
}