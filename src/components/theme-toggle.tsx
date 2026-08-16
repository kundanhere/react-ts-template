"use client";

import { useEffect, useState } from "react";

import { Moon01Icon, Sun01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { useTheme } from "@/hooks/use-theme";

import { Button } from "./ui/button";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? (
        <HugeiconsIcon icon={Sun01Icon} size={20} className="h-5 w-5" />
      ) : (
        <HugeiconsIcon icon={Moon01Icon} size={20} className="h-5 w-5" />
      )}
      <span className="hidden sm:inline">{isDark ? "Light" : "Dark"} Mode</span>
    </Button>
  );
}
