import { Outlet } from "react-router-dom";

import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

/* ==========================================================================
   1. APP SIDEBAR SKELETON
   - Uses bg-sidebar-foreground/15 and /10 to provide a slightly darker,
     highly visible shimmer that scales perfectly in both light and dark mode.
   ========================================================================== */
export function SidebarSkeleton() {
  return (
    <Sidebar
      collapsible="icon"
      className="border-sidebar-border bg-sidebar border-r"
    >
      {/* Brand Header */}
      <SidebarHeader className="border-sidebar-border/40 flex h-13 justify-start border-b p-3.5">
        <div className="flex items-center gap-2.5">
          <div className="bg-sidebar-primary/25 size-8 animate-pulse rounded-lg" />
          <div className="flex flex-1 flex-col gap-1.5">
            <div className="bg-sidebar-foreground/15 h-3.5 w-24 animate-pulse rounded" />
            <div className="bg-sidebar-foreground/10 h-2.5 w-16 animate-pulse rounded" />
          </div>
        </div>
      </SidebarHeader>

      {/* Navigation Links */}
      <SidebarContent className="flex flex-col gap-6 p-3">
        {/* Nav Group 1 */}
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }, () => crypto.randomUUID()).map((id) => (
            <div key={id} className="flex items-center gap-3 px-2 py-1.5">
              <div className="bg-sidebar-foreground/15 size-5 animate-pulse rounded" />
              <div className="bg-sidebar-foreground/10 h-3.5 w-24 animate-pulse rounded" />
            </div>
          ))}
        </div>

        {/* Nav Group 2 */}
        <div className="flex flex-col gap-3">
          <div className="bg-sidebar-foreground/10 mb-1 ml-2 h-2.5 w-36 animate-pulse rounded" />
          {Array.from({ length: 2 }, () => crypto.randomUUID()).map((id) => (
            <div key={id} className="flex items-center gap-3 px-2 py-1.5">
              <div className="bg-sidebar-foreground/15 size-5 animate-pulse rounded" />
              <div className="bg-sidebar-foreground/10 h-3.5 w-32 animate-pulse rounded" />
            </div>
          ))}
        </div>

        {/* Nav Group 3 */}
        <div className="flex flex-col gap-3">
          <div className="bg-sidebar-foreground/10 mb-1 ml-2 h-2.5 w-28 animate-pulse rounded" />
          {Array.from({ length: 2 }, () => crypto.randomUUID()).map((id) => (
            <div key={id} className="flex items-center gap-3 px-2 py-1.5">
              <div className="bg-sidebar-foreground/15 size-5 animate-pulse rounded" />
              <div className="bg-sidebar-foreground/10 h-3.5 w-28 animate-pulse rounded" />
            </div>
          ))}
        </div>

        {/* mt-auto Settings Group */}
        <div className="mt-auto flex flex-col gap-3">
          {Array.from({ length: 3 }, () => crypto.randomUUID()).map((id) => (
            <div key={id} className="flex items-center gap-3 px-2 py-1.5">
              <div className="bg-sidebar-foreground/15 size-5 animate-pulse rounded" />
              <div className="bg-sidebar-foreground/10 h-3.5 w-20 animate-pulse rounded" />
            </div>
          ))}
        </div>
      </SidebarContent>

      {/* Footer User Badge */}
      <SidebarFooter className="border-sidebar-border/40 border-t p-3">
        <div className="flex items-center gap-3 rounded-lg p-2">
          <div className="bg-sidebar-foreground/15 size-8 animate-pulse rounded-full" />
          <div className="flex flex-1 flex-col gap-1.5">
            <div className="bg-sidebar-foreground/15 h-3.5 w-20 animate-pulse rounded" />
            <div className="bg-sidebar-foreground/10 h-2.5 w-28 animate-pulse rounded" />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

/* ==========================================================================
   2. APP HEADER SKELETON
   - Matches the trigger position, breadcrumb placeholder, search form input, and profile trigger.
   ========================================================================== */
export function HeaderSkeleton() {
  return (
    <header className="border-border bg-background/50 flex h-12 shrink-0 items-center justify-between gap-2 border-b px-4">
      <div className="flex items-center gap-2">
        <div className="bg-muted-foreground/15 size-7 animate-pulse rounded-md" />
        <Separator
          orientation="vertical"
          className="mt-1.5 mr-2 data-[orientation=vertical]:h-4"
        />
        <div className="bg-muted-foreground/15 h-3.5 w-28 animate-pulse rounded" />
      </div>

      <div className="flex items-center gap-3">
        <div className="bg-muted-foreground/10 border-muted-foreground/10 hidden h-7 w-40 animate-pulse rounded border lg:block" />
        <Separator
          orientation="vertical"
          className="mt-2 hidden data-[orientation=vertical]:h-4 lg:block"
        />
        <div className="bg-muted-foreground/15 size-7 animate-pulse rounded-full" />
        <div className="bg-muted-foreground/15 size-7 animate-pulse rounded-full" />
      </div>
    </header>
  );
}

/* ==========================================================================
   3. APP FOOTER SKELETON
   - Matches the copyright footer layout text spacing.
   ========================================================================== */
export function FooterSkeleton() {
  return (
    <footer className="mt-auto w-full border-t px-8 py-2 text-center">
      <div className="bg-muted-foreground/10 mx-auto h-3.5 w-48 animate-pulse rounded" />
    </footer>
  );
}

/* ==========================================================================
   4. LAYOUT SKELETON WRAPPER
   - A shell layout containing the Sidebar, Header, and Footer skeletons.
   - Renders child page elements directly inside the main content view.
   ========================================================================== */
export function LayoutSkeleton({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarProvider className="min-h-0 flex-1">
        <SidebarSkeleton />
        <SidebarInset className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <HeaderSkeleton />
          <div className="min-h-0 flex-1 overflow-y-auto">
            {children || <Outlet />}
          </div>
          <FooterSkeleton />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
