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
import type { IDeleteFeedbackDialogProps } from "@/types/feedback";

export function DeleteFeedbackDialog({
  feedbacks,
  onSuccess,
  showTrigger = true,
  onDeleteFeedback,
  ...props
}: IDeleteFeedbackDialogProps) {
  const onDelete = () => {
    const ids = feedbacks.map((f) => f.id);
    onDeleteFeedback?.(ids);
    toast.success(
      feedbacks.length === 1
        ? "Feedback item deleted"
        : `${feedbacks.length} feedback items deleted`
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
          Delete ({feedbacks.length})
        </AlertDialogTrigger>
      ) : null}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently remove{" "}
            <span className="text-foreground font-medium">
              {feedbacks.length === 1
                ? feedbacks[0]?.title
                : `${feedbacks.length} feedback items`}
            </span>{" "}
            from the review queue.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
