import type * as React from "react";

import type { Table } from "@tanstack/react-table";

import type { AlertDialog } from "@/components/ui/alert-dialog";
import type { DataTableRowAction, QueryKeys } from "@/types/data-table";

export interface ActivityItem {
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

export interface GetActivityTableColumnsProps {
  statusCounts: Record<ActivityItem["status"], number>;
  severityCounts: Record<ActivityItem["severity"], number>;
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<ActivityItem> | null>
  >;
  onViewDetails?: (item: ActivityItem) => void;
}

export interface ActivityTableProps {
  queryKeys?: Partial<QueryKeys>;
}

export interface ActivityTableActionBarProps {
  table: Table<ActivityItem>;
  onBulkDelete?: (itemIds: string[]) => void;
}

export interface ActivityTableToolbarActionsProps {
  table: Table<ActivityItem>;
  onRefresh?: () => void;
}

export interface ActivityDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ActivityItem | null;
}

export interface DeleteActivityDialogProps extends React.ComponentPropsWithoutRef<
  typeof AlertDialog
> {
  items: ActivityItem[];
  onSuccess?: () => void;
  showTrigger?: boolean;
  onDeleteItems?: (itemIds: string[]) => void;
}
