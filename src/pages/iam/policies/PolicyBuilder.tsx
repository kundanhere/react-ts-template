import { ArrowLeft01Icon, CodeIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function PolicyBuilderPage() {
  return (
    <div className="flex flex-col gap-6 py-4">
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="mb-2"
          render={<Link to="/iam/policies" />}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} className="mr-1" />
          Back to Policies
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">
          Policy Builder
        </h1>
        <p className="text-muted-foreground text-sm">
          Construct custom JSON access policies with explicit ALLOW/DENY rules.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-card flex flex-col gap-4 rounded-xl border p-6 shadow-xs">
          <h2 className="text-lg font-semibold">Policy Configuration</h2>
          <div className="flex flex-col gap-2">
            <label className="text-muted-foreground text-xs font-medium">
              Policy Name
            </label>
            <Input placeholder="e.g. Finance Audit Override" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-muted-foreground text-xs font-medium">
              Effect
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="radio"
                  name="effect"
                  value="ALLOW"
                  defaultChecked
                  className="accent-primary"
                />
                ALLOW
              </label>
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="radio"
                  name="effect"
                  value="DENY"
                  className="accent-primary"
                />
                DENY (Overrides ALLOWs)
              </label>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-muted-foreground text-xs font-medium">
              Resource Pattern
            </label>
            <Input placeholder="e.g. iam/users/*" />
          </div>
          <Button className="mt-4">Save Policy</Button>
        </div>

        <div className="bg-card flex flex-col gap-3 rounded-xl border p-6 shadow-xs">
          <div className="text-primary flex items-center gap-2 font-medium">
            <HugeiconsIcon icon={CodeIcon} size={18} />
            <span>Policy JSON Preview</span>
          </div>
          <Textarea
            className="bg-muted/40 h-64 font-mono text-xs"
            readOnly
            value={JSON.stringify(
              {
                Version: "2026-08-19",
                Statement: [
                  {
                    Sid: "VisualPolicyBuilder",
                    Effect: "ALLOW",
                    Action: ["iam:Read", "iam:List"],
                    Resource: "arn:aws:iam::123456789012:user/*",
                  },
                ],
              },
              null,
              2
            )}
          />
        </div>
      </div>
    </div>
  );
}
