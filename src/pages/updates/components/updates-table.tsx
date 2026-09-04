import * as React from "react";

import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { Button } from "@/components/ui/button";
import { useDataTable } from "@/hooks/use-data-table";
import type {
  IUpdatesTableProps,
  UpdateChannel,
  UpdateImpact,
  UpdateStatus,
  UpdateType,
} from "@/types/updates";

import { UpdatesTableActionBar } from "./updates-table-action-bar";
import { getUpdatesTableColumns } from "./updates-table-columns";

export function UpdatesTable({
  updates,
  onViewDetails,
  onToggleRead,
  onDeleteUpdates,
  onNewUpdateClick,
  queryKeys,
}: IUpdatesTableProps) {
  const typeCounts = React.useMemo(
    () =>
      updates.reduce(
        (acc, item) => {
          acc[item.type] = (acc[item.type] || 0) + 1;
          return acc;
        },
        {
          major: 0,
          minor: 0,
          patch: 0,
          security: 0,
          hotfix: 0,
          maintenance: 0,
        } as Record<UpdateType, number>
      ),
    [updates]
  );

  const channelCounts = React.useMemo(
    () =>
      updates.reduce(
        (acc, item) => {
          acc[item.channel] = (acc[item.channel] || 0) + 1;
          return acc;
        },
        {
          stable: 0,
          beta: 0,
          security: 0,
          lts: 0,
        } as Record<UpdateChannel, number>
      ),
    [updates]
  );

  const statusCounts = React.useMemo(
    () =>
      updates.reduce(
        (acc, item) => {
          acc[item.status] = (acc[item.status] || 0) + 1;
          return acc;
        },
        {
          deployed: 0,
          rolling_out: 0,
          scheduled: 0,
          draft: 0,
        } as Record<UpdateStatus, number>
      ),
    [updates]
  );

  const impactCounts = React.useMemo(
    () =>
      updates.reduce(
        (acc, item) => {
          acc[item.impact] = (acc[item.impact] || 0) + 1;
          return acc;
        },
        {
          critical: 0,
          high: 0,
          medium: 0,
          low: 0,
        } as Record<UpdateImpact, number>
      ),
    [updates]
  );

  const columns = React.useMemo(
    () =>
      getUpdatesTableColumns({
        typeCounts,
        channelCounts,
        statusCounts,
        impactCounts,
        onViewDetails,
        onToggleRead,
        onDeleteUpdate: (id) => onDeleteUpdates([id]),
      }),
    [
      typeCounts,
      channelCounts,
      statusCounts,
      impactCounts,
      onViewDetails,
      onToggleRead,
      onDeleteUpdates,
    ]
  );

  const { table } = useDataTable({
    data: updates,
    columns,
    pageCount: 1,
    initialState: {
      sorting: [{ id: "publishedAt", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    queryKeys,
    getRowId: (originalRow) => originalRow.id,
    shallow: false,
    clearOnDefault: true,
  });

  return (
    <div className="flex flex-col gap-3">
      <DataTable
        table={table}
        actionBar={
          <UpdatesTableActionBar
            table={table}
            onBulkMarkRead={(ids) => {
              if (onToggleRead) {
                ids.forEach((id) => onToggleRead(id));
              }
            }}
            onBulkDelete={onDeleteUpdates}
          />
        }
        emptyStateTitle="No system release notes found"
        emptyStateDescription="Publish a new release announcement or adjust your active filters."
        emptyStateActions={
          <Button
            onClick={onNewUpdateClick}
            size="sm"
            className="gap-1.5 text-xs"
          >
            <HugeiconsIcon
              icon={Add01Icon}
              strokeWidth={2}
              className="size-3.5"
            />
            Broadcast Release
          </Button>
        }
      >
        <DataTableToolbar table={table}>
          <Button
            size="sm"
            onClick={onNewUpdateClick}
            className="h-8 gap-1.5 text-xs"
          >
            <HugeiconsIcon
              icon={Add01Icon}
              strokeWidth={2}
              className="size-3.5"
            />
            Publish Update
          </Button>
        </DataTableToolbar>
      </DataTable>
    </div>
  );
}
