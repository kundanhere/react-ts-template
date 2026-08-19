import { Add01Icon, CodeIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router-dom";

import { PageWrapper } from "@/components/page-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function PoliciesPage() {
  const policies = [
    {
      id: "pol-101",
      name: "Global User Admin Policy",
      effect: "ALLOW",
      resource: "users:*",
      actions: ["create", "read", "update", "delete"],
      updatedAt: "2 hours ago",
    },
    {
      id: "pol-102",
      name: "Audit Log Reader Policy",
      effect: "ALLOW",
      resource: "audit:*",
      actions: ["read", "export"],
      updatedAt: "1 day ago",
    },
    {
      id: "pol-103",
      name: "Restricted Security Settings Deny",
      effect: "DENY",
      resource: "security/settings:*",
      actions: ["update", "delete"],
      updatedAt: "3 days ago",
    },
    {
      id: "pol-104",
      name: "Department Manager Access",
      effect: "ALLOW",
      resource: "users:dept",
      actions: ["read", "update"],
      updatedAt: "5 days ago",
    },
  ];

  return (
    <PageWrapper
      title="Policies Registry"
      subtitle="Manage granular access control rules, conditions, and policy JSON definitions."
      action={
        <Button render={<Link to="/iam/policies/new" />}>
          <HugeiconsIcon icon={Add01Icon} size={16} />
          Create Policy
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {policies.map((p) => (
          <div
            key={p.id}
            className="bg-card flex flex-col justify-between rounded-xl border p-5 shadow-xs"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 text-primary rounded-lg p-2">
                    <HugeiconsIcon icon={CodeIcon} size={18} strokeWidth={2} />
                  </div>
                  <h2 className="text-base font-semibold">{p.name}</h2>
                </div>
                <Badge
                  variant={p.effect === "ALLOW" ? "default" : "destructive"}
                >
                  {p.effect}
                </Badge>
              </div>
              <div className="bg-muted/60 text-muted-foreground rounded-lg border p-2.5 font-mono text-xs">
                Resource: {p.resource} | Actions: [{p.actions.join(", ")}]
              </div>
            </div>

            <div className="text-muted-foreground mt-4 flex items-center justify-between border-t pt-3 text-xs">
              <span>Updated {p.updatedAt}</span>
              <Button
                variant="ghost"
                size="sm"
                render={<Link to={`/iam/policies/${p.id}`} />}
              >
                Inspect JSON &rarr;
              </Button>
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}
