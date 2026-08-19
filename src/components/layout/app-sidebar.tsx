"use client";

import * as React from "react";

import {
  Audit02Icon,
  BellPlusIcon,
  CommandIcon,
  CpuIcon,
  DashboardSquare01Icon,
  GridIcon,
  Home03Icon,
  InboxIcon,
  LaptopPhoneSyncIcon,
  Quiz05Icon,
  SentIcon,
  Shield01Icon,
  ShieldKeyIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router-dom";

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
      url: "/",
      icon: <HugeiconsIcon icon={Home03Icon} strokeWidth={2} />,
    },
    {
      title: "Overview",
      url: "/dashboard",
      icon: <HugeiconsIcon icon={DashboardSquare01Icon} strokeWidth={2} />,
    },
    {
      title: "Updates",
      url: "/updates",
      icon: <HugeiconsIcon icon={BellPlusIcon} strokeWidth={2} />,
      badge: "40",
    },
    {
      title: "Inbox",
      url: "/inbox",
      icon: <HugeiconsIcon icon={InboxIcon} strokeWidth={2} />,
      badge: "10",
    },
  ],
  navPrimary: [
    {
      title: "Identity & Access",
      url: "/iam/dashboard",
      icon: <HugeiconsIcon icon={Shield01Icon} strokeWidth={2} />,
      isActive: true,
      items: [
        {
          title: "Users",
          url: "/iam/users",
        },
        {
          title: "Roles",
          url: "/iam/roles",
        },
        {
          title: "Policies",
          url: "/iam/policies",
        },
        {
          title: "Modules",
          url: "/iam/modules",
        },
      ],
    },
    {
      title: "Audit Trail",
      url: "/iam/audit/logs",
      icon: <HugeiconsIcon icon={Audit02Icon} strokeWidth={2} />,
      items: [
        {
          title: "My Activity Log",
          url: "/iam/audit/me",
        },
        {
          title: "System Audit Logs",
          url: "/iam/audit/logs",
        },
      ],
    },
  ],
  navGovernance: [
    {
      title: "Access Matrix",
      url: "/iam/access-matrix",
      icon: <HugeiconsIcon icon={GridIcon} strokeWidth={2} />,
    },
    {
      title: "Policy Simulator",
      url: "/iam/access/simulate",
      icon: <HugeiconsIcon icon={CpuIcon} strokeWidth={2} />,
    },
  ],
  navSystem: [
    {
      title: "Active Sessions",
      url: "/iam/sessions",
      icon: <HugeiconsIcon icon={LaptopPhoneSyncIcon} strokeWidth={2} />,
    },
    {
      title: "Security Settings",
      url: "/iam/security/settings",
      icon: <HugeiconsIcon icon={ShieldKeyIcon} strokeWidth={2} />,
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "/support",
      icon: <HugeiconsIcon icon={Quiz05Icon} strokeWidth={2} />,
    },
    {
      title: "Feedback",
      url: "/feedback",
      icon: <HugeiconsIcon icon={SentIcon} strokeWidth={2} />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link to="/" />}>
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
        <NavPrimary
          groupLabel="Identity & Access Management"
          items={data.navPrimary}
        />
        <NavPrimary
          groupLabel="Governance & Tools"
          items={data.navGovernance}
        />
        <NavSystem groupLabel="Security & System" items={data.navSystem} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
