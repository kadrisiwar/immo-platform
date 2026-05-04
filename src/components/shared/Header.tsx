"use client";

import { ThemeToggle } from "@/components/shared/ThemeToggle";

export function Header() {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      
      {/* Logo / Title */}
      <h1 className="text-xl font-bold">
        ImmoPlat
      </h1>

      {/* Dark Mode Button */}
      <ThemeToggle />

    </header>
  );
}