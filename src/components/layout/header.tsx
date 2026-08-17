import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { ThemeToggle } from "../theme-toggle";
import { SearchForm } from "./search-form";
import { User } from "./user";

export function Header() {
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
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">Build Your Application</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Data Fetching</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-2 px-3">
        <SearchForm />
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
