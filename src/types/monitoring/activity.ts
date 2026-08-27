import type * as React from "react";

import type { Table } from "@tanstack/react-table";

import type { AlertDialog } from "@/components/ui/alert-dialog";
import type { IDataTableRowAction, IQueryKeys } from "@/types/data-table";

export interface IActivityItem {
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

export interface IGetActivityTableColumnsProps {
  statusCounts: Record<IActivityItem["status"], number>;
  severityCounts: Record<IActivityItem["severity"], number>;
  setRowAction: React.Dispatch<
    React.SetStateAction<IDataTableRowAction<IActivityItem> | null>
  >;
  onViewDetails?: (item: IActivityItem) => void;
}

export interface IActivityTableProps {
  queryKeys?: Partial<IQueryKeys>;
}

export interface IActivityTableActionBarProps {
  table: Table<IActivityItem>;
  onBulkDelete?: (itemIds: string[]) => void;
}

export interface IActivityTableToolbarActionsProps {
  table: Table<IActivityItem>;
  onRefresh?: () => void;
}

export interface IActivityDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: IActivityItem | null;
}

export interface IDeleteActivityDialogProps extends React.ComponentPropsWithoutRef<
  typeof AlertDialog
> {
  items: IActivityItem[];
  onSuccess?: () => void;
  showTrigger?: boolean;
  onDeleteItems?: (itemIds: string[]) => void;
}
