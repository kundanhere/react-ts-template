import { Link } from "react-router-dom";

import { ThemeToggle } from "@/components/theme-toggle";

import { LoginBrandPanel } from "./components/login-brand-panel";
import { LoginForm } from "./components/login-form";

export default function LoginPage() {
  return (
    <section className="bg-background relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Theme Switcher in top corner */}
      <div className="absolute top-5 right-5 z-20">
        <ThemeToggle />
      </div>

      <div className="flex min-h-screen w-full items-stretch">
        {/* Left Column: Creative Space Video Sidebar (desktop) */}
        <LoginBrandPanel />

        {/* Right Column: Clean, Modern Login Content */}
        <div className="flex flex-1 flex-col items-center justify-center p-6 sm:p-10 lg:p-12">
          <div className="flex w-full max-w-sm flex-col gap-6">
            {/* Header: Logo & Title */}
            <div className="flex flex-col items-center gap-2 text-center">
              <Link
                to="/"
                aria-label="Go to home"
                className="mb-2 flex flex-col items-center gap-1.5 transition-transform hover:scale-105 lg:hidden"
              >
                <img
                  src="https://images.shadcnspace.com/assets/logo/logo-icon-black.svg"
                  alt="Logo"
                  width={38}
                  height={38}
                  className="block size-9 dark:hidden"
                />
                <img
                  src="https://images.shadcnspace.com/assets/logo/logo-icon-white.svg"
                  alt="Logo"
                  width={38}
                  height={38}
                  className="hidden size-9 dark:block"
                />
              </Link>
              <h1 className="text-foreground text-2xl font-bold tracking-tight">
                Sign in to your account
              </h1>
              <p className="text-muted-foreground text-xs">
                Enter your credentials below to access your workspace
              </p>
            </div>

            {/* Login Form */}
            <LoginForm />
          </div>
        </div>
      </div>
    </section>
  );
}
