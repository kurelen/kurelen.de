"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button
        className="rounded-md border px-3 py-1 text-sm opacity-60"
        aria-hidden
      >
        …
      </button>
    );
  }

  const isDark = (theme ?? resolvedTheme) === "dark";

  return (
    <button
      className="rounded-md border px-3 py-1 text-sm"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      aria-label="Toggle theme"
    >
      {isDark ? "🌙 Dark" : "🌞 Light"}
    </button>
  );
}
