import * as React from "react";

import {
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

  const handleRevoke = (id: string, name: string) => {
    setSessions(sessions.filter((s) => s.id !== id));
    toast.success(`Session on ${name} revoked.`);
  };

  return (
    <div className="max-w-4xl space-y-6">
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
      </div>
    </div>
  );
}
