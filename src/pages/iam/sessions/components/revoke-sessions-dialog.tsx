import { CancelCircleIcon } from "@hugeicons/core-free-icons";
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
import type { RevokeSessionsDialogProps } from "@/types/iam/sessions";

export function RevokeSessionsDialog({
  sessions,
  isRevokeAllOther = false,
  onSuccess,
  showTrigger = false,
  onRevokeSessions,
  onRevokeAllOtherSessions,
  ...props
}: RevokeSessionsDialogProps) {
  const onConfirm = () => {
    if (isRevokeAllOther) {
      onRevokeAllOtherSessions?.();
      toast.success("All other active sessions have been revoked");
    } else {
      const ids = sessions.map((s) => s.id);
      onRevokeSessions?.(ids);
      toast.success(
        sessions.length === 1
          ? `Session "${sessions[0]?.code}" revoked`
          : `${sessions.length} sessions revoked`
      );
    }
    onSuccess?.();
    props.onOpenChange?.(false, {} as any);
  };

  return (
    <AlertDialog {...props}>
      {showTrigger ? (
        <AlertDialogTrigger render={<Button variant="destructive" size="sm" />}>
          <HugeiconsIcon
            icon={CancelCircleIcon}
            strokeWidth={2}
            className="mr-2 size-4"
            aria-hidden="true"
          />
          {isRevokeAllOther
            ? "Revoke All Other Sessions"
            : `Revoke (${sessions.length})`}
        </AlertDialogTrigger>
      ) : null}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isRevokeAllOther
              ? "Revoke All Other Sessions?"
              : "Confirm Session Revocation"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isRevokeAllOther ? (
              <span>
                This will immediately invalidate and logout all active sessions
                across all devices except for your current active session.
              </span>
            ) : (
              <span>
                Are you sure you want to revoke{" "}
                <span className="text-foreground font-medium">
                  {sessions.length === 1
                    ? `session ${sessions[0]?.code} (${sessions[0]?.user.name})`
                    : `${sessions.length} selected sessions`}
                </span>
                ? The affected users will be instantly signed out and required
                to authenticate again.
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            className=""
            onClick={onConfirm}
          >
            Revoke Session{sessions.length > 1 || isRevokeAllOther ? "s" : ""}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
