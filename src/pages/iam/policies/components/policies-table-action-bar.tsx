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
import type {
  IPoliciesTableActionBarProps,
  IPolicy,
} from "@/types/iam/policies";

import { POLICY_EFFECTS, POLICY_STATUSES } from "./policies-table-columns";

export function PoliciesTableActionBar({
  table,
  onBulkUpdateEffect,
  onBulkUpdateStatus,
  onBulkDelete,
}: IPoliciesTableActionBarProps) {
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

  const onEffectChange = React.useCallback(
    (effect: IPolicy["effect"]) => {
      const ids = rows.map((r) => r.original.id);
      onBulkUpdateEffect?.(ids, effect);
      toast.success(`Updated ${ids.length} policies effect to ${effect}`);
    },
    [rows, onBulkUpdateEffect]
  );

  const onStatusChange = React.useCallback(
    (status: IPolicy["status"]) => {
      const ids = rows.map((r) => r.original.id);
      onBulkUpdateStatus?.(ids, status);
      toast.success(`Updated ${ids.length} policies status to ${status}`);
    },
    [rows, onBulkUpdateStatus]
  );

  const onExport = React.useCallback(() => {
    exportTableToCSV(table, {
      filename: "policies-export",
      excludeColumns: ["select", "actions"],
      onlySelected: true,
    });
    toast.success("Exported selected policies to CSV");
  }, [table]);

  const onDelete = React.useCallback(() => {
    const ids = rows.map((r) => r.original.id);
    onBulkDelete?.(ids);
    table.toggleAllRowsSelected(false);
    toast.success(`Deleted ${ids.length} policies`);
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
              <HugeiconsIcon icon={Shield01Icon} strokeWidth={2} />
              Effect
            </ActionBarItem>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {POLICY_EFFECTS.map((effect) => (
              <DropdownMenuItem
                key={effect}
                onClick={() => onEffectChange(effect)}
              >
                {effect}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <ActionBarItem>
              <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} />
              Status
            </ActionBarItem>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {POLICY_STATUSES.map((status) => (
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
