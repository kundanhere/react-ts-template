import type * as React from "react";

import type { Table } from "@tanstack/react-table";

import type { AlertDialog } from "@/components/ui/alert-dialog";
import type { IDataTableRowAction, IQueryKeys } from "@/types/data-table";

export interface IAuditLog {
  id: string;
  code: string;
  timestamp: Date;
  actor: string;
  action: string;
  resource: string;
  status: "SUCCESS" | "DENIED" | "WARNING";
  severity: "info" | "warning" | "error";
  ipAddress: string;
}
export type AuditLog = IAuditLog;

export interface IGetAuditLogsTableColumnsProps {
  statusCounts: Record<IAuditLog["status"], number>;
  severityCounts: Record<IAuditLog["severity"], number>;
  setRowAction: React.Dispatch<
    React.SetStateAction<IDataTableRowAction<IAuditLog> | null>
  >;
  onViewDetails?: (log: IAuditLog) => void;
}
export type GetAuditLogsTableColumnsProps = IGetAuditLogsTableColumnsProps;

export interface IAuditLogsTableProps {
  queryKeys?: Partial<IQueryKeys>;
}
export type AuditLogsTableProps = IAuditLogsTableProps;

export interface IAuditLogsTableActionBarProps {
  table: Table<IAuditLog>;
  onBulkDelete?: (logIds: string[]) => void;
}
export type AuditLogsTableActionBarProps = IAuditLogsTableActionBarProps;

export interface IAuditLogsTableToolbarActionsProps {
  table: Table<IAuditLog>;
  onRefresh?: () => void;
}
export type AuditLogsTableToolbarActionsProps =
  IAuditLogsTableToolbarActionsProps;

export interface IAuditLogDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  log: IAuditLog | null;
}
export type AuditLogDetailsDialogProps = IAuditLogDetailsDialogProps;

export interface IDeleteAuditLogsDialogProps extends React.ComponentPropsWithoutRef<
  typeof AlertDialog
> {
  logs: IAuditLog[];
  onSuccess?: () => void;
  showTrigger?: boolean;
  onDeleteLogs?: (logIds: string[]) => void;
}
export type DeleteAuditLogsDialogProps = IDeleteAuditLogsDialogProps;
