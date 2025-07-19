"use client";

import { useEffect, useState } from "react";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      className="border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring dark:hover:bg-accent/50 ml-4 inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium shadow-sm transition-colors focus:outline-none focus-visible:ring-2"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      <span className="ml-2 hidden sm:inline">
        {isDark ? "Light" : "Dark"} Mode
      </span>
    </button>
  );
}
