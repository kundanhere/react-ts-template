"use client";

import * as React from "react";

import {
  Audit02Icon,
  BellPlusIcon,
  CommandIcon,
  Home03Icon,
  InboxIcon,
  LaptopPhoneSyncIcon,
  Quiz05Icon,
  SentIcon,
  Shield01Icon,
  ShieldKeyIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { NavMain } from "@/components/layout/nav-main";
import { NavPrimary } from "@/components/layout/nav-primary";
import { NavSecondary } from "@/components/layout/nav-secondary";
import { NavSystem } from "@/components/layout/nav-system";
import { NavUser } from "@/components/layout/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "Kundan Gupta",
    email: "kundang25@gmail.com",
    avatar: "https://i.pravatar.cc/150?u=a04",
  },
  navMain: [
    {
      title: "Home",
      url: "#",
      icon: <HugeiconsIcon icon={Home03Icon} strokeWidth={2} />,
      isActive: true,
    },
    {
      title: "Updates",
      url: "#",
      icon: <HugeiconsIcon icon={BellPlusIcon} strokeWidth={2} />,
      badge: "40",
    },
    {
      title: "Inbox",
      url: "#",
      icon: <HugeiconsIcon icon={InboxIcon} strokeWidth={2} />,
      badge: "10",
    },
  ],
  navPrimary: [
    {
      title: "Identity & Access Management",
      url: "#",
      icon: <HugeiconsIcon icon={Shield01Icon} strokeWidth={2} />,
      isActive: true,
      items: [
        {
          title: "Users",
          url: "#",
        },
        {
          title: "Roles",
          url: "#",
        },
        {
          title: "Policies",
          url: "#",
        },
        {
          title: "Modules",
          url: "#",
        },
      ],
    },
    {
      title: "Active Sessions",
      url: "#",
      icon: <HugeiconsIcon icon={LaptopPhoneSyncIcon} strokeWidth={2} />,
    },
    {
      title: "Audit Logs",
      url: "#",
      icon: <HugeiconsIcon icon={Audit02Icon} strokeWidth={2} />,
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: <HugeiconsIcon icon={Quiz05Icon} strokeWidth={2} />,
    },
    {
      title: "Feedback",
      url: "#",
      icon: <HugeiconsIcon icon={SentIcon} strokeWidth={2} />,
    },
  ],
  navSystem: [
    {
      title: "Security Settings",
      url: "#",
      icon: <HugeiconsIcon icon={ShieldKeyIcon} strokeWidth={2} />,
    },
  ],
};
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<a href="/" />}>
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <HugeiconsIcon
                  icon={CommandIcon}
                  strokeWidth={2}
                  className="size-4"
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Sentry IAM</span>
                <span className="truncate text-xs">Access Console</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavPrimary items={data.navPrimary} />
        <NavSystem items={data.navSystem} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
