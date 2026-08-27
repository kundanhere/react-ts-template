import type * as React from "react";

import type { Table } from "@tanstack/react-table";

import type { IQueryKeys } from "@/types/data-table";

export interface IRoleItem {
  id: string;
  name: string;
  icon?: React.ReactNode;
  description: string;
  userCount: number;
  isSystem: boolean;
}

export interface IGetRolesTableColumnsProps {
  onEditRole?: (role: IRoleItem) => void;
  onDuplicateRole?: (role: IRoleItem) => void;
  onDeleteRole?: (role: IRoleItem) => void;
}

export interface IRolesTableProps {
  queryKeys?: Partial<IQueryKeys>;
  onNewRoleClick?: () => void;
}

export interface IRolesTableActionBarProps {
  table: Table<IRoleItem>;
  onBulkDelete?: (roleIds: string[]) => void;
}

export interface IRolesTableToolbarActionsProps {
  table: Table<IRoleItem>;
  onNewRoleClick?: () => void;
}
