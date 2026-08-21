import * as React from "react";

import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";

export default function NotificationsTab() {
  const [success, setSuccess] = React.useState(false);

  const handleSave = () => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Success banner */}
      {success && (
        <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50/70 p-3 text-xs text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-950/20 dark:text-emerald-400">
          <HugeiconsIcon
            icon={CheckmarkCircle02Icon}
            className="size-4 text-emerald-600 dark:text-emerald-400"
          />
          <span>Notification preferences updated.</span>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold tracking-tight">Notifications</h2>
        <p className="text-muted-foreground text-xs">
          Configure how and when you receive system alerts and updates.
        </p>
      </div>

      <div className="border-border/60 border-t" />

      <div className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Notification channels</h3>

          <div className="bg-muted/10 space-y-3 rounded-lg border p-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="email-notif"
                defaultChecked
                className="accent-primary mt-1 size-3.5"
              />
              <div>
                <label
                  htmlFor="email-notif"
                  className="cursor-pointer text-xs font-semibold"
                >
                  Email notifications
                </label>
                <p className="text-muted-foreground text-[11px] leading-normal">
                  Receive alerts, weekly summaries, and system status updates at
                  your public email address.
                </p>
              </div>
            </div>

            <div className="border-border/40 my-2 border-t" />

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="push-notif"
                defaultChecked
                className="accent-primary mt-1 size-3.5"
              />
              <div>
                <label
                  htmlFor="push-notif"
                  className="cursor-pointer text-xs font-semibold"
                >
                  Push notifications
                </label>
                <p className="text-muted-foreground text-[11px] leading-normal">
                  Receive real-time in-app dashboard alerts while logged in.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Alert Events</h3>
          <p className="text-muted-foreground text-xs">
            Choose which security events trigger immediate notifications.
          </p>

          <div className="bg-muted/10 space-y-3 rounded-lg border p-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="login-alert"
                defaultChecked
                className="accent-primary mt-1 size-3.5"
              />
              <div>
                <label
                  htmlFor="login-alert"
                  className="cursor-pointer text-xs font-semibold"
                >
                  New device log-in
                </label>
                <p className="text-muted-foreground text-[11px] leading-normal">
                  Alert me immediately when my account is accessed from a new IP
                  or device.
                </p>
              </div>
            </div>

            <div className="border-border/40 my-2 border-t" />

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="role-change"
                defaultChecked
                className="accent-primary mt-1 size-3.5"
              />
              <div>
                <label
                  htmlFor="role-change"
                  className="cursor-pointer text-xs font-semibold"
                >
                  Role changes & policy updates
                </label>
                <p className="text-muted-foreground text-[11px] leading-normal">
                  Send notifications whenever my permissions, roles, or access
                  policies are modified.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-border/60 border-t pt-4" />

        <Button
          onClick={handleSave}
          className="h-8 bg-emerald-600 text-xs text-white hover:bg-emerald-700"
        >
          Save preferences
        </Button>
      </div>
    </div>
  );
}
