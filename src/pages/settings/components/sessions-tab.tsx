import * as React from "react";

import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
  ComputerIcon,
  Location01Icon,
  SmartPhone01Icon,
  Tablet01Icon,
} from "@hugeicons/core-free-icons";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";

export default function SessionsTab() {
  const [sessions, setSessions] = React.useState([
    {
      id: "sess-1",
      browser: "Chrome",
      os: "Windows 11",
      ip: "157.44.112.55",
      location: "Bengaluru, India",
      isCurrent: true,
      lastActive: "Active now",
      deviceType: "desktop",
    },
    {
      id: "sess-2",
      browser: "Safari",
      os: "iPhone 15 Pro",
      ip: "157.44.112.55",
      location: "Bengaluru, India",
      isCurrent: false,
      lastActive: "2 hours ago",
      deviceType: "mobile",
    },
    {
      id: "sess-3",
      browser: "Firefox",
      os: "macOS Sonoma",
      ip: "84.21.144.12",
      location: "London, United Kingdom",
      isCurrent: false,
      lastActive: "3 days ago",
      deviceType: "desktop",
    },
    {
      id: "sess-4",
      browser: "Chrome Mobile",
      os: "Android 14",
      ip: "157.44.112.98",
      location: "Bengaluru, India",
      isCurrent: false,
      lastActive: "1 week ago",
      deviceType: "mobile",
    },
  ]);

  const [accessTokenTtl, setAccessTokenTtl] = React.useState("60");
  const [refreshTokenTtl, setRefreshTokenTtl] = React.useState("30");
  const [mfaEnforced, setMfaEnforced] = React.useState(true);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null
  );

  const handleRevoke = (id: string, name: string) => {
    setSessions(sessions.filter((s) => s.id !== id));
    toast.success(`Session on ${name} revoked.`);
  };

  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("Session policy updated successfully.");
    toast.success("Session policy updated");
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Alert Banner */}
      {successMessage && (
        <div className="flex items-center justify-between rounded-md border border-emerald-200 bg-emerald-50/70 p-3 text-xs text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-950/20 dark:text-emerald-400">
          <div className="flex items-center gap-2">
            <HugeiconsIcon
              icon={CheckmarkCircle02Icon}
              className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
            />
            <span>{successMessage}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSuccessMessage(null)}
            className="size-6 p-0 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/30"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
          </Button>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          Active Sessions
        </h2>
        <p className="text-muted-foreground text-xs">
          Review and manage the active web sessions currently authorized to
          access your account.
        </p>
      </div>

      <div className="border-border/60 border-t" />

      <div className="space-y-6">
        {/* Web Sessions */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold">Web sessions</h3>
            <p className="text-muted-foreground text-xs">
              These web sessions are authorized to access your account.
            </p>
          </div>

          <div className="divide-border/60 border-border/80 bg-card divide-y overflow-hidden rounded-lg border">
            {sessions.map((sess) => {
              let sessionIcon = ComputerIcon;
              if (sess.deviceType === "mobile") {
                sessionIcon = SmartPhone01Icon;
              } else if (sess.deviceType === "tablet") {
                sessionIcon = Tablet01Icon;
              }

              return (
                <div
                  key={sess.id}
                  className="flex flex-wrap items-center justify-between gap-3 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-muted text-muted-foreground mt-0.5 shrink-0 rounded-md p-2.5">
                      <HugeiconsIcon icon={sessionIcon} className="size-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-foreground text-xs font-semibold">
                          {sess.browser} on {sess.os}
                        </span>
                        {sess.isCurrent && (
                          <Badge
                            variant="secondary"
                            className="border-emerald-200 bg-emerald-50 px-1.5 py-0 text-[9px] font-medium text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-400"
                          >
                            Current session
                          </Badge>
                        )}
                        <span className="text-muted-foreground text-[10px]">
                          • {sess.lastActive}
                        </span>
                      </div>
                      <p className="text-muted-foreground flex items-center gap-1 text-[11px] leading-normal">
                        <HugeiconsIcon
                          icon={Location01Icon}
                          className="size-3"
                        />
                        <span>
                          {sess.ip} — {sess.location}
                        </span>
                      </p>
                    </div>
                  </div>

                  {!sess.isCurrent && (
                    <AlertDialog>
                      <AlertDialogTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 px-3 text-xs font-medium"
                          />
                        }
                      >
                        Revoke
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Revoke this session?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This will sign you out of your account on the device
                            running{" "}
                            <span className="text-foreground font-medium">
                              {sess.browser} on {sess.os}
                            </span>
                            .
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            variant="destructive"
                            onClick={() =>
                              handleRevoke(
                                sess.id,
                                `${sess.browser} (${sess.os})`
                              )
                            }
                          >
                            Revoke
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-border/60 border-t pt-6" />

        {/* Session Duration & TTL Policy Section */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold">
              Session Duration & TTL Policy
            </h3>
            <p className="text-muted-foreground text-xs">
              Configure session timeout rules, token time-to-live settings, and
              administrator enforcement policies.
            </p>
          </div>

          <form onSubmit={handleSavePolicy} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="access-ttl" className="text-xs font-semibold">
                  Access Token TTL (minutes)
                </Label>
                <Input
                  id="access-ttl"
                  type="number"
                  value={accessTokenTtl}
                  onChange={(e) => setAccessTokenTtl(e.target.value)}
                  placeholder="60"
                  min="5"
                />
                <p className="text-muted-foreground text-[10px]">
                  Controls how long individual access tokens remain valid.
                  Recommended: 15–60 minutes.
                </p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="refresh-ttl" className="text-xs font-semibold">
                  Refresh Token TTL (days)
                </Label>
                <Input
                  id="refresh-ttl"
                  type="number"
                  value={refreshTokenTtl}
                  onChange={(e) => setRefreshTokenTtl(e.target.value)}
                  placeholder="30"
                  min="1"
                />
                <p className="text-muted-foreground text-[10px]">
                  Controls the duration refresh tokens can be used to request
                  new access tokens. Recommended: 7–30 days.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 pt-2">
              <Checkbox
                id="mfa-enforce-chk"
                checked={mfaEnforced}
                onCheckedChange={(checked) => setMfaEnforced(!!checked)}
                className="mt-0.5"
              />
              <div className="grid gap-0.5">
                <Label
                  htmlFor="mfa-enforce-chk"
                  className="cursor-pointer text-xs font-semibold"
                >
                  Enforce 2FA for Administrators
                </Label>
                <span className="text-muted-foreground text-[10px] leading-normal">
                  Require all administrators and privileged accounts to
                  configure and sign in using two-factor authentication.
                </span>
              </div>
            </div>

            <div className="border-border/60 border-t pt-4" />

            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 shrink-0 px-4 text-xs font-medium"
            >
              Save session policy
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
