import * as React from "react";

import {
  Cancel01Icon,
  CheckmarkCircle01Icon,
  Delete02Icon,
  Download01Icon,
  Flag01Icon,
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
  FeedbackPriority,
  FeedbackStatus,
  IFeedbackTableActionBarProps,
} from "@/types/feedback";

import {
  FEEDBACK_PRIORITIES,
  FEEDBACK_STATUSES,
} from "./feedback-table-columns";

export function FeedbackTableActionBar({
  table,
  onBulkUpdateStatus,
  onBulkUpdatePriority,
  onBulkDelete,
}: IFeedbackTableActionBarProps) {
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
    (status: FeedbackStatus) => {
      const ids = rows.map((r) => r.original.id);
      onBulkUpdateStatus?.(ids, status);
      table.toggleAllRowsSelected(false);
      toast.success(
        `Updated ${ids.length} items to "${status.replace("_", " ")}"`
      );
    },
    [rows, onBulkUpdateStatus, table]
  );

  const onPriorityChange = React.useCallback(
    (priority: FeedbackPriority) => {
      const ids = rows.map((r) => r.original.id);
      onBulkUpdatePriority?.(ids, priority);
      table.toggleAllRowsSelected(false);
      toast.success(`Updated ${ids.length} items to "${priority}" priority`);
    },
    [rows, onBulkUpdatePriority, table]
  );

  const onExport = React.useCallback(() => {
    exportTableToCSV(table, {
      filename: "feedback-export",
      excludeColumns: ["select", "actions"],
      onlySelected: true,
    });
    toast.success("Exported selected feedback records to CSV");
  }, [table]);

  const onDelete = React.useCallback(() => {
    const ids = rows.map((r) => r.original.id);
    onBulkDelete?.(ids);
    table.toggleAllRowsSelected(false);
    toast.success(`Deleted ${ids.length} items`);
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
              Set Status
            </ActionBarItem>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {FEEDBACK_STATUSES.map((status) => (
              <DropdownMenuItem
                key={status}
                className="capitalize"
                onClick={() => onStatusChange(status)}
              >
                {status.replace("_", " ")}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <ActionBarItem>
              <HugeiconsIcon icon={Flag01Icon} strokeWidth={2} />
              Set Priority
            </ActionBarItem>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {FEEDBACK_PRIORITIES.map((pri) => (
              <DropdownMenuItem
                key={pri}
                className="capitalize"
                onClick={() => onPriorityChange(pri)}
              >
                {pri}
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
