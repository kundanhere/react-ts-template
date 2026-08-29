import { MouseEvent as ReactMouseEvent, useEffect, useState } from "react";

import { flushSync } from "react-dom";

type Theme = "light" | "dark" | "system";

// Shared transitioning flag to prevent concurrent transition triggers across multiple hook instances
let isTransitioning = false;

// Helper to safely invoke startViewTransition
const startViewTransition = (callback: () => void) => {
  if (typeof document !== "undefined" && "startViewTransition" in document) {
    return (document as any).startViewTransition(callback);
  }
  return null;
};

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

      const applyTheme = () => {
        setResolvedTheme(newResolvedTheme);
        if (newResolvedTheme === "dark") {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      };

      const currentIsDark = root.classList.contains("dark");
      const targetIsDark = newResolvedTheme === "dark";

      if (currentIsDark !== targetIsDark && !isTransitioning) {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          applyTheme();
          return;
        }

        const xStr = root.style.getPropertyValue("--x");
        const yStr = root.style.getPropertyValue("--y");
        const x = xStr ? parseFloat(xStr) : window.innerWidth / 2;
        const y = yStr ? parseFloat(yStr) : window.innerHeight / 2;

        const endRadius = Math.hypot(
          Math.max(x, window.innerWidth - x),
          Math.max(y, window.innerHeight - y)
        );

        const transition = startViewTransition(() => {
          flushSync(() => {
            applyTheme();
          });
        });

        if (transition) {
          isTransitioning = true;

          transition.ready.then(() => {
            document.documentElement.animate(
              {
                clipPath: [
                  `circle(0px at ${x}px ${y}px)`,
                  `circle(${endRadius}px at ${x}px ${y}px)`,
                ],
              },
              {
                duration: 500,
                easing: "ease-in-out",
                pseudoElement: "::view-transition-new(root)",
              }
            );
          });

          transition.finished.finally(() => {
            isTransitioning = false;
          });
        } else {
          // Fallback: use a CSS class to transition smoothly
          root.classList.add("theme-transition");
          applyTheme();
          setTimeout(() => {
            root.classList.remove("theme-transition");
          }, 300);
        }
      } else {
        applyTheme();
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

    const applyColor = () => {
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
    };

    // Check if the target class is already applied to avoid redundant transition animations
    const activeColors: ThemeColor[] = [
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
    const currentActiveColor =
      activeColors.find((c) => root.classList.contains(`theme-${c}`)) ||
      "default";

    if (currentActiveColor !== themeColor && !isTransitioning) {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        applyColor();
        return;
      }

      const xStr = root.style.getPropertyValue("--x");
      const yStr = root.style.getPropertyValue("--y");
      const x = xStr ? parseFloat(xStr) : window.innerWidth / 2;
      const y = yStr ? parseFloat(yStr) : window.innerHeight / 2;

      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const transition = startViewTransition(() => {
        flushSync(() => {
          applyColor();
        });
      });

      if (transition) {
        isTransitioning = true;

        transition.ready.then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 500,
              easing: "ease-in-out",
              pseudoElement: "::view-transition-new(root)",
            }
          );
        });

        transition.finished.finally(() => {
          isTransitioning = false;
        });
      } else {
        root.classList.add("theme-transition");
        applyColor();
        setTimeout(() => {
          root.classList.remove("theme-transition");
        }, 300);
      }
    } else {
      applyColor();
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

  const setThemeValue = (
    newTheme: Theme,
    event?: ReactMouseEvent<any> | MouseEvent
  ) => {
    const root =
      typeof window !== "undefined" ? window.document.documentElement : null;

    const applyThemeChange = () => {
      let newResolvedTheme: "light" | "dark";

      if (newTheme === "system") {
        newResolvedTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";
      } else {
        newResolvedTheme = newTheme;
      }

      setTheme(newTheme);
      setResolvedTheme(newResolvedTheme);

      if (root) {
        if (newResolvedTheme === "dark") {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }

      localStorage.setItem("theme", newTheme);
      dispatchChangeEvent();
    };

    if (typeof window !== "undefined" && root) {
      let x = window.innerWidth / 2;
      let y = window.innerHeight / 2;

      if (event) {
        if (event.clientX !== 0 || event.clientY !== 0) {
          x = event.clientX;
          y = event.clientY;
        } else {
          const target = event.currentTarget || event.target;
          if (target instanceof HTMLElement) {
            const rect = target.getBoundingClientRect();
            x = rect.left + rect.width / 2;
            y = rect.top + rect.height / 2;
          }
        }
      }

      root.style.setProperty("--x", `${x}px`);
      root.style.setProperty("--y", `${y}px`);

      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const currentIsDark = root.classList.contains("dark");
      let targetIsDark = false;
      if (newTheme === "system") {
        targetIsDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
      } else {
        targetIsDark = newTheme === "dark";
      }

      const shouldAnimate = currentIsDark !== targetIsDark;

      if (shouldAnimate && !isTransitioning) {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          applyThemeChange();
          return;
        }

        const transition = startViewTransition(() => {
          flushSync(() => {
            applyThemeChange();
          });
        });

        if (transition) {
          isTransitioning = true;
          transition.ready.then(() => {
            document.documentElement.animate(
              {
                clipPath: [
                  `circle(0px at ${x}px ${y}px)`,
                  `circle(${endRadius}px at ${x}px ${y}px)`,
                ],
              },
              {
                duration: 500,
                easing: "ease-in-out",
                pseudoElement: "::view-transition-new(root)",
              }
            );
          });
          transition.finished.finally(() => {
            isTransitioning = false;
          });
        } else {
          root.classList.add("theme-transition");
          applyThemeChange();
          setTimeout(() => {
            root.classList.remove("theme-transition");
          }, 300);
        }
      } else {
        applyThemeChange();
      }
    } else {
      setTheme(newTheme);
    }
  };

  const setThemeColorValue = (
    newColor: ThemeColor,
    event?: ReactMouseEvent<any> | MouseEvent
  ) => {
    const root =
      typeof window !== "undefined" ? window.document.documentElement : null;

    const applyColorChange = () => {
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
        if (root) root.classList.remove(`theme-${c}`);
      });

      if (newColor !== "default" && root) {
        root.classList.add(`theme-${newColor}`);
      }

      setThemeColor(newColor);
      localStorage.setItem("theme-color", newColor);
      dispatchChangeEvent();
    };

    if (typeof window !== "undefined" && root) {
      let x = window.innerWidth / 2;
      let y = window.innerHeight / 2;

      if (event) {
        if (event.clientX !== 0 || event.clientY !== 0) {
          x = event.clientX;
          y = event.clientY;
        } else {
          const target = event.currentTarget || event.target;
          if (target instanceof HTMLElement) {
            const rect = target.getBoundingClientRect();
            x = rect.left + rect.width / 2;
            y = rect.top + rect.height / 2;
          }
        }
      }

      root.style.setProperty("--x", `${x}px`);
      root.style.setProperty("--y", `${y}px`);

      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const activeColors: ThemeColor[] = [
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
      const currentActiveColor =
        activeColors.find((c) => root.classList.contains(`theme-${c}`)) ||
        "default";

      const shouldAnimate = currentActiveColor !== newColor;

      if (shouldAnimate && !isTransitioning) {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          applyColorChange();
          return;
        }

        const transition = startViewTransition(() => {
          flushSync(() => {
            applyColorChange();
          });
        });

        if (transition) {
          isTransitioning = true;
          transition.ready.then(() => {
            document.documentElement.animate(
              {
                clipPath: [
                  `circle(0px at ${x}px ${y}px)`,
                  `circle(${endRadius}px at ${x}px ${y}px)`,
                ],
              },
              {
                duration: 500,
                easing: "ease-in-out",
                pseudoElement: "::view-transition-new(root)",
              }
            );
          });
          transition.finished.finally(() => {
            isTransitioning = false;
          });
        } else {
          root.classList.add("theme-transition");
          applyColorChange();
          setTimeout(() => {
            root.classList.remove("theme-transition");
          }, 300);
        }
      } else {
        applyColorChange();
      }
    } else {
      setThemeColor(newColor);
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
