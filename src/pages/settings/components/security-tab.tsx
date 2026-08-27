import * as React from "react";

import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SecurityTab() {
  const [accessTokenTtl, setAccessTokenTtl] = React.useState("60");
  const [refreshTokenTtl, setRefreshTokenTtl] = React.useState("30");
  const [mfaEnforced, setMfaEnforced] = React.useState(true);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null
  );

  const handleSave = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Banner */}
      {successMessage && (
        <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50/70 p-3 text-xs text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-950/20 dark:text-emerald-400">
          <HugeiconsIcon
            icon={CheckmarkCircle02Icon}
            className="size-4 text-emerald-600 dark:text-emerald-400"
          />
          <span>{successMessage}</span>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          Password & Security
        </h2>
        <p className="text-muted-foreground text-xs">
          Configure authentication rules, token TTL, password requirements, and
          MFA policy.
        </p>
      </div>

      <div className="border-border/60 border-t" />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Token & Session Policy */}
        <div className="bg-card flex flex-col gap-4 rounded-xl border p-5 shadow-xs">
          <h3 className="text-sm font-semibold">Token & Session Policy</h3>
          <div className="space-y-1.5">
            <Label htmlFor="access-ttl" className="text-xs font-medium">
              Access Token TTL (minutes)
            </Label>
            <Input
              id="access-ttl"
              type="number"
              value={accessTokenTtl}
              onChange={(e) => setAccessTokenTtl(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="refresh-ttl" className="text-xs font-medium">
              Refresh Token TTL (days)
            </Label>
            <Input
              id="refresh-ttl"
              type="number"
              value={refreshTokenTtl}
              onChange={(e) => setRefreshTokenTtl(e.target.value)}
            />
          </div>
          <Button
            size="sm"
            className="mt-2 h-8 text-xs"
            onClick={() => handleSave("Session policy updated successfully.")}
          >
            Update Session Policy
          </Button>
        </div>

        {/* Multi-Factor Authentication */}
        <div className="bg-card flex flex-col justify-between gap-4 rounded-xl border p-5 shadow-xs">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">
              Multi-Factor Authentication (MFA)
            </h3>
            <p className="text-muted-foreground text-xs leading-normal">
              Enforce mandatory TOTP or Hardware Security Keys for all
              administrative roles and privileged accounts.
            </p>
            <div className="flex items-center gap-2.5 pt-2">
              <Checkbox
                id="mfa-enforce"
                checked={mfaEnforced}
                onCheckedChange={(checked) => setMfaEnforced(!!checked)}
              />
              <Label
                htmlFor="mfa-enforce"
                className="cursor-pointer text-xs font-semibold"
              >
                Enforce MFA for IAM Administrators
              </Label>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={() => handleSave("MFA configuration saved.")}
          >
            Save MFA Configuration
          </Button>
        </div>
      </div>
    </div>
  );
}
