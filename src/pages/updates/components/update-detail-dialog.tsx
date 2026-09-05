import {
  Alert02Icon,
  CheckmarkCircle01Icon,
  Copy01Icon,
  GitBranchIcon,
  LinkSquare02Icon,
  Notification01Icon,
  ShieldCheck,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { InlineCopy } from "@/components/ui/inline-copy";
import { toast } from "@/components/ui/toast";
import { formatDate } from "@/lib/format";
import type { ISystemUpdate, UpdateType } from "@/types/updates";

interface IUpdateDetailDialogProps {
  update: ISystemUpdate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onToggleRead?: (updateId: string) => void;
}

const typeVariantMap: Record<UpdateType, string> = {
  major:
    "border-emerald-500/30 text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 dark:text-emerald-400",
  minor:
    "border-sky-500/30 text-sky-600 bg-sky-50/50 dark:bg-sky-950/20 dark:text-sky-400",
  patch:
    "border-indigo-500/30 text-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 dark:text-indigo-400",
  security:
    "border-rose-500/30 text-rose-600 bg-rose-50/50 dark:bg-rose-950/20 dark:text-rose-400",
  hotfix:
    "border-amber-500/30 text-amber-600 bg-amber-50/50 dark:bg-amber-950/20 dark:text-amber-400",
  maintenance: "border-muted bg-muted/40 text-muted-foreground",
};

export function UpdateDetailDialog({
  update,
  open,
  onOpenChange,
  onToggleRead,
}: IUpdateDetailDialogProps) {
  if (!update) return null;

  const initials = update.author.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleCopyMarkdown = () => {
    const text = `# ${update.version}: ${update.title}\n\n**Published:** ${formatDate(update.publishedAt)}\n**Type:** ${update.type.toUpperCase()}\n**Channel:** ${update.channel.toUpperCase()}\n\n## Overview\n${update.description}\n\n## Highlights\n${update.highlights?.map((h) => `- ${h}`).join("\n") || "None"}\n\n**Commit:** ${update.commitHash || "N/A"}`;
    navigator.clipboard.writeText(text);
    toast.success("Release notes copied as Markdown");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" className="p-0">
        <DialogHeader className="p-4 pb-2 sm:p-5 sm:pb-2.5">
          {/* Metadata badges row */}
          <div className="flex flex-wrap items-center gap-1.5">
            <InlineCopy
              text={update.version}
              label="version"
              className="border-border/60 bg-muted/60 text-foreground hover:text-primary rounded border px-2 py-0.5 font-mono text-[0.6875rem] font-bold"
            />
            <Badge
              variant="outline"
              className={`h-5 gap-1 px-1.5 py-0 text-[0.625rem] font-medium capitalize ${typeVariantMap[update.type]}`}
            >
              {update.type}
            </Badge>
            <Badge
              variant="outline"
              className="text-foreground h-5 px-1.5 py-0 text-[0.625rem] font-medium uppercase"
            >
              {update.channel}
            </Badge>
            <Badge
              variant="secondary"
              className="h-5 px-1.5 py-0 text-[0.625rem] font-medium capitalize"
            >
              {update.status.replace("_", " ")}
            </Badge>
            {update.isUnread && (
              <span className="py-0.2 flex items-center gap-1 rounded-full bg-blue-500/10 px-1.5 text-[0.625rem] font-semibold text-blue-600 dark:text-blue-400">
                <span className="size-1.5 rounded-full bg-blue-500" />
                Unread
              </span>
            )}
          </div>

          <DialogTitle className="text-foreground mt-0.5 text-sm leading-snug font-semibold tracking-tight sm:text-base">
            {update.title}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-0 text-[0.6875rem] leading-normal">
            Released {formatDate(update.publishedAt)} by{" "}
            <span className="text-foreground font-medium">
              {update.author.name}
            </span>{" "}
            ({update.author.role})
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <div className="flex flex-col gap-3.5 px-4 pt-1 pb-4 text-xs sm:px-5 sm:pt-1 sm:pb-5">
            {/* Overview Box */}
            <div className="bg-muted/40 border-border/60 flex flex-col gap-1.5 rounded-lg border p-3">
              <span className="text-muted-foreground text-[0.625rem] font-semibold tracking-wider uppercase">
                Release Overview
              </span>
              <p className="text-foreground text-xs leading-relaxed">
                {update.description}
              </p>
            </div>

            {/* Security Advisory Warning (if applicable) */}
            {update.securityNotice && (
              <div className="flex flex-col gap-1.5 rounded-lg border border-rose-500/30 bg-rose-50/50 p-3 dark:bg-rose-950/20">
                <div className="flex items-center gap-1.5 text-[0.6875rem] font-semibold text-rose-700 dark:text-rose-400">
                  <HugeiconsIcon
                    icon={ShieldCheck}
                    strokeWidth={2}
                    className="size-4"
                  />
                  <span>Security Advisory Resolution</span>
                </div>
                <p className="text-xs leading-relaxed text-rose-800 dark:text-rose-300">
                  {update.securityNotice}
                </p>
              </div>
            )}

            {/* Highlights List */}
            {update.highlights && update.highlights.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <span className="text-muted-foreground text-[0.625rem] font-semibold tracking-wider uppercase">
                  Key Enhancements & Changes
                </span>
                <div className="border-border/60 bg-muted/20 space-y-2 rounded-lg border p-3">
                  {update.highlights.map((h) => (
                    <div key={h} className="flex items-start gap-2">
                      <HugeiconsIcon
                        icon={CheckmarkCircle01Icon}
                        strokeWidth={2}
                        className="mt-0.5 size-3.5 shrink-0 text-emerald-500"
                      />
                      <span className="text-foreground text-xs leading-relaxed">
                        {h}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Breaking Changes Callout (if any) */}
            {update.breakingChanges && update.breakingChanges.length > 0 && (
              <div className="flex flex-col gap-1.5 rounded-lg border border-amber-500/30 bg-amber-50/50 p-3 dark:bg-amber-950/20">
                <div className="flex items-center gap-1.5 text-[0.6875rem] font-semibold text-amber-700 dark:text-amber-400">
                  <HugeiconsIcon
                    icon={Alert02Icon}
                    strokeWidth={2}
                    className="size-4"
                  />
                  <span>Migration & Breaking Changes</span>
                </div>
                <ul className="list-disc space-y-1 pl-4 text-xs text-amber-900 dark:text-amber-200">
                  {update.breakingChanges.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {/* Deployer */}
              <div className="bg-muted/40 border-border/60 flex items-center gap-2.5 rounded-lg border p-3">
                <Avatar size="sm" className="size-7 after:hidden">
                  {update.author.avatar ? (
                    <AvatarImage
                      src={update.author.avatar}
                      alt={update.author.name}
                    />
                  ) : null}
                  <AvatarFallback className="bg-primary/10 text-primary text-[0.625rem] font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-0.5">
                  <span className="text-muted-foreground text-[0.625rem] font-semibold uppercase">
                    Released By
                  </span>
                  <p className="text-foreground text-xs font-semibold">
                    {update.author.name}
                  </p>
                  <p className="text-muted-foreground text-[0.6875rem]">
                    {update.author.role}
                  </p>
                </div>
              </div>

              {/* Build & Commit Info */}
              <div className="bg-muted/40 border-border/60 flex items-center gap-2.5 rounded-lg border p-3">
                <div className="bg-muted text-muted-foreground flex size-7 items-center justify-center rounded-lg">
                  <HugeiconsIcon
                    icon={GitBranchIcon}
                    strokeWidth={2}
                    className="size-4"
                  />
                </div>
                <div className="space-y-0.5">
                  <span className="text-muted-foreground text-[0.625rem] font-semibold uppercase">
                    Git Reference
                  </span>
                  <div>
                    <InlineCopy
                      text={update.commitHash || "HEAD"}
                      displayValue={`commit ${update.commitHash || "HEAD"}`}
                      label="commit hash"
                      className="text-foreground hover:text-primary font-mono text-xs font-semibold"
                      iconSize={12}
                    />
                  </div>
                  <p className="text-muted-foreground text-[0.6875rem]">
                    Channel: {update.channel.toUpperCase()} ·{" "}
                    {update.impact.toUpperCase()} Impact
                  </p>
                </div>
              </div>
            </div>

            {/* Affected Modules */}
            <div className="flex flex-col gap-1.5">
              <span className="text-muted-foreground text-[0.625rem] font-semibold tracking-wider uppercase">
                Impacted Platform Modules
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {update.affectedModules.map((m) => (
                  <span
                    key={m}
                    className="border-border/60 bg-muted/40 text-foreground rounded-md border px-2 py-0.5 text-xs font-medium"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </DialogBody>

        <DialogFooter className="border-border/60 bg-muted/50 flex flex-col-reverse gap-2 border-t px-4 py-3 sm:flex-row sm:justify-between sm:gap-2 sm:px-5 sm:py-3">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyMarkdown}
              className="h-8 gap-1.5 text-xs"
            >
              <HugeiconsIcon
                icon={Copy01Icon}
                strokeWidth={2}
                className="size-3.5"
              />
              Copy Changelog
            </Button>
            {onToggleRead && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onToggleRead(update.id)}
                className="h-8 gap-1.5 text-xs"
              >
                <HugeiconsIcon
                  icon={Notification01Icon}
                  strokeWidth={2}
                  className="size-3.5"
                />
                {update.isUnread ? "Mark as Read" : "Mark as Unread"}
              </Button>
            )}
            {update.docsUrl && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 gap-1 text-xs"
                render={<Link to={update.docsUrl} />}
              >
                <HugeiconsIcon
                  icon={LinkSquare02Icon}
                  strokeWidth={2}
                  className="size-3.5"
                />
                View Docs
              </Button>
            )}
          </div>

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
