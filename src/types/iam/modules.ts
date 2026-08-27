import type * as React from "react";

import type { Table } from "@tanstack/react-table";

import type { AlertDialog } from "@/components/ui/alert-dialog";
import type { IDataTableRowAction, IQueryKeys } from "@/types/data-table";

export interface IModule {
  id: string;
  code: string;
  name: string;
  route: string;
  priority: number;
  category: "core" | "system" | "feature" | "integration" | "governance";
  status: "active" | "inactive" | "maintenance" | "beta";
  isSystem: boolean;
  description: string;
  createdAt: Date;
  children?: IModule[];
}

export interface IGetModulesTableColumnsProps {
  statusCounts: Record<IModule["status"], number>;
  categoryCounts: Record<IModule["category"], number>;
  priorityRange: { min: number; max: number };
  setRowAction: React.Dispatch<
    React.SetStateAction<IDataTableRowAction<IModule> | null>
  >;
  onEditModule?: (module: IModule) => void;
  onUpdateStatus?: (moduleId: string, status: IModule["status"]) => void;
  onToggleSystem?: (moduleId: string) => void;
}

export interface IModulesTableProps {
  queryKeys?: Partial<IQueryKeys>;
}

export interface IModulesTableActionBarProps {
  table: Table<IModule>;
  onBulkUpdateStatus?: (moduleIds: string[], status: IModule["status"]) => void;
  onBulkUpdateCategory?: (
    moduleIds: string[],
    category: IModule["category"]
  ) => void;
  onBulkDelete?: (moduleIds: string[]) => void;
}

export interface IModulesTableToolbarActionsProps {
  table: Table<IModule>;
  onAddModule?: () => void;
}

export interface IModuleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Partial<IModule> | null;
  onSubmit: (values: Omit<IModule, "id" | "code" | "createdAt">) => void;
}

export interface IDeleteModulesDialogProps extends React.ComponentPropsWithoutRef<
  typeof AlertDialog
> {
  modules: IModule[];
  onSuccess?: () => void;
  showTrigger?: boolean;
  onDeleteModules?: (moduleIds: string[]) => void;
}
