"use client";

import * as React from "react";

import { CommandIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { useMyModulesQuery } from "@/hooks/use-modules";
import { getModuleIcon } from "@/layout/module-icons";
import { NavMain } from "@/layout/nav-main";
import { NavPrimary } from "@/layout/nav-primary";
import { NavSecondary } from "@/layout/nav-secondary";
import { NavUser } from "@/layout/nav-user";
import { useAppStore } from "@/store/use-app-store";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAppStore();
  const { data: moduleGroups = [], isLoading } = useMyModulesQuery("group");

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  const currentUser = {
    name: fullName || user?.username || "Guest User",
    email: user?.email || "",
    avatar: user?.avatarUrl || "",
  };

  // 1. Identify Primary group (rendered at top, no label)
  const primaryGroup = React.useMemo(
    () => moduleGroups.find((g) => g.slug === "primary"),
    [moduleGroups]
  );

  // 2. Identify Secondary group (rendered at footer level, no label)
  const secondaryGroup = React.useMemo(
    () => moduleGroups.find((g) => g.slug === "secondary"),
    [moduleGroups]
  );

  // 3. Center groups: all remaining groups in exact API response order
  const centerGroups = React.useMemo(
    () =>
      moduleGroups.filter(
        (g) => g.slug !== "primary" && g.slug !== "secondary"
      ),
    [moduleGroups]
  );

  const primaryNavItems = React.useMemo(() => {
    if (!primaryGroup?.modules?.length) return [];
    return primaryGroup.modules.map((m) => ({
      title: m.name,
      url: m.path,
      icon: getModuleIcon(m.icon),
      badge: m.badge,
    }));
  }, [primaryGroup]);

  const centerNavSections = React.useMemo(
    () =>
      centerGroups.map((group) => ({
        key: group.ID || group.slug || group.name,
        groupLabel: group.name,
        items: (group.modules || []).map((m) => ({
          title: m.name,
          url: m.path,
          icon: getModuleIcon(m.icon),
          items:
            m.children && m.children.length > 0
              ? m.children.map((child) => ({
                  title: child.name,
                  url: child.path,
                }))
              : undefined,
        })),
      })),
    [centerGroups]
  );

  const secondaryNavItems = React.useMemo(() => {
    if (!secondaryGroup?.modules?.length) return [];
    return secondaryGroup.modules.map((m) => ({
      title: m.name,
      url: m.path,
      icon: getModuleIcon(m.icon),
    }));
  }, [secondaryGroup]);

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
        {isLoading ? (
          <SidebarGroup>
            <SidebarMenu>
              {Array.from({ length: 6 }, () => crypto.randomUUID()).map(
                (id) => (
                  <SidebarMenuItem key={id}>
                    <SidebarMenuSkeleton showIcon />
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroup>
        ) : (
          <>
            {primaryNavItems.length > 0 && <NavMain items={primaryNavItems} />}
            {centerNavSections.map((section) => (
              <NavPrimary
                key={section.key}
                groupLabel={section.groupLabel}
                items={section.items}
              />
            ))}
            {secondaryNavItems.length > 0 && (
              <NavSecondary items={secondaryNavItems} className="mt-auto" />
            )}
          </>
        )}

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
