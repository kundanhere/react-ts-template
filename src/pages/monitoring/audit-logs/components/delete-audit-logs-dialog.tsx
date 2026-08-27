import { Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import type { DeleteAuditLogsDialogProps } from "@/types/monitoring/audit-logs";

export function DeleteAuditLogsDialog({
  logs,
  onSuccess,
  showTrigger = true,
  onDeleteLogs,
  ...props
}: DeleteAuditLogsDialogProps) {
  const onDelete = () => {
    const ids = logs.map((l) => l.id);
    onDeleteLogs?.(ids);
    toast.success(
      logs.length === 1
        ? "Audit log entry deleted"
        : `${logs.length} audit log entries deleted`
    );
    onSuccess?.();
    props.onOpenChange?.(false, {} as any);
  };

  return (
    <AlertDialog {...props}>
      {showTrigger ? (
        <AlertDialogTrigger render={<Button variant="outline" size="sm" />}>
          <HugeiconsIcon
            icon={Delete02Icon}
            strokeWidth={2}
            className="mr-2 size-4"
            aria-hidden="true"
          />
          Delete ({logs.length})
        </AlertDialogTrigger>
      ) : null}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently remove{" "}
            <span className="text-foreground font-medium">
              {logs.length === 1
                ? `log entry ${logs[0]?.code}`
                : `${logs.length} audit log entries`}
            </span>{" "}
            from the system event record.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>Delete Log</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
