import { Link } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";

import { Button } from "@/components/ui/button";
import {
  Card,
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
import type { ITopAccessModulesCardProps } from "@/types/monitoring/analytics";

export function TopAccessModulesCard({ modules }: ITopAccessModulesCardProps) {
  const moduleTrafficData = [
    { module: "Users", requests: 1420, fill: "var(--chart-1, #10b981)" },
    { module: "Payments", requests: 980, fill: "var(--chart-2, #0ea5e9)" },
    { module: "Invoices", requests: 750, fill: "var(--chart-3, #14b8a6)" },
    { module: "Roles", requests: 620, fill: "var(--chart-4, #8b5cf6)" },
    { module: "Tasks", requests: 430, fill: "var(--chart-5, #f59e0b)" },
    { module: "Content", requests: 310, fill: "var(--chart-1, #059669)" },
  ];

  const moduleTrafficConfig = {
    requests: {
      label: "Request Volume",
      color: "var(--primary, #10b981)",
    },
  } satisfies ChartConfig;

  return (
    <Card className="gap-0 py-0 shadow-xs">
      <CardHeader className="border-border/40 border-b px-4 py-3">
        <CardTitle className="text-sm font-semibold">
          Top Access Modules
        </CardTitle>
        <CardDescription className="text-xs">
          Authorization frequency per functional module ({modules.length}{" "}
          registered).
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 py-3">
        <ChartContainer
          config={moduleTrafficConfig}
          className="aspect-auto h-55 w-full"
        >
          <BarChart
            data={moduleTrafficData}
            layout="vertical"
            margin={{ top: 0, right: 10, left: 5, bottom: 0 }}
          >
            <CartesianGrid
              horizontal={false}
              strokeDasharray="3 3"
              stroke="var(--border)"
              opacity={0.5}
            />
            <XAxis type="number" tickLine={false} axisLine={false} />
            <YAxis
              dataKey="module"
              type="category"
              tickLine={false}
              axisLine={false}
              width={65}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="requests" radius={[0, 4, 4, 0]}>
              {moduleTrafficData.map((entry) => (
                <Cell key={entry.module} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="text-muted-foreground mt-auto flex w-full items-center justify-between border-t px-4 py-2.5 text-xs">
        <span>6 Active Pipelines</span>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-primary h-6 px-2 text-[11px]"
        >
          <Link to="/iam/modules">Manage Modules →</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
