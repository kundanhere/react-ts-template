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
import type { DeletePoliciesDialogProps } from "@/types/iam/policies";

export function DeletePoliciesDialog({
  policies,
  onSuccess,
  showTrigger = true,
  onDeletePolicies,
  ...props
}: DeletePoliciesDialogProps) {
  const onDelete = () => {
    const ids = policies.map((p) => p.id);
    onDeletePolicies?.(ids);
    toast.success(
      policies.length === 1
        ? "Policy deleted"
        : `${policies.length} policies deleted`
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
          Delete ({policies.length})
        </AlertDialogTrigger>
      ) : null}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            <span className="text-foreground font-medium">
              {policies.length === 1
                ? policies[0]?.name
                : `${policies.length} policies`}
            </span>{" "}
            from our system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
