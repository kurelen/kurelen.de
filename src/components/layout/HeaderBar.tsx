"use client";

import ThemeToggle from "@/components/theme/ThemeToggle";
import LanguageSwitcher from "@/components/lang/LanguageSwitcher";

export default function HeaderBar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-end gap-2 p-3">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </header>
  );
}
