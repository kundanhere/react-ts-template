import { Area, AreaChart, ResponsiveContainer } from "recharts";

import { Badge } from "@/components/ui/badge";
import type { IAnalyticsKpiCardsProps } from "@/types/monitoring/analytics";

export function AnalyticsKpiCards({
  users,
  sessions,
  roles,
  policies,
}: IAnalyticsKpiCardsProps) {
  const activeCount = users.filter(
    (u) => u.status === "active" && !u.locked
  ).length;
  const lockedCount = users.filter((u) => u.locked).length;
  const rootRolesCount = roles.filter((r) => !r.parentId).length;
  const denyPoliciesCount = policies.filter((p) => p.effect === "DENY").length;
  const allowPoliciesCount = policies.filter(
    (p) => p.effect === "ALLOW"
  ).length;
  const uniqueUsersInSessions = new Set(sessions.map((s) => s.userId)).size;
  const lockedOrInactiveUsers = users.filter(
    (u) => u.locked || u.status !== "active"
  );

  const topKpis = [
    {
      id: "users",
      title: "Principals",
      subtitle: "Users & Accounts",
      value: users.length,
      statLine: `${activeCount} active · ${lockedOrInactiveUsers.length} suspended`,
      color: "var(--primary, #10b981)",
      accentClass: "bg-primary",
      badge: (
        <Badge
          variant="outline"
          className="border-emerald-500/30 bg-emerald-50/50 px-1.5 py-0.5 text-[0.625rem] font-semibold text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"
        >
          +14.2%
        </Badge>
      ),
      data: [
        { v: 3 },
        { v: 4 },
        { v: 4.5 },
        { v: 4.2 },
        { v: 5.5 },
        { v: 6 },
        { v: 7 },
      ],
    },
    {
      id: "sessions",
      title: "Active Sessions",
      subtitle: "Live Token Instances",
      value: sessions.length,
      statLine: `${uniqueUsersInSessions} active clients online`,
      color: "#0ea5e9",
      accentClass: "bg-sky-500",
      badge: (
        <Badge
          variant="outline"
          className="gap-1 border-sky-500/30 bg-sky-50/50 px-1.5 py-0.5 text-[0.625rem] font-semibold text-sky-600 dark:bg-sky-950/20 dark:text-sky-400"
        >
          <span className="size-1 rounded-full bg-sky-500" />
          Healthy
        </Badge>
      ),
      data: [
        { v: 2 },
        { v: 3.5 },
        { v: 2.8 },
        { v: 4.6 },
        { v: 3.9 },
        { v: 4.8 },
        { v: 5 },
      ],
    },
    {
      id: "roles",
      title: "Assigned Roles",
      subtitle: "Hierarchy Definitions",
      value: roles.length,
      statLine: `${rootRolesCount} custom · ${roles.length - rootRolesCount} inherited`,
      color: "#8b5cf6",
      accentClass: "bg-violet-500",
      badge: (
        <Badge
          variant="outline"
          className="gap-1 border-violet-500/30 bg-violet-50/50 px-1.5 py-0.5 text-[0.625rem] font-semibold text-violet-600 dark:bg-violet-950/20 dark:text-violet-400"
        >
          <span className="size-1 rounded-full bg-violet-500" />6 Defined
        </Badge>
      ),
      data: [
        { v: 3 },
        { v: 4 },
        { v: 4.2 },
        { v: 4.8 },
        { v: 5.2 },
        { v: 5.8 },
        { v: 6 },
      ],
    },
    {
      id: "policies",
      title: "IAM Policy Bindings",
      subtitle: "Declarative Rule Scope",
      value: policies.length,
      statLine: `${allowPoliciesCount} allow · ${denyPoliciesCount} explicit deny`,
      color: "#14b8a6",
      accentClass: "bg-teal-500",
      badge: (
        <Badge
          variant="outline"
          className="gap-1 border-teal-500/30 bg-teal-50/50 px-1.5 py-0.5 text-[0.625rem] font-semibold text-teal-600 dark:bg-teal-950/20 dark:text-teal-400"
        >
          <span className="size-1 rounded-full bg-teal-500" />
          100% Active
        </Badge>
      ),
      data: [
        { v: 4 },
        { v: 5 },
        { v: 5.8 },
        { v: 6.2 },
        { v: 7 },
        { v: 7.6 },
        { v: 8 },
      ],
    },
    {
      id: "locked",
      title: "Security Findings",
      subtitle: "Threat & Anomaly Guard",
      value: lockedCount,
      statLine:
        lockedCount > 0 ? "1 account requires review" : "0 active violations",
      color: lockedCount > 0 ? "#f43f5e" : "var(--primary, #10b981)",
      accentClass: lockedCount > 0 ? "bg-rose-500" : "bg-primary",
      badge:
        lockedCount > 0 ? (
          <Badge
            variant="outline"
            className="gap-1 border-rose-500/30 bg-rose-50/50 px-1.5 py-0.5 text-[0.625rem] font-semibold text-rose-600 dark:bg-rose-950/20 dark:text-rose-400"
          >
            <span className="size-1 rounded-full bg-rose-500" />
            Action Required
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="border-primary/30 bg-primary/10 text-primary gap-1 px-1.5 py-0.5 text-[0.625rem] font-semibold"
          >
            <span className="bg-primary size-1 rounded-full" />
            Protected
          </Badge>
        ),
      data: [
        { v: 0 },
        { v: 0.2 },
        { v: 0 },
        { v: 0.8 },
        { v: 0.3 },
        { v: 1 },
        { v: 1 },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {topKpis.map((kpi) => (
        <div
          key={kpi.id}
          className="border-border/75 bg-card relative flex flex-col justify-between overflow-hidden rounded-xl border p-3.5 shadow-xs"
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
                        stopColor={kpi.color}
                        stopOpacity={0.4}
                      />
                      <stop
                        offset="100%"
                        stopColor={kpi.color}
                        stopOpacity={0.0}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke={kpi.color}
                    strokeWidth={1.8}
                    fill={`url(#kpi-grad-${kpi.id})`}
                    isAnimationActive
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
