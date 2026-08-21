import { useTheme } from "@/hooks/use-theme";

export default function AppearanceTab() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Appearance</h2>
        <p className="text-muted-foreground text-xs">
          Manage your theme, color mode, and dashboard layout preferences.
        </p>
      </div>

      <div className="border-border/60 border-t" />

      <div className="space-y-6">
        <div>
          <h3 className="mb-2 text-sm font-semibold">Theme Mode</h3>
          <p className="text-muted-foreground mb-4 text-xs">
            Select how the dashboard appearance looks to you.
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
              <span className="text-xs font-semibold">Light mode</span>
              <span className="text-muted-foreground mt-0.5 text-[10px]">
                Always clean, bright, and easy to read.
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
              <span className="text-xs font-semibold">Dark mode</span>
              <span className="text-muted-foreground mt-0.5 text-[10px]">
                Easy on the eyes, optimized for low light.
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
              <span className="text-xs font-semibold">Sync with system</span>
              <span className="text-muted-foreground mt-0.5 text-[10px]">
                Matches your OS theme mode automatically.
              </span>
            </button>
          </div>
        </div>

        <div className="border-border/60 border-t pt-6" />

        {/* Extra setting mockups */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Accessibility & Font Size</h3>
          <div className="bg-muted/20 flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="text-xs font-semibold">Compact density mode</p>
              <p className="text-muted-foreground text-[11px]">
                Shrink row heights and spacing to show more content.
              </p>
            </div>
            <input
              type="checkbox"
              id="compact-mode"
              defaultChecked
              className="accent-primary size-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
