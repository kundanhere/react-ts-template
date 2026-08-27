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
import type { DeleteActivityDialogProps } from "@/types/monitoring/activity";

export function DeleteActivityDialog({
  items,
  onSuccess,
  showTrigger = true,
  onDeleteItems,
  ...props
}: DeleteActivityDialogProps) {
  const onDelete = () => {
    const ids = items.map((i) => i.id);
    onDeleteItems?.(ids);
    toast.success(
      items.length === 1
        ? "Activity log entry deleted"
        : `${items.length} activity log entries deleted`
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
          Delete ({items.length})
        </AlertDialogTrigger>
      ) : null}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently remove{" "}
            <span className="text-foreground font-medium">
              {items.length === 1
                ? `activity entry ${items[0]?.code}`
                : `${items.length} activity log entries`}
            </span>{" "}
            from your personal activity history.
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
