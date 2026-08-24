import { Download01Icon, RefreshIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { exportTableToCSV } from "@/lib/export";

import type { AuditLog } from "./audit-logs-table-columns";

interface AuditLogsTableToolbarActionsProps {
  table: Table<AuditLog>;
  onRefresh?: () => void;
}

export function AuditLogsTableToolbarActions({
  table,
  onRefresh,
}: AuditLogsTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        onClick={() => {
          onRefresh?.();
          toast.success("Audit logs stream refreshed");
        }}
      >
        <HugeiconsIcon
          icon={RefreshIcon}
          strokeWidth={2}
          className="mr-1 size-3.5"
          aria-hidden="true"
        />
        Refresh
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          exportTableToCSV(table, {
            filename: "audit-logs",
            excludeColumns: ["select", "actions"],
          })
        }
      >
        <HugeiconsIcon
          icon={Download01Icon}
          strokeWidth={2}
          className="mr-1 size-3.5"
          aria-hidden="true"
        />
        Export
      </Button>
    </div>
  );
}
