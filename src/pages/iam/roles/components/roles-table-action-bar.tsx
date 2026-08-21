import * as React from "react";

import {
  Cancel01Icon,
  Delete02Icon,
  Download01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Table } from "@tanstack/react-table";

import {
  ActionBar,
  ActionBarClose,
  ActionBarGroup,
  ActionBarItem,
  ActionBarSelection,
  ActionBarSeparator,
} from "@/components/ui/action-bar";
import { toast } from "@/components/ui/toast";
import { getSelectedTableRows } from "@/lib/data-table";
import { exportTableToCSV } from "@/lib/export";

import type { RoleItem } from "./roles-table-columns";

interface RolesTableActionBarProps {
  table: Table<RoleItem>;
  onBulkDelete?: (roleIds: string[]) => void;
}

export function RolesTableActionBar({
  table,
  onBulkDelete,
}: RolesTableActionBarProps) {
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

  const onExport = React.useCallback(() => {
    exportTableToCSV(table, {
      filename: "roles-export",
      excludeColumns: ["select", "actions"],
      onlySelected: true,
    });
    toast.success("Exported selected roles to CSV");
  }, [table]);

  const onDelete = React.useCallback(() => {
    const ids = rows.map((r) => r.original.id);
    onBulkDelete?.(ids);
    table.toggleAllRowsSelected(false);
    toast.success(`Deleted ${ids.length} roles`);
  }, [rows, onBulkDelete, table]);

  const displayCount = React.useMemo(
    () =>
      rows.filter((r) => r.depth === 0 || !r.getParentRow()?.getIsSelected())
        .length,
    [rows]
  );

  return (
    <ActionBar open={displayCount > 0} onOpenChange={onOpenChange}>
      <ActionBarSelection>
        <span className="font-medium">{displayCount}</span>
        <span>selected</span>
        <ActionBarSeparator />
        <ActionBarClose>
          <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
        </ActionBarClose>
      </ActionBarSelection>
      <ActionBarSeparator />
      <ActionBarGroup>
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
