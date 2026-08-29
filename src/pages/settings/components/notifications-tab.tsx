import * as React from "react";

import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";

export default function NotificationsTab() {
  const [success, setSuccess] = React.useState(false);

  const [emailNotif, setEmailNotif] = React.useState(true);
  const [pushNotif, setPushNotif] = React.useState(true);
  const [loginAlert, setLoginAlert] = React.useState(true);
  const [roleChange, setRoleChange] = React.useState(true);

  const handleSave = () => {
    setSuccess(true);
    toast.success("Notification preferences updated");
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Success banner */}
      {success && (
        <div className="flex items-center justify-between rounded-md border border-emerald-200 bg-emerald-50/70 p-3 text-xs text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-950/20 dark:text-emerald-400">
          <div className="flex items-center gap-2">
            <HugeiconsIcon
              icon={CheckmarkCircle02Icon}
              className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
            />
            <span>Notification preferences updated successfully.</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSuccess(false)}
            className="size-6 p-0 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/30"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
          </Button>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold tracking-tight">Notifications</h2>
        <p className="text-muted-foreground text-xs">
          Configure your notification channels and choose which system alerts
          you receive.
        </p>
      </div>

      <div className="border-border/60 border-t" />

      <div className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Notification channels</h3>

          <div className="bg-muted/10 space-y-3 rounded-lg border p-4">
            <div className="flex items-start gap-3">
              <Checkbox
                id="email-notif"
                checked={emailNotif}
                onCheckedChange={(checked) => setEmailNotif(!!checked)}
                className="mt-0.5"
              />
              <div className="space-y-0.5">
                <Label
                  htmlFor="email-notif"
                  className="cursor-pointer text-xs font-semibold"
                >
                  Email notifications
                </Label>
                <p className="text-muted-foreground text-[11px] leading-normal">
                  Receive alerts, weekly digests, and system updates at your
                  primary email address.
                </p>
              </div>
            </div>

            <div className="border-border/40 my-2 border-t" />

            <div className="flex items-start gap-3">
              <Checkbox
                id="push-notif"
                checked={pushNotif}
                onCheckedChange={(checked) => setPushNotif(!!checked)}
                className="mt-0.5"
              />
              <div className="space-y-0.5">
                <Label
                  htmlFor="push-notif"
                  className="cursor-pointer text-xs font-semibold"
                >
                  Push notifications
                </Label>
                <p className="text-muted-foreground text-[11px] leading-normal">
                  Receive real-time in-app alerts directly in your browser while
                  signed in.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Security & Activity Alerts</h3>
          <p className="text-muted-foreground text-xs">
            Choose which security events trigger immediate notifications.
          </p>

          <div className="bg-muted/10 space-y-3 rounded-lg border p-4">
            <div className="flex items-start gap-3">
              <Checkbox
                id="login-alert"
                checked={loginAlert}
                onCheckedChange={(checked) => setLoginAlert(!!checked)}
                className="mt-0.5"
              />
              <div className="space-y-0.5">
                <Label
                  htmlFor="login-alert"
                  className="cursor-pointer text-xs font-semibold"
                >
                  New device sign-in
                </Label>
                <p className="text-muted-foreground text-[11px] leading-normal">
                  Receive an immediate alert when your account is accessed from
                  a new device or IP address.
                </p>
              </div>
            </div>

            <div className="border-border/40 my-2 border-t" />

            <div className="flex items-start gap-3">
              <Checkbox
                id="role-change"
                checked={roleChange}
                onCheckedChange={(checked) => setRoleChange(!!checked)}
                className="mt-0.5"
              />
              <div className="space-y-0.5">
                <Label
                  htmlFor="role-change"
                  className="cursor-pointer text-xs font-semibold"
                >
                  Role & policy changes
                </Label>
                <p className="text-muted-foreground text-[11px] leading-normal">
                  Receive an alert whenever your account roles, permissions, or
                  access policies are updated.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-border/60 border-t pt-4" />

        <Button
          onClick={handleSave}
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 shrink-0 px-4 text-xs font-medium"
        >
          Save preferences
        </Button>
      </div>
    </div>
  );
}
