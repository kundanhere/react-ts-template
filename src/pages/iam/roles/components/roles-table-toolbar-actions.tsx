import { Add01Icon, Download01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { exportTableToCSV } from "@/lib/export";

import type { RoleItem } from "./roles-table-columns";

interface RolesTableToolbarActionsProps {
  table: Table<RoleItem>;
  onNewRoleClick?: () => void;
}

export function RolesTableToolbarActions({
  table,
  onNewRoleClick,
}: RolesTableToolbarActionsProps) {
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
