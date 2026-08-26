import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import type { DataTableRowAction, QueryKeys } from "@/types/data-table";

import { ActivityDetailsDialog } from "./activity-details-dialog";
import { ActivityTableActionBar } from "./activity-table-action-bar";
import {
  type ActivityItem,
  getActivityTableColumns,
} from "./activity-table-columns";
import { ActivityTableToolbarActions } from "./activity-table-toolbar-actions";
import { DeleteActivityDialog } from "./delete-activity-dialog";

const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: "act-101",
    code: "ACT-101",
    timestamp: new Date("2026-08-26T10:24:00"),
    actor: "Kundan Gupta (You)",
    action: "iam:UpdateUserRole",
    resource: "User #42 (Jane Doe)",
    status: "SUCCESS",
    severity: "info",
    ipAddress: "192.168.1.45",
  },
  {
    id: "act-102",
    code: "ACT-102",
    timestamp: new Date("2026-08-25T16:15:00"),
    actor: "Kundan Gupta (You)",
    action: "iam:CreatePolicy",
    resource: "Policy #pol-104",
    status: "SUCCESS",
    severity: "info",
    ipAddress: "192.168.1.45",
  },
  {
    id: "act-103",
    code: "ACT-103",
    timestamp: new Date("2026-08-25T11:42:30"),
    actor: "Kundan Gupta (You)",
    action: "iam:Authenticate",
    resource: "Admin CMS Login",
    status: "SUCCESS",
    severity: "info",
    ipAddress: "192.168.1.45",
  },
  {
    id: "act-104",
    code: "ACT-104",
    timestamp: new Date("2026-08-24T19:30:15"),
    actor: "Kundan Gupta (You)",
    action: "security:UpdateFirewall",
    resource: "Ingress Rule #443",
    status: "WARNING",
    severity: "warning",
    ipAddress: "192.168.1.45",
  },
  {
    id: "act-105",
    code: "ACT-105",
    timestamp: new Date("2026-08-24T14:10:00"),
    actor: "Kundan Gupta (You)",
    action: "iam:DeletePolicy",
    resource: "Policy #pol-99",
    status: "SUCCESS",
    severity: "info",
    ipAddress: "192.168.1.45",
  },
  {
    id: "act-106",
    code: "ACT-106",
    timestamp: new Date("2026-08-23T20:05:40"),
    actor: "Kundan Gupta (You)",
    action: "iam:RevokeSession",
    resource: "Session #sess-902",
    status: "SUCCESS",
    severity: "info",
    ipAddress: "192.168.1.45",
  },
  {
    id: "act-107",
    code: "ACT-107",
    timestamp: new Date("2026-08-23T15:20:10"),
    actor: "Kundan Gupta (You)",
    action: "analytics:ExportMetrics",
    resource: "Usage Metrics 2026",
    status: "SUCCESS",
    severity: "info",
    ipAddress: "192.168.1.45",
  },
  {
    id: "act-108",
    code: "ACT-108",
    timestamp: new Date("2026-08-22T18:45:00"),
    actor: "Kundan Gupta (You)",
    action: "iam:AdminEscalation",
    resource: "Super Admin Role",
    status: "DENIED",
    severity: "error",
    ipAddress: "192.168.1.45",
  },
  {
    id: "act-109",
    code: "ACT-109",
    timestamp: new Date("2026-08-22T09:12:00"),
    actor: "Kundan Gupta (You)",
    action: "security:RotateKeys",
    resource: "KMS Key #k-882",
    status: "SUCCESS",
    severity: "info",
    ipAddress: "192.168.1.45",
  },
];

interface ActivityTableProps {
  queryKeys?: Partial<QueryKeys>;
}

export function ActivityTable({ queryKeys }: ActivityTableProps) {
  const [activities, setActivities] =
    React.useState<ActivityItem[]>(INITIAL_ACTIVITIES);
  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<ActivityItem> | null>(null);
  const [selectedItemForDetails, setSelectedItemForDetails] =
    React.useState<ActivityItem | null>(null);

  const statusCounts = React.useMemo(
    () =>
      activities.reduce(
        (acc, item) => {
          acc[item.status] = (acc[item.status] || 0) + 1;
          return acc;
        },
        { SUCCESS: 0, DENIED: 0, WARNING: 0 } as Record<
          ActivityItem["status"],
          number
        >
      ),
    [activities]
  );

  const severityCounts = React.useMemo(
    () =>
      activities.reduce(
        (acc, item) => {
          acc[item.severity] = (acc[item.severity] || 0) + 1;
          return acc;
        },
        { info: 0, warning: 0, error: 0 } as Record<
          ActivityItem["severity"],
          number
        >
      ),
    [activities]
  );

  const handleBulkDelete = React.useCallback((itemIds: string[]) => {
    setActivities((prev) => prev.filter((i) => !itemIds.includes(i.id)));
  }, []);

  const handleViewDetails = React.useCallback((item: ActivityItem) => {
    setSelectedItemForDetails(item);
  }, []);

  const columns = React.useMemo(
    () =>
      getActivityTableColumns({
        statusCounts,
        severityCounts,
        setRowAction,
        onViewDetails: handleViewDetails,
      }),
    [statusCounts, severityCounts, handleViewDetails]
  );

  const { table } = useDataTable({
    data: activities,
    columns,
    pageCount: 1,
    enableAdvancedFilter: false,
    initialState: {
      sorting: [{ id: "timestamp", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    queryKeys,
    getRowId: (originalRow) => originalRow.id,
    shallow: false,
    clearOnDefault: true,
  });

  return (
    <>
      <DataTable
        table={table}
        actionBar={
          <ActivityTableActionBar
            table={table}
            onBulkDelete={handleBulkDelete}
          />
        }
      >
        <DataTableToolbar table={table}>
          <ActivityTableToolbarActions table={table} />
        </DataTableToolbar>
      </DataTable>

      <DeleteActivityDialog
        open={rowAction?.variant === "delete"}
        onOpenChange={() => setRowAction(null)}
        items={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
        onDeleteItems={handleBulkDelete}
      />

      <ActivityDetailsDialog
        open={!!selectedItemForDetails}
        onOpenChange={(open) => {
          if (!open) setSelectedItemForDetails(null);
        }}
        item={selectedItemForDetails}
      />
    </>
  );
}
