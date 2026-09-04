import * as React from "react";

import {
  Cancel01Icon,
  CheckmarkCircle01Icon,
  Delete02Icon,
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
import { toast } from "@/components/ui/toast";
import type { IUpdatesTableActionBarProps } from "@/types/updates";

export function UpdatesTableActionBar({
  table,
  onBulkMarkRead,
  onBulkDelete,
}: IUpdatesTableActionBarProps) {
  const { rows } = table.getFilteredSelectedRowModel();

  const onOpenChange = React.useCallback(
    (open: boolean) => {
      if (!open) {
        table.toggleAllRowsSelected(false);
      }
    },
    [table]
  );

  const onMarkRead = React.useCallback(() => {
    const ids = rows.map((r) => r.original.id);
    onBulkMarkRead?.(ids);
    table.toggleAllRowsSelected(false);
    toast.success(`Marked ${ids.length} updates as read`);
  }, [rows, onBulkMarkRead, table]);

  const onDelete = React.useCallback(() => {
    const ids = rows.map((r) => r.original.id);
    onBulkDelete?.(ids);
    table.toggleAllRowsSelected(false);
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
        <ActionBarItem onClick={onMarkRead}>
          <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} />
          Mark as Read
        </ActionBarItem>

        <ActionBarItem variant="destructive" onClick={onDelete}>
          <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
          Delete
        </ActionBarItem>
      </ActionBarGroup>
    </ActionBar>
  );
}
