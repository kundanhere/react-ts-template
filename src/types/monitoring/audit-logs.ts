import type * as React from "react";

import type { Table } from "@tanstack/react-table";

import type { AlertDialog } from "@/components/ui/alert-dialog";
import type { DataTableRowAction, QueryKeys } from "@/types/data-table";

export interface AuditLog {
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

export interface GetAuditLogsTableColumnsProps {
  statusCounts: Record<AuditLog["status"], number>;
  severityCounts: Record<AuditLog["severity"], number>;
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<AuditLog> | null>
  >;
  onViewDetails?: (log: AuditLog) => void;
}

export interface AuditLogsTableProps {
  queryKeys?: Partial<QueryKeys>;
}

export interface AuditLogsTableActionBarProps {
  table: Table<AuditLog>;
  onBulkDelete?: (logIds: string[]) => void;
}

export interface AuditLogsTableToolbarActionsProps {
  table: Table<AuditLog>;
  onRefresh?: () => void;
}

export interface AuditLogDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  log: AuditLog | null;
}

export interface DeleteAuditLogsDialogProps extends React.ComponentPropsWithoutRef<
  typeof AlertDialog
> {
  logs: AuditLog[];
  onSuccess?: () => void;
  showTrigger?: boolean;
  onDeleteLogs?: (logIds: string[]) => void;
}
