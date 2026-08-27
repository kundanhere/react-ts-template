import * as React from "react";

import {
  Cancel01Icon,
  CheckmarkCircle01Icon,
  Delete02Icon,
  Download01Icon,
  Shield01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  ActionBar,
  ActionBarClose,
  ActionBarGroup,
  ActionBarItem,
  ActionBarSelection,
  ActionBarSeparator,
} from "@/components/ui/action-bar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";
import { getSelectedTableRows } from "@/lib/data-table";
import { exportTableToCSV } from "@/lib/export";
import type { IUser, IUsersTableActionBarProps } from "@/types/iam/users";

import { USER_ROLES, USER_STATUSES } from "./users-table-columns";

export function UsersTableActionBar({
  table,
  onBulkUpdateStatus,
  onBulkUpdateRole,
  onBulkDelete,
}: IUsersTableActionBarProps) {
  const { rowSelection } = table.getState();
  const rows = React.useMemo(() => {
    if (!rowSelection) return [];
    return getSelectedTableRows(table);
  }, [table, rowSelection]);

  const onOpenChange = React.useCallback(
    (open: boolean) => {
      if (!open) {
        table.toggleAllRowsSelected(false);
      }
    },
    [table]
  );

  const onStatusChange = React.useCallback(
    (status: IUser["status"]) => {
      const ids = rows.map((r) => r.original.id);
      onBulkUpdateStatus?.(ids, status);
      toast.success(`Updated ${ids.length} users status to ${status}`);
    },
    [rows, onBulkUpdateStatus]
  );

  const onRoleChange = React.useCallback(
    (role: IUser["role"]) => {
      const ids = rows.map((r) => r.original.id);
      onBulkUpdateRole?.(ids, role);
      toast.success(`Updated ${ids.length} users role to ${role}`);
    },
    [rows, onBulkUpdateRole]
  );

  const onExport = React.useCallback(() => {
    exportTableToCSV(table, {
      filename: "users-export",
      excludeColumns: ["select", "actions"],
      onlySelected: true,
    });
    toast.success("Exported selected users to CSV");
  }, [table]);

  const onDelete = React.useCallback(() => {
    const ids = rows.map((r) => r.original.id);
    onBulkDelete?.(ids);
    table.toggleAllRowsSelected(false);
    toast.success(`Deleted ${ids.length} users`);
  }, [rows, onBulkDelete, table]);

  return (
    <ActionBar open={rows.length > 0} onOpenChange={onOpenChange}>
      <ActionBarSelection>
        <span className="font-medium">{rows.length}</span>
        <span>selected</span>
        <ActionBarSeparator />
        <ActionBarClose>
          <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
        </ActionBarClose>
      </ActionBarSelection>
      <ActionBarSeparator />
      <ActionBarGroup>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <ActionBarItem>
              <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} />
              Status
            </ActionBarItem>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {USER_STATUSES.map((status) => (
              <DropdownMenuItem
                key={status}
                className="capitalize"
                onClick={() => onStatusChange(status)}
              >
                {status}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <ActionBarItem>
              <HugeiconsIcon icon={Shield01Icon} strokeWidth={2} />
              Role
            </ActionBarItem>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {USER_ROLES.map((role) => (
              <DropdownMenuItem
                key={role}
                className="capitalize"
                onClick={() => onRoleChange(role)}
              >
                {role}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <ActionBarItem onClick={onExport}>
          <HugeiconsIcon icon={Download01Icon} strokeWidth={2} />
          Export
        </ActionBarItem>
        <ActionBarItem variant="destructive" onClick={onDelete}>
          <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
          Delete
        </ActionBarItem>
      </ActionBarGroup>
    </ActionBar>
  );
}
