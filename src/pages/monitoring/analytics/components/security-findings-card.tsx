import { Alert01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router-dom";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { SecurityFindingsCardProps } from "@/types/monitoring/analytics";

export function SecurityFindingsCard({ users }: SecurityFindingsCardProps) {
  const lockedOrInactiveUsers = users.filter(
    (u) => u.locked || u.status !== "active"
  );
  const lockedCount = users.filter((u) => u.locked).length;

  return (
    <Card className="gap-0 py-0 shadow-xs">
      <CardHeader className="border-border/40 flex flex-row items-center justify-between border-b px-4 py-3">
        <div>
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <HugeiconsIcon
              icon={Alert01Icon}
              className="h-4 w-4 text-amber-500"
            />
            <span>Security Findings</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Identity anomalies flagged by policy analyzer.
          </CardDescription>
        </div>
        <CardAction>
          <Button
            variant="link"
            size="sm"
            asChild
            className="text-primary p-0 text-xs font-medium"
          >
            <Link to="/iam/users">Users →</Link>
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-52">
          <div className="space-y-2 p-3">
            {lockedOrInactiveUsers.length > 0 ? (
              lockedOrInactiveUsers.map((user) => (
                <div
                  key={user.id}
                  className="border-border/70 bg-card space-y-1.5 rounded-lg border p-2.5 shadow-xs transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex min-w-0 items-center gap-2">
                      <Avatar className="ring-border h-6 w-6 shrink-0 ring-1">
                        <AvatarFallback className="bg-muted text-[9px] font-bold">
                          {user.firstName.charAt(0)}
                          {user.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="truncate text-xs font-semibold">
                          {user.firstName} {user.lastName}
                        </div>
                      </div>
                    </div>

                    <Badge
                      variant="outline"
                      className={`gap-1 px-1.5 py-0.5 text-[0.625rem] capitalize ${
                        user.locked
                          ? "text-destructive border-destructive/30 bg-destructive/10"
                          : "text-muted-foreground border-muted bg-muted/40"
                      }`}
                    >
                      {user.locked ? "Locked" : "Suspended"}
                    </Badge>
                  </div>

                  <div className="text-muted-foreground bg-muted/30 border-border/30 rounded-md border p-1.5 text-[11px]">
                    {user.locked
                      ? "Restricted due to anomalous failed MFA credentials."
                      : "Account suspended by identity workspace policy."}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-muted-foreground py-10 text-center text-xs">
                Zero security findings detected.
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="text-muted-foreground mt-auto flex w-full items-center justify-between border-t px-4 py-2.5 text-xs">
        <span>Anomaly Scanner</span>
        <span className="font-mono text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
          {lockedCount === 0 ? "All Clear" : `${lockedCount} Action Needed`}
        </span>
      </CardFooter>
    </Card>
  );
}
