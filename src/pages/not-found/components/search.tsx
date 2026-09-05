"use client";

import { useEffect } from "react";

import {
  Activity01Icon,
  Analytics01Icon,
  Audit02Icon,
  BellPlusIcon,
  CpuIcon,
  DashboardSquare01Icon,
  FileCodeIcon,
  GridIcon,
  Home03Icon,
  InboxIcon,
  LaptopPhoneSyncIcon,
  PackageIcon,
  Quiz05Icon,
  SentIcon,
  Settings01Icon,
  Shield01Icon,
  ShieldKeyIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useNavigate } from "react-router-dom";

import { AutocompleteSearch } from "@/components/ui/autocomplete-search";
import { Kbd } from "@/components/ui/kbd";

export interface IDashboardPageItem {
  id: string;
  value: string;
  label: string;
  path: string;
  category: string;
  description: string;
  keywords?: string[];
  icon: React.ReactNode;
  [key: string]: unknown;
}

export const dashboardPages: IDashboardPageItem[] = [
  {
    id: "home",
    value: "/",
    label: "Home",
    path: "/",
    category: "Main",
    description: "Welcome overview and Sentry IAM portal",
    keywords: ["welcome", "start", "landing", "main"],
    icon: <HugeiconsIcon icon={Home03Icon} size={16} />,
  },
  {
    id: "dashboard",
    value: "/dashboard",
    label: "Overview Dashboard",
    path: "/dashboard",
    category: "Main",
    description: "System overview, security health, and key metrics",
    keywords: ["stats", "kpi", "overview", "metrics", "charts"],
    icon: <HugeiconsIcon icon={DashboardSquare01Icon} size={16} />,
  },
  {
    id: "iam-analytics",
    value: "/iam/dashboard",
    label: "Analytics & Metrics",
    path: "/iam/dashboard",
    category: "IAM",
    description: "Real-time security analytics and access graphs",
    keywords: ["charts", "telemetry", "traffic", "iam analytics", "graphs"],
    icon: <HugeiconsIcon icon={Analytics01Icon} size={16} />,
  },
  {
    id: "iam-users",
    value: "/iam/users",
    label: "Users",
    path: "/iam/users",
    category: "IAM",
    description: "Directory of user accounts, credentials, and access",
    keywords: ["members", "accounts", "people", "profiles", "staff"],
    icon: <HugeiconsIcon icon={UserGroupIcon} size={16} />,
  },
  {
    id: "iam-roles",
    value: "/iam/roles",
    label: "Roles & Permissions",
    path: "/iam/roles",
    category: "IAM",
    description: "Configure system roles, permissions, and grants",
    keywords: ["privileges", "rbac", "admin", "permissions"],
    icon: <HugeiconsIcon icon={Shield01Icon} size={16} />,
  },
  {
    id: "iam-policies",
    value: "/iam/policies",
    label: "Policies Registry",
    path: "/iam/policies",
    category: "IAM",
    description: "JSON security policy definitions and condition rules",
    keywords: ["json", "abac", "rules", "conditions", "access rules"],
    icon: <HugeiconsIcon icon={FileCodeIcon} size={16} />,
  },
  {
    id: "iam-modules",
    value: "/iam/modules",
    label: "Modules Management",
    path: "/iam/modules",
    category: "IAM",
    description: "Service components and module capability bindings",
    keywords: ["services", "apps", "components", "endpoints"],
    icon: <HugeiconsIcon icon={PackageIcon} size={16} />,
  },
  {
    id: "iam-access-matrix",
    value: "/iam/access-matrix",
    label: "Access Matrix",
    path: "/iam/access-matrix",
    category: "Governance",
    description: "Interactive Role x Module permission grid",
    keywords: ["grid", "matrix", "table", "capabilities", "coverage"],
    icon: <HugeiconsIcon icon={GridIcon} size={16} />,
  },
  {
    id: "iam-simulator",
    value: "/iam/access/simulate",
    label: "Policy Simulator",
    path: "/iam/access/simulate",
    category: "Governance",
    description: "Simulate and test policy decision evaluations",
    keywords: ["test", "dry run", "simulate", "evaluate", "engine"],
    icon: <HugeiconsIcon icon={CpuIcon} size={16} />,
  },
  {
    id: "iam-sessions",
    value: "/iam/sessions",
    label: "Active Sessions",
    path: "/iam/sessions",
    category: "Security",
    description: "Monitor active login sessions, devices, and tokens",
    keywords: ["devices", "tokens", "ip address", "active logins"],
    icon: <HugeiconsIcon icon={LaptopPhoneSyncIcon} size={16} />,
  },
  {
    id: "iam-security",
    value: "/iam/security/settings",
    label: "Security Settings",
    path: "/iam/security/settings",
    category: "Security",
    description: "MFA authentication, passwords, and security controls",
    keywords: ["2fa", "mfa", "password", "authentication", "protection"],
    icon: <HugeiconsIcon icon={ShieldKeyIcon} size={16} />,
  },
  {
    id: "iam-audit",
    value: "/iam/audit/logs",
    label: "System Audit Logs",
    path: "/iam/audit/logs",
    category: "Audit",
    description: "Immutable system activity trail and compliance records",
    keywords: ["compliance", "logs", "events", "history", "records"],
    icon: <HugeiconsIcon icon={Audit02Icon} size={16} />,
  },
  {
    id: "iam-my-activity",
    value: "/iam/audit/me",
    label: "My Activity Log",
    path: "/iam/audit/me",
    category: "Audit",
    description: "Personal account audit history and security events",
    keywords: ["my actions", "history", "recent", "login history"],
    icon: <HugeiconsIcon icon={Activity01Icon} size={16} />,
  },
  {
    id: "settings",
    value: "/settings",
    label: "System Settings",
    path: "/settings",
    category: "System",
    description: "General configuration and system preferences",
    keywords: ["preferences", "config", "appearance", "general"],
    icon: <HugeiconsIcon icon={Settings01Icon} size={16} />,
  },
  {
    id: "updates",
    value: "/updates",
    label: "Updates & Releases",
    path: "/updates",
    category: "System",
    description: "Changelog, release notes, and latest improvements",
    keywords: ["changelog", "news", "versions", "features", "releases"],
    icon: <HugeiconsIcon icon={BellPlusIcon} size={16} />,
  },
  {
    id: "inbox",
    value: "/inbox",
    label: "Inbox & Alerts",
    path: "/inbox",
    category: "System",
    description: "System notifications, access requests, and inbox alerts",
    keywords: ["messages", "alerts", "notifications", "requests"],
    icon: <HugeiconsIcon icon={InboxIcon} size={16} />,
  },
  {
    id: "support",
    value: "/support",
    label: "Support Center",
    path: "/support",
    category: "Support",
    description: "Help articles, documentation, and customer support",
    keywords: ["help", "docs", "faq", "tickets", "contact"],
    icon: <HugeiconsIcon icon={Quiz05Icon} size={16} />,
  },
  {
    id: "feedback",
    value: "/feedback",
    label: "Send Feedback",
    path: "/feedback",
    category: "Support",
    description: "Submit suggestions, bug reports, and product feedback",
    keywords: ["suggestion", "bug", "report", "ideas"],
    icon: <HugeiconsIcon icon={SentIcon} size={16} />,
  },
];

function matchesQuery(page: IDashboardPageItem, query: string): boolean {
  const q = query.toLowerCase().trim();
  if (!q) return false;
  return (
    page.label.toLowerCase().includes(q) ||
    page.description.toLowerCase().includes(q) ||
    page.category.toLowerCase().includes(q) ||
    page.path.toLowerCase().includes(q) ||
    Boolean(page.keywords?.some((k) => k.toLowerCase().includes(q)))
  );
}

async function searchPages(query: string): Promise<IDashboardPageItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return dashboardPages.filter((page) => matchesQuery(page, query));
}

export interface INotFoundSearchProps {
  id?: string;
  className?: string;
}

export function NotFoundSearch({
  id = "404-search",
  className,
}: INotFoundSearchProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // "/" key
      if (event.code !== "Slash") return;

      // Don't steal "/" when already typing in a field
      const target = event.target as HTMLElement | null;

      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT" ||
        target?.isContentEditable
      ) {
        return;
      }

      event.preventDefault();

      const input = document.getElementById(id);

      if (input instanceof HTMLInputElement) {
        input.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [id]);

  const handleSelect = (item: IDashboardPageItem | null) => {
    if (!item) return;
    if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <AutocompleteSearch<IDashboardPageItem>
      id={id}
      className={className}
      placeholder="Search pages, e.g. Users, Roles, Audit..."
      kbd={<Kbd>/</Kbd>}
      showClear
      showCountStatus
      onSearch={searchPages}
      onSelect={handleSelect}
      itemClassName="hover:bg-accent/60 data-highlighted:bg-accent/60 hover:[&_.page-icon]:bg-primary/15 hover:[&_.page-icon]:text-primary data-highlighted:[&_.page-icon]:bg-primary/15 data-highlighted:[&_.page-icon]:text-primary hover:[&_.page-title]:text-primary data-highlighted:[&_.page-title]:text-primary rounded-lg px-2.5 py-1.5 transition-colors duration-150 cursor-pointer"
      renderItem={(page) => (
        <div className="flex w-full items-center gap-2.5 py-0.5">
          <div className="page-icon bg-muted/80 text-muted-foreground flex size-7 shrink-0 items-center justify-center rounded-md transition-colors duration-150">
            {page.icon}
          </div>
          <div className="min-w-0 flex-1 text-left">
            <div className="flex items-center gap-1.5">
              <span className="page-title text-foreground truncate text-xs font-medium transition-colors duration-150">
                {page.label}
              </span>
              <span className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-[0.625rem] font-medium uppercase">
                {page.category}
              </span>
            </div>
            <p className="text-muted-foreground truncate text-[0.6875rem]">
              {page.description}
            </p>
          </div>
          <span className="text-muted-foreground/50 font-mono text-[0.625rem]">
            {page.path}
          </span>
        </div>
      )}
    />
  );
}

export default NotFoundSearch;
