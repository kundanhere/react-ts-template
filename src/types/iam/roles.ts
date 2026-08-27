import type * as React from "react";

import type { Table } from "@tanstack/react-table";

import type { QueryKeys } from "@/types/data-table";

export interface RoleItem {
  id: string;
  name: string;
  icon?: React.ReactNode;
  description: string;
  userCount: number;
  isSystem: boolean;
}

export interface GetRolesTableColumnsProps {
  onEditRole?: (role: RoleItem) => void;
  onDuplicateRole?: (role: RoleItem) => void;
  onDeleteRole?: (role: RoleItem) => void;
}

export interface RolesTableProps {
  queryKeys?: Partial<QueryKeys>;
  onNewRoleClick?: () => void;
}

export interface RolesTableActionBarProps {
  table: Table<RoleItem>;
  onBulkDelete?: (roleIds: string[]) => void;
}

export interface RolesTableToolbarActionsProps {
  table: Table<RoleItem>;
  onNewRoleClick?: () => void;
}
