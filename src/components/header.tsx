import { Link } from "react-router-dom";

import { useRoutes } from "@/hooks/useRoutes";

import { ThemeToggle } from "./theme-toggle";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./ui/navigation-menu";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog/hello-world" },
  { label: "Profile", href: "/user/1" },
] as const;

const getNavLinkClasses = (isActive: boolean) =>
  `rounded-md px-4 py-2 text-base font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
    isActive
      ? "bg-primary/10 text-primary font-semibold"
      : "text-foreground hover:bg-accent hover:text-accent-foreground"
  }`;

export function Header() {
  const { isCurrentPath, isPathActive } = useRoutes();

  return (
    <header className="w-full max-w-[1440px] !px-12 font-sans shadow-sm">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between px-4 py-4 md:px-8">
        <Link
          to="/"
          className="text-primary hover:text-primary/80 flex items-center gap-2 text-2xl font-bold transition-colors"
        >
          <span className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full font-black">
            R
          </span>
          ReactStarter
        </Link>

        <div className="flex items-center gap-2">
          <NavigationMenu>
            <NavigationMenuList className="flex gap-2">
              {navLinks.map(({ label, href }) => {
                const isActive =
                  href === "/"
                    ? isCurrentPath("/")
                    : isPathActive(href.split("/")[1]); // Check if path starts with the main segment

                return (
                  <NavigationMenuItem key={href}>
                    <NavigationMenuLink asChild>
                      <Link to={href} className={getNavLinkClasses(isActive)}>
                        {label}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
