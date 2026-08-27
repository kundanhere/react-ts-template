import { Add01Icon, Download01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { exportTableToCSV } from "@/lib/export";
import type { IPoliciesTableToolbarActionsProps } from "@/types/iam/policies";

export function PoliciesTableToolbarActions({
  table,
}: IPoliciesTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button asChild>
        <Link to="/iam/policies/new">
          <HugeiconsIcon
            icon={Add01Icon}
            strokeWidth={2}
            className="mr-1 size-4"
            aria-hidden="true"
          />
          New Policy
        </Link>
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          exportTableToCSV(table, {
            filename: "policies",
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
