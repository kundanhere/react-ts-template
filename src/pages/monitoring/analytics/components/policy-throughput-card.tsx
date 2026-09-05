import * as React from "react";

import { Globe02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  IPolicyThroughputCardProps,
  TimeRange,
} from "@/types/monitoring/analytics";

export function PolicyThroughputCard({
  timeRange,
  setTimeRange,
}: IPolicyThroughputCardProps) {
  const traffic24h = React.useMemo(
    () => [
      { time: "00:00", allowed: 45, denied: 3 },
      { time: "04:00", allowed: 28, denied: 1 },
      { time: "08:00", allowed: 165, denied: 14 },
      { time: "12:00", allowed: 340, denied: 28 },
      { time: "16:00", allowed: 480, denied: 42 },
      { time: "20:00", allowed: 290, denied: 19 },
      { time: "23:59", allowed: 110, denied: 6 },
    ],
    []
  );

  const traffic7d = React.useMemo(
    () => [
      { time: "Mon", allowed: 1420, denied: 110 },
      { time: "Tue", allowed: 1680, denied: 145 },
      { time: "Wed", allowed: 1890, denied: 98 },
      { time: "Thu", allowed: 2100, denied: 165 },
      { time: "Fri", allowed: 1950, denied: 130 },
      { time: "Sat", allowed: 820, denied: 45 },
      { time: "Sun", allowed: 640, denied: 30 },
    ],
    []
  );

  const traffic30d = React.useMemo(
    () => [
      { time: "W1", allowed: 8400, denied: 620 },
      { time: "W2", allowed: 9800, denied: 740 },
      { time: "W3", allowed: 11200, denied: 890 },
      { time: "W4", allowed: 10450, denied: 810 },
    ],
    []
  );

  const activeTrafficData = React.useMemo(() => {
    if (timeRange === "24h") return traffic24h;
    if (timeRange === "7d") return traffic7d;
    return traffic30d;
  }, [timeRange, traffic24h, traffic7d, traffic30d]);

  const trafficChartConfig = {
    allowed: {
      label: "Allowed Calls",
      color: "var(--primary, #10b981)",
    },
    denied: {
      label: "Denied / Blocked",
      color: "#f43f5e",
    },
  } satisfies ChartConfig;

  const getRangeLabel = (range: TimeRange) => {
    if (range === "24h") return "24 Hours";
    if (range === "7d") return "7 Days";
    return "30 Days";
  };

  return (
    <Card className="gap-0 py-0 shadow-xs lg:col-span-2">
      <CardHeader className="border-border/40 flex flex-col justify-between gap-2.5 border-b px-4 py-3 sm:flex-row sm:items-center">
        <div>
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <span>Policy Evaluation Throughput</span>
            <Badge
              variant="outline"
              className="border-primary/30 bg-primary/10 text-primary gap-1.5 px-2 py-0.5 text-[0.625rem] font-normal"
            >
              <span className="bg-primary size-1.5 animate-pulse rounded-full" />
              Active
            </Badge>
          </CardTitle>
          <CardDescription className="mt-0.5 text-xs">
            Real-time authorization decisions evaluated across all system API
            surfaces.
          </CardDescription>
        </div>

        <CardAction>
          <Tabs
            value={timeRange}
            onValueChange={(val) => val && setTimeRange(val as TimeRange)}
            className="gap-0"
          >
            <TabsList className="bg-muted/40 border-border/60 h-7 border p-0.5">
              {(["24h", "7d", "30d"] as const).map((range) => (
                <TabsTrigger
                  key={range}
                  value={range}
                  className="h-full px-2.5 py-0 text-xs font-medium"
                >
                  {getRangeLabel(range)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardAction>
      </CardHeader>

      <CardContent className="px-4 py-3">
        <ChartContainer
          config={trafficChartConfig}
          className="aspect-auto h-55 w-full"
        >
          <AreaChart
            data={activeTrafficData}
            margin={{ top: 8, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="themeAllowedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--primary)"
                  stopOpacity={0.35}
                />
                <stop
                  offset="95%"
                  stopColor="var(--primary)"
                  stopOpacity={0.0}
                />
              </linearGradient>
              <linearGradient id="themeDeniedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--border)"
              opacity={0.5}
            />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={6}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={6} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="allowed"
              stroke="var(--primary)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#themeAllowedGrad)"
            />
            <Area
              type="monotone"
              dataKey="denied"
              stroke="#f43f5e"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#themeDeniedGrad)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="text-muted-foreground mt-auto flex w-full items-center justify-between border-t px-4 py-2.5 text-xs">
        <div className="flex items-center gap-1.5">
          <HugeiconsIcon icon={Globe02Icon} size={14} />
          <span>Global Realtime Pipeline</span>
        </div>
        <span className="text-foreground font-mono text-[0.6875rem] font-medium">
          99.98% SLA Availability
        </span>
      </CardFooter>
    </Card>
  );
}
