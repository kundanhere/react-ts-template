import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/format";

import type { Session } from "./sessions-table-columns";

interface SessionDetailsDialogProps {
  session: Session | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRevoke?: (session: Session) => void;
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground text-right font-medium">{children}</span>
    </div>
  );
}

export function SessionDetailsDialog({
  session,
  open,
  onOpenChange,
  onRevoke,
}: SessionDetailsDialogProps) {
  if (!session) return null;

  const initials = session.user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const statusColor: Record<Session["status"], string> = {
    active: "bg-emerald-500",
    idle: "bg-amber-500",
    revoked: "bg-rose-500",
    expired: "bg-muted-foreground",
  };

  const riskColor: Record<Session["riskScore"], string> = {
    low: "bg-emerald-500",
    medium: "bg-amber-500",
    high: "bg-rose-500",
  };

  const authLabel: Record<Session["authMethod"], string> = {
    mfa: "MFA",
    sso: "SSO / SAML",
    password: "Password",
    api_key: "API Key",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Session Inspector</DialogTitle>
          <DialogDescription>
            Authentication state, device fingerprint, and token lifecycle.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 px-4 pb-0.5 sm:px-5">
          {/* User */}
          <div className="flex items-center gap-2.5">
            <Avatar>
              <AvatarImage src={session.user.avatar} alt={session.user.name} />
              <AvatarFallback className="text-[10px]">
                {initials}
              </AvatarFallback>
              <AvatarBadge className={statusColor[session.status]} />
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold">
                {session.user.name}
              </p>
              <p className="text-muted-foreground truncate text-[11px]">
                {session.user.email}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <Badge
                variant="outline"
                className="text-[10px] font-normal capitalize"
              >
                {session.user.role}
              </Badge>
              <code className="text-muted-foreground font-mono text-[10px]">
                {session.code}
              </code>
            </div>
          </div>

          <Separator />

          {/* Properties */}
          <div className="flex flex-col gap-2">
            <Row label="Status">
              <span className="inline-flex items-center gap-1.5 capitalize">
                <span
                  className={`size-1.5 rounded-full ${statusColor[session.status]}`}
                />
                {session.status}
                {session.isCurrent && (
                  <Badge
                    variant="secondary"
                    className="ml-0.5 h-4 px-1 text-[9px]"
                  >
                    You
                  </Badge>
                )}
              </span>
            </Row>
            <Row label="Risk Level">
              <span className="inline-flex items-center gap-1.5 capitalize">
                <span
                  className={`size-1.5 rounded-full ${riskColor[session.riskScore]}`}
                />
                {session.riskScore}
              </span>
            </Row>
            <Row label="Auth Method">{authLabel[session.authMethod]}</Row>
            <Row label="Device Type">
              <span className="capitalize">{session.deviceType}</span>
            </Row>
          </div>

          <Separator />

          {/* Connection */}
          <div className="flex flex-col gap-2">
            <Row label="IP Address">
              <code className="bg-muted rounded px-1.5 py-px font-mono text-[11px]">
                {session.ipAddress}
              </code>
            </Row>
            <Row label="Location">{session.location}</Row>
            <Row label="Client">
              <span className="inline-block max-w-44 truncate">
                {session.device}
              </span>
            </Row>
          </div>

          <Separator />

          {/* Timeline */}
          <div className="flex flex-col gap-2">
            <Row label="Started">{formatDate(session.startedAt)}</Row>
            <Row label="Last Active">{formatDate(session.lastActiveAt)}</Row>
            <Row label="Expires">{formatDate(session.expiresAt)}</Row>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {!session.isCurrent && session.status !== "revoked" && (
            <Button
              variant="destructive"
              onClick={() => {
                onOpenChange(false);
                onRevoke?.(session);
              }}
            >
              Revoke Session
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
