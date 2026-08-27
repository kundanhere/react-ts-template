import { ArrowRight01Icon, UserGroupIcon } from "@hugeicons/core-free-icons";
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
import type { IActiveSessionsCardProps } from "@/types/monitoring/analytics";

import { getUserInitials, getUserName, timeAgo } from "../utils";

export function ActiveSessionsCard({
  sessions,
  users,
  onRevokeSession,
}: IActiveSessionsCardProps) {
  const uniqueUsersInSessions = new Set(sessions.map((s) => s.userId)).size;

  return (
    <Card className="gap-0 py-0 shadow-xs lg:col-span-2">
      <CardHeader className="border-border/40 flex flex-row items-center justify-between border-b px-4 py-3">
        <div>
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <span>Active Client Sessions</span>
            <Badge
              variant="secondary"
              className="border-border border px-2 py-0.5 text-[0.625rem]"
            >
              {sessions.length} Connected
            </Badge>
          </CardTitle>
          <CardDescription className="text-xs">
            Active OAuth tokens and authenticated browser instances.
          </CardDescription>
        </div>
        <CardAction>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-primary h-7 gap-1 text-xs"
          >
            <Link to="/iam/sessions">
              All Sessions <HugeiconsIcon icon={ArrowRight01Icon} size={11} />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-52">
          <div className="divide-border/30 divide-y">
            {sessions.length > 0 ? (
              sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between gap-3 px-4 py-2 transition-colors"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <Avatar className="ring-border h-6 w-6 shrink-0 ring-1">
                      <AvatarFallback className="bg-muted text-[10px] font-bold">
                        {getUserInitials(users, session.userId)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="text-foreground truncate text-xs font-semibold">
                        {getUserName(users, session.userId)}
                      </div>
                      <div className="text-muted-foreground truncate text-[10px]">
                        {session.device}
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2.5">
                    <span className="text-muted-foreground bg-muted/50 border-border/50 rounded border px-1.5 py-0.5 font-mono text-[0.6875rem]">
                      {session.ip}
                    </span>
                    <span className="text-muted-foreground hidden font-mono text-[10px] whitespace-nowrap sm:inline-block">
                      {timeAgo(session.lastActiveAt)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRevokeSession(session.id)}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive h-6 px-2 text-[10px] font-medium"
                    >
                      Disconnect
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-muted-foreground py-10 text-center text-xs">
                No active sessions found.
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="text-muted-foreground mt-auto flex w-full items-center justify-between border-t px-4 py-2.5 text-xs">
        <div className="flex items-center gap-1.5">
          <HugeiconsIcon icon={UserGroupIcon} size={14} />
          <span>{uniqueUsersInSessions} Authenticated Principals</span>
        </div>
        <span className="font-mono text-[11px]">TLS 1.3 Encrypted</span>
      </CardFooter>
    </Card>
  );
}
