import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useDataTable } from "@/hooks/use-data-table";
import type { IDataTableRowAction } from "@/types/data-table";
import type {
  IAuditLog,
  IAuditLogsTableProps,
} from "@/types/monitoring/audit-logs";

import { AuditLogDetailsDialog } from "./audit-log-details-dialog";
import { AuditLogsTableActionBar } from "./audit-logs-table-action-bar";
import { getAuditLogsTableColumns } from "./audit-logs-table-columns";
import { AuditLogsTableToolbarActions } from "./audit-logs-table-toolbar-actions";
import { DeleteAuditLogsDialog } from "./delete-audit-logs-dialog";

const INITIAL_AUDIT_LOGS: IAuditLog[] = [
  {
    id: "log-501",
    code: "LOG-501",
    timestamp: new Date("2026-08-24T10:24:12"),
    actor: "Kundan Gupta",
    action: "iam:UpdateUserRole",
    resource: "User #42 (Jane Doe)",
    status: "SUCCESS",
    severity: "info",
    ipAddress: "192.168.1.45",
  },
  {
    id: "log-502",
    code: "LOG-502",
    timestamp: new Date("2026-08-24T09:55:01"),
    actor: "Jane Doe",
    action: "iam:CreatePolicy",
    resource: "Policy #pol-104",
    status: "SUCCESS",
    severity: "info",
    ipAddress: "10.0.0.12",
  },
  {
    id: "log-503",
    code: "LOG-503",
    timestamp: new Date("2026-08-24T08:30:44"),
    actor: "Unknown (IP 45.12.3.1)",
    action: "iam:Authenticate",
    resource: "Login Attempt",
    status: "DENIED",
    severity: "warning",
    ipAddress: "45.12.3.1",
  },
  {
    id: "log-504",
    code: "LOG-504",
    timestamp: new Date("2026-08-24T07:15:20"),
    actor: "Kundan Gupta",
    action: "iam:DeletePolicy",
    resource: "Policy #pol-99",
    status: "SUCCESS",
    severity: "info",
    ipAddress: "192.168.1.45",
  },
  {
    id: "log-505",
    code: "LOG-505",
    timestamp: new Date("2026-08-23T22:11:05"),
    actor: "Alex Smith",
    action: "iam:UpdateModule",
    resource: "Module #mod-03",
    status: "SUCCESS",
    severity: "info",
    ipAddress: "172.16.0.88",
  },
  {
    id: "log-506",
    code: "LOG-506",
    timestamp: new Date("2026-08-23T19:40:12"),
    actor: "System Agent",
    action: "security:RotateKeys",
    resource: "KMS Key #k-882",
    status: "SUCCESS",
    severity: "info",
    ipAddress: "127.0.0.1",
  },
  {
    id: "log-507",
    code: "LOG-507",
    timestamp: new Date("2026-08-23T18:02:59"),
    actor: "Unknown (IP 185.220.101.5)",
    action: "iam:AdminEscalation",
    resource: "Super Admin Role",
    status: "DENIED",
    severity: "error",
    ipAddress: "185.220.101.5",
  },
  {
    id: "log-508",
    code: "LOG-508",
    timestamp: new Date("2026-08-23T15:22:33"),
    actor: "Sarah Connor",
    action: "billing:ExportReport",
    resource: "Financial Report Q3",
    status: "SUCCESS",
    severity: "info",
    ipAddress: "10.0.0.55",
  },
  {
    id: "log-509",
    code: "LOG-509",
    timestamp: new Date("2026-08-23T11:05:00"),
    actor: "Jane Doe",
    action: "iam:RevokeSession",
    resource: "Session #sess-902",
    status: "SUCCESS",
    severity: "info",
    ipAddress: "10.0.0.12",
  },
  {
    id: "log-510",
    code: "LOG-510",
    timestamp: new Date("2026-08-22T23:59:10"),
    actor: "Kundan Gupta",
    action: "security:UpdateFirewall",
    resource: "Ingress Rule #443",
    status: "WARNING",
    severity: "warning",
    ipAddress: "192.168.1.45",
  },
  {
    id: "log-511",
    code: "LOG-511",
    timestamp: new Date("2026-08-22T16:30:00"),
    actor: "Unknown (IP 193.56.28.12)",
    action: "iam:Authenticate",
    resource: "Login Attempt",
    status: "DENIED",
    severity: "warning",
    ipAddress: "193.56.28.12",
  },
  {
    id: "log-512",
    code: "LOG-512",
    timestamp: new Date("2026-08-22T14:12:45"),
    actor: "Alex Smith",
    action: "analytics:ExportMetrics",
    resource: "Usage Metrics 2026",
    status: "SUCCESS",
    severity: "info",
    ipAddress: "172.16.0.88",
  },
];

export function AuditLogsTable({ queryKeys }: IAuditLogsTableProps) {
  const [logs, setLogs] = React.useState<IAuditLog[]>(INITIAL_AUDIT_LOGS);
  const [rowAction, setRowAction] =
    React.useState<IDataTableRowAction<IAuditLog> | null>(null);
  const [selectedLogForDetails, setSelectedLogForDetails] =
    React.useState<IAuditLog | null>(null);

  const statusCounts = React.useMemo(
    () =>
      logs.reduce(
        (acc, log) => {
          acc[log.status] = (acc[log.status] || 0) + 1;
          return acc;
        },
        { SUCCESS: 0, DENIED: 0, WARNING: 0 } as Record<
          IAuditLog["status"],
          number
        >
      ),
    [logs]
  );

  const severityCounts = React.useMemo(
    () =>
      logs.reduce(
        (acc, log) => {
          acc[log.severity] = (acc[log.severity] || 0) + 1;
          return acc;
        },
        { info: 0, warning: 0, error: 0 } as Record<
          IAuditLog["severity"],
          number
        >
      ),
    [logs]
  );

  const handleBulkDelete = React.useCallback((logIds: string[]) => {
    setLogs((prev) => prev.filter((log) => !logIds.includes(log.id)));
  }, []);

  const handleViewDetails = React.useCallback((log: IAuditLog) => {
    setSelectedLogForDetails(log);
  }, []);

  const columns = React.useMemo(
    () =>
      getAuditLogsTableColumns({
        statusCounts,
        severityCounts,
        setRowAction,
        onViewDetails: handleViewDetails,
      }),
    [statusCounts, severityCounts, handleViewDetails]
  );

  const { table } = useDataTable({
    data: logs,
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
          <AuditLogsTableActionBar
            table={table}
            onBulkDelete={handleBulkDelete}
          />
        }
        emptyStateTitle="No audit logs found"
        emptyStateDescription="There are no security audit logs matching the current search parameters."
        emptyStateActions={
          <Button
            variant="outline"
            onClick={() => {
              toast.success("Audit logs refreshed");
            }}
          >
            Refresh Logs
          </Button>
        }
      >
        <DataTableToolbar table={table}>
          <AuditLogsTableToolbarActions table={table} />
        </DataTableToolbar>
      </DataTable>

      <DeleteAuditLogsDialog
        open={rowAction?.variant === "delete"}
        onOpenChange={() => setRowAction(null)}
        logs={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
        onDeleteLogs={handleBulkDelete}
      />

      <AuditLogDetailsDialog
        open={!!selectedLogForDetails}
        onOpenChange={(open) => {
          if (!open) setSelectedLogForDetails(null);
        }}
        log={selectedLogForDetails}
      />
    </>
  );
}
