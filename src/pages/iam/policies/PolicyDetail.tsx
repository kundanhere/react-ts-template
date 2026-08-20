import { ArrowLeft01Icon, CodeIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link, useParams } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function PolicyDetailPage() {
  const { id } = useParams<{ id: string }>();

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
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary rounded-xl p-3">
            <HugeiconsIcon icon={CodeIcon} size={24} strokeWidth={2} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                Policy Inspector: {id}
              </h1>
              <Badge variant="default">ALLOW</Badge>
            </div>
            <p className="text-muted-foreground text-sm">
              Raw JSON definition and evaluation target rules for policy ID {id}
              .
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card flex flex-col gap-4 rounded-xl border p-6 shadow-xs">
        <h2 className="text-lg font-semibold">Policy Statement</h2>
        <pre className="bg-muted/60 overflow-x-auto rounded-lg border p-4 font-mono text-xs">
          {JSON.stringify(
            {
              PolicyId: id,
              Version: "2026-08-19",
              Statement: [
                {
                  Sid: "AllowUserAccess",
                  Effect: "ALLOW",
                  Action: ["iam:CreateUser", "iam:GetUser", "iam:ListUsers"],
                  Resource: "arn:iam:module:users/*",
                },
              ],
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
}
