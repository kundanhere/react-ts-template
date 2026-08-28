import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router-dom";

import { ThemeToggle } from "@/components/theme-toggle";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useBreadcrumbs } from "@/hooks/use-breadcrumbs";

import { User } from "./nav-profile";
import { SearchForm } from "./search-form";

export function Header() {
  const breadcrumbs = useBreadcrumbs();

  return (
    <header className="flex h-12 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-10">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger size="icon" className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mt-1.5 mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.length <= 2 ? (
              breadcrumbs.map((item, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (
                  <div
                    key={`${item.title}`}
                    className="flex items-center gap-1.5"
                  >
                    <BreadcrumbItem>
                      {isLast || !item.href ? (
                        <BreadcrumbPage>{item.title}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink render={<Link to={item.href} />}>
                          {item.title}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator />}
                  </div>
                );
              })
            ) : (
              <>
                {/* First Item */}
                <div className="flex items-center gap-1.5">
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      render={<Link to={breadcrumbs[0].href || "/"} />}
                    >
                      {breadcrumbs[0].title}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </div>

                {/* Ellipsis (Mobile/Tablet only) */}
                <div className="flex items-center gap-1.5 lg:hidden">
                  <BreadcrumbItem>
                    <BreadcrumbEllipsis />
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </div>

                {/* Middle Items (Desktop only) */}
                {breadcrumbs.slice(1, -1).map((item) => (
                  <div
                    key={`${item.title}`}
                    className="hidden items-center gap-1.5 lg:flex"
                  >
                    <BreadcrumbItem>
                      {item.href ? (
                        <BreadcrumbLink render={<Link to={item.href} />}>
                          {item.title}
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage>{item.title}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                  </div>
                ))}

                {/* Last Item */}
                <div className="flex items-center gap-1.5">
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      {breadcrumbs[breadcrumbs.length - 1].title}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </div>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-2 px-3">
        {/* Full input on desktop */}
        <SearchForm className="hidden lg:block" />

        {/* Icon button on mobile/tablet */}
        <Button variant="ghost" size="icon" className="h-8 w-8 lg:hidden">
          <HugeiconsIcon
            icon={Search01Icon}
            size={16}
            className="text-muted-foreground"
          />
        </Button>
        <Separator
          orientation="vertical"
          className="mt-2 data-[orientation=vertical]:h-4"
        />
        <ThemeToggle />
        <User
          user={{
            name: "Kundan Gupta",
            email: "kundang25@gmail.com",
            avatar: "https://i.pravatar.cc/150?u=a04",
          }}
        />
      </div>
    </header>
  );
}
