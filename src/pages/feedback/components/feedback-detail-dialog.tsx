import { GlobeIcon, StarIcon, UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { formatDate } from "@/lib/format";
import type { FeedbackStatus, IFeedback } from "@/types/feedback";

interface IFeedbackDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feedback: IFeedback | null;
  onUpdateStatus?: (feedbackId: string, status: FeedbackStatus) => void;
}

export function FeedbackDetailDialog({
  open,
  onOpenChange,
  feedback,
  onUpdateStatus,
}: IFeedbackDetailDialogProps) {
  if (!feedback) return null;

  const handleStatusChange = (newStatus: FeedbackStatus) => {
    onUpdateStatus?.(feedback.id, newStatus);
    toast.success(`Status updated to "${newStatus.replace("_", " ")}"`);
  };

  const statusVariantMap: Record<FeedbackStatus, string> = {
    new: "text-sky-600 border-sky-500/30 bg-sky-50/50 dark:bg-sky-950/20 dark:text-sky-400",
    in_review:
      "text-amber-600 border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 dark:text-amber-400",
    in_progress:
      "text-violet-600 border-violet-500/30 bg-violet-50/50 dark:bg-violet-950/20 dark:text-violet-400",
    resolved:
      "text-emerald-600 border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 dark:text-emerald-400",
    closed: "text-muted-foreground border-muted bg-muted/40",
  };

  const priorityDotMap: Record<string, string> = {
    critical: "bg-rose-500",
    high: "bg-amber-500",
    medium: "bg-sky-500",
    low: "bg-muted-foreground",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" className="p-0">
        <DialogHeader className="p-4 pb-2 sm:p-5 sm:pb-2.5">
          {/* Metadata badges row */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-muted-foreground font-mono text-[11px] font-semibold">
              {feedback.code}
            </span>
            <Badge
              variant="outline"
              className={`h-5 gap-1 px-1.5 py-0 text-[10px] font-medium capitalize ${statusVariantMap[feedback.status]}`}
            >
              {feedback.status.replace("_", " ")}
            </Badge>
            <Badge
              variant="outline"
              className="text-foreground h-5 gap-1 px-1.5 py-0 text-[10px] font-medium capitalize"
            >
              <span
                className={`size-1.5 rounded-full ${priorityDotMap[feedback.priority] || "bg-muted-foreground"}`}
              />
              {feedback.priority}
            </Badge>
            <Badge
              variant="secondary"
              className="h-5 px-1.5 py-0 text-[10px] font-medium uppercase"
            >
              {feedback.type}
            </Badge>
          </div>

          <DialogTitle className="text-foreground mt-0.5 text-sm leading-snug font-semibold tracking-tight sm:text-base">
            {feedback.title}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-0 text-[11px] leading-normal">
            Submitted {formatDate(feedback.createdAt)} by{" "}
            <span className="text-foreground font-medium">
              {feedback.author.name}
            </span>
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <div className="flex flex-col gap-3.5 px-4 pt-1 pb-4 text-xs sm:px-5 sm:pt-1 sm:pb-5">
            {/* Main Description */}
            <div className="bg-muted/40 border-border/60 flex flex-col gap-1.5 rounded-lg border p-3">
              <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                {feedback.type === "bug"
                  ? "Observed Issue & Behavior"
                  : "Feedback Summary"}
              </span>
              <p className="text-foreground text-xs leading-relaxed whitespace-pre-wrap">
                {feedback.description}
              </p>
            </div>

            {/* Steps to Reproduce */}
            {feedback.stepsToReproduce && (
              <div className="flex flex-col gap-1.5">
                <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                  Steps to Reproduce
                </span>
                <pre className="border-border/70 bg-muted/30 text-foreground rounded-lg border p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                  {feedback.stepsToReproduce}
                </pre>
              </div>
            )}

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="bg-muted/40 border-border/60 flex items-center gap-2.5 rounded-lg border p-3">
                <HugeiconsIcon
                  icon={UserIcon}
                  strokeWidth={2}
                  className="text-muted-foreground size-4"
                />
                <div className="space-y-0.5">
                  <span className="text-muted-foreground text-[10px] font-semibold uppercase">
                    Reporter
                  </span>
                  <p className="text-foreground text-xs font-semibold">
                    {feedback.author.name}
                  </p>
                  <p className="text-muted-foreground text-[11px]">
                    {feedback.author.email}
                  </p>
                </div>
              </div>

              <div className="bg-muted/40 border-border/60 flex items-center gap-2.5 rounded-lg border p-3">
                <HugeiconsIcon
                  icon={GlobeIcon}
                  strokeWidth={2}
                  className="text-muted-foreground size-4"
                />
                <div className="space-y-0.5">
                  <span className="text-muted-foreground text-[10px] font-semibold uppercase">
                    Target Route
                  </span>
                  <p className="text-foreground font-mono text-xs font-semibold">
                    {feedback.url || "/"}
                  </p>
                  <p className="text-muted-foreground text-[11px]">
                    {feedback.deviceInfo || "Desktop Browser"}
                  </p>
                </div>
              </div>
            </div>

            {/* Rating and Workflow Status */}
            <div className="bg-muted/40 border-border/60 flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-0.5">
                <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                  User Satisfaction
                </span>
                <div className="flex items-center gap-1.5 pt-0.5">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {Array.from({ length: 5 }, () => crypto.randomUUID()).map(
                      (idx, i) => (
                        <HugeiconsIcon
                          key={idx}
                          icon={StarIcon}
                          strokeWidth={2}
                          className={`size-3.5 ${
                            i < feedback.rating
                              ? "fill-amber-400 text-amber-500"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      )
                    )}
                  </div>
                  <span className="text-foreground text-xs font-semibold">
                    {feedback.rating} / 5
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs font-medium">
                  Status:
                </span>
                <div className="w-36">
                  <Select
                    value={feedback.status}
                    onValueChange={(val) =>
                      handleStatusChange(val as FeedbackStatus)
                    }
                  >
                    <SelectTrigger className="h-8 text-xs capitalize">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="in_review">In Review</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </DialogBody>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="h-8 text-xs">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
