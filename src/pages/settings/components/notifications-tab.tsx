import * as React from "react";

import {
  AlertCircleIcon,
  ArchiveArrowDownIcon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  ComputerIcon,
  LockIcon,
  Mail02Icon,
  Settings01Icon,
  ShieldCheck,
  SmartPhone01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toast";

export default function NotificationsTab() {
  const [success, setSuccess] = React.useState(false);

  // Channel States
  const [inboxNotif, setInboxNotif] = React.useState(true);
  const [emailNotif, setEmailNotif] = React.useState(true);
  const [immediateAlert, setImmediateAlert] = React.useState(false);
  const [integrationsNotif, setIntegrationsNotif] = React.useState(true);
  const [mobileNotif, setMobileNotif] = React.useState(false);
  const [desktopNotif, setDesktopNotif] = React.useState(false);

  // Security Alert States
  const [failedLoginAlert, setFailedLoginAlert] = React.useState(true);
  const [mfaAlert, setMfaAlert] = React.useState(true);
  const [unrecognizedLoginAlert, setUnrecognizedLoginAlert] =
    React.useState(true);
  const [tokenAlert, setTokenAlert] = React.useState(false);

  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSuccess(true);
      toast.success("Notification preferences updated");
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setSuccess(false), 5000);
    }, 450);
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

      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Notifications</h2>
        <p className="text-muted-foreground text-xs">
          Configure how and where you receive task updates, security
          notifications, and app integrations.
        </p>
      </div>

      <div className="border-border/60 border-t" />

      <div className="space-y-6">
        {/* Notification Channels Section */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold">Notification channels</h3>
            <p className="text-muted-foreground text-xs">
              Choose which channels to activate for system, task, and project
              updates.
            </p>
          </div>

          <div className="border-border/80 bg-muted/20 space-y-4 rounded-lg border p-4">
            {/* Inbox */}
            <div className="border-border/60 flex flex-wrap items-start justify-between gap-4 border-b pb-4 sm:flex-nowrap">
              <div className="flex items-start gap-3">
                <div className="bg-muted text-muted-foreground mt-0.5 shrink-0 rounded-md p-2">
                  <HugeiconsIcon
                    icon={ArchiveArrowDownIcon}
                    className="size-4.5"
                  />
                </div>
                <div className="space-y-0.5">
                  <span className="text-foreground text-xs font-semibold">
                    Inbox
                  </span>
                  <p className="text-muted-foreground max-w-xl text-[11px] leading-normal">
                    You'll consistently get notifications for your subscriptions
                    within your TeamTask inbox.
                  </p>
                </div>
              </div>
              <Switch
                checked={inboxNotif}
                onCheckedChange={setInboxNotif}
                className="mt-0.5"
              />
            </div>

            {/* Email */}
            <div className="border-border/60 space-y-3 border-b pb-4">
              <div className="flex flex-wrap items-start justify-between gap-4 sm:flex-nowrap">
                <div className="flex items-start gap-3">
                  <div className="bg-muted text-muted-foreground mt-0.5 shrink-0 rounded-md p-2">
                    <HugeiconsIcon icon={Mail02Icon} className="size-4.5" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-foreground text-xs font-semibold">
                      Email
                    </span>
                    <p className="text-muted-foreground max-w-xl text-[11px] leading-normal">
                      Get an email summary for unread notifications, with
                      notifications grouped and sent according to their urgency.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={emailNotif}
                  onCheckedChange={setEmailNotif}
                  className="mt-0.5"
                />
              </div>

              {emailNotif && (
                <div className="border-border/40 flex flex-wrap items-start justify-between gap-4 border-t pt-3 pl-11 sm:flex-nowrap">
                  <div className="space-y-0.5">
                    <span className="text-foreground text-[11.5px] font-semibold">
                      Immediate email alert for urgent tasks
                    </span>
                    <p className="text-muted-foreground max-w-lg text-[10.5px] leading-normal">
                      Receive an immediate email alert whenever a task assigned
                      to you is marked urgent or associated with a high-priority
                      project with a tight deadline.
                    </p>
                  </div>
                  <Switch
                    checked={immediateAlert}
                    onCheckedChange={setImmediateAlert}
                    className="mt-0.5"
                  />
                </div>
              )}
            </div>

            {/* Integrations */}
            <div className="border-border/60 space-y-3 border-b pb-4">
              <div className="flex flex-wrap items-start justify-between gap-4 sm:flex-nowrap">
                <div className="flex items-start gap-3">
                  <div className="bg-muted text-muted-foreground mt-0.5 shrink-0 rounded-md p-2">
                    <HugeiconsIcon icon={Settings01Icon} className="size-4.5" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-foreground text-xs font-semibold">
                      Integrations
                    </span>
                    <p className="text-muted-foreground max-w-xl text-[11px] leading-normal">
                      Get personal notifications integrated into messaging apps
                      like Slack or Discord:
                    </p>
                  </div>
                </div>
                <Switch
                  checked={integrationsNotif}
                  onCheckedChange={setIntegrationsNotif}
                  className="mt-0.5"
                />
              </div>
              {integrationsNotif && (
                <div className="border-border/40 flex flex-wrap items-center gap-3.5 border-t pt-3 pl-11">
                  <img
                    src="/svg/telegram.svg"
                    alt="Telegram"
                    className="size-4.5 shrink-0 object-contain"
                  />
                  <img
                    src="/svg/slack.svg"
                    alt="Slack"
                    className="size-4.5 shrink-0 object-contain"
                  />
                  <img
                    src="/svg/line.svg"
                    alt="LINE"
                    className="size-4.5 shrink-0 object-contain"
                  />
                  <img
                    src="/svg/whatsapp.svg"
                    alt="WhatsApp"
                    className="size-4.5 shrink-0 object-contain"
                  />
                  <img
                    src="/svg/discord.svg"
                    alt="Discord"
                    className="size-4.5 shrink-0 object-contain"
                  />
                  <img
                    src="/svg/chat.svg"
                    alt="Google Chat"
                    className="size-4.5 shrink-0 object-contain"
                  />
                  <button
                    type="button"
                    className="text-primary ml-1 cursor-pointer border-none bg-transparent p-0 text-[10.5px] font-medium hover:underline"
                    onClick={() =>
                      toast.info(
                        "Integrations management dialog triggered (simulated)"
                      )
                    }
                  >
                    Manage
                  </button>
                </div>
              )}
            </div>

            {/* Mobile */}
            <div className="border-border/60 flex flex-wrap items-start justify-between gap-4 border-b pb-4 sm:flex-nowrap">
              <div className="flex items-start gap-3">
                <div className="bg-muted text-muted-foreground mt-0.5 shrink-0 rounded-md p-2">
                  <HugeiconsIcon icon={SmartPhone01Icon} className="size-4.5" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-foreground text-xs font-semibold">
                    Mobile
                  </span>
                  <p className="text-muted-foreground max-w-xl text-[11px] leading-normal">
                    You'll get notifications for your subscriptions directly to
                    your mobile app inbox.
                  </p>
                </div>
              </div>
              <Switch
                checked={mobileNotif}
                onCheckedChange={setMobileNotif}
                className="mt-0.5"
              />
            </div>

            {/* Desktop */}
            <div className="flex flex-wrap items-start justify-between gap-4 sm:flex-nowrap">
              <div className="flex items-start gap-3">
                <div className="bg-muted text-muted-foreground mt-0.5 shrink-0 rounded-md p-2">
                  <HugeiconsIcon icon={ComputerIcon} className="size-4.5" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-foreground text-xs font-semibold">
                    Desktop
                  </span>
                  <p className="text-muted-foreground max-w-xl text-[11px] leading-normal">
                    You'll receive notifications for your subscriptions directly
                    to your inbox on either the desktop app or website app.
                  </p>
                </div>
              </div>
              <Switch
                checked={desktopNotif}
                onCheckedChange={setDesktopNotif}
                className="mt-0.5"
              />
            </div>
          </div>
        </div>

        <div className="border-border/60 border-t pt-6" />

        {/* Security Alerts Section */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold">Security Alerts</h3>
            <p className="text-muted-foreground text-xs">
              Choose which security events and authentication triggers
              immediately send notifications.
            </p>
          </div>

          <div className="border-border/80 bg-muted/20 space-y-4 rounded-lg border p-4">
            {/* Failed Logins */}
            <div className="border-border/60 flex flex-wrap items-start justify-between gap-4 border-b pb-4 sm:flex-nowrap">
              <div className="flex items-start gap-3">
                <div className="bg-muted text-muted-foreground mt-0.5 shrink-0 rounded-md p-2">
                  <HugeiconsIcon icon={AlertCircleIcon} className="size-4.5" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-foreground text-xs font-semibold">
                    Failed sign-in threshold alert
                  </span>
                  <p className="text-muted-foreground max-w-xl text-[11px] leading-normal">
                    Receive an immediate email and dashboard notification if
                    there are 5 or more consecutive failed login attempts on
                    your account.
                  </p>
                </div>
              </div>
              <Switch
                checked={failedLoginAlert}
                onCheckedChange={setFailedLoginAlert}
                className="mt-0.5"
              />
            </div>

            {/* Credential & MFA Update */}
            <div className="border-border/60 flex flex-wrap items-start justify-between gap-4 border-b pb-4 sm:flex-nowrap">
              <div className="flex items-start gap-3">
                <div className="bg-muted text-muted-foreground mt-0.5 shrink-0 rounded-md p-2">
                  <HugeiconsIcon icon={LockIcon} className="size-4.5" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-foreground text-xs font-semibold">
                    MFA & Credential updates
                  </span>
                  <p className="text-muted-foreground max-w-xl text-[11px] leading-normal">
                    Receive an alert whenever your password is modified or
                    multi-factor authentication (TOTP/SMS/Passkeys) settings are
                    added, disabled, or changed.
                  </p>
                </div>
              </div>
              <Switch
                checked={mfaAlert}
                onCheckedChange={setMfaAlert}
                className="mt-0.5"
              />
            </div>

            {/* New Device Logins */}
            <div className="border-border/60 flex flex-wrap items-start justify-between gap-4 border-b pb-4 sm:flex-nowrap">
              <div className="flex items-start gap-3">
                <div className="bg-muted text-muted-foreground mt-0.5 shrink-0 rounded-md p-2">
                  <HugeiconsIcon icon={ShieldCheck} className="size-4.5" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-foreground text-xs font-semibold">
                    Unrecognized device sign-ins
                  </span>
                  <p className="text-muted-foreground max-w-xl text-[11px] leading-normal">
                    Get notified immediately when a successful sign-in is
                    recorded from a new browser session, device hardware
                    profile, or geographic location.
                  </p>
                </div>
              </div>
              <Switch
                checked={unrecognizedLoginAlert}
                onCheckedChange={setUnrecognizedLoginAlert}
                className="mt-0.5"
              />
            </div>

            {/* Access Token Creation */}
            <div className="flex flex-wrap items-start justify-between gap-4 sm:flex-nowrap">
              <div className="flex items-start gap-3">
                <div className="bg-muted text-muted-foreground mt-0.5 shrink-0 rounded-md p-2">
                  <HugeiconsIcon icon={Settings01Icon} className="size-4.5" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-foreground text-xs font-semibold">
                    Access token creation & updates
                  </span>
                  <p className="text-muted-foreground max-w-xl text-[11px] leading-normal">
                    Receive notification logs when a new developer access token,
                    API integration, or OAuth authentication is created.
                  </p>
                </div>
              </div>
              <Switch
                checked={tokenAlert}
                onCheckedChange={setTokenAlert}
                className="mt-0.5"
              />
            </div>
          </div>
        </div>

        <div className="border-border/60 border-t pt-4" />

        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 shrink-0 px-4 text-xs font-medium"
        >
          {isSaving ? "Saving..." : "Save preferences"}
        </Button>
      </div>
    </div>
  );
}
