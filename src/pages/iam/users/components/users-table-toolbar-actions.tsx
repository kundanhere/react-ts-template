import { Add01Icon, Download01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { exportTableToCSV } from "@/lib/export";
import type { IUsersTableToolbarActionsProps } from "@/types/iam/users";

export function UsersTableToolbarActions({
  table,
}: IUsersTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button onClick={() => toast.info("New user clicked")}>
        <HugeiconsIcon
          icon={Add01Icon}
          strokeWidth={2}
          className="mr-1 size-4"
          aria-hidden="true"
        />
        New User
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          exportTableToCSV(table, {
            filename: "users",
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
