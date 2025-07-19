import { Outlet } from "react-router-dom";

import { Breadcrumb } from "./breadcrumb";
import { Footer } from "./footer";
import { Header } from "./header";

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-screen-xl px-4 py-6 md:px-8">
          <Breadcrumb />
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
