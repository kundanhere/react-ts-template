import { Outlet, useLocation } from "react-router-dom";

import { ErrorBoundary } from "@/app/error-boundary";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/layout/app-sidebar";

import { Footer } from "./footer";
import { Header } from "./header";

export function Layout() {
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarProvider className="min-h-0 flex-1">
        <AppSidebar />

        <SidebarInset className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <Header />

          <ScrollArea className="min-h-0 flex-1">
            <div className="flex min-h-full flex-col gap-4 p-4 pt-0">
              <ErrorBoundary resetKey={location.pathname}>
                <Outlet />
              </ErrorBoundary>
            </div>
          </ScrollArea>

          <Footer />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
