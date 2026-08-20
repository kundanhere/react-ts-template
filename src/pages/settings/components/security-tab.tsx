import { PageWrapper } from "@/components/page-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SecuritySettingsPage() {
  return (
    <PageWrapper
      title="Security & System Settings"
      subtitle="Configure authentication rules, token TTL, password requirements, and MFA policy."
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="bg-card flex flex-col gap-4 rounded-xl border p-6 shadow-xs">
          <h2 className="text-lg font-semibold">Token & Session Policy</h2>
          <div className="flex flex-col gap-2">
            <label className="text-muted-foreground text-xs font-medium">
              Access Token TTL (minutes)
            </label>
            <Input defaultValue="60" type="number" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-muted-foreground text-xs font-medium">
              Refresh Token TTL (days)
            </label>
            <Input defaultValue="30" type="number" />
          </div>
          <Button className="mt-2">Update Session Policy</Button>
        </div>

        <div className="bg-card flex flex-col gap-4 rounded-xl border p-6 shadow-xs">
          <h2 className="text-lg font-semibold">
            Multi-Factor Authentication (MFA)
          </h2>
          <p className="text-muted-foreground text-sm">
            Enforce mandatory TOTP/Hardware Security Keys for all administrative
            roles.
          </p>
          <div className="mt-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="mfa-enforce"
              defaultChecked
              className="accent-primary size-4"
            />
            <label htmlFor="mfa-enforce" className="text-sm font-medium">
              Enforce MFA for IAM Administrators
            </label>
          </div>
          <Button variant="outline" className="mt-4">
            Save MFA Configuration
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
}
