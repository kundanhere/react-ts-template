import { Area, AreaChart, ResponsiveContainer } from "recharts";

import { Badge } from "@/components/ui/badge";
import type { IFeedback } from "@/types/feedback";

interface IFeedbackStatsCardsProps {
  feedbacks: IFeedback[];
}

export function FeedbackStatsCards({ feedbacks }: IFeedbackStatsCardsProps) {
  const totalCount = feedbacks.length;
  const bugCount = feedbacks.filter((f) => f.type === "bug").length;
  const openBugs = feedbacks.filter(
    (f) => f.type === "bug" && f.status !== "resolved" && f.status !== "closed"
  ).length;
  const criticalBugs = feedbacks.filter(
    (f) =>
      f.type === "bug" &&
      (f.priority === "critical" || f.priority === "high") &&
      f.status !== "resolved" &&
      f.status !== "closed"
  ).length;

  const resolvedCount = feedbacks.filter(
    (f) => f.status === "resolved" || f.status === "closed"
  ).length;
  const inProgressCount = feedbacks.filter(
    (f) => f.status === "in_progress" || f.status === "in_review"
  ).length;

  const avgRating =
    totalCount > 0
      ? (
          feedbacks.reduce((sum, f) => sum + (f.rating || 5), 0) / totalCount
        ).toFixed(1)
      : "5.0";

  const resolvedRate =
    totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 100;

  const stats = [
    {
      id: "total",
      title: "Total Submissions",
      value: totalCount,
      statLine: `${bugCount} bugs · ${totalCount - bugCount} suggestions`,
      color: "var(--primary, #10b981)",
      accentClass: "bg-primary",
      badge: (
        <Badge
          variant="outline"
          className="border-emerald-500/30 bg-emerald-50/50 px-1.5 py-0.5 text-[0.625rem] font-semibold text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"
        >
          +18.4% MoM
        </Badge>
      ),
      data: [
        { v: 4 },
        { v: 6 },
        { v: 5.5 },
        { v: 7 },
        { v: 8.5 },
        { v: 9 },
        { v: totalCount },
      ],
    },
    {
      id: "open-bugs",
      title: "Active Bug Reports",
      value: openBugs,
      statLine:
        criticalBugs > 0
          ? `${criticalBugs} high/critical priority`
          : "All critical issues addressed",
      color: openBugs > 0 ? "#f43f5e" : "var(--primary, #10b981)",
      accentClass: openBugs > 0 ? "bg-rose-500" : "bg-primary",
      badge:
        openBugs > 0 ? (
          <Badge
            variant="outline"
            className="gap-1 border-rose-500/30 bg-rose-50/50 px-1.5 py-0.5 text-[0.625rem] font-semibold text-rose-600 dark:bg-rose-950/20 dark:text-rose-400"
          >
            <span className="size-1 rounded-full bg-rose-500" />
            {criticalBugs > 0 ? "Attention Needed" : "Open"}
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="border-primary/30 bg-primary/10 text-primary gap-1 px-1.5 py-0.5 text-[0.625rem] font-semibold"
          >
            <span className="bg-primary size-1 rounded-full" />
            Clear
          </Badge>
        ),
      data: [{ v: 1 }, { v: 3 }, { v: 2 }, { v: 4 }, { v: 3 }, { v: openBugs }],
    },
    {
      id: "avg-rating",
      title: "Customer Satisfaction",
      value: `${avgRating} / 5.0`,
      statLine: "Based on verified user feedback",
      color: "#eab308",
      accentClass: "bg-amber-500",
      badge: (
        <Badge
          variant="outline"
          className="gap-1 border-amber-500/30 bg-amber-50/50 px-1.5 py-0.5 text-[0.625rem] font-semibold text-amber-600 dark:bg-amber-950/20 dark:text-amber-400"
        >
          ★ 96% Positive
        </Badge>
      ),
      data: [
        { v: 4.2 },
        { v: 4.4 },
        { v: 4.5 },
        { v: 4.3 },
        { v: 4.7 },
        { v: Number(avgRating) },
      ],
    },
    {
      id: "in-progress",
      title: "In Review / Pipeline",
      value: inProgressCount,
      statLine: `${feedbacks.filter((f) => f.type === "feature").length} feature requests logged`,
      color: "#8b5cf6",
      accentClass: "bg-violet-500",
      badge: (
        <Badge
          variant="outline"
          className="gap-1 border-violet-500/30 bg-violet-50/50 px-1.5 py-0.5 text-[0.625rem] font-semibold text-violet-600 dark:bg-violet-950/20 dark:text-violet-400"
        >
          <span className="size-1 rounded-full bg-violet-500" />
          Active Sprint
        </Badge>
      ),
      data: [
        { v: 2 },
        { v: 3 },
        { v: 4 },
        { v: 3.5 },
        { v: 5 },
        { v: inProgressCount },
      ],
    },
    {
      id: "resolved-rate",
      title: "Resolution Velocity",
      value: `${resolvedRate}%`,
      statLine: `${resolvedCount} resolved of ${totalCount} items`,
      color: "#0ea5e9",
      accentClass: "bg-sky-500",
      badge: (
        <Badge
          variant="outline"
          className="gap-1 border-sky-500/30 bg-sky-50/50 px-1.5 py-0.5 text-[0.625rem] font-semibold text-sky-600 dark:bg-sky-950/20 dark:text-sky-400"
        >
          <span className="size-1 rounded-full bg-sky-500" />
          Healthy SLA
        </Badge>
      ),
      data: [
        { v: 50 },
        { v: 62 },
        { v: 58 },
        { v: 70 },
        { v: 80 },
        { v: resolvedRate },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {stats.map((kpi) => (
        <div
          key={kpi.id}
          className="border-border/75 bg-card relative flex flex-col justify-between overflow-hidden rounded-xl border p-3.5 shadow-xs transition-shadow hover:shadow-sm"
        >
          <div
            className={`absolute top-0 right-0 left-0 h-[2.5px] ${kpi.accentClass}`}
            style={{
              backgroundColor: kpi.color.startsWith("var")
                ? undefined
                : kpi.color,
            }}
          />

          <div className="flex items-center justify-between gap-1 pt-0.5">
            <span className="text-muted-foreground truncate text-xs font-semibold tracking-tight">
              {kpi.title}
            </span>
            {kpi.badge}
          </div>

          <div className="mt-2.5 flex items-end justify-between gap-2">
            <div className="flex min-w-0 flex-col">
              <div className="text-foreground text-2xl leading-none font-bold tracking-tight">
                {kpi.value}
              </div>
              <div className="text-muted-foreground mt-1 truncate text-[11px] font-medium">
                {kpi.statLine}
              </div>
            </div>

            <div className="h-8 w-20 shrink-0 overflow-hidden rounded">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={kpi.data}
                  margin={{ top: 2, right: 0, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id={`kpi-grad-${kpi.id}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={
                          kpi.color.startsWith("var") ? "#10b981" : kpi.color
                        }
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="100%"
                        stopColor={
                          kpi.color.startsWith("var") ? "#10b981" : kpi.color
                        }
                        stopOpacity={0.0}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke={kpi.color.startsWith("var") ? "#10b981" : kpi.color}
                    strokeWidth={1.8}
                    fill={`url(#kpi-grad-${kpi.id})`}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
