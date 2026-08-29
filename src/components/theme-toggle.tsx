"use client";

import { useEffect, useState } from "react";

import { Moon02Icon, Sun01Icon } from "@hugeicons/core-free-icons";
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
      variant="ghost"
      size="icon-lg"
      aria-label="Toggle theme"
      onClick={(e) => setTheme(isDark ? "light" : "dark", e)}
    >
      {isDark ? (
        <HugeiconsIcon icon={Moon02Icon} size={20} className="h-8 w-8" />
      ) : (
        <HugeiconsIcon icon={Sun01Icon} size={20} className="h-8 w-8" />
      )}
      {/* <span className="hidden sm:inline">{isDark ? "Light" : "Dark"} Mode</span> */}
    </Button>
  );
}
