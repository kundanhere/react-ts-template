import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
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
import type { CloudAuditLogsCardProps } from "@/types/monitoring/analytics";

import { getUserInitials, getUserName, timeAgo } from "../utils";

export function CloudAuditLogsCard({
  auditLogs,
  users,
  auditFilter,
  setAuditFilter,
}: CloudAuditLogsCardProps) {
  const allowAuditCount = auditLogs.filter((l) => l.result === "ALLOW").length;
  const denyAuditCount = auditLogs.filter((l) => l.result === "DENY").length;

  const filteredAuditLogs = auditLogs.filter((log) => {
    if (auditFilter === "ALL") return true;
    return log.result === auditFilter;
  });

  return (
    <Card className="gap-0 py-0 shadow-xs lg:col-span-2">
      <CardHeader className="border-border/40 flex flex-col justify-between gap-2.5 border-b px-4 py-3 sm:flex-row sm:items-center">
        <div>
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <span>Cloud Audit Logs</span>
            <Badge
              variant="secondary"
              className="border-border border px-2 py-0.5 text-[0.625rem]"
            >
              {filteredAuditLogs.length} Events
            </Badge>
          </CardTitle>
          <CardDescription className="text-xs">
            Continuous evaluation trace of IAM methods and authorization
            decisions.
          </CardDescription>
        </div>

        <CardAction>
          <div className="flex items-center gap-2">
            <div className="border-border bg-muted/40 flex items-center rounded-lg border p-0.5 text-xs font-medium">
              <button
                type="button"
                onClick={() => setAuditFilter("ALL")}
                className={`rounded-md px-2.5 py-0.5 text-xs transition-all ${
                  auditFilter === "ALL"
                    ? "bg-background text-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All ({auditLogs.length})
              </button>
              <button
                type="button"
                onClick={() => setAuditFilter("ALLOW")}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-xs transition-all ${
                  auditFilter === "ALLOW"
                    ? "bg-background font-semibold text-emerald-600 shadow-xs dark:text-emerald-400"
                    : "text-muted-foreground hover:text-emerald-500"
                }`}
              >
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Allow ({allowAuditCount})
              </button>
              <button
                type="button"
                onClick={() => setAuditFilter("DENY")}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-xs transition-all ${
                  auditFilter === "DENY"
                    ? "bg-background text-destructive font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-destructive"
                }`}
              >
                <span className="bg-destructive size-1.5 rounded-full" />
                Deny ({denyAuditCount})
              </button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-primary h-7 gap-1 text-xs"
            >
              <Link to="/iam/audit/logs">
                Full Log <HugeiconsIcon icon={ArrowRight01Icon} size={11} />
              </Link>
            </Button>
          </div>
        </CardAction>
      </CardHeader>

      <CardContent className="p-0">
        <div className="min-w-155">
          <div className="bg-muted/30 border-border/40 text-muted-foreground grid grid-cols-12 gap-3 border-b px-4 py-2 text-[10px] font-bold tracking-wider uppercase">
            <div className="col-span-2">SEVERITY / STATUS</div>
            <div className="col-span-3">PRINCIPAL</div>
            <div className="col-span-3">METHOD / ACTION</div>
            <div className="col-span-3">RESOURCE & DETAIL</div>
            <div className="col-span-1 text-right">TIME</div>
          </div>

          <ScrollArea className="h-55">
            <div className="divide-border/30 divide-y">
              {filteredAuditLogs.length > 0 ? (
                filteredAuditLogs.map((log) => {
                  const isAllow = log.result === "ALLOW";
                  return (
                    <div
                      key={log.id}
                      className="grid grid-cols-12 items-center gap-3 px-4 py-2 text-xs transition-colors"
                    >
                      <div className="col-span-2 flex items-center">
                        <Badge
                          variant="outline"
                          className="gap-1.5 px-2 py-0.5 text-[0.625rem] font-normal"
                        >
                          <span
                            className={`size-1.5 rounded-full ${
                              isAllow ? "bg-emerald-500" : "bg-destructive"
                            }`}
                          />
                          {isAllow ? "Allow" : "Deny"}
                        </Badge>
                      </div>

                      <div className="col-span-3 flex min-w-0 items-center gap-2">
                        <Avatar className="ring-border/80 h-5 w-5 shrink-0 ring-1">
                          <AvatarFallback className="bg-muted text-[9px] font-bold">
                            {getUserInitials(users, log.userId)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-foreground truncate text-xs font-semibold">
                          {getUserName(users, log.userId)}
                        </span>
                      </div>

                      <div className="col-span-3 flex min-w-0 items-center gap-1.5">
                        <span className="bg-muted/60 border-border/40 text-foreground truncate rounded border px-1.5 py-0.5 font-mono text-xs font-medium">
                          {log.action}
                        </span>
                      </div>

                      <div
                        className="text-muted-foreground col-span-3 truncate text-xs"
                        title={log.detail}
                      >
                        <span className="text-foreground/85 mr-1 font-semibold">
                          {log.resourceType}:
                        </span>
                        {log.detail}
                      </div>

                      <div className="text-muted-foreground col-span-1 text-right font-mono text-[11px] whitespace-nowrap">
                        {timeAgo(log.ts)}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-muted-foreground py-10 text-center text-xs font-medium">
                  No audit events recorded for current filter.
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>

      <CardFooter className="text-muted-foreground mt-auto flex w-full items-center justify-between border-t px-4 py-2.5 text-xs">
        <span>Real-time Stream</span>
        <span className="font-mono text-[11px]">Audit Engine v2.4</span>
      </CardFooter>
    </Card>
  );
}
