import { useState } from "react";

import {
  CheckmarkCircle02Icon,
  ComputerIcon,
  Moon02Icon,
  PaintBoardIcon,
  Sun01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  BottomLayoutIllustration,
  EmptyAnalyticsIllustration,
  EmptyCardPickerIllustration,
  EmptyChartIllustration,
  EmptyDataTable,
  EmptyFormIllustration,
  EmptyNoMeetingsIllustration,
  EmptySearchResultsIllustration,
  EmptySourceIllustration,
  EmptyTableIllustration,
  EmptyThreadsIllustration,
  SidebarLayoutIllustration,
  TopLayoutIllustration,
} from "@/components/empty";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type ThemeColor, useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

const illustrations = [
  {
    name: "EmptyTableIllustration",
    title: "Table Empty State",
    description:
      "Database table rows with header columns, search lens, and active cell highlight.",
    category: "Data & Tables",
    component: <EmptyTableIllustration className="h-32 w-auto" />,
  },
  {
    name: "EmptyAnalyticsIllustration",
    title: "Analytics & Trends",
    description:
      "Multi-layered area charts, trend spikes, column metrics, and focal magnifying glass.",
    category: "Charts & Analytics",
    component: <EmptyAnalyticsIllustration className="h-32 w-auto" />,
  },
  {
    name: "EmptyChartIllustration",
    title: "Chart & Metrics",
    description:
      "Pie charts, vertical bar graphs, and inspect magnifying lens.",
    category: "Charts & Analytics",
    component: <EmptyChartIllustration className="h-32 w-auto" />,
  },
  {
    name: "EmptyNoMeetingsIllustration",
    title: "Calendar & Schedule",
    description:
      "Calendar event planner sheet with clock markers and active meeting status.",
    category: "Productivity",
    component: <EmptyNoMeetingsIllustration className="h-32 w-auto" />,
  },
  {
    name: "EmptyFormIllustration",
    title: "Form & Records",
    description:
      "Layered clipboards with header clamps, field inputs, and search inspect glass.",
    category: "Productivity",
    component: <EmptyFormIllustration className="h-32 w-auto" />,
  },
  {
    name: "EmptySourceIllustration",
    title: "Connected Sources & Integrations",
    description:
      "App cards preserving authentic Slack, Figma, and Google Drive branding.",
    category: "Integrations",
    component: <EmptySourceIllustration className="h-32 w-auto" />,
  },
  {
    name: "EmptyCardPickerIllustration",
    title: "Card Picker & Widgets",
    description:
      "Assorted visual cards (columns, pie slices, vertical bars) under review.",
    category: "Selection & Filtering",
    component: <EmptyCardPickerIllustration className="h-32 w-auto" />,
  },
  {
    name: "EmptySearchResultsIllustration",
    title: "Search Results",
    description:
      "Search results with profile avatar, tag chip, document badge, and lens.",
    category: "Selection & Filtering",
    component: <EmptySearchResultsIllustration className="h-32 w-auto" />,
  },
  {
    name: "EmptyThreadsIllustration",
    title: "Threads & Conversations",
    description:
      "Layered chat dialogue bubbles, user avatars, and resolved check badge.",
    category: "Communication",
    component: <EmptyThreadsIllustration className="h-32 w-auto" />,
  },
  {
    name: "BottomLayoutIllustration",
    title: "Bottom Panel Layout",
    description:
      "Window frame with macOS traffic light controls and active bottom bar region.",
    category: "Layouts & UI",
    component: <BottomLayoutIllustration className="h-24 w-auto" />,
  },
  {
    name: "SidebarLayoutIllustration",
    title: "Sidebar Layout",
    description:
      "Window frame with macOS traffic light controls and active sidebar panel region.",
    category: "Layouts & UI",
    component: <SidebarLayoutIllustration className="h-24 w-auto" />,
  },
  {
    name: "TopLayoutIllustration",
    title: "Top Navigation Layout",
    description:
      "Window frame with macOS traffic light controls and active top navigation bar.",
    category: "Layouts & UI",
    component: <TopLayoutIllustration className="h-24 w-auto" />,
  },
];

const colorOptions: { key: ThemeColor; label: string; swatch: string }[] = [
  {
    key: "default",
    label: "Default",
    swatch: "bg-neutral-900 dark:bg-neutral-100",
  },
  { key: "zinc", label: "Zinc", swatch: "bg-zinc-600" },
  { key: "bronze", label: "Bronze", swatch: "bg-amber-700" },
  { key: "indigo", label: "Indigo", swatch: "bg-indigo-600" },
  { key: "violet", label: "Violet", swatch: "bg-violet-600" },
  { key: "fuchsia", label: "Fuchsia", swatch: "bg-fuchsia-600" },
  { key: "orange", label: "Orange", swatch: "bg-orange-500" },
  { key: "rose", label: "Rose", swatch: "bg-rose-500" },
];

export default function TestIllustrationPage() {
  const { theme, setTheme, resolvedTheme, themeColor, setThemeColor } =
    useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    "all",
    ...Array.from(new Set(illustrations.map((i) => i.category))),
  ];

  const filteredIllustrations =
    selectedCategory === "all"
      ? illustrations
      : illustrations.filter((i) => i.category === selectedCategory);

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Top Header & Controls */}
      <header className="border-border bg-card/80 sticky top-0 z-30 border-b backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                Illustration System Test
              </h1>
              <Badge
                variant="outline"
                className="text-primary border-primary/30 font-medium"
              >
                Dynamic Theme Support
              </Badge>
            </div>
            <p className="text-muted-foreground mt-0.5 text-xs sm:text-sm">
              Live demonstration of theme-adaptive illustrations with real-time
              accent & mode switching.
            </p>
          </div>

          {/* Theme & Mode Switchers */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Mode Controls */}
            <div className="border-border bg-muted/40 flex items-center rounded-lg border p-1">
              <Button
                variant={theme === "light" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 px-2.5 text-xs"
                onClick={(e) => setTheme("light", e)}
              >
                <HugeiconsIcon icon={Sun01Icon} size={14} className="mr-1.5" />
                Light
              </Button>
              <Button
                variant={theme === "dark" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 px-2.5 text-xs"
                onClick={(e) => setTheme("dark", e)}
              >
                <HugeiconsIcon icon={Moon02Icon} size={14} className="mr-1.5" />
                Dark
              </Button>
              <Button
                variant={theme === "system" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 px-2.5 text-xs"
                onClick={(e) => setTheme("system", e)}
              >
                <HugeiconsIcon
                  icon={ComputerIcon}
                  size={14}
                  className="mr-1.5"
                />
                System
              </Button>
            </div>
          </div>
        </div>

        {/* Accent Color Palette Selector Bar */}
        <div className="border-border/60 bg-muted/20 border-t px-4 py-2.5 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 sm:gap-3">
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
              <HugeiconsIcon icon={PaintBoardIcon} size={14} />
              <span>Accent:</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {colorOptions.map(({ key, label, swatch }) => {
                const isActive = themeColor === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={(e) => setThemeColor(key, e)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-all",
                      isActive
                        ? "border-primary bg-primary/10 text-primary ring-primary/40 shadow-xs ring-1"
                        : "border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span className={cn("size-2.5 rounded-full", swatch)} />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Category Filter Tabs */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="capitalize"
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Illustrations Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredIllustrations.map((item) => (
            <Card
              key={item.name}
              className="border-border bg-card flex flex-col justify-between overflow-hidden shadow-xs transition-shadow hover:shadow-md"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-base font-semibold">
                      {item.title}
                    </CardTitle>
                    <code className="text-muted-foreground mt-0.5 block text-xs">
                      &lt;{item.name} /&gt;
                    </code>
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-[10px] font-normal"
                  >
                    {item.category}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2 text-xs">
                  {item.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col items-center justify-center p-6 pt-2">
                <div className="border-border/60 bg-muted/15 flex min-h-40 w-full items-center justify-center rounded-xl border p-4 transition-colors">
                  {item.component}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Live Example in DataTable Empty State */}
        <section className="mt-12">
          <div className="mb-4">
            <h2 className="text-lg font-bold">
              Complete Component Example: EmptyDataTable
            </h2>
            <p className="text-muted-foreground text-xs">
              Demonstration of how the illustration integrates inside the full
              EmptyDataTable widget with title, description, and action button.
            </p>
          </div>

          <div className="border-border bg-card overflow-hidden rounded-xl border">
            <div className="border-border/60 bg-muted/40 flex items-center justify-between border-b px-4 py-2 text-xs font-medium">
              <span>Preview in Container</span>
              <span className="text-muted-foreground">
                Mode: {resolvedTheme} | Accent: {themeColor}
              </span>
            </div>
            <div className="py-10">
              <EmptyDataTable
                emptyStateWidget={
                  <EmptyTableIllustration className="mb-2 h-36 w-auto" />
                }
                emptyStateTitle="No records found"
                emptyStateDescription="Try adjusting your active search query or filter settings to find what you're looking for."
                emptyStateActions={
                  <Button size="sm" variant="outline">
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      size={16}
                      className="mr-1.5"
                    />
                    Reset Filters
                  </Button>
                }
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
