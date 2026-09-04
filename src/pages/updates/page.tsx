import * as React from "react";

import {
  Add01Icon,
  CheckmarkCircle02Icon,
  Notification01Icon,
  RefreshIcon,
  Table01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { PageWrapper } from "@/components/page-wrapper";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import type { ISystemUpdate } from "@/types/updates";
import { getItem, setItem } from "@/utils/local-storage";

import { PublishUpdateDialog } from "./components/publish-update-dialog";
import { UpdateDetailDialog } from "./components/update-detail-dialog";
import { UpdateStatsCards } from "./components/update-stats-cards";
import { UpdatesFeed } from "./components/updates-feed";
import { UpdatesTable } from "./components/updates-table";
import { INITIAL_UPDATES } from "./data/mock-updates";

const LS_KEY = "sentry_system_updates_v1";

export default function UpdatesPage() {
  const [updates, setUpdates] = React.useState<ISystemUpdate[]>([]);
  const [activeTab, setActiveTab] = React.useState<"feed" | "table">("feed");
  const [inspectUpdate, setInspectUpdate] =
    React.useState<ISystemUpdate | null>(null);
  const [isPublishOpen, setIsPublishOpen] = React.useState(false);

  // Initialize data from local storage or fallback to mock updates
  React.useEffect(() => {
    const cached = getItem<any[]>(LS_KEY);
    if (cached && Array.isArray(cached) && cached.length > 0) {
      const parsed: ISystemUpdate[] = cached.map((item) => ({
        ...item,
        publishedAt: new Date(item.publishedAt),
      }));
      setUpdates(parsed);
    } else {
      setUpdates(INITIAL_UPDATES);
      setItem(LS_KEY, INITIAL_UPDATES);
    }
  }, []);

  const handleToggleRead = React.useCallback((updateId: string) => {
    setUpdates((prev) => {
      const next = prev.map((u) =>
        u.id === updateId ? { ...u, isUnread: !u.isUnread } : u
      );
      setItem(LS_KEY, next);
      return next;
    });
  }, []);

  const handleMarkAllRead = React.useCallback(() => {
    setUpdates((prev) => {
      const next = prev.map((u) => ({ ...u, isUnread: false }));
      setItem(LS_KEY, next);
      return next;
    });
    toast.success("All system release notifications marked as read");
  }, []);

  const handlePublishUpdate = React.useCallback((newUpdate: ISystemUpdate) => {
    setUpdates((prev) => {
      const next = [newUpdate, ...prev];
      setItem(LS_KEY, next);
      return next;
    });
  }, []);

  const handleDeleteUpdates = React.useCallback((ids: string[]) => {
    setUpdates((prev) => {
      const next = prev.filter((u) => !ids.includes(u.id));
      setItem(LS_KEY, next);
      return next;
    });
    toast.success(
      `Removed ${ids.length} update release log${ids.length > 1 ? "s" : ""}`
    );
  }, []);

  const handleResetDefaults = React.useCallback(() => {
    setUpdates(INITIAL_UPDATES);
    setItem(LS_KEY, INITIAL_UPDATES);
    toast.success("System updates reloaded to official release registry");
  }, []);

  const unreadCount = React.useMemo(
    () => updates.filter((u) => u.isUnread).length,
    [updates]
  );

  return (
    <PageWrapper
      title="System Updates & Release Notes"
      subtitle="Latest platform enhancements, security advisories, and system notification broadcasts."
    >
      <div className="flex flex-col gap-5">
        {/* Top Controls Bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* View Toggle Tabs */}
          <div className="flex items-center gap-2">
            <div className="bg-muted/60 border-border/50 flex items-center gap-1 rounded-lg border p-0.5">
              <button
                type="button"
                onClick={() => setActiveTab("feed")}
                className={`flex h-7 cursor-pointer items-center gap-1.5 rounded-md px-3 text-xs font-medium transition-colors ${
                  activeTab === "feed"
                    ? "bg-background text-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <HugeiconsIcon
                  icon={Notification01Icon}
                  strokeWidth={2}
                  className="size-3.5"
                />
                Notifications & Feed
                {unreadCount > 0 && (
                  <span className="flex size-4 items-center justify-center rounded-full bg-blue-600 text-[10px] leading-none font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("table")}
                className={`flex h-7 cursor-pointer items-center gap-1.5 rounded-md px-3 text-xs font-medium transition-colors ${
                  activeTab === "table"
                    ? "bg-background text-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <HugeiconsIcon
                  icon={Table01Icon}
                  strokeWidth={2}
                  className="size-3.5"
                />
                Changelog Registry
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllRead}
                className="h-8 gap-1.5 text-xs"
              >
                <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  strokeWidth={2}
                  className="size-3.5"
                />
                Mark all read
              </Button>
            )}

            <Button
              variant="outline"
              size="icon-sm"
              onClick={handleResetDefaults}
              title="Reset to default updates"
              className="size-8"
            >
              <HugeiconsIcon
                icon={RefreshIcon}
                strokeWidth={2}
                className="size-3.5"
              />
              <span className="sr-only">Reset defaults</span>
            </Button>

            <Button
              size="sm"
              onClick={() => setIsPublishOpen(true)}
              className="h-8 gap-1.5 text-xs"
            >
              <HugeiconsIcon
                icon={Add01Icon}
                strokeWidth={2}
                className="size-3.5"
              />
              Broadcast Release
            </Button>
          </div>
        </div>

        {/* Top KPI Metrics Cards */}
        <UpdateStatsCards updates={updates} />

        {/* View Switcher: Feed vs Registry Table */}
        {activeTab === "feed" ? (
          <UpdatesFeed
            updates={updates}
            onViewDetails={(u) => setInspectUpdate(u)}
            onToggleRead={handleToggleRead}
          />
        ) : (
          <UpdatesTable
            updates={updates}
            onViewDetails={(u) => setInspectUpdate(u)}
            onToggleRead={handleToggleRead}
            onDeleteUpdates={handleDeleteUpdates}
            onNewUpdateClick={() => setIsPublishOpen(true)}
          />
        )}

        {/* Release Notes Inspector Dialog */}
        <UpdateDetailDialog
          update={inspectUpdate}
          open={!!inspectUpdate}
          onOpenChange={(open) => !open && setInspectUpdate(null)}
          onToggleRead={handleToggleRead}
        />

        {/* Broadcast / Publish New Update Dialog */}
        <PublishUpdateDialog
          open={isPublishOpen}
          onOpenChange={setIsPublishOpen}
          onPublishUpdate={handlePublishUpdate}
        />
      </div>
    </PageWrapper>
  );
}
