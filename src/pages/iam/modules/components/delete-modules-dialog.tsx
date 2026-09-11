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
import { Badge } from "@/components/ui/badge";
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
        ? "Module deleted successfully"
        : `${modules.length} modules deleted successfully`
    );
    onSuccess?.();
    props.onOpenChange?.(false, {} as any);
  };

  const hasSystemModules = modules.some((m) => m.isSystem);

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
      <AlertDialogContent size="default" className="p-0 sm:max-w-md">
        <AlertDialogHeader className="p-4 pb-2 sm:p-5 sm:pb-3">
          <AlertDialogTitle>Delete Selected Modules</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Please confirm removal from the system
            registry.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col gap-3 px-4 py-2 text-xs sm:px-5 sm:pb-4">
          <div className="bg-destructive/5 border-destructive/20 flex flex-col gap-2 rounded-lg border p-3">
            <div className="flex items-center justify-between">
              <span className="text-destructive text-[0.625rem] font-semibold tracking-wider uppercase">
                Target Scope ({modules.length})
              </span>
              {hasSystemModules && (
                <Badge
                  variant="destructive"
                  className="h-4.5 px-1.5 text-[0.625rem] font-medium"
                >
                  Contains System Modules
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-[0.6875rem] leading-relaxed">
              Permanent removal will remove all associated permission policies
              and route allocations.
            </p>

            <div className="mt-1 max-h-24 space-y-1 overflow-y-auto pr-1">
              {modules.map((m) => (
                <div
                  key={m.id}
                  className="hover:bg-destructive/10 flex items-center justify-between rounded px-2 py-1 text-xs"
                >
                  <span className="text-foreground truncate font-medium">
                    {m.name}
                  </span>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <code className="text-muted-foreground font-mono text-[0.625rem]">
                      {m.code}
                    </code>
                    {m.isSystem && (
                      <Badge
                        variant="secondary"
                        className="px-1 py-0 text-[0.625rem]"
                      >
                        sys
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <AlertDialogFooter className="border-t px-4 py-3 sm:px-5">
          <AlertDialogCancel className="h-8 text-xs">Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={onDelete}
            className="h-8 text-xs"
          >
            Delete Permanently
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
