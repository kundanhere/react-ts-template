import type * as React from "react";

import type { Table } from "@tanstack/react-table";

import type { AlertDialog } from "@/components/ui/alert-dialog";
import type { DataTableRowAction, QueryKeys } from "@/types/data-table";

export interface User {
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

export interface GetUsersTableColumnsProps {
  statusCounts: Record<User["status"], number>;
  roleCounts: Record<User["role"], number>;
  departmentCounts: Record<User["department"], number>;
  loginCountRange: { min: number; max: number };
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<User> | null>
  >;
  onUpdateUserRole?: (userId: string, role: User["role"]) => void;
}

export interface UsersTableProps {
  queryKeys?: Partial<QueryKeys>;
}

export interface UsersTableActionBarProps {
  table: Table<User>;
  onBulkUpdateStatus?: (userIds: string[], status: User["status"]) => void;
  onBulkUpdateRole?: (userIds: string[], role: User["role"]) => void;
  onBulkDelete?: (userIds: string[]) => void;
}

export interface UsersTableToolbarActionsProps {
  table: Table<User>;
}

export interface UserFormProps {
  initialValues?: Partial<User>;
  onSubmit: (
    values: Omit<User, "id" | "code" | "createdAt" | "loginCount">
  ) => void;
  onCancel?: () => void;
  submitText?: string;
}

export interface DeleteUsersDialogProps extends React.ComponentPropsWithoutRef<
  typeof AlertDialog
> {
  users: User[];
  onSuccess?: () => void;
  showTrigger?: boolean;
  onDeleteUsers?: (userIds: string[]) => void;
}
