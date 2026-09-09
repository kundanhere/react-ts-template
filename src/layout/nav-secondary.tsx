import * as React from "react";

import { Link, useLocation } from "react-router-dom";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export interface INavSecondaryItem {
  title: string;
  url?: string | null;
  icon: React.ReactNode;
}

export function NavSecondary({
  items,
  ...props
}: {
  items: INavSecondaryItem[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const location = useLocation();

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const hasValidUrl = Boolean(item.url && item.url !== "#");
            const isActive = hasValidUrl && location.pathname === item.url;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  size="sm"
                  render={hasValidUrl ? <Link to={item.url!} /> : undefined}
                  isActive={isActive}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
