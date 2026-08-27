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
import type { IActivityDetailsDialogProps } from "@/types/monitoring/activity";

import { getSeverityIcon } from "./activity-table-columns";

export function ActivityDetailsDialog({
  open,
  onOpenChange,
  item,
}: IActivityDetailsDialogProps) {
  if (!item) return null;

  const SeverityIcon = getSeverityIcon(item.severity);

  let dotColorClass = "bg-amber-500";
  let statusText = "Warning";

  if (item.status === "SUCCESS") {
    dotColorClass = "bg-emerald-500";
    statusText = "Success";
  } else if (item.status === "DENIED") {
    dotColorClass = "bg-destructive";
    statusText = "Denied";
  }

  const renderSeverityBadge = () => {
    if (item.severity === "warning") {
      return (
        <Badge
          variant="outline"
          className="gap-1 border-amber-500/30 bg-amber-50/50 px-1.5 py-0.5 text-xs text-amber-600 capitalize dark:bg-amber-950/20 dark:text-amber-400 [&>svg]:size-3"
        >
          <SeverityIcon />
          {item.severity}
        </Badge>
      );
    }

    if (item.severity === "error") {
      return (
        <Badge
          variant="outline"
          className="text-destructive border-destructive/30 bg-destructive/10 dark:bg-destructive/20 gap-1 px-1.5 py-0.5 text-xs capitalize [&>svg]:size-3"
        >
          <SeverityIcon />
          {item.severity}
        </Badge>
      );
    }

    return (
      <Badge
        variant="secondary"
        className="border-border gap-1 border px-1.5 py-0.5 text-xs capitalize [&>svg]:size-3"
      >
        <SeverityIcon />
        {item.severity}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] p-0 sm:max-w-md">
        <DialogHeader className="border-b px-4 py-4 sm:px-5">
          <DialogTitle>Activity Event Details</DialogTitle>
          <DialogDescription>
            Detailed inspection payload and execution metadata for activity ID{" "}
            {item.id}.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="activity-code">Activity ID</Label>
                <Input
                  id="activity-code"
                  value={item.code}
                  readOnly
                  className="font-mono text-xs"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="activity-ip">IP Address</Label>
                <Input
                  id="activity-ip"
                  value={item.ipAddress}
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
                <Label htmlFor="activity-actor">Actor Principal</Label>
                <Input
                  id="activity-actor"
                  value={item.actor}
                  readOnly
                  className="text-xs"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="activity-time">Timestamp</Label>
                <Input
                  id="activity-time"
                  value={formatDate(item.timestamp, {
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
              <Label htmlFor="activity-action">Action Method</Label>
              <Input
                id="activity-action"
                value={item.action}
                readOnly
                className="font-mono text-xs"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="activity-resource">Target Resource</Label>
              <Input
                id="activity-resource"
                value={item.resource}
                readOnly
                className="font-mono text-xs"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="activity-payload">Event Payload Context</Label>
              <Textarea
                id="activity-payload"
                readOnly
                value={JSON.stringify(
                  {
                    activityId: item.id,
                    activityCode: item.code,
                    timestamp: item.timestamp.toISOString(),
                    principal: item.actor,
                    method: item.action,
                    resource: item.resource,
                    clientIp: item.ipAddress,
                    status: item.status,
                    severity: item.severity,
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
