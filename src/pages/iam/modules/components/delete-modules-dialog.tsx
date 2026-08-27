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
import type { IDeleteModulesDialogProps } from "@/types/iam/modules";

export function DeleteModulesDialog({
  modules,
  onSuccess,
  showTrigger = true,
  onDeleteModules,
  ...props
}: IDeleteModulesDialogProps) {
  const onDelete = () => {
    const ids = modules.map((m) => m.id);
    onDeleteModules?.(ids);
    toast.success(
      modules.length === 1
        ? "Module deleted"
        : `${modules.length} modules deleted`
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
          Delete ({modules.length})
        </AlertDialogTrigger>
      ) : null}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            <span className="text-foreground font-medium">
              {modules.length === 1
                ? modules[0]?.name
                : `${modules.length} modules`}
            </span>{" "}
            from the system registration registry.
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
