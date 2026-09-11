import type * as React from "react";

import type { Table } from "@tanstack/react-table";

import type { AlertDialog } from "@/components/ui/alert-dialog";
import type { IDataTableRowAction, IQueryKeys } from "@/types/data-table";

export type NavigationGroupType = "main" | "primary" | "secondary";

export interface INavigationGroup {
  id: string;
  name: string;
  slug: string;
  type: NavigationGroupType;
  priority: number;
  icon?: string;
  description?: string;
  moduleIds: string[];
}

export interface IModule {
  id: string;
  code: string;
  name: string;
  route: string;
  icon?: string;
  priority: number;
  status: "active" | "inactive" | "maintenance" | "beta";
  isSystem: boolean;
  description: string;
  createdAt: Date;
  groupId?: string | null;
  badge?: string | number;
  children?: IModule[];
}

export interface IUserModuleItem {
  ID: number;
  name: string;
  slug: string;
  description: string | null;
  path: string | null;
  icon: string | null;
  is_active: number;
  is_system_module: number;
  parent_id: number | null;
  group_id: number | null;
  priority: number;
  badge?: string | number;
  children?: IUserModuleItem[];
}

export interface IUserModuleGroup {
  ID: string;
  group_id: number;
  is_group: boolean;
  name: string;
  slug: string;
  description: string | null;
  priority: number | null;
  modules: IUserModuleItem[];
}

export interface IMyModulesResponse {
  status: number;
  messageCode: string;
  message: string;
  payload: IUserModuleGroup[];
}

export interface IGetModulesTableColumnsProps {
  statusCounts: Record<IModule["status"], number>;
  priorityRange: { min: number; max: number };
  groups: INavigationGroup[];
  setRowAction: React.Dispatch<
    React.SetStateAction<IDataTableRowAction<IModule> | null>
  >;
  onEditModule?: (module: IModule) => void;
  onAssignGroup?: (moduleId: string, groupId: string | null) => void;
  onUpdateStatus?: (moduleId: string, status: IModule["status"]) => void;
  onToggleSystem?: (moduleId: string) => void;
}

export interface IModulesTableProps {
  queryKeys?: Partial<IQueryKeys>;
}

export interface IModulesTableActionBarProps {
  table: Table<IModule>;
  groups: INavigationGroup[];
  onBulkUpdateStatus?: (moduleIds: string[], status: IModule["status"]) => void;
  onBulkAssignGroup?: (moduleIds: string[], groupId: string | null) => void;
  onCreateGroupFromSelected?: (moduleIds: string[]) => void;
  onBulkDelete?: (moduleIds: string[]) => void;
}

export interface IModulesTableToolbarActionsProps {
  table: Table<IModule>;
}

export interface IModuleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Partial<IModule> | null;
  isChildModule?: boolean;
  parentModuleName?: string | null;
  groups: INavigationGroup[];
  onSubmit: (values: Partial<IModule>) => void;
}

export interface IGroupFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Partial<INavigationGroup> | null;
  availableModules: IModule[];
  groups?: INavigationGroup[];
  onSubmit: (group: Omit<INavigationGroup, "id"> & { id?: string }) => void;
}

export interface IDeleteModulesDialogProps extends React.ComponentPropsWithoutRef<
  typeof AlertDialog
> {
  modules: IModule[];
  onSuccess?: () => void;
  showTrigger?: boolean;
  onDeleteModules?: (moduleIds: string[]) => void;
}
