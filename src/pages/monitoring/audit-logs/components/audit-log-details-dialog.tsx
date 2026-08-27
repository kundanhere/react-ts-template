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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/format";
import type { IAuditLogDetailsDialogProps } from "@/types/monitoring/audit-logs";

import { getSeverityIcon } from "./audit-logs-table-columns";

export function AuditLogDetailsDialog({
  open,
  onOpenChange,
  log,
}: IAuditLogDetailsDialogProps) {
  if (!log) return null;

  const SeverityIcon = getSeverityIcon(log.severity);

  let dotColorClass = "bg-amber-500";
  let statusText = "Warning";

  if (log.status === "SUCCESS") {
    dotColorClass = "bg-emerald-500";
    statusText = "Success";
  } else if (log.status === "DENIED") {
    dotColorClass = "bg-destructive";
    statusText = "Denied";
  }

  const renderSeverityBadge = () => {
    if (log.severity === "warning") {
      return (
        <Badge
          variant="outline"
          className="gap-1 border-amber-500/30 bg-amber-50/50 px-1.5 py-0.5 text-xs text-amber-600 capitalize dark:bg-amber-950/20 dark:text-amber-400 [&>svg]:size-3"
        >
          <SeverityIcon />
          {log.severity}
        </Badge>
      );
    }

    if (log.severity === "error") {
      return (
        <Badge
          variant="outline"
          className="text-destructive border-destructive/30 bg-destructive/10 dark:bg-destructive/20 gap-1 px-1.5 py-0.5 text-xs capitalize [&>svg]:size-3"
        >
          <SeverityIcon />
          {log.severity}
        </Badge>
      );
    }

    return (
      <Badge
        variant="secondary"
        className="border-border gap-1 border px-1.5 py-0.5 text-xs capitalize [&>svg]:size-3"
      >
        <SeverityIcon />
        {log.severity}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] p-0 sm:max-w-md">
        <DialogHeader className="border-b px-4 py-4 sm:px-5">
          <DialogTitle>Audit Event Details</DialogTitle>
          <DialogDescription>
            Detailed inspection payload and execution metadata for event ID{" "}
            {log.id}.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="audit-code">Log ID</Label>
                <Input
                  id="audit-code"
                  value={log.code}
                  readOnly
                  className="font-mono text-xs"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="audit-ip">IP Address</Label>
                <Input
                  id="audit-ip"
                  value={log.ipAddress}
                  readOnly
                  className="font-mono text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <Label>Status</Label>
                <div className="bg-muted/20 border-input flex h-9 items-center rounded-md border px-3">
                  <Badge
                    variant="outline"
                    className="text-foreground gap-1.5 px-2 py-0.5 text-xs font-normal"
                  >
                    <span
                      className={`size-1.5 rounded-full ${dotColorClass}`}
                    />
                    {statusText}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Severity</Label>
                <div className="bg-muted/20 border-input flex h-9 items-center rounded-md border px-3">
                  {renderSeverityBadge()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="audit-actor">Actor Principal</Label>
                <Input
                  id="audit-actor"
                  value={log.actor}
                  readOnly
                  className="text-xs"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="audit-time">Timestamp</Label>
                <Input
                  id="audit-time"
                  value={formatDate(log.timestamp, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                  })}
                  readOnly
                  className="font-mono text-xs"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="audit-action">Action Method</Label>
              <Input
                id="audit-action"
                value={log.action}
                readOnly
                className="font-mono text-xs"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="audit-resource">Target Resource</Label>
              <Input
                id="audit-resource"
                value={log.resource}
                readOnly
                className="font-mono text-xs"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="audit-payload">Event Payload Context</Label>
              <Textarea
                id="audit-payload"
                readOnly
                value={JSON.stringify(
                  {
                    eventId: log.id,
                    eventCode: log.code,
                    timestamp: log.timestamp.toISOString(),
                    principal: log.actor,
                    method: log.action,
                    resource: log.resource,
                    clientIp: log.ipAddress,
                    status: log.status,
                    severity: log.severity,
                  },
                  null,
                  2
                )}
                rows={5}
                className="font-mono text-xs"
              />
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="border-t px-4 py-3 sm:px-5">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
