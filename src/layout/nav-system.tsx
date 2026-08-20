"use client";

import {
  Delete02Icon,
  FolderIcon,
  MoreHorizontalCircle01Icon,
  Share03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link, useLocation } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavSystem({
  items,
  groupLabel = "System",
}: {
  groupLabel?: string;
  items: {
    title: string;
    url: string;
    icon: React.ReactNode;
  }[];
}) {
  const { isMobile } = useSidebar();
  const location = useLocation();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      {groupLabel && <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item) => {
          const isActive =
            location.pathname === item.url ||
            location.pathname.startsWith(`${item.url}/`);
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                render={<Link to={item.url} />}
                isActive={isActive}
              >
                {item.icon}
                <span>{item.title}</span>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <SidebarMenuAction
                      showOnHover
                      className="data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground"
                    />
                  }
                >
                  <HugeiconsIcon
                    icon={MoreHorizontalCircle01Icon}
                    strokeWidth={2}
                  />
                  <span className="sr-only">More</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-48"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem>
                    <HugeiconsIcon
                      icon={FolderIcon}
                      strokeWidth={2}
                      className="text-muted-foreground"
                    />
                    <span>View Project</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HugeiconsIcon
                      icon={Share03Icon}
                      strokeWidth={2}
                      className="text-muted-foreground"
                    />
                    <span>Share Project</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <HugeiconsIcon
                      icon={Delete02Icon}
                      strokeWidth={2}
                      className="text-muted-foreground"
                    />
                    <span>Delete Project</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
