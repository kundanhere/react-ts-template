import { Add01Icon, Download01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { exportTableToCSV } from "@/lib/export";
import type { IRolesTableToolbarActionsProps } from "@/types/iam/roles";

export function RolesTableToolbarActions({
  table,
  onNewRoleClick,
}: IRolesTableToolbarActionsProps) {
  const onExport = () => {
    exportTableToCSV(table, {
      filename: "roles-export",
      excludeColumns: ["select", "actions"],
    });
    toast.success("Exported roles to CSV");
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={
          onNewRoleClick ?? (() => toast.info("Create Role modal triggered"))
        }
        className="text-xs"
      >
        <HugeiconsIcon icon={Add01Icon} strokeWidth={2} className="mr-1" />
        New Role
      </Button>
      <Button variant="outline" onClick={onExport} className="text-xs">
        <HugeiconsIcon icon={Download01Icon} strokeWidth={2} className="mr-1" />
        Export
      </Button>
    </div>
  );
}
