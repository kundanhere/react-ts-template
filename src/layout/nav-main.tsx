"use client";

import * as React from "react";

import { Link, useLocation } from "react-router-dom";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export interface INavMainItem {
  title: string;
  url?: string | null;
  icon?: React.ReactNode;
  isActive?: boolean;
  badge?: string | number;
}

export function NavMain({ items }: { items: INavMainItem[] }) {
  const location = useLocation();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const hasValidUrl = Boolean(item.url && item.url !== "#");
          const isCurrentActive =
            hasValidUrl &&
            (item.url === "/"
              ? location.pathname === "/"
              : location.pathname === item.url ||
                location.pathname.startsWith(`${item.url}/`));

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                render={hasValidUrl ? <Link to={item.url!} /> : undefined}
                isActive={isCurrentActive}
              >
                {item.icon}
                <span>{item.title}</span>
              </SidebarMenuButton>
              {item.badge !== undefined && item.badge !== null && (
                <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
              )}
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
