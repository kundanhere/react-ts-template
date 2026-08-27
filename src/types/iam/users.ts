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

export interface IUsersTableProps {
  queryKeys?: Partial<IQueryKeys>;
}

export interface IUsersTableActionBarProps {
  table: Table<IUser>;
  onBulkUpdateStatus?: (userIds: string[], status: IUser["status"]) => void;
  onBulkUpdateRole?: (userIds: string[], role: IUser["role"]) => void;
  onBulkDelete?: (userIds: string[]) => void;
}

export interface IUsersTableToolbarActionsProps {
  table: Table<IUser>;
}

export interface IUserFormProps {
  initialValues?: Partial<IUser>;
  onSubmit: (
    values: Omit<IUser, "id" | "code" | "createdAt" | "loginCount">
  ) => void;
  onCancel?: () => void;
  submitText?: string;
}

export interface IDeleteUsersDialogProps extends React.ComponentPropsWithoutRef<
  typeof AlertDialog
> {
  users: IUser[];
  onSuccess?: () => void;
  showTrigger?: boolean;
  onDeleteUsers?: (userIds: string[]) => void;
}
