import {
  CheckmarkCircle02Icon,
  GitBranchIcon,
  Notification01Icon,
  ShieldCheck,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

import { Badge } from "@/components/ui/badge";
import type { ISystemUpdate } from "@/types/updates";

interface IUpdateStatsCardsProps {
  updates: ISystemUpdate[];
}

export function UpdateStatsCards({ updates }: IUpdateStatsCardsProps) {
  const totalCount = updates.length;
  const securityCount = updates.filter((u) => u.type === "security").length;
  const majorCount = updates.filter((u) => u.type === "major").length;
  const unreadCount = updates.filter((u) => u.isUnread).length;
  const rollingOutCount = updates.filter(
    (u) => u.status === "rolling_out"
  ).length;

  const latestDeployed =
    updates.find((u) => u.status === "deployed") || updates[0];

  const stats = [
    {
      id: "latest",
      title: "Current Active Release",
      value: latestDeployed ? latestDeployed.version : "v2.4.0",
      statLine: latestDeployed
        ? `${latestDeployed.title}`
        : "Production Cluster",
      icon: GitBranchIcon,
      color: "var(--primary, #10b981)",
      accentClass: "bg-primary",
      badge: (
        <Badge
          variant="outline"
          className="border-emerald-500/30 bg-emerald-50/50 px-1.5 py-0.5 text-[0.625rem] font-semibold text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"
        >
          100% Deployed
        </Badge>
      ),
      data: [
        { v: 2 },
        { v: 4 },
        { v: 5 },
        { v: 6 },
        { v: 8 },
        { v: 10 },
        { v: 12 },
      ],
    },
    {
      id: "unread",
      title: "New Notifications",
      value: `${unreadCount} Unread`,
      statLine: `${rollingOutCount} rolling out in canary preview`,
      icon: Notification01Icon,
      color: "#3b82f6",
      accentClass: "bg-blue-500",
      badge:
        unreadCount > 0 ? (
          <Badge
            variant="outline"
            className="border-blue-500/30 bg-blue-50/50 px-1.5 py-0.5 text-[0.625rem] font-semibold text-blue-600 dark:bg-blue-950/20 dark:text-blue-400"
          >
            Action Required
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="border-muted bg-muted/40 text-muted-foreground px-1.5 py-0.5 text-[0.625rem] font-medium"
          >
            All Read
          </Badge>
        ),
      data: [
        { v: 1 },
        { v: 2 },
        { v: 3 },
        { v: 2 },
        { v: 4 },
        { v: 3 },
        { v: unreadCount || 1 },
      ],
    },
    {
      id: "security",
      title: "Security & Patches",
      value: `${securityCount} Applied`,
      statLine: "0 zero-day vulnerabilities reported",
      icon: ShieldCheck,
      color: "#8b5cf6",
      accentClass: "bg-violet-500",
      badge: (
        <Badge
          variant="outline"
          className="border-violet-500/30 bg-violet-50/50 px-1.5 py-0.5 text-[0.625rem] font-semibold text-violet-600 dark:bg-violet-950/20 dark:text-violet-400"
        >
          Compliant
        </Badge>
      ),
      data: [
        { v: 1 },
        { v: 1.5 },
        { v: 2 },
        { v: 2.2 },
        { v: 2.8 },
        { v: 3 },
        { v: securityCount },
      ],
    },
    {
      id: "total",
      title: "Total System Releases",
      value: totalCount,
      statLine: `${majorCount} major milestones · ${totalCount - majorCount} service updates`,
      icon: CheckmarkCircle02Icon,
      color: "#f59e0b",
      accentClass: "bg-amber-500",
      badge: (
        <Badge
          variant="outline"
          className="border-amber-500/30 bg-amber-50/50 px-1.5 py-0.5 text-[0.625rem] font-semibold text-amber-600 dark:bg-amber-950/20 dark:text-amber-400"
        >
          Platform Health 99.98%
        </Badge>
      ),
      data: [
        { v: 2 },
        { v: 3 },
        { v: 4 },
        { v: 5 },
        { v: 6 },
        { v: 6.5 },
        { v: totalCount },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div
            key={s.id}
            className="bg-card hover:border-border/80 group border-border/60 relative flex flex-col justify-between overflow-hidden rounded-xl border p-3.5 shadow-2xs transition-colors"
          >
            {/* Top Row: Title & Badge */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="bg-muted/60 text-muted-foreground group-hover:text-foreground flex size-7 items-center justify-center rounded-lg transition-colors">
                  <HugeiconsIcon
                    icon={Icon}
                    strokeWidth={2}
                    className="size-4"
                  />
                </div>
                <span className="text-muted-foreground text-xs font-medium">
                  {s.title}
                </span>
              </div>
              {s.badge}
            </div>

            {/* Middle: Metric & Sparkline */}
            <div className="mt-3 flex items-baseline justify-between gap-2">
              <span className="text-foreground truncate text-xl font-bold tracking-tight">
                {s.value}
              </span>
              <div className="h-9 w-20 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={s.data}
                    margin={{ top: 2, right: 2, left: 2, bottom: 2 }}
                  >
                    <defs>
                      <linearGradient
                        id={`grad-${s.id}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={s.color}
                          stopOpacity={0.35}
                        />
                        <stop
                          offset="95%"
                          stopColor={s.color}
                          stopOpacity={0.0}
                        />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="v"
                      stroke={s.color}
                      strokeWidth={1.75}
                      fillOpacity={1}
                      fill={`url(#grad-${s.id})`}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bottom Subtitle / Detail */}
            <p className="text-muted-foreground mt-1 truncate text-[0.6875rem] leading-normal">
              {s.statLine}
            </p>
          </div>
        );
      })}
    </div>
  );
}
