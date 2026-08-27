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
export type RoleItem = IRoleItem;

export interface IGetRolesTableColumnsProps {
  onEditRole?: (role: IRoleItem) => void;
  onDuplicateRole?: (role: IRoleItem) => void;
  onDeleteRole?: (role: IRoleItem) => void;
}
export type GetRolesTableColumnsProps = IGetRolesTableColumnsProps;

export interface IRolesTableProps {
  queryKeys?: Partial<IQueryKeys>;
  onNewRoleClick?: () => void;
}
export type RolesTableProps = IRolesTableProps;

export interface IRolesTableActionBarProps {
  table: Table<IRoleItem>;
  onBulkDelete?: (roleIds: string[]) => void;
}
export type RolesTableActionBarProps = IRolesTableActionBarProps;

export interface IRolesTableToolbarActionsProps {
  table: Table<IRoleItem>;
  onNewRoleClick?: () => void;
}
export type RolesTableToolbarActionsProps = IRolesTableToolbarActionsProps;
