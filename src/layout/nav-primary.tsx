import React from "react";

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

export interface INavPrimaryItem {
  title: string;
  url?: string | null;
  icon?: React.ReactNode;
  isActive?: boolean;
  items?: {
    title: string;
    url?: string | null;
  }[];
}

function NavPrimaryItem({ item }: { item: INavPrimaryItem }) {
  const location = useLocation();
  const hasSubItems = Boolean(item.items?.length);
  const hasValidUrl = Boolean(item.url && item.url !== "#");

  const firstChildUrl = React.useMemo(() => {
    if (!hasSubItems || !item.items) return undefined;
    return item.items.find((sub) => Boolean(sub.url && sub.url !== "#"))?.url;
  }, [hasSubItems, item.items]);

  const isItemActive =
    hasValidUrl &&
    (location.pathname === item.url ||
      (item.url !== "/" && location.pathname.startsWith(`${item.url}/`)));

  const isChildActive = Boolean(
    hasSubItems &&
    item.items?.some(
      (subItem) =>
        Boolean(subItem.url && subItem.url !== "#") &&
        (location.pathname === subItem.url ||
          (subItem.url !== "/" &&
            location.pathname.startsWith(`${subItem.url}/`)))
    )
  );

  const [isOpen, setIsOpen] = React.useState(
    Boolean(item.isActive || isItemActive || isChildActive)
  );

  React.useEffect(() => {
    if (isChildActive || isItemActive) {
      setIsOpen(true);
    }
  }, [isChildActive, isItemActive]);

  const navigationUrl = hasValidUrl ? item.url! : firstChildUrl;

  const handleParentClick = () => {
    if (hasSubItems && !isOpen) {
      setIsOpen(true);
    }
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      render={<SidebarMenuItem />}
    >
      {navigationUrl ? (
        <SidebarMenuButton
          tooltip={item.title}
          render={<Link to={navigationUrl} onClick={handleParentClick} />}
          isActive={isItemActive}
        >
          {item.icon}
          <span>{item.title}</span>
        </SidebarMenuButton>
      ) : (
        <SidebarMenuButton tooltip={item.title} onClick={handleParentClick}>
          {item.icon}
          <span>{item.title}</span>
        </SidebarMenuButton>
      )}

      {hasSubItems && (
        <>
          <CollapsibleTrigger
            render={<SidebarMenuAction className="aria-expanded:rotate-90" />}
          >
            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
            <span className="sr-only">Toggle</span>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.items?.map((subItem) => {
                const isSubActive =
                  Boolean(subItem.url && subItem.url !== "#") &&
                  (location.pathname === subItem.url ||
                    (subItem.url !== "/" &&
                      location.pathname.startsWith(`${subItem.url}/`)));

                return (
                  <SidebarMenuSubItem key={subItem.title}>
                    <SidebarMenuSubButton
                      render={
                        subItem.url && subItem.url !== "#" ? (
                          <Link to={subItem.url} />
                        ) : undefined
                      }
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
      )}
    </Collapsible>
  );
}

export function NavPrimary({
  items,
  groupLabel,
}: {
  groupLabel?: string;
  items: INavPrimaryItem[];
}) {
  return (
    <SidebarGroup>
      {groupLabel && <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item) => (
          <NavPrimaryItem key={item.title} item={item} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
