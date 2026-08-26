import { Download01Icon, RefreshIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { exportTableToCSV } from "@/lib/export";

import type { ActivityItem } from "./activity-table-columns";

interface ActivityTableToolbarActionsProps {
  table: Table<ActivityItem>;
  onRefresh?: () => void;
}

export function ActivityTableToolbarActions({
  table,
  onRefresh,
}: ActivityTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        onClick={() => {
          onRefresh?.();
          toast.success("Personal activity log refreshed");
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
            filename: "my-activity-log",
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
