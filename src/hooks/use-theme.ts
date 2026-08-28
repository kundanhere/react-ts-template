import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

export type ThemeColor =
  | "default"
  | "zinc"
  | "slate"
  | "blue"
  | "violet"
  | "green"
  | "orange"
  | "red"
  | "rose"
  | "yellow";

const APPEARANCE_EVENT = "appearance-settings-change";

export function useTheme() {
  const getStoredTheme = (): Theme => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as Theme) || "system";
    }
    return "system";
  };

  const getStoredThemeColor = (): ThemeColor => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme-color") as ThemeColor) || "default";
    }
    return "default";
  };

  const getStoredFontSize = (): number => {
    if (typeof window !== "undefined") {
      return Number(localStorage.getItem("font-size")) || 16;
    }
    return 16;
  };

  const getStoredRadius = (): number => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme-radius");
      return stored !== null ? Number(stored) : 0.75;
    }
    return 0.75;
  };

  const getStoredCompactMode = (): boolean => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("compact-mode");
      return stored !== null ? stored === "true" : true;
    }
    return true;
  };

  const [theme, setTheme] = useState<Theme>(getStoredTheme);
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const [themeColor, setThemeColor] = useState<ThemeColor>(getStoredThemeColor);
  const [fontSize, setFontSize] = useState<number>(getStoredFontSize);
  const [radius, setRadius] = useState<number>(getStoredRadius);
  const [compactMode, setCompactMode] = useState<boolean>(getStoredCompactMode);

  // Synchronize instances of hook across the application
  useEffect(() => {
    const handleSync = () => {
      setTheme(getStoredTheme());
      setThemeColor(getStoredThemeColor());
      setFontSize(getStoredFontSize());
      setRadius(getStoredRadius());
      setCompactMode(getStoredCompactMode());
    };

    window.addEventListener(APPEARANCE_EVENT, handleSync);
    window.addEventListener("storage", handleSync);

    return () => {
      window.removeEventListener(APPEARANCE_EVENT, handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  // Apply theme class (dark / light)
  useEffect(() => {
    const root = window.document.documentElement;

    const updateTheme = () => {
      let newResolvedTheme: "light" | "dark";

      if (theme === "system") {
        newResolvedTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";
      } else {
        newResolvedTheme = theme;
      }

      setResolvedTheme(newResolvedTheme);

      if (newResolvedTheme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    updateTheme();

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", updateTheme);
      return () => mediaQuery.removeEventListener("change", updateTheme);
    }
  }, [theme]);

  // Apply theme color class
  useEffect(() => {
    const root = window.document.documentElement;

    // Remove other theme color classes
    const colors: ThemeColor[] = [
      "zinc",
      "slate",
      "blue",
      "violet",
      "green",
      "orange",
      "red",
      "rose",
      "yellow",
    ];
    colors.forEach((c) => {
      root.classList.remove(`theme-${c}`);
    });

    if (themeColor !== "default") {
      root.classList.add(`theme-${themeColor}`);
    }
  }, [themeColor]);

  // Apply font size style
  useEffect(() => {
    const root = window.document.documentElement;
    root.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  // Apply border radius CSS variable
  useEffect(() => {
    const root = window.document.documentElement;
    root.style.setProperty("--radius", `${radius}rem`);
  }, [radius]);

  // Apply compact density class
  useEffect(() => {
    const root = window.document.documentElement;
    if (compactMode) {
      root.classList.add("density-compact");
    } else {
      root.classList.remove("density-compact");
    }
  }, [compactMode]);

  const dispatchChangeEvent = () => {
    window.dispatchEvent(new Event(APPEARANCE_EVENT));
  };

  const setThemeValue = (newTheme: Theme) => {
    setTheme(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme);
      dispatchChangeEvent();
    }
  };

  const setThemeColorValue = (newColor: ThemeColor) => {
    setThemeColor(newColor);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme-color", newColor);
      dispatchChangeEvent();
    }
  };

  const setFontSizeValue = (newSize: number) => {
    setFontSize(newSize);
    if (typeof window !== "undefined") {
      localStorage.setItem("font-size", String(newSize));
      dispatchChangeEvent();
    }
  };

  const setRadiusValue = (newRadius: number) => {
    setRadius(newRadius);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme-radius", String(newRadius));
      dispatchChangeEvent();
    }
  };

  const setCompactModeValue = (newCompact: boolean) => {
    setCompactMode(newCompact);
    if (typeof window !== "undefined") {
      localStorage.setItem("compact-mode", String(newCompact));
      dispatchChangeEvent();
    }
  };

  return {
    theme,
    setTheme: setThemeValue,
    resolvedTheme,
    themeColor,
    setThemeColor: setThemeColorValue,
    fontSize,
    setFontSize: setFontSizeValue,
    radius,
    setRadius: setRadiusValue,
    compactMode,
    setCompactMode: setCompactModeValue,
  };
}
