import { Add01Icon, Download01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { exportTableToCSV } from "@/lib/export";

import type { Module } from "./modules-table-columns";

interface ModulesTableToolbarActionsProps {
  table: Table<Module>;
  onAddModule?: () => void;
}

export function ModulesTableToolbarActions({
  table,
  onAddModule,
}: ModulesTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button onClick={onAddModule}>
        <HugeiconsIcon
          icon={Add01Icon}
          strokeWidth={2}
          className="mr-1 size-4"
          aria-hidden="true"
        />
        New module
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          exportTableToCSV(table, {
            filename: "system-modules",
            excludeColumns: ["select", "actions"],
          })
        }
      >
        <HugeiconsIcon
          icon={Download01Icon}
          strokeWidth={2}
          className="mr-1 size-3"
          aria-hidden="true"
        />
        Export
      </Button>
    </div>
  );
}
