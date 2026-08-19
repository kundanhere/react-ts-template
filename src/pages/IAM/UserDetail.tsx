import {
  ArrowLeft01Icon,
  CheckmarkCircle02Icon,
  Shield01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link, useParams } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex flex-col gap-6 py-4">
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="mb-2"
          render={<Link to="/iam/users" />}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} className="mr-1" />
          Back to User Directory
        </Button>
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary rounded-xl p-3">
            <HugeiconsIcon icon={UserIcon} size={24} strokeWidth={2} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                User Details ({id})
              </h1>
              <Badge variant="default">Active Account</Badge>
            </div>
            <p className="text-muted-foreground text-sm">
              User ID: <code className="font-mono text-xs">{id}</code>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="bg-card flex flex-col gap-4 rounded-xl border p-6 shadow-xs">
          <h2 className="text-lg font-semibold">Assigned System Roles</h2>
          <div className="flex flex-col gap-2">
            <div className="bg-muted/20 flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={Shield01Icon}
                  size={18}
                  className="text-primary"
                />
                <span className="text-sm font-medium">IAM Administrator</span>
              </div>
              <Badge variant="secondary">Assigned</Badge>
            </div>
            <div className="bg-muted/20 flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={Shield01Icon}
                  size={18}
                  className="text-primary"
                />
                <span className="text-sm font-medium">Security Auditor</span>
              </div>
              <Badge variant="outline">Inherited</Badge>
            </div>
          </div>
        </div>

        <div className="bg-card flex flex-col gap-4 rounded-xl border p-6 shadow-xs">
          <h2 className="text-lg font-semibold">Direct Policy Overrides</h2>
          <div className="bg-muted/40 rounded-lg border p-4 font-mono text-xs">
            <div className="mb-1 flex items-center gap-2 font-bold text-emerald-600">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
              ALLOW: Audit Log Export
            </div>
            <div className="text-muted-foreground">Expires: Permanent</div>
          </div>
        </div>
      </div>
    </div>
  );
}
