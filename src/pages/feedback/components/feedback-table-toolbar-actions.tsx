import { Add01Icon, Download01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { exportTableToCSV } from "@/lib/export";
import type { IFeedbackTableToolbarActionsProps } from "@/types/feedback";

export function FeedbackTableToolbarActions({
  table,
  onNewFeedbackClick,
}: IFeedbackTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={onNewFeedbackClick}
        size="sm"
        className="h-8 gap-1.5 text-xs"
      >
        <HugeiconsIcon
          icon={Add01Icon}
          strokeWidth={2}
          className="size-4"
          aria-hidden="true"
        />
        Submit Feedback / Bug
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-8 gap-1.5 text-xs"
        onClick={() =>
          exportTableToCSV(table, {
            filename: "sentry-user-feedback",
            excludeColumns: ["select", "actions"],
          })
        }
      >
        <HugeiconsIcon
          icon={Download01Icon}
          strokeWidth={2}
          className="size-3.5"
          aria-hidden="true"
        />
        Export CSV
      </Button>
    </div>
  );
}
