import type * as React from "react";

import type { Table } from "@tanstack/react-table";

import type { AlertDialog } from "@/components/ui/alert-dialog";
import type { IDataTableRowAction, IQueryKeys } from "@/types/data-table";

export interface IUser {
  id: string;
  code: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "member" | "viewer";
  status: "active" | "inactive" | "pending" | "suspended";
  department: "engineering" | "design" | "marketing" | "sales" | "support";
  loginCount: number;
  createdAt: Date;
}
export type User = IUser;

export interface IGetUsersTableColumnsProps {
  statusCounts: Record<IUser["status"], number>;
  roleCounts: Record<IUser["role"], number>;
  departmentCounts: Record<IUser["department"], number>;
  loginCountRange: { min: number; max: number };
  setRowAction: React.Dispatch<
    React.SetStateAction<IDataTableRowAction<IUser> | null>
  >;
  onUpdateUserRole?: (userId: string, role: IUser["role"]) => void;
}
export type GetUsersTableColumnsProps = IGetUsersTableColumnsProps;

export interface IUsersTableProps {
  queryKeys?: Partial<IQueryKeys>;
}
export type UsersTableProps = IUsersTableProps;

export interface IUsersTableActionBarProps {
  table: Table<IUser>;
  onBulkUpdateStatus?: (userIds: string[], status: IUser["status"]) => void;
  onBulkUpdateRole?: (userIds: string[], role: IUser["role"]) => void;
  onBulkDelete?: (userIds: string[]) => void;
}
export type UsersTableActionBarProps = IUsersTableActionBarProps;

export interface IUsersTableToolbarActionsProps {
  table: Table<IUser>;
}
export type UsersTableToolbarActionsProps = IUsersTableToolbarActionsProps;

export interface IUserFormProps {
  initialValues?: Partial<IUser>;
  onSubmit: (
    values: Omit<IUser, "id" | "code" | "createdAt" | "loginCount">
  ) => void;
  onCancel?: () => void;
  submitText?: string;
}
export type UserFormProps = IUserFormProps;

export interface IDeleteUsersDialogProps extends React.ComponentPropsWithoutRef<
  typeof AlertDialog
> {
  users: IUser[];
  onSuccess?: () => void;
  showTrigger?: boolean;
  onDeleteUsers?: (userIds: string[]) => void;
}
export type DeleteUsersDialogProps = IDeleteUsersDialogProps;
