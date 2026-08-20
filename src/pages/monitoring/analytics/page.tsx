import {
  AnalyticsUpIcon,
  CheckmarkCircle02Icon,
  Shield01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { PageWrapper } from "@/components/page-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AnalyticsPage() {
  const metrics = [
    {
      title: "Total Active Users",
      value: "1,248",
      change: "+12% this month",
      icon: UserGroupIcon,
    },
    {
      title: "Evaluated Policies",
      value: "45,890",
      change: "+8.4% daily avg",
      icon: Shield01Icon,
    },
    {
      title: "Active Sessions",
      value: "342",
      change: "24 peak concurrent",
      icon: AnalyticsUpIcon,
    },
    {
      title: "System Uptime",
      value: "99.98%",
      change: "0 incidents reported",
      icon: CheckmarkCircle02Icon,
    },
  ];

  return (
    <PageWrapper
      title="Analytics & Metrics"
      subtitle="Real-time security analytics, identity evaluations, and system traffic overview."
      action={
        <div className="flex items-center gap-2">
          <Button variant="outline">Export Report</Button>
          <Button>Refresh Data</Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m) => (
            <div
              key={m.title}
              className="bg-card flex flex-col gap-2 rounded-xl border p-5 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm font-medium">
                  {m.title}
                </span>
                <div className="bg-primary/10 text-primary rounded-lg p-2">
                  <HugeiconsIcon icon={m.icon} size={20} strokeWidth={2} />
                </div>
              </div>
              <div className="text-3xl font-bold tracking-tight">{m.value}</div>
              <p className="text-muted-foreground text-xs">{m.change}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="bg-card flex flex-col gap-4 rounded-xl border p-6 shadow-xs lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                Policy Evaluation Traffic
              </h2>
              <Badge variant="secondary">Live Stream</Badge>
            </div>
            <div className="bg-muted/40 text-muted-foreground flex h-64 items-center justify-center rounded-lg border border-dashed text-sm">
              Interactive evaluation traffic chart visualizer
            </div>
          </div>

          <div className="bg-card flex flex-col gap-4 rounded-xl border p-6 shadow-xs">
            <h2 className="text-lg font-semibold">Top Access Requests</h2>
            <div className="flex flex-col gap-3">
              {[
                {
                  module: "Users Directory",
                  count: "14,290 reqs",
                  status: "Normal",
                },
                {
                  module: "Roles & Permissions",
                  count: "8,920 reqs",
                  status: "High",
                },
                {
                  module: "Audit Log Export",
                  count: "3,110 reqs",
                  status: "Normal",
                },
                {
                  module: "Security Settings",
                  count: "1,040 reqs",
                  status: "Low",
                },
              ].map((item) => (
                <div
                  key={item.module}
                  className="flex items-center justify-between border-b pb-2 last:border-b-0"
                >
                  <div>
                    <div className="text-sm font-medium">{item.module}</div>
                    <div className="text-muted-foreground text-xs">
                      {item.count}
                    </div>
                  </div>
                  <Badge variant="outline">{item.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
