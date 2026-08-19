import * as React from "react";

import {
  Cancel01Icon,
  CheckmarkCircle01Icon,
  Delete02Icon,
  Download01Icon,
  Layers01Icon,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";
import { exportTableToCSV } from "@/lib/export";

import {
  MODULE_CATEGORIES,
  MODULE_STATUSES,
  type Module,
} from "./modules-table-columns";

interface ModulesTableActionBarProps {
  table: Table<Module>;
  onBulkUpdateStatus?: (moduleIds: string[], status: Module["status"]) => void;
  onBulkUpdateCategory?: (
    moduleIds: string[],
    category: Module["category"]
  ) => void;
  onBulkDelete?: (moduleIds: string[]) => void;
}

export function ModulesTableActionBar({
  table,
  onBulkUpdateStatus,
  onBulkUpdateCategory,
  onBulkDelete,
}: ModulesTableActionBarProps) {
  const { rows } = table.getFilteredSelectedRowModel();

  const onOpenChange = React.useCallback(
    (open: boolean) => {
      if (!open) {
        table.toggleAllRowsSelected(false);
      }
    },
    [table]
  );

  const onStatusChange = React.useCallback(
    (status: Module["status"]) => {
      const ids = rows.map((r) => r.original.id);
      onBulkUpdateStatus?.(ids, status);
      toast.success(`Updated ${ids.length} modules status to ${status}`);
    },
    [rows, onBulkUpdateStatus]
  );

  const onCategoryChange = React.useCallback(
    (category: Module["category"]) => {
      const ids = rows.map((r) => r.original.id);
      onBulkUpdateCategory?.(ids, category);
      toast.success(`Updated ${ids.length} modules category to ${category}`);
    },
    [rows, onBulkUpdateCategory]
  );

  const onExport = React.useCallback(() => {
    exportTableToCSV(table, {
      filename: "modules-export",
      excludeColumns: ["select", "actions"],
      onlySelected: true,
    });
    toast.success("Exported selected modules to CSV");
  }, [table]);

  const onDelete = React.useCallback(() => {
    const ids = rows.map((r) => r.original.id);
    onBulkDelete?.(ids);
    table.toggleAllRowsSelected(false);
    toast.success(`Deleted ${ids.length} modules`);
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
            {MODULE_STATUSES.map((status) => (
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
              <HugeiconsIcon icon={Layers01Icon} strokeWidth={2} />
              Category
            </ActionBarItem>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {MODULE_CATEGORIES.map((cat) => (
              <DropdownMenuItem
                key={cat}
                className="capitalize"
                onClick={() => onCategoryChange(cat)}
              >
                {cat}
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
