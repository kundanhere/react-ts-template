import * as React from "react";

import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { type ThemeColor, useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

const fontSizes = [13, 14, 15, 16, 18, 20, 22];

export default function AppearanceTab() {
  const {
    theme,
    setTheme,
    themeColor,
    setThemeColor,
    fontSize,
    setFontSize,
    radius,
    setRadius,
    compactMode,
    setCompactMode,
  } = useTheme();

  // Local state to track temporary font size during scrubbing/dragging
  const [tempFontSize, setTempFontSize] = React.useState(fontSize);

  // Sync local temp state when global font size changes (e.g. from storage/sync)
  React.useEffect(() => {
    setTempFontSize(fontSize);
  }, [fontSize]);

  const colors = [
    { name: "Default", id: "default" as ThemeColor, bg: "bg-teal-600" },
    {
      name: "Zinc",
      id: "zinc" as ThemeColor,
      bg: "bg-zinc-700 dark:bg-zinc-300",
    },
    { name: "Slate", id: "slate" as ThemeColor, bg: "bg-slate-500" },
    { name: "Blue", id: "blue" as ThemeColor, bg: "bg-blue-600" },
    { name: "Violet", id: "violet" as ThemeColor, bg: "bg-violet-600" },
    { name: "Green", id: "green" as ThemeColor, bg: "bg-green-600" },
    { name: "Orange", id: "orange" as ThemeColor, bg: "bg-orange-500" },
    { name: "Red", id: "red" as ThemeColor, bg: "bg-red-600" },
    { name: "Rose", id: "rose" as ThemeColor, bg: "bg-rose-500" },
    { name: "Yellow", id: "yellow" as ThemeColor, bg: "bg-yellow-500" },
  ];

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Appearance</h2>
        <p className="text-muted-foreground text-xs">
          Customize the theme, accent color, text scaling, and interface
          spacing.
        </p>
      </div>

      <div className="border-border/60 border-t" />

      <div className="space-y-6">
        {/* Theme Mode Section */}
        <div>
          <h3 className="mb-2 text-sm font-semibold">Theme Mode</h3>
          <p className="text-muted-foreground mb-4 text-xs">
            Choose how the user interface is displayed on your device.
          </p>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Light Theme Card */}
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`hover:bg-muted/40 flex flex-col items-start rounded-lg border p-4 text-left transition-all ${
                theme === "light"
                  ? "border-primary ring-primary/20 bg-muted/20 ring-2"
                  : "border-border bg-card"
              }`}
            >
              <div className="border-border mb-3 flex aspect-16/10 w-full flex-col gap-1 rounded-md border bg-white p-2 shadow-xs">
                <div className="h-2 w-1/3 rounded bg-slate-200" />
                <div className="h-2 w-2/3 rounded bg-slate-100" />
                <div className="mt-auto flex items-center gap-1.5">
                  <div className="size-4 rounded-full bg-slate-300" />
                  <div className="h-2 flex-1 rounded bg-slate-200" />
                </div>
              </div>
              <span className="text-xs font-semibold">Light Mode</span>
              <span className="text-muted-foreground mt-0.5 text-[10px]">
                A bright, clean appearance optimized for daylight.
              </span>
            </button>

            {/* Dark Theme Card */}
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`hover:bg-muted/40 flex flex-col items-start rounded-lg border p-4 text-left transition-all ${
                theme === "dark"
                  ? "border-primary ring-primary/20 bg-muted/20 ring-2"
                  : "border-border bg-card"
              }`}
            >
              <div className="mb-3 flex aspect-16/10 w-full flex-col gap-1 rounded-md border border-zinc-800 bg-zinc-950 p-2 shadow-xs">
                <div className="h-2 w-1/3 rounded bg-zinc-800" />
                <div className="h-2 w-2/3 rounded bg-zinc-900" />
                <div className="mt-auto flex items-center gap-1.5">
                  <div className="size-4 rounded-full bg-zinc-800" />
                  <div className="h-2 flex-1 rounded bg-zinc-800" />
                </div>
              </div>
              <span className="text-xs font-semibold">Dark Mode</span>
              <span className="text-muted-foreground mt-0.5 text-[10px]">
                A dark interface designed to reduce eye strain in low-light
                environments.
              </span>
            </button>

            {/* System Theme Card */}
            <button
              type="button"
              onClick={() => setTheme("system")}
              className={`hover:bg-muted/40 flex flex-col items-start rounded-lg border p-4 text-left transition-all ${
                theme === "system"
                  ? "border-primary ring-primary/20 bg-muted/20 ring-2"
                  : "border-border bg-card"
              }`}
            >
              <div className="border-border relative mb-3 flex aspect-16/10 w-full flex-col gap-1 overflow-hidden rounded-md border bg-linear-to-r from-white to-zinc-950 p-2 shadow-xs">
                <div className="absolute inset-0 flex">
                  <div className="flex w-1/2 flex-col gap-1 bg-white p-2">
                    <div className="h-2 w-2/3 rounded bg-slate-200" />
                    <div className="h-2 w-full rounded bg-slate-100" />
                  </div>
                  <div className="flex w-1/2 flex-col gap-1 bg-zinc-950 p-2">
                    <div className="h-2 w-2/3 rounded bg-zinc-800" />
                    <div className="h-2 w-full rounded bg-zinc-900" />
                  </div>
                </div>
              </div>
              <span className="text-xs font-semibold">Sync with System</span>
              <span className="text-muted-foreground mt-0.5 text-[10px]">
                Automatically match your system's light or dark mode settings.
              </span>
            </button>
          </div>
        </div>

        <div className="border-border/60 border-t pt-6" />

        {/* Color Theme Section */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold">Color Theme</h3>
            <p className="text-muted-foreground text-xs">
              Choose the primary accent color for buttons, active states, and
              focus indicators.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {colors.map((c) => {
              const isActive = themeColor === c.id;
              return (
                <Tooltip key={c.id}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => setThemeColor(c.id)}
                      className={cn(
                        "relative flex size-6 cursor-pointer items-center justify-center rounded-full border border-black/10 transition-all hover:scale-105 active:scale-95 dark:border-white/10",
                        c.bg,
                        isActive
                          ? "ring-primary ring-offset-background scale-105 shadow-sm ring-2 ring-offset-2"
                          : "opacity-85 hover:opacity-100"
                      )}
                      aria-label={c.name}
                    >
                      {isActive && (
                        <HugeiconsIcon
                          icon={Tick02Icon}
                          strokeWidth={2.5}
                          className={cn(
                            "size-3 text-white",
                            c.id === "yellow" && "text-yellow-950",
                            c.id === "zinc" && "text-white dark:text-zinc-950"
                          )}
                        />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={7}>
                    {c.name}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>

        <div className="border-border/60 border-t pt-6" />

        {/* Font Size Section */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold">Font Size</h3>
            <p className="text-muted-foreground text-xs">
              Scale the size of the interface text to your preference.
            </p>
          </div>

          <div className="bg-muted/20 flex max-w-md items-center gap-4 rounded-lg border p-4">
            <span className="text-muted-foreground text-xs font-medium select-none">
              A
            </span>
            <div className="relative flex flex-1 items-center">
              <Slider
                min={0}
                max={fontSizes.length - 1}
                step={1}
                value={[
                  fontSizes.indexOf(tempFontSize) !== -1
                    ? fontSizes.indexOf(tempFontSize)
                    : 3,
                ]}
                onValueChange={(val) => {
                  const idx = Array.isArray(val) ? val[0] : val;
                  setTempFontSize(fontSizes[idx]);
                }}
                onValueCommitted={(val) => {
                  const idx = Array.isArray(val) ? val[0] : val;
                  setFontSize(fontSizes[idx]);
                }}
                className="relative z-10 w-full"
              />
              {/* Stopper Dots */}
              <div className="pointer-events-none absolute inset-y-0 right-1.5 left-1.5 z-20 flex items-center">
                {fontSizes.map((val, idx) => {
                  const pct = (idx / (fontSizes.length - 1)) * 100;
                  const isPast = val <= tempFontSize;
                  return (
                    <span
                      key={val}
                      className={`absolute size-1.5 -translate-x-1/2 rounded-full transition-all ${
                        isPast
                          ? "bg-background opacity-100"
                          : "bg-primary opacity-35"
                      }`}
                      style={{ left: `${pct}%` }}
                    />
                  );
                })}
              </div>
            </div>
            <span className="text-lg font-semibold select-none">A</span>
            <span className="text-muted-foreground min-w-12 text-right text-xs font-semibold">
              {tempFontSize}px
            </span>
          </div>
        </div>

        <div className="border-border/60 border-t pt-6" />

        {/* Border Radius Section */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold">Border Radius</h3>
            <p className="text-muted-foreground text-xs">
              Adjust the roundness of corners for buttons, cards, and inputs.
            </p>
          </div>

          <div className="bg-muted/20 rounded-lg border p-4">
            <ToggleGroup
              type="single"
              variant="outline"
              value={String(radius)}
              onValueChange={(value) => {
                if (value) setRadius(Number(value));
              }}
              className="flex flex-wrap gap-2"
            >
              <ToggleGroupItem value="0" className="cursor-pointer text-xs">
                Sharp (0)
              </ToggleGroupItem>
              <ToggleGroupItem value="0.3" className="cursor-pointer text-xs">
                Compact (0.3)
              </ToggleGroupItem>
              <ToggleGroupItem value="0.5" className="cursor-pointer text-xs">
                Medium (0.5)
              </ToggleGroupItem>
              <ToggleGroupItem value="0.75" className="cursor-pointer text-xs">
                Comfortable (0.75)
              </ToggleGroupItem>
              <ToggleGroupItem value="1" className="cursor-pointer text-xs">
                Rounded (1.0)
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        <div className="border-border/60 border-t pt-6" />

        {/* Accessibility Density mode */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Accessibility & Density</h3>
          <div className="bg-muted/20 flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label
                htmlFor="compact-mode"
                className="cursor-pointer text-xs font-semibold"
              >
                Compact density mode
              </Label>
              <p className="text-muted-foreground text-[11px]">
                Reduce row heights and margins to fit more information on
                screen.
              </p>
            </div>
            <Checkbox
              id="compact-mode"
              checked={compactMode}
              onCheckedChange={(checked) => setCompactMode(!!checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
