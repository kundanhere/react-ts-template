import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { toast } from "@/components/ui/toast";
import { useDataTable } from "@/hooks/use-data-table";
import type { DataTableRowAction } from "@/types/data-table";
import type { Session, SessionsTableProps } from "@/types/iam/sessions";

import { RevokeSessionsDialog } from "./revoke-sessions-dialog";
import { SessionDetailsDialog } from "./session-details-dialog";
import { SessionsTableActionBar } from "./sessions-table-action-bar";
import { getSessionsTableColumns } from "./sessions-table-columns";
import { SessionsTableToolbarActions } from "./sessions-table-toolbar-actions";

const INITIAL_SESSIONS: Session[] = [
  {
    id: "sess-1001",
    code: "SESS-1001",
    user: {
      name: "Kundan Gupta",
      email: "kundang25@gmail.com",
      avatar: "https://i.pravatar.cc/150?u=a04",
      role: "Super Admin",
    },
    ipAddress: "192.168.1.45",
    location: "San Francisco, US",
    device: "Chrome 122.0 on macOS 14.3",
    deviceType: "desktop",
    authMethod: "mfa",
    status: "active",
    isCurrent: true,
    riskScore: "low",
    startedAt: new Date("2026-08-26T10:15:00"),
    lastActiveAt: new Date("2026-08-26T15:35:00"),
    expiresAt: new Date("2026-08-27T10:15:00"),
  },
  {
    id: "sess-1002",
    code: "SESS-1002",
    user: {
      name: "Jane Doe",
      email: "jane.doe@enterprise.com",
      avatar: "https://i.pravatar.cc/150?u=a02",
      role: "IAM Admin",
    },
    ipAddress: "10.0.0.12",
    location: "New York, US",
    device: "Firefox 123.0 on Windows 11",
    deviceType: "desktop",
    authMethod: "sso",
    status: "active",
    isCurrent: false,
    riskScore: "low",
    startedAt: new Date("2026-08-26T08:30:00"),
    lastActiveAt: new Date("2026-08-26T14:20:00"),
    expiresAt: new Date("2026-08-27T08:30:00"),
  },
  {
    id: "sess-1003",
    code: "SESS-1003",
    user: {
      name: "Alex Smith",
      email: "alex.smith@partner.io",
      avatar: "https://i.pravatar.cc/150?u=a03",
      role: "Security Auditor",
    },
    ipAddress: "172.16.0.88",
    location: "London, UK",
    device: "Safari 17.2 on iOS 17.3",
    deviceType: "mobile",
    authMethod: "password",
    status: "idle",
    isCurrent: false,
    riskScore: "medium",
    startedAt: new Date("2026-08-26T06:00:00"),
    lastActiveAt: new Date("2026-08-26T11:45:00"),
    expiresAt: new Date("2026-08-27T06:00:00"),
  },
  {
    id: "sess-1004",
    code: "SESS-1004",
    user: {
      name: "Sarah Connor",
      email: "sarah.c@cyberdyne.org",
      avatar: "https://i.pravatar.cc/150?u=a05",
      role: "Compliance Officer",
    },
    ipAddress: "198.51.100.42",
    location: "Tokyo, JP",
    device: "Edge 121.0 on Windows 10",
    deviceType: "desktop",
    authMethod: "mfa",
    status: "active",
    isCurrent: false,
    riskScore: "low",
    startedAt: new Date("2026-08-26T02:10:00"),
    lastActiveAt: new Date("2026-08-26T15:10:00"),
    expiresAt: new Date("2026-08-27T02:10:00"),
  },
  {
    id: "sess-1005",
    code: "SESS-1005",
    user: {
      name: "Michael Scott",
      email: "m.scott@dundermifflin.com",
      avatar: "https://i.pravatar.cc/150?u=a01",
      role: "Regional Lead",
    },
    ipAddress: "203.0.113.19",
    location: "Scranton, US",
    device: "Safari 16.5 on macOS 13.1",
    deviceType: "tablet",
    authMethod: "password",
    status: "expired",
    isCurrent: false,
    riskScore: "high",
    startedAt: new Date("2026-08-24T09:00:00"),
    lastActiveAt: new Date("2026-08-25T17:00:00"),
    expiresAt: new Date("2026-08-25T18:00:00"),
  },
  {
    id: "sess-1006",
    code: "SESS-1006",
    user: {
      name: "Dev Bot Runner",
      email: "ci-bot@internal.net",
      avatar: "https://i.pravatar.cc/150?u=a06",
      role: "Automation Account",
    },
    ipAddress: "10.240.0.5",
    location: "Oregon, US",
    device: "Node.js v20.11 HTTP Engine",
    deviceType: "api",
    authMethod: "api_key",
    status: "active",
    isCurrent: false,
    riskScore: "low",
    startedAt: new Date("2026-08-26T00:00:00"),
    lastActiveAt: new Date("2026-08-26T15:38:00"),
    expiresAt: new Date("2026-09-01T00:00:00"),
  },
  {
    id: "sess-1007",
    code: "SESS-1007",
    user: {
      name: "Robert Chen",
      email: "r.chen@techcorp.com",
      avatar: "https://i.pravatar.cc/150?u=a07",
      role: "Lead Developer",
    },
    ipAddress: "185.220.101.5",
    location: "Berlin, DE",
    device: "Chrome 120.0 on Android 14",
    deviceType: "mobile",
    authMethod: "mfa",
    status: "revoked",
    isCurrent: false,
    riskScore: "high",
    startedAt: new Date("2026-08-25T14:30:00"),
    lastActiveAt: new Date("2026-08-25T19:22:00"),
    expiresAt: new Date("2026-08-26T14:30:00"),
  },
  {
    id: "sess-1008",
    code: "SESS-1008",
    user: {
      name: "Emily Watson",
      email: "e.watson@enterprise.co",
      avatar: "https://i.pravatar.cc/150?u=a08",
      role: "Finance Director",
    },
    ipAddress: "192.0.2.146",
    location: "Toronto, CA",
    device: "Chrome 122.0 on Windows 11",
    deviceType: "desktop",
    authMethod: "sso",
    status: "active",
    isCurrent: false,
    riskScore: "low",
    startedAt: new Date("2026-08-26T11:00:00"),
    lastActiveAt: new Date("2026-08-26T15:20:00"),
    expiresAt: new Date("2026-08-27T11:00:00"),
  },
  {
    id: "sess-1009",
    code: "SESS-1009",
    user: {
      name: "David Kim",
      email: "d.kim@cloudsys.io",
      avatar: "https://i.pravatar.cc/150?u=a09",
      role: "DevOps Engineer",
    },
    ipAddress: "198.51.100.99",
    location: "Seoul, KR",
    device: "Firefox 122.0 on Ubuntu Linux",
    deviceType: "desktop",
    authMethod: "mfa",
    status: "idle",
    isCurrent: false,
    riskScore: "low",
    startedAt: new Date("2026-08-26T04:45:00"),
    lastActiveAt: new Date("2026-08-26T12:10:00"),
    expiresAt: new Date("2026-08-27T04:45:00"),
  },
  {
    id: "sess-1010",
    code: "SESS-1010",
    user: {
      name: "System Backup Agent",
      email: "backup@internal.net",
      avatar: "https://i.pravatar.cc/150?u=a10",
      role: "System Service",
    },
    ipAddress: "10.128.0.1",
    location: "Virginia, US",
    device: "Python Requests v2.31.0",
    deviceType: "api",
    authMethod: "api_key",
    status: "active",
    isCurrent: false,
    riskScore: "low",
    startedAt: new Date("2026-08-26T01:00:00"),
    lastActiveAt: new Date("2026-08-26T15:00:00"),
    expiresAt: new Date("2026-08-28T01:00:00"),
  },
];

export function SessionsTable({ queryKeys }: SessionsTableProps) {
  const [sessions, setSessions] = React.useState<Session[]>(INITIAL_SESSIONS);
  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<Session> | null>(null);
  const [inspectedSession, setInspectedSession] =
    React.useState<Session | null>(null);
  const [isRevokeAllOtherOpen, setIsRevokeAllOtherOpen] = React.useState(false);

  const statusCounts = React.useMemo(
    () =>
      sessions.reduce(
        (acc, s) => {
          acc[s.status] = (acc[s.status] || 0) + 1;
          return acc;
        },
        { active: 0, idle: 0, revoked: 0, expired: 0 } as Record<
          Session["status"],
          number
        >
      ),
    [sessions]
  );

  const deviceTypeCounts = React.useMemo(
    () =>
      sessions.reduce(
        (acc, s) => {
          acc[s.deviceType] = (acc[s.deviceType] || 0) + 1;
          return acc;
        },
        { desktop: 0, mobile: 0, tablet: 0, api: 0 } as Record<
          Session["deviceType"],
          number
        >
      ),
    [sessions]
  );

  const authMethodCounts = React.useMemo(
    () =>
      sessions.reduce(
        (acc, s) => {
          acc[s.authMethod] = (acc[s.authMethod] || 0) + 1;
          return acc;
        },
        { mfa: 0, sso: 0, password: 0, api_key: 0 } as Record<
          Session["authMethod"],
          number
        >
      ),
    [sessions]
  );

  const riskScoreCounts = React.useMemo(
    () =>
      sessions.reduce(
        (acc, s) => {
          acc[s.riskScore] = (acc[s.riskScore] || 0) + 1;
          return acc;
        },
        { low: 0, medium: 0, high: 0 } as Record<Session["riskScore"], number>
      ),
    [sessions]
  );

  const handleUpdateStatus = React.useCallback(
    (sessionId: string, status: Session["status"]) => {
      setSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...s, status } : s))
      );
    },
    []
  );

  const handleBulkUpdateStatus = React.useCallback(
    (sessionIds: string[], status: Session["status"]) => {
      setSessions((prev) =>
        prev.map((s) => (sessionIds.includes(s.id) ? { ...s, status } : s))
      );
    },
    []
  );

  const handleBulkRevoke = React.useCallback((sessionIds: string[]) => {
    setSessions((prev) =>
      prev.map((s) =>
        sessionIds.includes(s.id) && !s.isCurrent
          ? { ...s, status: "revoked" }
          : s
      )
    );
    toast.success(`Revoked ${sessionIds.length} session(s)`);
  }, []);

  const handleRevokeAllOther = React.useCallback(() => {
    setSessions((prev) =>
      prev.map((s) => (s.isCurrent ? s : { ...s, status: "revoked" }))
    );
  }, []);

  const handleViewDetails = React.useCallback((session: Session) => {
    setInspectedSession(session);
  }, []);

  const columns = React.useMemo(
    () =>
      getSessionsTableColumns({
        statusCounts,
        deviceTypeCounts,
        authMethodCounts,
        riskScoreCounts,
        setRowAction,
        onViewDetails: handleViewDetails,
        onUpdateStatus: handleUpdateStatus,
      }),
    [
      statusCounts,
      deviceTypeCounts,
      authMethodCounts,
      riskScoreCounts,
      handleViewDetails,
      handleUpdateStatus,
    ]
  );

  const { table } = useDataTable({
    data: sessions,
    columns,
    pageCount: 1,
    enableAdvancedFilter: false,
    initialState: {
      sorting: [{ id: "lastActiveAt", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    queryKeys,
    getRowId: (originalRow) => originalRow.id,
    shallow: false,
    clearOnDefault: true,
  });

  return (
    <>
      <DataTable
        table={table}
        actionBar={
          <SessionsTableActionBar
            table={table}
            onBulkUpdateStatus={handleBulkUpdateStatus}
            onBulkRevoke={handleBulkRevoke}
          />
        }
      >
        <DataTableToolbar table={table}>
          <SessionsTableToolbarActions
            table={table}
            onRevokeAllOther={() => setIsRevokeAllOtherOpen(true)}
          />
        </DataTableToolbar>
      </DataTable>

      <RevokeSessionsDialog
        open={rowAction?.variant === "delete"}
        onOpenChange={() => setRowAction(null)}
        sessions={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
        onRevokeSessions={handleBulkRevoke}
      />

      <RevokeSessionsDialog
        open={isRevokeAllOtherOpen}
        onOpenChange={setIsRevokeAllOtherOpen}
        isRevokeAllOther
        sessions={[]}
        showTrigger={false}
        onRevokeAllOtherSessions={handleRevokeAllOther}
      />

      <SessionDetailsDialog
        open={!!inspectedSession}
        onOpenChange={(open) => {
          if (!open) setInspectedSession(null);
        }}
        session={inspectedSession}
        onRevoke={(s) => handleBulkRevoke([s.id])}
      />
    </>
  );
}
