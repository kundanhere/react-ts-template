import type * as React from "react";

import type { Table } from "@tanstack/react-table";

import type { AlertDialog } from "@/components/ui/alert-dialog";
import type { IDataTableRowAction, IQueryKeys } from "@/types/data-table";

export interface ISession {
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
export type Session = ISession;

export interface IGetSessionsTableColumnsProps {
  statusCounts: Record<ISession["status"], number>;
  deviceTypeCounts: Record<ISession["deviceType"], number>;
  authMethodCounts: Record<ISession["authMethod"], number>;
  riskScoreCounts: Record<ISession["riskScore"], number>;
  setRowAction: React.Dispatch<
    React.SetStateAction<IDataTableRowAction<ISession> | null>
  >;
  onViewDetails?: (session: ISession) => void;
  onUpdateStatus?: (sessionId: string, status: ISession["status"]) => void;
}
export type GetSessionsTableColumnsProps = IGetSessionsTableColumnsProps;

export interface ISessionsTableProps {
  queryKeys?: Partial<IQueryKeys>;
}
export type SessionsTableProps = ISessionsTableProps;

export interface ISessionsTableActionBarProps {
  table: Table<ISession>;
  onBulkUpdateStatus?: (
    sessionIds: string[],
    status: ISession["status"]
  ) => void;
  onBulkRevoke?: (sessionIds: string[]) => void;
}
export type SessionsTableActionBarProps = ISessionsTableActionBarProps;

export interface ISessionsTableToolbarActionsProps {
  table: Table<ISession>;
  onRevokeAllOther?: () => void;
}
export type SessionsTableToolbarActionsProps =
  ISessionsTableToolbarActionsProps;

export interface ISessionDetailsDialogProps {
  session: ISession | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRevoke?: (session: ISession) => void;
}
export type SessionDetailsDialogProps = ISessionDetailsDialogProps;

export interface IRevokeSessionsDialogProps extends React.ComponentPropsWithoutRef<
  typeof AlertDialog
> {
  sessions: ISession[];
  isRevokeAllOther?: boolean;
  onSuccess?: () => void;
  showTrigger?: boolean;
  onRevokeSessions?: (sessionIds: string[]) => void;
  onRevokeAllOtherSessions?: () => void;
}
export type RevokeSessionsDialogProps = IRevokeSessionsDialogProps;
