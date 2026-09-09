import * as React from "react";

import {
  Audit02Icon,
  BellPlusIcon,
  CommandIcon,
  CpuIcon,
  DashboardCircleIcon,
  DashboardSquare01Icon,
  GridIcon,
  HelpCircleIcon,
  Home03Icon,
  InboxIcon,
  LaptopPhoneSyncIcon,
  Quiz05Icon,
  SentIcon,
  Settings01Icon,
  Shield01Icon,
  ShieldKeyIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const ICON_MAP: Record<string, any> = {
  Home03Icon,
  DashboardSquare01Icon,
  DashboardCircleIcon,
  BellPlusIcon,
  InboxIcon,
  Shield01Icon,
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
  strokeWidth = 2
): React.ReactNode {
  if (!iconName) {
    return (
      <HugeiconsIcon icon={DashboardCircleIcon} strokeWidth={strokeWidth} />
    );
  }

  const iconDef = ICON_MAP[iconName.trim()];
  if (!iconDef) {
    return (
      <HugeiconsIcon icon={DashboardCircleIcon} strokeWidth={strokeWidth} />
    );
  }

  return <HugeiconsIcon icon={iconDef} strokeWidth={strokeWidth} />;
}
