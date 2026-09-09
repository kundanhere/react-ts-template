"use client";

import * as React from "react";

import {
  Audit02Icon,
  BellPlusIcon,
  CommandIcon,
  CpuIcon,
  DashboardSquare01Icon,
  GridIcon,
  HelpCircleIcon,
  Home03Icon,
  InboxIcon,
  LaptopPhoneSyncIcon,
  SentIcon,
  Settings01Icon,
  Shield01Icon,
  ShieldKeyIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "@/layout/nav-main";
import { NavPrimary } from "@/layout/nav-primary";
import { NavSecondary } from "@/layout/nav-secondary";
import { NavUser } from "@/layout/nav-user";
import { useAppStore } from "@/store/use-app-store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const data = {
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
          title: "Analytics & Metrics",
          url: "/iam/dashboard",
        },
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
    {
      title: "Audit Trail",
      url: "/iam/audit/logs",
      icon: <HugeiconsIcon icon={Audit02Icon} strokeWidth={2} />,
      items: [
        {
          title: "System Audit Logs",
          url: "/iam/audit/logs",
        },
        {
          title: "Activity Log",
          url: "/iam/audit/me",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: <HugeiconsIcon icon={Settings01Icon} strokeWidth={2} />,
    },
    {
      title: "Get Help",
      url: "/support",
      icon: <HugeiconsIcon icon={HelpCircleIcon} strokeWidth={2} />,
    },
    {
      title: "Feedback",
      url: "/feedback",
      icon: <HugeiconsIcon icon={SentIcon} strokeWidth={2} />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAppStore();
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  const currentUser = {
    name: fullName || user?.username || "Guest User",
    email: user?.email || "",
    avatar: user?.avatarUrl || "",
  };

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
        <NavPrimary groupLabel="Security & System" items={data.navSystem} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />

        {/* card */}
        <div className="hidden px-4 pt-5">
          <Card className="bg-secondary px-4 py-6 shadow-none ring-0">
            <CardContent className="flex flex-col items-center gap-3 p-0">
              <img
                src="/images/cat.png"
                alt="sidebar-img"
                width={74}
                height={74}
                className="h-20 w-20"
              />
              <div className="flex flex-col items-center gap-4">
                <div>
                  <p className="text-card-foreground text-center text-sm font-semibold">
                    Grab Pro Now
                  </p>
                  <p className="font-regular text-muted-foreground text-center text-xs">
                    Customize your admin
                  </p>
                </div>
                <Button className="h-8 w-fit cursor-pointer rounded-xl px-4 py-2 shadow-none">
                  Get Premium
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={currentUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
