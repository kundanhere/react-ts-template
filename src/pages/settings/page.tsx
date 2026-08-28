"use client";

import * as React from "react";

import {
  Audit02Icon,
  BellIcon,
  BiometricAccessIcon,
  LaptopPhoneSyncIcon,
  LockKeyIcon,
  MailValidation01Icon,
  PaintBoardIcon,
  Settings01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { PageWrapper } from "@/components/page-wrapper";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import AppearanceTab from "./components/appearance-tab";
import NotificationsTab from "./components/notifications-tab";
import ProfileTab from "./components/profile-tab";
import SecurityTab from "./components/security-tab";

const data = {
  groups: [
    {
      items: [
        {
          name: "Your profile",
          id: "profile",
          icon: <HugeiconsIcon icon={UserIcon} />,
        },
        {
          name: "Account",
          id: "account",
          icon: <HugeiconsIcon icon={Settings01Icon} />,
        },
        {
          name: "Appearance",
          id: "appearance",
          icon: <HugeiconsIcon icon={PaintBoardIcon} />,
        },
      ],
    },
    {
      label: "Access & Security",
      items: [
        {
          name: "Password & Security",
          id: "advanced",
          icon: <HugeiconsIcon icon={BiometricAccessIcon} />,
        },
        {
          name: "Verified Emails",
          id: "emails",
          icon: <HugeiconsIcon icon={MailValidation01Icon} />,
        },
        {
          name: "Active Sessions",
          id: "sessions",
          icon: <HugeiconsIcon icon={LaptopPhoneSyncIcon} />,
        },
        {
          name: "Access Tokens",
          id: "tokens",
          icon: <HugeiconsIcon icon={LockKeyIcon} />,
        },
      ],
    },
    {
      label: "Notifications & Billing",
      items: [
        {
          name: "Notifications",
          id: "notifications",
          icon: <HugeiconsIcon icon={BellIcon} />,
        },
        {
          name: "Billing & Plans",
          id: "billing",
          icon: <HugeiconsIcon icon={Audit02Icon} />,
        },
      ],
    },
  ],
};

const SettingsPage = () => {
  const [activeTab, setActiveTab] = React.useState("profile");

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileTab />;
      case "notifications":
        return <NotificationsTab />;
      case "appearance":
        return <AppearanceTab />;
      case "advanced":
        return <SecurityTab />;
      default:
        return (
          <div className="flex h-87.5 flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <HugeiconsIcon
              icon={Settings01Icon}
              className="text-muted-foreground/60 mb-3 size-8 animate-pulse"
            />
            <h3 className="text-sm font-semibold">Settings Section</h3>
            <p className="text-muted-foreground mt-1 max-w-70 text-xs">
              This settings view is currently under development. Please check
              back later.
            </p>
          </div>
        );
    }
  };

  return (
    <PageWrapper
      title="Settings"
      subtitle="Manage your public profile, security credentials, and preferences."
    >
      <SidebarProvider className="items-start">
        <Sidebar
          collapsible="none"
          className="settings-sidebar border-border/40 flex shrink-0 border-r bg-transparent pr-0 lg:pr-4"
        >
          <SidebarContent className="gap-4 pt-2">
            {data.groups.map((group) => (
              <SidebarGroup key={group.label} className="px-0 lg:px-1">
                {group.label && (
                  <SidebarGroupLabel className="hidden capitalize lg:flex">
                    {group.label}
                  </SidebarGroupLabel>
                )}
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => {
                      const isActive = activeTab === item.id;
                      return (
                        <SidebarMenuItem key={item.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <SidebarMenuButton
                                onClick={() => setActiveTab(item.id)}
                                isActive={isActive}
                                className="mx-auto size-8 justify-center lg:mx-0 lg:h-8 lg:w-full lg:justify-start"
                              >
                                {item.icon}
                                <span className="hidden lg:inline">
                                  {item.name}
                                </span>
                              </SidebarMenuButton>
                            </TooltipTrigger>
                            <TooltipContent
                              side="right"
                              align="center"
                              className="z-100 lg:hidden"
                            >
                              {item.name}
                            </TooltipContent>
                          </Tooltip>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 overflow-y-auto px-2 py-2 md:px-6">
          {renderTabContent()}
        </main>
      </SidebarProvider>
    </PageWrapper>
  );
};

export default SettingsPage;
