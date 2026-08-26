import * as React from "react";

import {
  Cancel01Icon,
  CancelCircleIcon,
  CheckmarkCircle01Icon,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";
import { getSelectedTableRows } from "@/lib/data-table";
import { exportTableToCSV } from "@/lib/export";

import { SESSION_STATUSES, type Session } from "./sessions-table-columns";

interface SessionsTableActionBarProps {
  table: Table<Session>;
  onBulkUpdateStatus?: (
    sessionIds: string[],
    status: Session["status"]
  ) => void;
  onBulkRevoke?: (sessionIds: string[]) => void;
}

export function SessionsTableActionBar({
  table,
  onBulkUpdateStatus,
  onBulkRevoke,
}: SessionsTableActionBarProps) {
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
    (status: Session["status"]) => {
      const ids = rows.map((r) => r.original.id);
      onBulkUpdateStatus?.(ids, status);
      toast.success(`Updated ${ids.length} sessions status to ${status}`);
    },
    [rows, onBulkUpdateStatus]
  );

  const onExport = React.useCallback(() => {
    exportTableToCSV(table, {
      filename: "selected-sessions-export",
      excludeColumns: ["select", "actions"],
      onlySelected: true,
    });
    toast.success("Exported selected sessions to CSV");
  }, [table]);

  const onRevoke = React.useCallback(() => {
    const ids = rows.map((r) => r.original.id);
    onBulkRevoke?.(ids);
    table.toggleAllRowsSelected(false);
  }, [rows, onBulkRevoke, table]);

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
              Change Status
            </ActionBarItem>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {SESSION_STATUSES.map((status) => (
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

        <ActionBarItem variant="destructive" onClick={onRevoke}>
          <HugeiconsIcon icon={CancelCircleIcon} strokeWidth={2} />
          Revoke
        </ActionBarItem>
      </ActionBarGroup>
    </ActionBar>
  );
}
