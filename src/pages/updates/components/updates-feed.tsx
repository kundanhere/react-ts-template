import * as React from "react";

import {
  Alert02Icon,
  CheckmarkCircle01Icon,
  Copy01Icon,
  EyeIcon,
  GitBranchIcon,
  Layers01Icon,
  Notification01Icon,
  Rocket01Icon,
  Search01Icon,
  ShieldCheck,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InlineCopy } from "@/components/ui/inline-copy";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ISystemUpdate, UpdateType } from "@/types/updates";

interface IUpdatesFeedProps {
  updates: ISystemUpdate[];
  onViewDetails: (update: ISystemUpdate) => void;
  onToggleRead: (updateId: string) => void;
}

const typeBadgeConfig: Record<
  UpdateType,
  { label: string; icon: any; className: string }
> = {
  major: {
    label: "Major Feature",
    icon: SparklesIcon,
    className:
      "border-emerald-500/30 text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 dark:text-emerald-400",
  },
  minor: {
    label: "Enhancement",
    icon: Rocket01Icon,
    className:
      "border-sky-500/30 text-sky-600 bg-sky-50/50 dark:bg-sky-950/20 dark:text-sky-400",
  },
  patch: {
    label: "Patch",
    icon: GitBranchIcon,
    className:
      "border-indigo-500/30 text-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 dark:text-indigo-400",
  },
  security: {
    label: "Security Advisory",
    icon: ShieldCheck,
    className:
      "border-rose-500/30 text-rose-600 bg-rose-50/50 dark:bg-rose-950/20 dark:text-rose-400",
  },
  hotfix: {
    label: "Hotfix",
    icon: Alert02Icon,
    className:
      "border-amber-500/30 text-amber-600 bg-amber-50/50 dark:bg-amber-950/20 dark:text-amber-400",
  },
  maintenance: {
    label: "Maintenance",
    icon: CheckmarkCircle01Icon,
    className: "border-muted bg-muted/40 text-muted-foreground",
  },
};

const channelBadgeConfig: Record<string, string> = {
  stable:
    "border-emerald-500/30 text-emerald-600 bg-emerald-50/40 dark:text-emerald-400",
  beta: "border-amber-500/30 text-amber-600 bg-amber-50/40 dark:text-amber-400",
  security: "border-rose-500/30 text-rose-600 bg-rose-50/40 dark:text-rose-400",
  lts: "border-blue-500/30 text-blue-600 bg-blue-50/40 dark:text-blue-400",
};

export function UpdatesFeed({
  updates,
  onViewDetails,
  onToggleRead,
}: IUpdatesFeedProps) {
  const [search, setSearch] = React.useState("");
  const [selectedType, setSelectedType] = React.useState<string>("all");
  const [onlyUnread, setOnlyUnread] = React.useState(false);

  const filteredUpdates = React.useMemo(
    () =>
      updates.filter((item) => {
        if (onlyUnread && !item.isUnread) return false;
        if (selectedType !== "all" && item.type !== selectedType) return false;
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchVer = item.version.toLowerCase().includes(q);
          const matchSummary = item.summary.toLowerCase().includes(q);
          const matchModules = item.affectedModules.some((m) =>
            m.toLowerCase().includes(q)
          );
          if (!matchTitle && !matchVer && !matchSummary && !matchModules)
            return false;
        }
        return true;
      }),
    [updates, search, selectedType, onlyUnread]
  );

  const handleCopyNotes = (update: ISystemUpdate, e: React.MouseEvent) => {
    e.stopPropagation();
    const content = `# ${update.version}: ${update.title}\n\n${update.summary}\n\nPublished: ${new Date(update.publishedAt).toLocaleDateString()}`;
    navigator.clipboard.writeText(content);
    toast.success(`Copied release notes for ${update.version}`);
  };

  const types: {
    label: string;
    value: string;
    count: number;
    icon: any;
    activeColor?: string;
  }[] = [
    {
      label: "All Updates",
      value: "all",
      count: updates.length,
      icon: Layers01Icon,
      activeColor: "text-primary",
    },
    {
      label: "Features",
      value: "major",
      count: updates.filter((u) => u.type === "major" || u.type === "minor")
        .length,
      icon: SparklesIcon,
      activeColor: "text-emerald-500 dark:text-emerald-400",
    },
    {
      label: "Security",
      value: "security",
      count: updates.filter((u) => u.type === "security").length,
      icon: ShieldCheck,
      activeColor: "text-rose-500 dark:text-rose-400",
    },
    {
      label: "Hotfixes",
      value: "hotfix",
      count: updates.filter((u) => u.type === "hotfix").length,
      icon: Alert02Icon,
      activeColor: "text-amber-500 dark:text-amber-400",
    },
    {
      label: "Maintenance",
      value: "maintenance",
      count: updates.filter((u) => u.type === "maintenance").length,
      icon: CheckmarkCircle01Icon,
      activeColor: "text-sky-500 dark:text-sky-400",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Controls Bar: Search & Filter Tabs */}
      <div className="border-border/60 bg-card flex flex-col gap-2.5 rounded-xl border p-2.5 shadow-2xs">
        <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between">
          {/* Segmented Filter Tabs */}
          <div className="bg-muted/50 border-border/50 no-scrollbar flex items-center gap-1 overflow-x-auto rounded-lg border p-1">
            {types.map((t) => {
              const isSelected = selectedType === t.value;
              const Icon = t.icon;
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setSelectedType(t.value)}
                  className={cn(
                    "flex h-7 shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-2.5 text-xs font-medium whitespace-nowrap transition-colors",
                    isSelected
                      ? "bg-background text-foreground font-semibold shadow-2xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                  )}
                >
                  <HugeiconsIcon
                    icon={Icon}
                    strokeWidth={2}
                    className={cn(
                      "size-3.5 transition-colors",
                      isSelected
                        ? t.activeColor || "text-foreground"
                        : "text-muted-foreground"
                    )}
                  />
                  <span>{t.label}</span>
                  <span
                    className={cn(
                      "py-0.2 ml-0.5 rounded-full px-1.5 font-mono text-[0.625rem] leading-none transition-colors",
                      isSelected
                        ? "bg-muted text-foreground font-bold"
                        : "bg-muted/70 text-muted-foreground"
                    )}
                  >
                    {t.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: Search Input & Unread Toggle */}
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-60">
              <HugeiconsIcon
                icon={Search01Icon}
                strokeWidth={2}
                className="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2"
              />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search updates, features..."
                className="bg-muted/30 h-8 pl-8 text-xs"
              />
            </div>

            <Button
              variant={onlyUnread ? "default" : "outline"}
              size="sm"
              onClick={() => setOnlyUnread(!onlyUnread)}
              className="h-8 shrink-0 gap-1.5 px-2.5 text-xs"
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  onlyUnread
                    ? "bg-primary-foreground"
                    : "bg-blue-500 ring-2 ring-blue-500/25"
                )}
              />
              {onlyUnread ? "Unread Only" : "Filter Unread"}
            </Button>
          </div>
        </div>
      </div>

      {/* Feed Cards Container */}
      {filteredUpdates.length === 0 ? (
        <div className="border-border/80 flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
          <div className="bg-muted text-muted-foreground mb-3 flex size-10 items-center justify-center rounded-full">
            <HugeiconsIcon
              icon={Notification01Icon}
              strokeWidth={2}
              className="size-5"
            />
          </div>
          <p className="text-foreground text-sm font-semibold">
            No updates found
          </p>
          <p className="text-muted-foreground mt-0.5 max-w-sm text-xs">
            No release notes or system notifications match your search or filter
            criteria.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4 h-8 text-xs"
            onClick={() => {
              setSearch("");
              setSelectedType("all");
              setOnlyUnread(false);
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
          {filteredUpdates.map((update) => {
            const typeInfo =
              typeBadgeConfig[update.type] || typeBadgeConfig.minor;
            const TypeIcon = typeInfo.icon;
            const initials = update.author.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <div
                key={update.id}
                onClick={() => onViewDetails(update)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onViewDetails(update);
                  }
                }}
                role="button"
                tabIndex={0}
                className={cn(
                  "group bg-card hover:border-border relative flex flex-col rounded-xl border p-4 shadow-2xs transition-colors",
                  update.isUnread
                    ? "border-primary/40 ring-primary/20 ring-1"
                    : "border-border/60"
                )}
              >
                {/* Header Row: Version, Type, Channel, Unread dot, and Action buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* Unread Indicator Dot */}
                    {update.isUnread && (
                      <span className="mr-1 flex size-2 shrink-0 rounded-full bg-blue-500 ring-2 ring-blue-500/30" />
                    )}

                    {/* Version Badge with Copy Button */}
                    <InlineCopy
                      text={update.version}
                      label="version"
                      className="border-border/60 bg-muted/60 text-foreground hover:text-primary rounded-md border px-2 py-0.5 font-mono text-xs font-bold"
                    />

                    {/* Type Badge */}
                    <Badge
                      variant="outline"
                      className={`h-5 gap-1 px-1.5 text-[0.625rem] font-medium capitalize ${typeInfo.className}`}
                    >
                      <HugeiconsIcon
                        icon={TypeIcon}
                        strokeWidth={2}
                        className="size-3"
                      />
                      {typeInfo.label}
                    </Badge>

                    {/* Channel Badge */}
                    <Badge
                      variant="outline"
                      className={`h-5 px-1.5 text-[0.625rem] font-medium uppercase ${
                        channelBadgeConfig[update.channel] ||
                        "border-muted text-muted-foreground"
                      }`}
                    >
                      {update.channel}
                    </Badge>

                    {/* Rollout status badge */}
                    {update.status === "rolling_out" && (
                      <Badge
                        variant="outline"
                        className="h-5 gap-1 border-amber-500/30 bg-amber-50/40 text-[0.625rem] font-medium text-amber-600 dark:text-amber-400"
                      >
                        <span className="size-1.5 rounded-full bg-amber-500 ring-2 ring-amber-500/25" />
                        Rolling out 25%
                      </Badge>
                    )}
                  </div>

                  {/* Top Right: Date & Quick Actions */}
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-xs">
                      {formatDate(update.publishedAt)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={(e) => handleCopyNotes(update, e)}
                      title="Copy release notes"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <HugeiconsIcon
                        icon={Copy01Icon}
                        strokeWidth={2}
                        className="size-3.5"
                      />
                    </Button>
                    {update.isUnread && (
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleRead(update.id);
                        }}
                        className="text-muted-foreground hover:text-foreground h-6 px-1.5 text-[0.6875rem]"
                      >
                        Mark read
                      </Button>
                    )}
                  </div>
                </div>

                {/* Title & Summary */}
                <div className="flex flex-col gap-1">
                  <h3 className="text-foreground group-hover:text-primary text-sm font-semibold tracking-tight transition-colors">
                    {update.title}
                  </h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {update.summary}
                  </p>
                </div>

                {/* Security Advisory Alert Callout (if security update) */}
                {update.securityNotice && (
                  <div className="mt-2.5 flex items-start gap-2 rounded-lg border border-rose-500/30 bg-rose-50/50 p-2.5 text-xs text-rose-800 dark:bg-rose-950/20 dark:text-rose-300">
                    <HugeiconsIcon
                      icon={ShieldCheck}
                      strokeWidth={2}
                      className="mt-0.5 size-4 shrink-0 text-rose-600"
                    />
                    <div className="space-y-0.5">
                      <span className="font-semibold">
                        Security Advisory Notice
                      </span>
                      <p className="text-[0.6875rem] leading-relaxed opacity-90">
                        {update.securityNotice}
                      </p>
                    </div>
                  </div>
                )}

                {/* Highlights List */}
                {update.highlights && update.highlights.length > 0 && (
                  <div className="bg-muted/30 border-border/50 mt-3 grid grid-cols-1 gap-1.5 rounded-lg border p-2.5 sm:grid-cols-2">
                    {update.highlights.slice(0, 4).map((h) => (
                      <div
                        key={h}
                        className="text-foreground/90 flex items-center gap-1.5 text-xs"
                      >
                        <HugeiconsIcon
                          icon={CheckmarkCircle01Icon}
                          strokeWidth={2}
                          className="size-3.5 shrink-0 text-emerald-500"
                        />
                        <span className="truncate text-[0.6875rem]">{h}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer: Author, Affected Modules, Commit Hash & Details Trigger */}
                <div className="border-border/40 mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t pt-2.5">
                  {/* Author / Deployer */}
                  <div className="flex items-center gap-2">
                    <Avatar size="sm" className="size-5 after:hidden">
                      {update.author.avatar ? (
                        <AvatarImage
                          src={update.author.avatar}
                          alt={update.author.name}
                        />
                      ) : null}
                      <AvatarFallback className="bg-primary/10 text-primary text-[0.5625rem] font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-foreground text-[0.6875rem] font-medium">
                      {update.author.name}
                    </span>
                    <span className="text-muted-foreground text-[0.625rem]">
                      · {update.author.role}
                    </span>
                  </div>

                  {/* Modules & Commit */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {update.affectedModules.slice(0, 3).map((m) => (
                      <span
                        key={m}
                        className="bg-muted/60 text-muted-foreground rounded px-1.5 py-0.5 text-[0.625rem] font-medium"
                      >
                        {m}
                      </span>
                    ))}
                    {update.commitHash && (
                      <InlineCopy
                        text={update.commitHash}
                        displayValue={`#${update.commitHash}`}
                        label="commit hash"
                        className="text-muted-foreground/80 hover:text-primary ml-1 font-mono text-[0.625rem]"
                        iconSize={11}
                      />
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-1 h-6 gap-1 px-2 text-[0.6875rem]"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails(update);
                      }}
                    >
                      <HugeiconsIcon
                        icon={EyeIcon}
                        strokeWidth={2}
                        className="size-3"
                      />
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
