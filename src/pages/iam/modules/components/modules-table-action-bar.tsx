import * as React from "react";

import {
  Add01Icon,
  Cancel01Icon,
  CheckmarkCircle01Icon,
  Delete02Icon,
  Download01Icon,
  Folder01Icon,
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
  DropdownMenuSeparator as DropdownSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";
import { getModuleIcon } from "@/layout/module-icons";
import { getSelectedTableRows } from "@/lib/data-table";
import { exportTableToCSV } from "@/lib/export";
import type { IModule, IModulesTableActionBarProps } from "@/types/iam/modules";

import { MODULE_STATUSES } from "./modules-table-columns";

export function ModulesTableActionBar({
  table,
  groups = [],
  onBulkUpdateStatus,
  onBulkAssignGroup,
  onCreateGroupFromSelected,
  onBulkDelete,
}: IModulesTableActionBarProps) {
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

  const selectedIds = React.useMemo(
    () => rows.map((r) => r.original.id),
    [rows]
  );

  // Only root rows can be assigned to groups; child modules automatically inherit
  const selectedRootIds = React.useMemo(
    () => rows.filter((r) => r.depth === 0).map((r) => r.original.id),
    [rows]
  );

  const onStatusChange = React.useCallback(
    (status: IModule["status"]) => {
      onBulkUpdateStatus?.(selectedIds, status);
      toast.success(
        `Updated ${selectedIds.length} modules status to ${status}`
      );
    },
    [selectedIds, onBulkUpdateStatus]
  );

  const onAssignGroup = React.useCallback(
    (groupId: string | null, groupName?: string) => {
      if (selectedRootIds.length === 0) {
        toast.info(
          "Child modules inherit their parent's group. Select root modules to assign."
        );
        return;
      }
      onBulkAssignGroup?.(selectedRootIds, groupId);
      table.toggleAllRowsSelected(false);
      if (groupId) {
        toast.success(
          `Assigned ${selectedRootIds.length} module(s) to "${groupName || "group"}"`
        );
      } else {
        toast.success(
          `Unassigned ${selectedRootIds.length} module(s) from group`
        );
      }
    },
    [selectedRootIds, onBulkAssignGroup, table]
  );

  const handleCreateGroup = React.useCallback(() => {
    if (selectedRootIds.length === 0) {
      toast.info(
        "Child modules inherit their parent's group. Select root modules to create a group."
      );
      return;
    }
    onCreateGroupFromSelected?.(selectedRootIds);
  }, [selectedRootIds, onCreateGroupFromSelected]);

  const onExport = React.useCallback(() => {
    exportTableToCSV(table, {
      filename: "modules-export",
      excludeColumns: ["select", "actions"],
      onlySelected: true,
    });
    toast.success("Exported selected modules to CSV");
  }, [table]);

  const onDelete = React.useCallback(() => {
    onBulkDelete?.(selectedIds);
    table.toggleAllRowsSelected(false);
    toast.success(`Deleted ${selectedIds.length} modules`);
  }, [selectedIds, onBulkDelete, table]);

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
        {/* Create Group from Selected */}
        <ActionBarItem onClick={handleCreateGroup}>
          <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
          Create Group
        </ActionBarItem>

        {/* Assign to Existing Group */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <ActionBarItem>
              <HugeiconsIcon icon={Folder01Icon} strokeWidth={2} />
              Assign Group
            </ActionBarItem>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-48">
            <div className="text-muted-foreground px-2 py-1.5 text-[0.6875rem] font-semibold">
              Select Navigation Group
            </div>
            {groups.map((group) => (
              <DropdownMenuItem
                key={group.id}
                onClick={() => onAssignGroup(group.id, group.name)}
                className="gap-2"
              >
                {getModuleIcon(group.icon, 2, 14)}
                <span className="flex-1 truncate">{group.name}</span>
                <span className="text-muted-foreground text-[0.625rem] capitalize">
                  {group.type}
                </span>
              </DropdownMenuItem>
            ))}
            <DropdownSeparator />
            <DropdownMenuItem
              onClick={() => onAssignGroup(null)}
              className="text-muted-foreground"
            >
              Remove from Group (Unassign)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Status */}
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

        {/* Export */}
        <ActionBarItem onClick={onExport}>
          <HugeiconsIcon icon={Download01Icon} strokeWidth={2} />
          Export
        </ActionBarItem>

        {/* Delete */}
        <ActionBarItem variant="destructive" onClick={onDelete}>
          <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
          Delete
        </ActionBarItem>
      </ActionBarGroup>
    </ActionBar>
  );
}
