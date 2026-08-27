import { CancelCircleIcon, Download01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { exportTableToCSV } from "@/lib/export";
import type { ISessionsTableToolbarActionsProps } from "@/types/iam/sessions";

export function SessionsTableToolbarActions({
  table,
  onRevokeAllOther,
}: ISessionsTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="destructive" onClick={onRevokeAllOther}>
        <HugeiconsIcon
          icon={CancelCircleIcon}
          strokeWidth={2}
          className="mr-1 size-4"
          aria-hidden="true"
        />
        Revoke All Other Sessions
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          exportTableToCSV(table, {
            filename: "active-sessions-export",
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
