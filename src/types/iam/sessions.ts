import type * as React from "react";

import type { Table } from "@tanstack/react-table";

import type { AlertDialog } from "@/components/ui/alert-dialog";
import type { DataTableRowAction, QueryKeys } from "@/types/data-table";

export interface Session {
  id: string;
  code: string;
  user: {
    name: string;
    email: string;
    avatar?: string;
    role: string;
  };
  ipAddress: string;
  location: string;
  device: string;
  deviceType: "desktop" | "mobile" | "tablet" | "api";
  authMethod: "mfa" | "sso" | "password" | "api_key";
  status: "active" | "idle" | "revoked" | "expired";
  isCurrent: boolean;
  riskScore: "low" | "medium" | "high";
  startedAt: Date;
  lastActiveAt: Date;
  expiresAt: Date;
}

export interface GetSessionsTableColumnsProps {
  statusCounts: Record<Session["status"], number>;
  deviceTypeCounts: Record<Session["deviceType"], number>;
  authMethodCounts: Record<Session["authMethod"], number>;
  riskScoreCounts: Record<Session["riskScore"], number>;
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<Session> | null>
  >;
  onViewDetails?: (session: Session) => void;
  onUpdateStatus?: (sessionId: string, status: Session["status"]) => void;
}

export interface SessionsTableProps {
  queryKeys?: Partial<QueryKeys>;
}

export interface SessionsTableActionBarProps {
  table: Table<Session>;
  onBulkUpdateStatus?: (
    sessionIds: string[],
    status: Session["status"]
  ) => void;
  onBulkRevoke?: (sessionIds: string[]) => void;
}

export interface SessionsTableToolbarActionsProps {
  table: Table<Session>;
  onRevokeAllOther?: () => void;
}

export interface SessionDetailsDialogProps {
  session: Session | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRevoke?: (session: Session) => void;
}

export interface RevokeSessionsDialogProps extends React.ComponentPropsWithoutRef<
  typeof AlertDialog
> {
  sessions: Session[];
  isRevokeAllOther?: boolean;
  onSuccess?: () => void;
  showTrigger?: boolean;
  onRevokeSessions?: (sessionIds: string[]) => void;
  onRevokeAllOtherSessions?: () => void;
}
