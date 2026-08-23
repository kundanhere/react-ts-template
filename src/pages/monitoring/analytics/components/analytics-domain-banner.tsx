import { Shield01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AnalyticsDomainBannerProps {
  moduleCount: number;
}

export function AnalyticsDomainBanner({
  moduleCount,
}: AnalyticsDomainBannerProps) {
  return (
    <div className="border-border bg-card flex flex-col justify-between gap-4 rounded-xl border p-4 shadow-xs sm:flex-row sm:items-center">
      <div className="flex items-center gap-3.5">
        <div className="border-border bg-muted/60 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border shadow-2xs">
          <HugeiconsIcon icon={Shield01Icon} size={18} />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground text-xs font-semibold">
              Organization Domain:
            </span>
            <span className="text-foreground bg-muted/50 border-border/60 rounded-md border px-2 py-0.5 font-mono text-xs font-semibold">
              sentry-identity-prod
            </span>
            <Badge
              variant="outline"
              className="gap-1.5 border-emerald-500/30 bg-emerald-50/50 px-2 py-0.5 text-[0.625rem] font-normal text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"
            >
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Enforced
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1 text-xs">
            Principal authorization engine active across {moduleCount}{" "}
            registered system modules with adaptive MFA enforcement.
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          asChild
          className="h-8 text-xs font-medium"
        >
          <Link to="/iam/users">Manage Principals</Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          asChild
          className="h-8 text-xs font-medium"
        >
          <Link to="/iam/roles">Manage Roles</Link>
        </Button>
      </div>
    </div>
  );
}
