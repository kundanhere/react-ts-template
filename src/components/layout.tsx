import { Outlet } from "react-router-dom";

import { Footer } from "./footer";
import Header from "./header";

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
