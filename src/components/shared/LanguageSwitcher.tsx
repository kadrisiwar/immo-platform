"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { getLocale, setLocale, type Locale } from "@/lib/locale";

const LANGUAGES = [
  { code: "fr", label: "Français",  flag: "🇫🇷" },
  { code: "ar", label: "العربية",   flag: "🇹🇳" },
  { code: "en", label: "English",   flag: "🇬🇧" },
];

export function LanguageSwitcher() {
  const [current, setCurrent] = useState<Locale>("fr");

  useEffect(() => {
    setCurrent(getLocale());
  }, []);

  const handleChange = (locale: Locale) => {
    setCurrent(locale);
    setLocale(locale);
  };

  const currentLang = LANGUAGES.find(l => l.code === current);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span>{currentLang?.flag} {currentLang?.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGES.map(lang => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleChange(lang.code as Locale)}
            className={current === lang.code ? "font-bold bg-accent" : ""}
          >
            <span className="mr-2 text-lg">{lang.flag}</span>
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}