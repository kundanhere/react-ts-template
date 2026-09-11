import * as React from "react";

import {
  Audit02Icon,
  BellPlusIcon,
  CommandIcon,
  CpuIcon,
  DashboardCircleIcon,
  DashboardSquare01Icon,
  Folder01Icon,
  GridIcon,
  HelpCircleIcon,
  Home03Icon,
  InboxIcon,
  LaptopPhoneSyncIcon,
  Quiz05Icon,
  SentIcon,
  Settings01Icon,
  Shield01Icon,
  ShieldCheck,
  ShieldKeyIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export const AVAILABLE_MODULE_ICONS = [
  {
    id: "DashboardSquare01Icon",
    label: "Dashboard",
    icon: DashboardSquare01Icon,
  },
  { id: "DashboardCircleIcon", label: "Analytics", icon: DashboardCircleIcon },
  { id: "Home03Icon", label: "Home", icon: Home03Icon },
  { id: "Shield01Icon", label: "Security & IAM", icon: Shield01Icon },
  { id: "ShieldCheck", label: "Roles & Permissions", icon: ShieldCheck },
  { id: "UserGroupIcon", label: "Users", icon: UserGroupIcon },
  { id: "Folder01Icon", label: "Folder", icon: Folder01Icon },
  { id: "ShieldKeyIcon", label: "Permissions", icon: ShieldKeyIcon },
  { id: "Audit02Icon", label: "Audit & Logs", icon: Audit02Icon },
  { id: "GridIcon", label: "Modules", icon: GridIcon },
  { id: "CpuIcon", label: "System Core", icon: CpuIcon },
  { id: "LaptopPhoneSyncIcon", label: "Sessions", icon: LaptopPhoneSyncIcon },
  { id: "Settings01Icon", label: "Settings", icon: Settings01Icon },
  { id: "InboxIcon", label: "Inbox", icon: InboxIcon },
  { id: "BellPlusIcon", label: "Notifications", icon: BellPlusIcon },
  { id: "SentIcon", label: "Workflows", icon: SentIcon },
  { id: "Quiz05Icon", label: "Policies", icon: Quiz05Icon },
  { id: "HelpCircleIcon", label: "Help & Support", icon: HelpCircleIcon },
  { id: "CommandIcon", label: "Console", icon: CommandIcon },
];

export const ICON_MAP: Record<string, any> = {
  Home03Icon,
  DashboardSquare01Icon,
  DashboardCircleIcon,
  BellPlusIcon,
  InboxIcon,
  Shield01Icon,
  ShieldCheck,
  UserGroupIcon,
  Folder01Icon,
  GridIcon,
  CpuIcon,
  LaptopPhoneSyncIcon,
  ShieldKeyIcon,
  Audit02Icon,
  Settings01Icon,
  Quiz05Icon,
  HelpCircleIcon,
  SentIcon,
  CommandIcon,
};

/**
 * Resolves a HugeIcon component for the icon name returned by the modules API.
 * Falls back to DashboardCircleIcon if no icon name is provided or matched.
 */
export function getModuleIcon(
  iconName: string | null | undefined,
  strokeWidth = 2,
  size = 16,
  className?: string
): React.ReactNode {
  const iconDef =
    (iconName && ICON_MAP[iconName.trim()]) || DashboardCircleIcon;
  return (
    <HugeiconsIcon
      icon={iconDef}
      strokeWidth={strokeWidth}
      size={size}
      className={className}
    />
  );
}
