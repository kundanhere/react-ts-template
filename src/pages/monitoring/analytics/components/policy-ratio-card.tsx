import { Shield01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router-dom";
import { Cell, Pie, PieChart } from "recharts";

import { Badge } from "@/components/ui/badge";
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
import type { IPolicyRatioCardProps } from "@/types/monitoring/analytics";

export function PolicyRatioCard({ policies }: IPolicyRatioCardProps) {
  const allowPoliciesCount = policies.filter(
    (p) => p.effect === "ALLOW"
  ).length;
  const denyPoliciesCount = policies.filter((p) => p.effect === "DENY").length;
  const totalPolicyCount = allowPoliciesCount + denyPoliciesCount || 1;

  const wildcardPoliciesCount = policies.filter((p) =>
    p.resources.includes("*")
  ).length;

  const conditionalPoliciesCount = policies.filter(
    (p) => Object.keys(p.conditions || {}).length > 0
  ).length;

  const policyRatioData = [
    {
      name: "Allow Permissions",
      value: allowPoliciesCount,
      fill: "var(--primary, #10b981)",
    },
    { name: "Deny Policies", value: denyPoliciesCount, fill: "#f43f5e" },
  ];

  const policyRatioConfig = {
    allow: {
      label: "Allow Permissions",
      color: "var(--primary, #10b981)",
    },
    deny: {
      label: "Deny Policies",
      color: "#f43f5e",
    },
  } satisfies ChartConfig;

  return (
    <Card className="gap-0 py-0 shadow-xs">
      <CardHeader className="border-border/40 border-b px-4 py-3">
        <CardTitle className="text-sm font-semibold">
          Policy Enforcement Ratio
        </CardTitle>
        <CardDescription className="text-xs">
          Declarative Allow permissions vs explicit Deny rules.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center px-4 py-3">
        <ChartContainer
          config={policyRatioConfig}
          className="aspect-square h-34 w-full"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={policyRatioData}
              dataKey="value"
              nameKey="name"
              innerRadius={42}
              outerRadius={62}
              strokeWidth={3}
              stroke="var(--background)"
            >
              {policyRatioData.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>

        <div className="divide-border/40 mt-1.5 w-full divide-y text-xs">
          <div className="flex items-center justify-between py-1.5">
            <span className="flex items-center gap-2 font-medium">
              <span className="bg-primary size-1.5 rounded-full" />
              ALLOW Rules
            </span>
            <Badge
              variant="outline"
              className="border-primary/30 bg-primary/10 text-primary px-1.5 py-0.5 text-[0.625rem] font-normal"
            >
              {allowPoliciesCount} rules (
              {((allowPoliciesCount / totalPolicyCount) * 100).toFixed(0)}
              %)
            </Badge>
          </div>
          <div className="flex items-center justify-between py-1.5">
            <span className="flex items-center gap-2 font-medium">
              <span className="bg-destructive size-1.5 rounded-full" />
              DENY Rules
            </span>
            <Badge
              variant="outline"
              className="text-destructive border-destructive/30 bg-destructive/10 px-1.5 py-0.5 text-[0.625rem] font-normal"
            >
              {denyPoliciesCount} rules (
              {((denyPoliciesCount / totalPolicyCount) * 100).toFixed(0)}
              %)
            </Badge>
          </div>
          <div className="text-muted-foreground flex items-center justify-between py-1 text-[11px]">
            <span>Wildcard (*) Target Scope</span>
            <span className="text-foreground font-mono font-semibold">
              {wildcardPoliciesCount}
            </span>
          </div>
          <div className="text-muted-foreground flex items-center justify-between py-1 text-[11px]">
            <span>MFA / Conditional Rules</span>
            <span className="text-foreground font-mono font-semibold">
              {conditionalPoliciesCount}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="text-muted-foreground mt-auto flex w-full items-center justify-between border-t px-4 py-2.5 text-xs">
        <div className="flex items-center gap-1.5">
          <HugeiconsIcon icon={Shield01Icon} size={14} />
          <span>{policies.length} Active Bindings</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-primary h-6 px-2 text-[11px]"
        >
          <Link to="/iam/policies">Policies →</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
