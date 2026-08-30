import * as React from "react";

import { RefreshIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router-dom";

import { ErrorBoundary } from "@/app/error-boundary";
import { PageWrapper } from "@/components/page-wrapper";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import type {
  AuditFilter,
  IAnalyticsAuditLog,
  IAnalyticsModule,
  IAnalyticsPolicy,
  IAnalyticsRole,
  IAnalyticsSession,
  IAnalyticsUser,
  TimeRange,
} from "@/types/monitoring/analytics";
import { getItem, setItem } from "@/utils/local-storage";

import {
  ActiveSessionsCard,
  AnalyticsDomainBanner,
  AnalyticsKpiCards,
  CloudAuditLogsCard,
  PolicyRatioCard,
  PolicyThroughputCard,
  SecurityFindingsCard,
  TopAccessModulesCard,
} from "./components";

const LS_PREFIX = "iam_console_";

export default function AnalyticsPage() {
  const [users, setUsers] = React.useState<IAnalyticsUser[]>([]);
  const [roles, setRoles] = React.useState<IAnalyticsRole[]>([]);
  const [policies, setPolicies] = React.useState<IAnalyticsPolicy[]>([]);
  const [modules, setModules] = React.useState<IAnalyticsModule[]>([]);
  const [sessions, setSessions] = React.useState<IAnalyticsSession[]>([]);
  const [auditLogs, setAuditLogs] = React.useState<IAnalyticsAuditLog[]>([]);
  const [timeRange, setTimeRange] = React.useState<TimeRange>("24h");
  const [auditFilter, setAuditFilter] = React.useState<AuditFilter>("ALL");

  const seedData = React.useCallback(() => {
    const t = Date.now();

    const initialModules: IAnalyticsModule[] = [
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

    const initialRoles: IAnalyticsRole[] = [
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

    const initialPolicies: IAnalyticsPolicy[] = [
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

    const initialUsers: IAnalyticsUser[] = [
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

    const initialSessions: IAnalyticsSession[] = [
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

    const initialAuditLogs: IAnalyticsAuditLog[] = [
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
    const localUsers = getItem<IAnalyticsUser[]>(`${LS_PREFIX}users`);
    const localSessions = getItem<IAnalyticsSession[]>(`${LS_PREFIX}sessions`);
    const localRoles = getItem<IAnalyticsRole[]>(`${LS_PREFIX}roles`);
    const localPolicies = getItem<IAnalyticsPolicy[]>(`${LS_PREFIX}policies`);
    const localModules = getItem<IAnalyticsModule[]>(`${LS_PREFIX}modules`);
    const localAudit = getItem<IAnalyticsAuditLog[]>(`${LS_PREFIX}audit`);

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
        <AnalyticsDomainBanner moduleCount={modules.length} />

        <AnalyticsKpiCards
          users={users}
          sessions={sessions}
          roles={roles}
          policies={policies}
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <PolicyThroughputCard
            timeRange={timeRange}
            setTimeRange={setTimeRange}
          />
          <ErrorBoundary variant="component">
            <PolicyRatioCard policies={policies} />
          </ErrorBoundary>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <TopAccessModulesCard modules={modules} />
          <CloudAuditLogsCard
            auditLogs={auditLogs}
            users={users}
            auditFilter={auditFilter}
            setAuditFilter={setAuditFilter}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <ErrorBoundary variant="component">
            <ActiveSessionsCard
              sessions={sessions}
              users={users}
              onRevokeSession={handleRevokeSession}
            />
          </ErrorBoundary>
          <SecurityFindingsCard users={users} />
        </div>
      </div>
    </PageWrapper>
  );
}
