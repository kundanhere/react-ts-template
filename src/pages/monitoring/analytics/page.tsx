import * as React from "react";

import {
  Alert01Icon,
  ArrowRight01Icon,
  Globe02Icon,
  RefreshIcon,
  Shield01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { PageWrapper } from "@/components/page-wrapper";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/toast";
import { getItem, setItem } from "@/utils/local-storage";

const LS_PREFIX = "iam_console_";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  status: string;
  locked: boolean;
  lastLoginAt: string;
  createdAt: string;
}

interface Role {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  description: string;
}

interface Policy {
  id: number;
  name: string;
  slug: string;
  effect: "ALLOW" | "DENY";
  actions: string[];
  resources: string[];
  conditions: Record<string, any>;
}

interface Module {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  priority: number;
  active: boolean;
}

interface Session {
  id: string;
  userId: number;
  device: string;
  ip: string;
  createdAt: string;
  lastActiveAt: string;
}

interface AuditLog {
  id: string;
  userId: number;
  action: string;
  resourceType: string;
  resourceId: number | null;
  result: "ALLOW" | "DENY";
  ip: string;
  ts: string;
  detail: string;
}

export default function AnalyticsPage() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [roles, setRoles] = React.useState<Role[]>([]);
  const [policies, setPolicies] = React.useState<Policy[]>([]);
  const [modules, setModules] = React.useState<Module[]>([]);
  const [sessions, setSessions] = React.useState<Session[]>([]);
  const [auditLogs, setAuditLogs] = React.useState<AuditLog[]>([]);
  const [timeRange, setTimeRange] = React.useState<"24h" | "7d" | "30d">("24h");
  const [auditFilter, setAuditFilter] = React.useState<
    "ALL" | "ALLOW" | "DENY"
  >("ALL");

  const seedData = React.useCallback(() => {
    const t = Date.now();

    const initialModules: Module[] = [
      {
        id: 1,
        name: "Dashboard",
        slug: "Dashboard",
        parentId: null,
        priority: 1,
        active: true,
      },
      {
        id: 2,
        name: "Tasks",
        slug: "Tasks",
        parentId: null,
        priority: 2,
        active: true,
      },
      {
        id: 3,
        name: "Payments",
        slug: "Payments",
        parentId: null,
        priority: 3,
        active: true,
      },
      {
        id: 4,
        name: "Invoices",
        slug: "Invoices",
        parentId: 3,
        priority: 1,
        active: true,
      },
      {
        id: 5,
        name: "Refunds",
        slug: "Refunds",
        parentId: 3,
        priority: 2,
        active: true,
      },
      {
        id: 6,
        name: "Users",
        slug: "Users",
        parentId: null,
        priority: 4,
        active: true,
      },
      {
        id: 7,
        name: "Roles",
        slug: "Roles",
        parentId: null,
        priority: 5,
        active: true,
      },
      {
        id: 8,
        name: "Policies",
        slug: "Policies",
        parentId: null,
        priority: 6,
        active: true,
      },
      {
        id: 9,
        name: "Content",
        slug: "Content",
        parentId: null,
        priority: 7,
        active: true,
      },
      {
        id: 10,
        name: "Pages",
        slug: "Pages",
        parentId: 9,
        priority: 1,
        active: true,
      },
      {
        id: 11,
        name: "Media",
        slug: "Media",
        parentId: 9,
        priority: 2,
        active: true,
      },
      {
        id: 12,
        name: "Reports",
        slug: "Reports",
        parentId: null,
        priority: 8,
        active: false,
      },
    ];

    const initialRoles: Role[] = [
      {
        id: 1,
        name: "Super Admin",
        slug: "super-admin",
        parentId: null,
        description: "Full unrestricted system access across all resources.",
      },
      {
        id: 2,
        name: "Admin",
        slug: "admin",
        parentId: 1,
        description:
          "Manages identity lifecycle, roles, and administrative tasks.",
      },
      {
        id: 3,
        name: "Support",
        slug: "support",
        parentId: 2,
        description: "Read access plus limited diagnostics.",
      },
      {
        id: 4,
        name: "Developer",
        slug: "developer",
        parentId: null,
        description: "Engineering task pipelines and service modules.",
      },
      {
        id: 5,
        name: "Finance",
        slug: "finance",
        parentId: null,
        description: "Financial billing, refunds, and invoice operations.",
      },
      {
        id: 6,
        name: "Intern",
        slug: "intern",
        parentId: 4,
        description: "Restricted developer sandbox environment.",
      },
    ];

    const initialPolicies: Policy[] = [
      {
        id: 1,
        name: "Full System Access",
        slug: "full-system-access",
        effect: "ALLOW",
        actions: ["*"],
        resources: ["*"],
        conditions: {},
      },
      {
        id: 2,
        name: "Admin Console Access",
        slug: "admin-console-access",
        effect: "ALLOW",
        actions: ["view", "add", "edit"],
        resources: ["Users", "Roles", "Content", "Pages", "Media"],
        conditions: {},
      },
      {
        id: 3,
        name: "Support Read Only",
        slug: "support-read-only",
        effect: "ALLOW",
        actions: ["view"],
        resources: ["Users", "Tasks", "Content"],
        conditions: {},
      },
      {
        id: 4,
        name: "Developer Task Access",
        slug: "developer-task-access",
        effect: "ALLOW",
        actions: ["view", "add", "edit"],
        resources: ["Tasks", "Modules"],
        conditions: { ipAddress: ["192.168.1.*"], mfaRequired: true },
      },
      {
        id: 5,
        name: "Finance Payments Access",
        slug: "finance-payments-access",
        effect: "ALLOW",
        actions: ["view", "add", "edit"],
        resources: ["Payments", "Invoices", "Refunds"],
        conditions: { mfaRequired: true },
      },
      {
        id: 6,
        name: "Deny Payments Delete",
        slug: "deny-payments-delete",
        effect: "DENY",
        actions: ["delete"],
        resources: ["Payments", "Refunds"],
        conditions: {},
      },
      {
        id: 7,
        name: "Intern Sandbox",
        slug: "intern-sandbox",
        effect: "ALLOW",
        actions: ["view"],
        resources: ["Tasks"],
        conditions: {},
      },
      {
        id: 8,
        name: "Deny Admin Panel",
        slug: "deny-admin-panel",
        effect: "DENY",
        actions: ["*"],
        resources: ["Roles", "Policies"],
        conditions: {},
      },
    ];

    const initialUsers: User[] = [
      {
        id: 1,
        firstName: "Aiden",
        lastName: "Rowe",
        username: "aiden.rowe",
        email: "aiden.rowe@sentry.dev",
        status: "active",
        locked: false,
        lastLoginAt: new Date(t - 1000 * 60 * 8).toISOString(),
        createdAt: new Date(t - 1000 * 60 * 60 * 24 * 400).toISOString(),
      },
      {
        id: 2,
        firstName: "Priya",
        lastName: "Nair",
        username: "priya.nair",
        email: "priya.nair@sentry.dev",
        status: "active",
        locked: false,
        lastLoginAt: new Date(t - 1000 * 60 * 45).toISOString(),
        createdAt: new Date(t - 1000 * 60 * 60 * 24 * 300).toISOString(),
      },
      {
        id: 3,
        firstName: "Marcus",
        lastName: "Webb",
        username: "marcus.webb",
        email: "marcus.webb@sentry.dev",
        status: "active",
        locked: true,
        lastLoginAt: new Date(t - 1000 * 60 * 60 * 24 * 6).toISOString(),
        createdAt: new Date(t - 1000 * 60 * 60 * 24 * 250).toISOString(),
      },
      {
        id: 4,
        firstName: "Elena",
        lastName: "Torres",
        username: "elena.torres",
        email: "elena.torres@sentry.dev",
        status: "active",
        locked: false,
        lastLoginAt: new Date(t - 1000 * 60 * 60 * 3).toISOString(),
        createdAt: new Date(t - 1000 * 60 * 60 * 24 * 190).toISOString(),
      },
      {
        id: 5,
        firstName: "Sam",
        lastName: "Okafor",
        username: "sam.okafor",
        email: "sam.okafor@sentry.dev",
        status: "inactive",
        locked: false,
        lastLoginAt: new Date(t - 1000 * 60 * 60 * 24 * 40).toISOString(),
        createdAt: new Date(t - 1000 * 60 * 60 * 24 * 180).toISOString(),
      },
      {
        id: 6,
        firstName: "Yuki",
        lastName: "Tanaka",
        username: "yuki.tanaka",
        email: "yuki.tanaka@sentry.dev",
        status: "active",
        locked: false,
        lastLoginAt: new Date(t - 1000 * 60 * 60 * 20).toISOString(),
        createdAt: new Date(t - 1000 * 60 * 60 * 24 * 120).toISOString(),
      },
      {
        id: 7,
        firstName: "Noah",
        lastName: "Fischer",
        username: "noah.fischer",
        email: "noah.fischer@sentry.dev",
        status: "active",
        locked: false,
        lastLoginAt: new Date(t - 1000 * 60 * 60 * 5).toISOString(),
        createdAt: new Date(t - 1000 * 60 * 60 * 24 * 60).toISOString(),
      },
    ];

    const initialSessions: Session[] = [
      {
        id: "sess_1",
        userId: 1,
        device: "Chrome · macOS Sequoia",
        ip: "49.207.14.22",
        createdAt: new Date(t - 1000 * 60 * 60 * 6).toISOString(),
        lastActiveAt: new Date(t - 1000 * 60 * 8).toISOString(),
      },
      {
        id: "sess_2",
        userId: 2,
        device: "Safari · iOS 17.5",
        ip: "103.21.244.10",
        createdAt: new Date(t - 1000 * 60 * 60 * 30).toISOString(),
        lastActiveAt: new Date(t - 1000 * 60 * 45).toISOString(),
      },
      {
        id: "sess_3",
        userId: 4,
        device: "Firefox · Windows 11",
        ip: "192.168.1.14",
        createdAt: new Date(t - 1000 * 60 * 60 * 2).toISOString(),
        lastActiveAt: new Date(t - 1000 * 60 * 60 * 2).toISOString(),
      },
      {
        id: "sess_4",
        userId: 6,
        device: "Edge · Windows 11",
        ip: "88.212.9.4",
        createdAt: new Date(t - 1000 * 60 * 60 * 22).toISOString(),
        lastActiveAt: new Date(t - 1000 * 60 * 60 * 20).toISOString(),
      },
      {
        id: "sess_5",
        userId: 7,
        device: "Chrome · Android 14",
        ip: "41.90.12.201",
        createdAt: new Date(t - 1000 * 60 * 60 * 8).toISOString(),
        lastActiveAt: new Date(t - 1000 * 60 * 60 * 5).toISOString(),
      },
    ];

    const initialAuditLogs: AuditLog[] = [
      {
        id: "aud_1",
        userId: 1,
        action: "iam.roles.attachPolicy",
        resourceType: "Role",
        resourceId: 5,
        result: "ALLOW",
        ip: "49.207.14.22",
        ts: new Date(t - 1000 * 60 * 4).toISOString(),
        detail: "Attached finance-payments-access to Role 'Finance'",
      },
      {
        id: "aud_2",
        userId: 2,
        action: "iam.users.lockAccount",
        resourceType: "User",
        resourceId: 3,
        result: "ALLOW",
        ip: "103.21.244.10",
        ts: new Date(t - 1000 * 60 * 40).toISOString(),
        detail: "Account locked after failed credential challenge threshold",
      },
      {
        id: "aud_3",
        userId: 7,
        action: "iam.payments.delete",
        resourceType: "Payments",
        resourceId: 882,
        result: "DENY",
        ip: "41.90.12.201",
        ts: new Date(t - 1000 * 60 * 90).toISOString(),
        detail: "Explicit DENY enforced by deny-payments-delete policy binding",
      },
      {
        id: "aud_4",
        userId: 4,
        action: "iam.tasks.mutate",
        resourceType: "Tasks",
        resourceId: 44,
        result: "ALLOW",
        ip: "192.168.1.14",
        ts: new Date(t - 1000 * 60 * 150).toISOString(),
        detail: "Updated deployment sprint task authorization parameters",
      },
      {
        id: "aud_5",
        userId: 6,
        action: "iam.invoices.query",
        resourceType: "Invoices",
        resourceId: 12,
        result: "ALLOW",
        ip: "88.212.9.4",
        ts: new Date(t - 1000 * 60 * 60 * 5).toISOString(),
        detail: "Authorized read query on client invoice audit record",
      },
      {
        id: "aud_6",
        userId: 5,
        action: "iam.auth.authenticate",
        resourceType: "Session",
        resourceId: null,
        result: "DENY",
        ip: "77.10.44.9",
        ts: new Date(t - 1000 * 60 * 60 * 24).toISOString(),
        detail: "Authentication rejected — account status is inactive",
      },
      {
        id: "aud_7",
        userId: 1,
        action: "iam.roles.create",
        resourceType: "Role",
        resourceId: 6,
        result: "ALLOW",
        ip: "49.207.14.22",
        ts: new Date(t - 1000 * 60 * 60 * 30).toISOString(),
        detail: "Created role 'Intern' with restricted developer inheritance",
      },
    ];

    setItem(`${LS_PREFIX}users`, initialUsers);
    setItem(`${LS_PREFIX}roles`, initialRoles);
    setItem(`${LS_PREFIX}policies`, initialPolicies);
    setItem(`${LS_PREFIX}modules`, initialModules);
    setItem(`${LS_PREFIX}sessions`, initialSessions);
    setItem(`${LS_PREFIX}audit`, initialAuditLogs);

    setUsers(initialUsers);
    setRoles(initialRoles);
    setPolicies(initialPolicies);
    setModules(initialModules);
    setSessions(initialSessions);
    setAuditLogs(initialAuditLogs);
  }, []);

  const loadData = React.useCallback(() => {
    const localUsers = getItem<User[]>(`${LS_PREFIX}users`);
    const localSessions = getItem<Session[]>(`${LS_PREFIX}sessions`);
    const localRoles = getItem<Role[]>(`${LS_PREFIX}roles`);
    const localPolicies = getItem<Policy[]>(`${LS_PREFIX}policies`);
    const localModules = getItem<Module[]>(`${LS_PREFIX}modules`);
    const localAudit = getItem<AuditLog[]>(`${LS_PREFIX}audit`);

    if (!localUsers || !localSessions || localSessions.length === 0) {
      seedData();
    } else {
      setUsers(localUsers);
      setRoles(localRoles && localRoles.length > 0 ? localRoles : []);
      setPolicies(
        localPolicies && localPolicies.length > 0 ? localPolicies : []
      );
      setModules(localModules && localModules.length > 0 ? localModules : []);
      setSessions(
        localSessions && localSessions.length > 0 ? localSessions : []
      );
      setAuditLogs(localAudit && localAudit.length > 0 ? localAudit : []);
    }
  }, [seedData]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleReset = () => {
    seedData();
    toast.success("IAM demo data reseeded successfully");
  };

  const handleRevokeSession = (sessionId: string) => {
    const updated = sessions.filter((s) => s.id !== sessionId);
    setSessions(updated);
    setItem(`${LS_PREFIX}sessions`, updated);
    toast.success(`Session node ${sessionId} disconnected`);
  };

  const activeCount = users.filter(
    (u) => u.status === "active" && !u.locked
  ).length;
  const lockedCount = users.filter((u) => u.locked).length;
  const rootRolesCount = roles.filter((r) => !r.parentId).length;
  const denyPoliciesCount = policies.filter((p) => p.effect === "DENY").length;
  const allowPoliciesCount = policies.filter(
    (p) => p.effect === "ALLOW"
  ).length;
  const uniqueUsersInSessions = new Set(sessions.map((s) => s.userId)).size;

  const totalPolicyCount = allowPoliciesCount + denyPoliciesCount || 1;
  const wildcardPoliciesCount = policies.filter((p) =>
    p.resources.includes("*")
  ).length;
  const conditionalPoliciesCount = policies.filter(
    (p) => Object.keys(p.conditions || {}).length > 0
  ).length;

  const lockedOrInactiveUsers = users.filter(
    (u) => u.locked || u.status !== "active"
  );

  const getUser = (userId: number) => users.find((u) => u.id === userId);

  const getUserName = (userId: number) => {
    const user = getUser(userId);
    return user
      ? `${user.firstName} ${user.lastName}`
      : "System Service Account";
  };

  const getUserInitials = (userId: number) => {
    const user = getUser(userId);
    if (!user) return "SA";
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  const timeAgo = (iso: string) => {
    if (!iso) return "—";
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    return `${d}d ago`;
  };

  const topKpis = [
    {
      id: "users",
      title: "Principals",
      subtitle: "Users & Accounts",
      value: users.length,
      statLine: `${activeCount} active · ${lockedOrInactiveUsers.length} suspended`,
      color: "var(--primary, #10b981)",
      accentClass: "bg-primary",
      badge: (
        <Badge
          variant="outline"
          className="border-emerald-500/30 bg-emerald-50/50 px-1.5 py-0.5 text-[0.625rem] font-semibold text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"
        >
          +14.2%
        </Badge>
      ),
      data: [
        { v: 3 },
        { v: 4 },
        { v: 4.5 },
        { v: 4.2 },
        { v: 5.5 },
        { v: 6 },
        { v: 7 },
      ],
    },
    {
      id: "sessions",
      title: "Active Sessions",
      subtitle: "Live Token Instances",
      value: sessions.length,
      statLine: `${uniqueUsersInSessions} active clients online`,
      color: "#0ea5e9",
      accentClass: "bg-sky-500",
      badge: (
        <Badge
          variant="outline"
          className="gap-1 border-sky-500/30 bg-sky-50/50 px-1.5 py-0.5 text-[0.625rem] font-semibold text-sky-600 dark:bg-sky-950/20 dark:text-sky-400"
        >
          <span className="size-1 rounded-full bg-sky-500" />
          Healthy
        </Badge>
      ),
      data: [
        { v: 2 },
        { v: 3.5 },
        { v: 2.8 },
        { v: 4.6 },
        { v: 3.9 },
        { v: 4.8 },
        { v: 5 },
      ],
    },
    {
      id: "roles",
      title: "Assigned Roles",
      subtitle: "Hierarchy Definitions",
      value: roles.length,
      statLine: `${rootRolesCount} custom · ${roles.length - rootRolesCount} inherited`,
      color: "#8b5cf6",
      accentClass: "bg-violet-500",
      badge: (
        <Badge
          variant="outline"
          className="gap-1 border-violet-500/30 bg-violet-50/50 px-1.5 py-0.5 text-[0.625rem] font-semibold text-violet-600 dark:bg-violet-950/20 dark:text-violet-400"
        >
          <span className="size-1 rounded-full bg-violet-500" />6 Defined
        </Badge>
      ),
      data: [
        { v: 3 },
        { v: 4 },
        { v: 4.2 },
        { v: 4.8 },
        { v: 5.2 },
        { v: 5.8 },
        { v: 6 },
      ],
    },
    {
      id: "policies",
      title: "IAM Policy Bindings",
      subtitle: "Declarative Rule Scope",
      value: policies.length,
      statLine: `${allowPoliciesCount} allow · ${denyPoliciesCount} explicit deny`,
      color: "#14b8a6",
      accentClass: "bg-teal-500",
      badge: (
        <Badge
          variant="outline"
          className="gap-1 border-teal-500/30 bg-teal-50/50 px-1.5 py-0.5 text-[0.625rem] font-semibold text-teal-600 dark:bg-teal-950/20 dark:text-teal-400"
        >
          <span className="size-1 rounded-full bg-teal-500" />
          100% Active
        </Badge>
      ),
      data: [
        { v: 4 },
        { v: 5 },
        { v: 5.8 },
        { v: 6.2 },
        { v: 7 },
        { v: 7.6 },
        { v: 8 },
      ],
    },
    {
      id: "locked",
      title: "Security Findings",
      subtitle: "Threat & Anomaly Guard",
      value: lockedCount,
      statLine:
        lockedCount > 0 ? "1 account requires review" : "0 active violations",
      color: lockedCount > 0 ? "#f43f5e" : "var(--primary, #10b981)",
      accentClass: lockedCount > 0 ? "bg-rose-500" : "bg-primary",
      badge:
        lockedCount > 0 ? (
          <Badge
            variant="outline"
            className="gap-1 border-rose-500/30 bg-rose-50/50 px-1.5 py-0.5 text-[0.625rem] font-semibold text-rose-600 dark:bg-rose-950/20 dark:text-rose-400"
          >
            <span className="size-1 rounded-full bg-rose-500" />
            Action Required
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="gap-1 border-emerald-500/30 bg-emerald-50/50 px-1.5 py-0.5 text-[0.625rem] font-semibold text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"
          >
            <span className="size-1 rounded-full bg-emerald-500" />
            Protected
          </Badge>
        ),
      data: [
        { v: 0 },
        { v: 0.2 },
        { v: 0 },
        { v: 0.8 },
        { v: 0.3 },
        { v: 1 },
        { v: 1 },
      ],
    },
  ];

  const traffic24h = React.useMemo(
    () => [
      { time: "00:00", allowed: 45, denied: 3 },
      { time: "04:00", allowed: 28, denied: 1 },
      { time: "08:00", allowed: 165, denied: 14 },
      { time: "12:00", allowed: 340, denied: 28 },
      { time: "16:00", allowed: 480, denied: 42 },
      { time: "20:00", allowed: 290, denied: 19 },
      { time: "23:59", allowed: 110, denied: 6 },
    ],
    []
  );

  const traffic7d = React.useMemo(
    () => [
      { time: "Mon", allowed: 1420, denied: 110 },
      { time: "Tue", allowed: 1680, denied: 145 },
      { time: "Wed", allowed: 1890, denied: 98 },
      { time: "Thu", allowed: 2100, denied: 165 },
      { time: "Fri", allowed: 1950, denied: 130 },
      { time: "Sat", allowed: 820, denied: 45 },
      { time: "Sun", allowed: 640, denied: 30 },
    ],
    []
  );

  const traffic30d = React.useMemo(
    () => [
      { time: "W1", allowed: 8400, denied: 620 },
      { time: "W2", allowed: 9800, denied: 740 },
      { time: "W3", allowed: 11200, denied: 890 },
      { time: "W4", allowed: 10450, denied: 810 },
    ],
    []
  );

  const activeTrafficData = React.useMemo(() => {
    if (timeRange === "24h") return traffic24h;
    if (timeRange === "7d") return traffic7d;
    return traffic30d;
  }, [timeRange, traffic24h, traffic7d, traffic30d]);

  const trafficChartConfig = {
    allowed: {
      label: "Allowed Calls",
      color: "var(--primary, #10b981)",
    },
    denied: {
      label: "Denied / Blocked",
      color: "#f43f5e",
    },
  } satisfies ChartConfig;

  const policyRatioData = [
    {
      name: "Allow Permissions",
      value: allowPoliciesCount,
      fill: "var(--primary, #10b981)",
    },
    { name: "Deny Policies", value: denyPoliciesCount, fill: "#f43f5e" },
  ];

  const policyRatioConfig = {
    allow: {
      label: "Allow Permissions",
      color: "var(--primary, #10b981)",
    },
    deny: {
      label: "Deny Policies",
      color: "#f43f5e",
    },
  } satisfies ChartConfig;

  const moduleTrafficData = [
    { module: "Users", requests: 1420, fill: "var(--chart-1, #10b981)" },
    { module: "Payments", requests: 980, fill: "var(--chart-2, #0ea5e9)" },
    { module: "Invoices", requests: 750, fill: "var(--chart-3, #14b8a6)" },
    { module: "Roles", requests: 620, fill: "var(--chart-4, #8b5cf6)" },
    { module: "Tasks", requests: 430, fill: "var(--chart-5, #f59e0b)" },
    { module: "Content", requests: 310, fill: "var(--chart-1, #059669)" },
  ];

  const moduleTrafficConfig = {
    requests: {
      label: "Request Volume",
      color: "var(--primary, #10b981)",
    },
  } satisfies ChartConfig;

  const allowAuditCount = auditLogs.filter((l) => l.result === "ALLOW").length;
  const denyAuditCount = auditLogs.filter((l) => l.result === "DENY").length;

  const filteredAuditLogs = auditLogs.filter((log) => {
    if (auditFilter === "ALL") return true;
    return log.result === auditFilter;
  });

  const getRangeLabel = (range: "24h" | "7d" | "30d") => {
    if (range === "24h") return "24 Hours";
    if (range === "7d") return "7 Days";
    return "30 Days";
  };

  return (
    <PageWrapper
      title="Analytics & Metrics"
      subtitle="Real-time security analytics, identity evaluations, and system traffic overview."
      action={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="border-border/80 h-8 gap-1.5 text-xs font-medium"
          >
            <HugeiconsIcon icon={RefreshIcon} size={14} />
            Reset State
          </Button>
          <Button size="sm" asChild className="h-8 text-xs font-medium">
            <Link to="/iam/access/simulate">Policy Simulator</Link>
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="border-border bg-card flex flex-col justify-between gap-4 rounded-xl border p-4 shadow-xs sm:flex-row sm:items-center">
          <div className="flex items-center gap-3.5">
            <div className="border-border bg-muted/60 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border shadow-2xs">
              <HugeiconsIcon icon={Shield01Icon} size={18} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-muted-foreground text-xs font-semibold">
                  Organization Domain:
                </span>
                <span className="text-foreground bg-muted/50 border-border/60 rounded-md border px-2 py-0.5 font-mono text-xs font-semibold">
                  sentry-identity-prod
                </span>
                <Badge
                  variant="outline"
                  className="gap-1.5 border-emerald-500/30 bg-emerald-50/50 px-2 py-0.5 text-[0.625rem] font-normal text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"
                >
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  Enforced
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                Principal authorization engine active across {modules.length}{" "}
                registered system modules with adaptive MFA enforcement.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="h-8 text-xs font-medium"
            >
              <Link to="/iam/users">Manage Principals</Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="h-8 text-xs font-medium"
            >
              <Link to="/iam/roles">Manage Roles</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {topKpis.map((kpi) => (
            <div
              key={kpi.id}
              className="border-border/75 bg-card relative flex flex-col justify-between overflow-hidden rounded-xl border p-3.5 shadow-xs"
            >
              <div
                className={`absolute top-0 right-0 left-0 h-[2.5px] ${kpi.accentClass}`}
                style={{
                  backgroundColor: kpi.color.startsWith("var")
                    ? undefined
                    : kpi.color,
                }}
              />

              <div className="flex items-center justify-between gap-1 pt-0.5">
                <span className="text-muted-foreground truncate text-xs font-semibold tracking-tight">
                  {kpi.title}
                </span>
                {kpi.badge}
              </div>

              <div className="mt-2.5 flex items-end justify-between gap-2">
                <div className="flex min-w-0 flex-col">
                  <div className="text-foreground text-2xl leading-none font-bold tracking-tight">
                    {kpi.value}
                  </div>
                  <div className="text-muted-foreground mt-1 truncate text-[11px] font-medium">
                    {kpi.statLine}
                  </div>
                </div>

                <div className="h-8 w-20 shrink-0 overflow-hidden rounded">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={kpi.data}
                      margin={{ top: 2, right: 0, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id={`kpi-grad-${kpi.id}`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor={
                              kpi.color.startsWith("var")
                                ? "#10b981"
                                : kpi.color
                            }
                            stopOpacity={0.4}
                          />
                          <stop
                            offset="100%"
                            stopColor={
                              kpi.color.startsWith("var")
                                ? "#10b981"
                                : kpi.color
                            }
                            stopOpacity={0.0}
                          />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="v"
                        stroke={
                          kpi.color.startsWith("var") ? "#10b981" : kpi.color
                        }
                        strokeWidth={1.8}
                        fill={`url(#kpi-grad-${kpi.id})`}
                        isAnimationActive
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="gap-0 py-0 shadow-xs lg:col-span-2">
            <CardHeader className="border-border/40 flex flex-col justify-between gap-2.5 border-b px-4 py-3 sm:flex-row sm:items-center">
              <div>
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <span>Policy Evaluation Throughput</span>
                  <Badge
                    variant="outline"
                    className="gap-1.5 border-emerald-500/30 bg-emerald-50/50 px-2 py-0.5 text-[0.625rem] font-normal text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"
                  >
                    <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                    Active
                  </Badge>
                </CardTitle>
                <CardDescription className="mt-0.5 text-xs">
                  Real-time authorization decisions evaluated across all system
                  API surfaces.
                </CardDescription>
              </div>

              <CardAction>
                <div className="border-border bg-muted/40 flex items-center rounded-lg border p-0.5 text-xs">
                  {(["24h", "7d", "30d"] as const).map((range) => (
                    <button
                      key={range}
                      type="button"
                      onClick={() => setTimeRange(range)}
                      className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                        timeRange === range
                          ? "bg-background text-foreground font-semibold shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {getRangeLabel(range)}
                    </button>
                  ))}
                </div>
              </CardAction>
            </CardHeader>

            <CardContent className="px-4 py-3">
              <ChartContainer
                config={trafficChartConfig}
                className="aspect-auto h-55 w-full"
              >
                <AreaChart
                  data={activeTrafficData}
                  margin={{ top: 8, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="themeAllowedGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#10b981"
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="95%"
                        stopColor="#10b981"
                        stopOpacity={0.0}
                      />
                    </linearGradient>
                    <linearGradient
                      id="themeDeniedGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#f43f5e"
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="95%"
                        stopColor="#f43f5e"
                        stopOpacity={0.0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="var(--border)"
                    opacity={0.5}
                  />
                  <XAxis
                    dataKey="time"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={6}
                  />
                  <YAxis tickLine={false} axisLine={false} tickMargin={6} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="allowed"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#themeAllowedGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="denied"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#themeDeniedGrad)"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>

            <CardFooter className="text-muted-foreground mt-auto flex w-full items-center justify-between border-t px-4 py-2.5 text-xs">
              <div className="flex items-center gap-1.5">
                <HugeiconsIcon icon={Globe02Icon} size={14} />
                <span>Global Realtime Pipeline</span>
              </div>
              <span className="text-foreground font-mono text-[11px] font-medium">
                99.98% SLA Availability
              </span>
            </CardFooter>
          </Card>

          <Card className="gap-0 py-0 shadow-xs">
            <CardHeader className="border-border/40 border-b px-4 py-3">
              <CardTitle className="text-sm font-semibold">
                Policy Enforcement Ratio
              </CardTitle>
              <CardDescription className="text-xs">
                Declarative Allow permissions vs explicit Deny rules.
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col items-center px-4 py-3">
              <ChartContainer
                config={policyRatioConfig}
                className="aspect-square h-34 w-full"
              >
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={policyRatioData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={42}
                    outerRadius={62}
                    strokeWidth={3}
                    stroke="var(--background)"
                  >
                    {policyRatioData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>

              <div className="divide-border/40 mt-1.5 w-full divide-y text-xs">
                <div className="flex items-center justify-between py-1.5">
                  <span className="flex items-center gap-2 font-medium">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    ALLOW Rules
                  </span>
                  <Badge
                    variant="outline"
                    className="border-emerald-500/30 bg-emerald-50/50 px-1.5 py-0.5 text-[0.625rem] font-normal text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"
                  >
                    {allowPoliciesCount} rules (
                    {((allowPoliciesCount / totalPolicyCount) * 100).toFixed(0)}
                    %)
                  </Badge>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="flex items-center gap-2 font-medium">
                    <span className="bg-destructive size-1.5 rounded-full" />
                    DENY Rules
                  </span>
                  <Badge
                    variant="outline"
                    className="text-destructive border-destructive/30 bg-destructive/10 px-1.5 py-0.5 text-[0.625rem] font-normal"
                  >
                    {denyPoliciesCount} rules (
                    {((denyPoliciesCount / totalPolicyCount) * 100).toFixed(0)}
                    %)
                  </Badge>
                </div>
                <div className="text-muted-foreground flex items-center justify-between py-1 text-[11px]">
                  <span>Wildcard (*) Target Scope</span>
                  <span className="text-foreground font-mono font-semibold">
                    {wildcardPoliciesCount}
                  </span>
                </div>
                <div className="text-muted-foreground flex items-center justify-between py-1 text-[11px]">
                  <span>MFA / Conditional Rules</span>
                  <span className="text-foreground font-mono font-semibold">
                    {conditionalPoliciesCount}
                  </span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="text-muted-foreground mt-auto flex w-full items-center justify-between border-t px-4 py-2.5 text-xs">
              <div className="flex items-center gap-1.5">
                <HugeiconsIcon icon={Shield01Icon} size={14} />
                <span>{policies.length} Active Bindings</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-primary h-6 px-2 text-[11px]"
              >
                <Link to="/iam/policies">Policies →</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="gap-0 py-0 shadow-xs">
            <CardHeader className="border-border/40 border-b px-4 py-3">
              <CardTitle className="text-sm font-semibold">
                Top Access Modules
              </CardTitle>
              <CardDescription className="text-xs">
                Authorization frequency per functional module ({modules.length}{" "}
                registered).
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 py-3">
              <ChartContainer
                config={moduleTrafficConfig}
                className="aspect-auto h-55 w-full"
              >
                <BarChart
                  data={moduleTrafficData}
                  layout="vertical"
                  margin={{ top: 0, right: 10, left: 5, bottom: 0 }}
                >
                  <CartesianGrid
                    horizontal={false}
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    opacity={0.5}
                  />
                  <XAxis type="number" tickLine={false} axisLine={false} />
                  <YAxis
                    dataKey="module"
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    width={65}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="requests" radius={[0, 4, 4, 0]}>
                    {moduleTrafficData.map((entry) => (
                      <Cell key={entry.module} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="text-muted-foreground mt-auto flex w-full items-center justify-between border-t px-4 py-2.5 text-xs">
              <span>6 Active Pipelines</span>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-primary h-6 px-2 text-[11px]"
              >
                <Link to="/iam/modules">Manage Modules →</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="gap-0 py-0 shadow-xs lg:col-span-2">
            <CardHeader className="border-border/40 flex flex-col justify-between gap-2.5 border-b px-4 py-3 sm:flex-row sm:items-center">
              <div>
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <span>Cloud Audit Logs</span>
                  <Badge
                    variant="secondary"
                    className="border-border border px-2 py-0.5 text-[0.625rem]"
                  >
                    {filteredAuditLogs.length} Events
                  </Badge>
                </CardTitle>
                <CardDescription className="text-xs">
                  Continuous evaluation trace of IAM methods and authorization
                  decisions.
                </CardDescription>
              </div>

              <CardAction>
                <div className="flex items-center gap-2">
                  <div className="border-border bg-muted/40 flex items-center rounded-lg border p-0.5 text-xs font-medium">
                    <button
                      type="button"
                      onClick={() => setAuditFilter("ALL")}
                      className={`rounded-md px-2.5 py-0.5 text-xs transition-all ${
                        auditFilter === "ALL"
                          ? "bg-background text-foreground font-semibold shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      All ({auditLogs.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuditFilter("ALLOW")}
                      className={`flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-xs transition-all ${
                        auditFilter === "ALLOW"
                          ? "bg-background font-semibold text-emerald-600 shadow-xs dark:text-emerald-400"
                          : "text-muted-foreground hover:text-emerald-500"
                      }`}
                    >
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      Allow ({allowAuditCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuditFilter("DENY")}
                      className={`flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-xs transition-all ${
                        auditFilter === "DENY"
                          ? "bg-background text-destructive font-semibold shadow-xs"
                          : "text-muted-foreground hover:text-destructive"
                      }`}
                    >
                      <span className="bg-destructive size-1.5 rounded-full" />
                      Deny ({denyAuditCount})
                    </button>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="text-primary h-7 gap-1 text-xs"
                  >
                    <Link to="/iam/audit/logs">
                      Full Log{" "}
                      <HugeiconsIcon icon={ArrowRight01Icon} size={11} />
                    </Link>
                  </Button>
                </div>
              </CardAction>
            </CardHeader>

            <CardContent className="p-0">
              <div className="min-w-155">
                <div className="bg-muted/30 border-border/40 text-muted-foreground grid grid-cols-12 gap-3 border-b px-4 py-2 text-[10px] font-bold tracking-wider uppercase">
                  <div className="col-span-2">SEVERITY / STATUS</div>
                  <div className="col-span-3">PRINCIPAL</div>
                  <div className="col-span-3">METHOD / ACTION</div>
                  <div className="col-span-3">RESOURCE & DETAIL</div>
                  <div className="col-span-1 text-right">TIME</div>
                </div>

                <ScrollArea className="h-55">
                  <div className="divide-border/30 divide-y">
                    {filteredAuditLogs.length > 0 ? (
                      filteredAuditLogs.map((log) => {
                        const isAllow = log.result === "ALLOW";
                        return (
                          <div
                            key={log.id}
                            className="grid grid-cols-12 items-center gap-3 px-4 py-2 text-xs transition-colors"
                          >
                            <div className="col-span-2 flex items-center">
                              <Badge
                                variant="outline"
                                className="gap-1.5 px-2 py-0.5 text-[0.625rem] font-normal"
                              >
                                <span
                                  className={`size-1.5 rounded-full ${
                                    isAllow
                                      ? "bg-emerald-500"
                                      : "bg-destructive"
                                  }`}
                                />
                                {isAllow ? "Allow" : "Deny"}
                              </Badge>
                            </div>

                            <div className="col-span-3 flex min-w-0 items-center gap-2">
                              <Avatar className="ring-border/80 h-5 w-5 shrink-0 ring-1">
                                <AvatarFallback className="bg-muted text-[9px] font-bold">
                                  {getUserInitials(log.userId)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-foreground truncate text-xs font-semibold">
                                {getUserName(log.userId)}
                              </span>
                            </div>

                            <div className="col-span-3 flex min-w-0 items-center gap-1.5">
                              <span className="bg-muted/60 border-border/40 text-foreground truncate rounded border px-1.5 py-0.5 font-mono text-xs font-medium">
                                {log.action}
                              </span>
                            </div>

                            <div
                              className="text-muted-foreground col-span-3 truncate text-xs"
                              title={log.detail}
                            >
                              <span className="text-foreground/85 mr-1 font-semibold">
                                {log.resourceType}:
                              </span>
                              {log.detail}
                            </div>

                            <div className="text-muted-foreground col-span-1 text-right font-mono text-[11px] whitespace-nowrap">
                              {timeAgo(log.ts)}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-muted-foreground py-10 text-center text-xs font-medium">
                        No audit events recorded for current filter.
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>

            <CardFooter className="text-muted-foreground mt-auto flex w-full items-center justify-between border-t px-4 py-2.5 text-xs">
              <span>Real-time Stream</span>
              <span className="font-mono text-[11px]">Audit Engine v2.4</span>
            </CardFooter>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="gap-0 py-0 shadow-xs lg:col-span-2">
            <CardHeader className="border-border/40 flex flex-row items-center justify-between border-b px-4 py-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <span>Active Client Sessions</span>
                  <Badge
                    variant="secondary"
                    className="border-border border px-2 py-0.5 text-[0.625rem]"
                  >
                    {sessions.length} Connected
                  </Badge>
                </CardTitle>
                <CardDescription className="text-xs">
                  Active OAuth tokens and authenticated browser instances.
                </CardDescription>
              </div>
              <CardAction>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-primary h-7 gap-1 text-xs"
                >
                  <Link to="/iam/sessions">
                    All Sessions{" "}
                    <HugeiconsIcon icon={ArrowRight01Icon} size={11} />
                  </Link>
                </Button>
              </CardAction>
            </CardHeader>

            <CardContent className="p-0">
              <ScrollArea className="h-52">
                <div className="divide-border/30 divide-y">
                  {sessions.length > 0 ? (
                    sessions.map((session) => (
                      <div
                        key={session.id}
                        className="flex items-center justify-between gap-3 px-4 py-2 transition-colors"
                      >
                        <div className="flex min-w-0 items-center gap-2.5">
                          <Avatar className="ring-border h-6 w-6 shrink-0 ring-1">
                            <AvatarFallback className="bg-muted text-[10px] font-bold">
                              {getUserInitials(session.userId)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="text-foreground truncate text-xs font-semibold">
                              {getUserName(session.userId)}
                            </div>
                            <div className="text-muted-foreground truncate text-[10px]">
                              {session.device}
                            </div>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2.5">
                          <span className="text-muted-foreground bg-muted/50 border-border/50 rounded border px-1.5 py-0.5 font-mono text-[0.6875rem]">
                            {session.ip}
                          </span>
                          <span className="text-muted-foreground hidden font-mono text-[10px] whitespace-nowrap sm:inline-block">
                            {timeAgo(session.lastActiveAt)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRevokeSession(session.id)}
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive h-6 px-2 text-[10px] font-medium"
                          >
                            Disconnect
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-muted-foreground py-10 text-center text-xs">
                      No active sessions found.
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>

            <CardFooter className="text-muted-foreground mt-auto flex w-full items-center justify-between border-t px-4 py-2.5 text-xs">
              <div className="flex items-center gap-1.5">
                <HugeiconsIcon icon={UserGroupIcon} size={14} />
                <span>{uniqueUsersInSessions} Authenticated Principals</span>
              </div>
              <span className="font-mono text-[11px]">TLS 1.3 Encrypted</span>
            </CardFooter>
          </Card>

          <Card className="gap-0 py-0 shadow-xs">
            <CardHeader className="border-border/40 flex flex-row items-center justify-between border-b px-4 py-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <HugeiconsIcon
                    icon={Alert01Icon}
                    className="h-4 w-4 text-amber-500"
                  />
                  <span>Security Findings</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Identity anomalies flagged by policy analyzer.
                </CardDescription>
              </div>
              <CardAction>
                <Button
                  variant="link"
                  size="sm"
                  asChild
                  className="text-primary p-0 text-xs font-medium"
                >
                  <Link to="/iam/users">Users →</Link>
                </Button>
              </CardAction>
            </CardHeader>

            <CardContent className="p-0">
              <ScrollArea className="h-52">
                <div className="space-y-2 p-3">
                  {lockedOrInactiveUsers.length > 0 ? (
                    lockedOrInactiveUsers.map((user) => (
                      <div
                        key={user.id}
                        className="border-border/70 bg-card space-y-1.5 rounded-lg border p-2.5 shadow-xs transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex min-w-0 items-center gap-2">
                            <Avatar className="ring-border h-6 w-6 shrink-0 ring-1">
                              <AvatarFallback className="bg-muted text-[9px] font-bold">
                                {user.firstName.charAt(0)}
                                {user.lastName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <div className="truncate text-xs font-semibold">
                                {user.firstName} {user.lastName}
                              </div>
                            </div>
                          </div>

                          <Badge
                            variant="outline"
                            className={`gap-1 px-1.5 py-0.5 text-[0.625rem] capitalize ${
                              user.locked
                                ? "text-destructive border-destructive/30 bg-destructive/10"
                                : "text-muted-foreground border-muted bg-muted/40"
                            }`}
                          >
                            {user.locked ? "Locked" : "Suspended"}
                          </Badge>
                        </div>

                        <div className="text-muted-foreground bg-muted/30 border-border/30 rounded-md border p-1.5 text-[11px]">
                          {user.locked
                            ? "Restricted due to anomalous failed MFA credentials."
                            : "Account suspended by identity workspace policy."}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-muted-foreground py-10 text-center text-xs">
                      Zero security findings detected.
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>

            <CardFooter className="text-muted-foreground mt-auto flex w-full items-center justify-between border-t px-4 py-2.5 text-xs">
              <span>Anomaly Scanner</span>
              <span className="font-mono text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                {lockedCount === 0
                  ? "All Clear"
                  : `${lockedCount} Action Needed`}
              </span>
            </CardFooter>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
