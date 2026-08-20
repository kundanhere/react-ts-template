import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link, useLocation } from "react-router-dom";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavPrimary({
  items,
  groupLabel = "Identity & Access",
}: {
  groupLabel?: string;
  items: {
    title: string;
    url: string;
    icon: React.ReactNode;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const location = useLocation();

  return (
    <SidebarGroup>
      {groupLabel && <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item) => {
          const hasSubItems = Boolean(item.items?.length);
          const isItemActive =
            item.url !== "#" &&
            (location.pathname === item.url ||
              (item.url !== "/" &&
                location.pathname.startsWith(`${item.url}/`)));

          const isChildActive = item.items?.some(
            (subItem) =>
              location.pathname === subItem.url ||
              location.pathname.startsWith(`${subItem.url}/`)
          );

          const isGroupOpen = item.isActive || isItemActive || isChildActive;

          return (
            <Collapsible
              key={item.title}
              defaultOpen={isGroupOpen}
              render={<SidebarMenuItem />}
            >
              <SidebarMenuButton
                tooltip={item.title}
                render={<Link to={item.url} />}
                isActive={isItemActive}
              >
                {item.icon}
                <span>{item.title}</span>
              </SidebarMenuButton>
              {hasSubItems ? (
                <>
                  <CollapsibleTrigger
                    render={
                      <SidebarMenuAction className="aria-expanded:rotate-90" />
                    }
                  >
                    <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
                    <span className="sr-only">Toggle</span>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => {
                        const isSubActive =
                          location.pathname === subItem.url ||
                          location.pathname.startsWith(`${subItem.url}/`);
                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              render={<Link to={subItem.url} />}
                              isActive={isSubActive}
                            >
                              <span>{subItem.title}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
