import type * as React from "react";

import type { Table } from "@tanstack/react-table";

import type { AlertDialog } from "@/components/ui/alert-dialog";
import type { DataTableRowAction, QueryKeys } from "@/types/data-table";

export interface Module {
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
  children?: Module[];
}

export interface GetModulesTableColumnsProps {
  statusCounts: Record<Module["status"], number>;
  categoryCounts: Record<Module["category"], number>;
  priorityRange: { min: number; max: number };
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<Module> | null>
  >;
  onEditModule?: (module: Module) => void;
  onUpdateStatus?: (moduleId: string, status: Module["status"]) => void;
  onToggleSystem?: (moduleId: string) => void;
}

export interface ModulesTableProps {
  queryKeys?: Partial<QueryKeys>;
}

export interface ModulesTableActionBarProps {
  table: Table<Module>;
  onBulkUpdateStatus?: (moduleIds: string[], status: Module["status"]) => void;
  onBulkUpdateCategory?: (
    moduleIds: string[],
    category: Module["category"]
  ) => void;
  onBulkDelete?: (moduleIds: string[]) => void;
}

export interface ModulesTableToolbarActionsProps {
  table: Table<Module>;
  onAddModule?: () => void;
}

export interface ModuleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Partial<Module> | null;
  onSubmit: (values: Omit<Module, "id" | "code" | "createdAt">) => void;
}

export interface DeleteModulesDialogProps extends React.ComponentPropsWithoutRef<
  typeof AlertDialog
> {
  modules: Module[];
  onSuccess?: () => void;
  showTrigger?: boolean;
  onDeleteModules?: (moduleIds: string[]) => void;
}
