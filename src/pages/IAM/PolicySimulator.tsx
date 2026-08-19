import { useState } from "react";

import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { PageWrapper } from "@/components/page-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PolicySimulatorPage() {
  const [evaluated, setEvaluated] = useState(true);

  return (
    <PageWrapper
      title="Policy Engine Simulator"
      subtitle="Interactive authorization simulator for testing policies and role overrides prior to deployment."
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-card flex flex-col gap-4 rounded-xl border p-6 shadow-xs">
          <h2 className="text-lg font-semibold">Simulation Parameters</h2>
          <div className="flex flex-col gap-2">
            <label className="text-muted-foreground text-xs font-medium">
              Select User Context
            </label>
            <Input defaultValue="Kundan Gupta (ID: 42)" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-muted-foreground text-xs font-medium">
              Action
            </label>
            <Input defaultValue="iam:UpdateUserRole" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-muted-foreground text-xs font-medium">
              Resource ARN
            </label>
            <Input defaultValue="arn:iam:users:102" />
          </div>
          <Button onClick={() => setEvaluated(true)} className="mt-2">
            Run Policy Simulation
          </Button>
        </div>

        <div className="bg-card flex flex-col gap-4 rounded-xl border p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Simulation Trace</h2>
            <Badge variant="default" className="gap-1">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
              {evaluated ? "ALLOWED" : "IDLE"}
            </Badge>
          </div>

          <div className="bg-muted/40 flex flex-col gap-2 rounded-lg border p-4 font-mono text-xs">
            <div className="font-bold text-emerald-600">STATUS: ALLOWED</div>
            <div className="text-muted-foreground">
              Matched Policy: Policy #12 ("Global User Admin Policy")
            </div>
            <div className="mt-1 border-t pt-2">Evaluation Steps:</div>
            <ol className="text-muted-foreground list-decimal space-y-1 pl-4">
              <li>Evaluated Direct User Overrides &rarr; No DENY match</li>
              <li>
                Evaluated Assigned Role "IAM Administrator" &rarr; ALLOW matched
              </li>
              <li>Evaluated Time-bound condition &rarr; Passed</li>
            </ol>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
