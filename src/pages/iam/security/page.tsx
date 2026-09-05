import * as React from "react";

import {
  AccountRecoveryIcon,
  BiometricAccessIcon,
  BiscuitIcon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  LaptopPhoneSyncIcon,
  Login01Icon,
  PasswordValidationIcon,
  SmsCodeIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useSearchParams } from "react-router-dom";

import { PageWrapper } from "@/components/page-wrapper";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toast";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export default function SecuritySettingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("tab") || "otp";
  const setActiveCategory = (tab: string) => setSearchParams({ tab });

  const [isSaving, setIsSaving] = React.useState(false);
  const [successBanner, setSuccessBanner] = React.useState<string | null>(null);

  // OTP State
  const [otpExpiry, setOtpExpiry] = React.useState("180");
  const [otpCooldown, setOtpCooldown] = React.useState("60");
  const [otpMaxRetries, setOtpMaxRetries] = React.useState("3");

  // JWT & Cookies State
  const [accessTokenExpiry, setAccessTokenExpiry] = React.useState("15");
  const [refreshTokenExpiry, setRefreshTokenExpiry] = React.useState("7");
  const [cookieExpiry, setCookieExpiry] = React.useState("30");
  const [enableRotation, setEnableRotation] = React.useState(true);
  const [revokeOnLogout, setRevokeOnLogout] = React.useState(true);

  // Sessions State
  const [sessionInactivity, setSessionInactivity] = React.useState("30");
  const [sessionMaxLifetime, setSessionMaxLifetime] = React.useState("30");
  const [maxConcurrentSessions, setMaxConcurrentSessions] = React.useState("5");

  // Password Policy State
  const [minPasswordLength, setMinPasswordLength] = React.useState("12");
  const [requireUppercase, setRequireUppercase] = React.useState(true);
  const [requireLowercase, setRequireLowercase] = React.useState(true);
  const [requireNumbers, setRequireNumbers] = React.useState(true);
  const [requireSpecial, setRequireSpecial] = React.useState(true);
  const [passwordExpiry, setPasswordExpiry] = React.useState("90");
  const [passwordHistory, setPasswordHistory] = React.useState("5");

  // Login Security State
  const [maxFailedLogins, setMaxFailedLogins] = React.useState("5");
  const [lockoutDuration, setLockoutDuration] = React.useState("15");
  const [reauthInterval, setReauthInterval] = React.useState("24");

  // MFA State
  const [enableMfa, setEnableMfa] = React.useState(true);
  const [requireMfaAdmin, setRequireMfaAdmin] = React.useState(true);

  // Account Recovery State
  const [resetTokenExpiry, setResetTokenExpiry] = React.useState("60");
  const [maxResetAttempts, setMaxResetAttempts] = React.useState("3");
  const [revokeOnReset, setRevokeOnReset] = React.useState(true);

  const categoriesData = {
    groups: [
      {
        label: "Authentication",
        items: [
          {
            id: "otp",
            name: "OTP Configuration",
            desc: "One-Time Password limits and expiry rules",
            icon: <HugeiconsIcon icon={SmsCodeIcon} />,
          },
          {
            id: "mfa",
            name: "Multi-Factor Auth (MFA)",
            desc: "MFA enforcement parameters",
            icon: <HugeiconsIcon icon={BiometricAccessIcon} />,
          },
          {
            id: "passwords",
            name: "Password Policy",
            desc: "Complexity and password history rules",
            icon: <HugeiconsIcon icon={PasswordValidationIcon} />,
          },
        ],
      },
      {
        label: "Sessions & Cookies",
        items: [
          {
            id: "jwt",
            name: "JWT & Cookies",
            desc: "Token lifetimes and cookie rotation",
            icon: <HugeiconsIcon icon={BiscuitIcon} />,
          },
          {
            id: "sessions",
            name: "Session Management",
            desc: "Concurrent limits and timeouts",
            icon: <HugeiconsIcon icon={LaptopPhoneSyncIcon} />,
          },
        ],
      },
      {
        label: "Access Protection",
        items: [
          {
            id: "login",
            name: "Login Security",
            desc: "Account lockout and login retries",
            icon: <HugeiconsIcon icon={Login01Icon} />,
          },
          {
            id: "recovery",
            name: "Account Recovery",
            desc: "Reset token limits and session revoking",
            icon: <HugeiconsIcon icon={AccountRecoveryIcon} />,
          },
        ],
      },
    ],
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      const categoryName = categoriesData.groups
        .flatMap((g) => g.items)
        .find((c) => c.id === activeCategory)?.name;
      toast.success(`${categoryName} updated successfully`);
      setSuccessBanner(
        `${categoryName} settings have been saved successfully.`
      );
      setTimeout(() => setSuccessBanner(null), 3000);
    }, 450);
  };

  const renderActiveForm = () => {
    switch (activeCategory) {
      case "otp":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                OTP Configuration
              </h2>
              <p className="text-muted-foreground text-xs">
                Configure One-Time Password behavior, timeouts, and verification
                limits.
              </p>
            </div>

            <div className="border-border/60 border-t" />

            <div className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="otp-expiry" className="text-xs font-semibold">
                  OTP expiration duration (seconds)
                </Label>
                <Input
                  id="otp-expiry"
                  type="number"
                  value={otpExpiry}
                  onChange={(e) => setOtpExpiry(e.target.value)}
                />
                <p className="text-muted-foreground text-[0.6875rem] leading-normal">
                  The valid timeframe of OTP verification codes.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="otp-cooldown" className="text-xs font-semibold">
                  Resend OTP cooldown (seconds)
                </Label>
                <Input
                  id="otp-cooldown"
                  type="number"
                  value={otpCooldown}
                  onChange={(e) => setOtpCooldown(e.target.value)}
                />
                <p className="text-muted-foreground text-[0.6875rem] leading-normal">
                  Required delay before a user is allowed to request a new code
                  request.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="otp-retries" className="text-xs font-semibold">
                  Maximum OTP verification retries
                </Label>
                <Input
                  id="otp-retries"
                  type="number"
                  value={otpMaxRetries}
                  onChange={(e) => setOtpMaxRetries(e.target.value)}
                />
                <p className="text-muted-foreground text-[0.6875rem] leading-normal">
                  Failed code verification attempts allowed before invalidating
                  the code.
                </p>
              </div>
            </div>
          </div>
        );
      case "jwt":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                JWT & Cookies
              </h2>
              <p className="text-muted-foreground text-xs">
                Manage token expiration, rotation, and cookie revocation
                security.
              </p>
            </div>

            <div className="border-border/60 border-t" />

            {/* Token Lifetimes */}
            <div className="space-y-5">
              <h3 className="text-sm font-semibold">Token Lifetimes</h3>

              <div className="space-y-1.5">
                <Label htmlFor="access-exp" className="text-xs font-semibold">
                  Access token expiration (minutes)
                </Label>
                <Input
                  id="access-exp"
                  type="number"
                  value={accessTokenExpiry}
                  onChange={(e) => setAccessTokenExpiry(e.target.value)}
                />
                <p className="text-muted-foreground text-[0.6875rem] leading-normal">
                  Validity duration of short-lived JWT credentials.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="refresh-exp" className="text-xs font-semibold">
                  Refresh token expiration (days)
                </Label>
                <Input
                  id="refresh-exp"
                  type="number"
                  value={refreshTokenExpiry}
                  onChange={(e) => setRefreshTokenExpiry(e.target.value)}
                />
                <p className="text-muted-foreground text-[0.6875rem] leading-normal">
                  Validity duration of persistent session refresh tokens.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cookie-exp" className="text-xs font-semibold">
                  Cookie/session expiration (days)
                </Label>
                <Input
                  id="cookie-exp"
                  type="number"
                  value={cookieExpiry}
                  onChange={(e) => setCookieExpiry(e.target.value)}
                />
                <p className="text-muted-foreground text-[0.6875rem] leading-normal">
                  Absolute validity lifespan of secure session cookies.
                </p>
              </div>
            </div>

            <div className="border-border/60 border-t" />

            {/* Cookie Security Rules */}
            <div className="space-y-5">
              <h3 className="text-sm font-semibold">Cookie Security Rules</h3>

              <div className="flex items-center justify-between py-1">
                <div className="space-y-0.5">
                  <Label
                    htmlFor="rot-switch"
                    className="cursor-pointer text-xs font-semibold"
                  >
                    Refresh token rotation
                  </Label>
                  <p className="text-muted-foreground text-[0.6875rem] leading-normal">
                    Issue a new refresh token and invalidate the old one on each
                    token refresh.
                  </p>
                </div>
                <Switch
                  id="rot-switch"
                  checked={enableRotation}
                  onCheckedChange={setEnableRotation}
                />
              </div>

              <div className="flex items-center justify-between py-1">
                <div className="space-y-0.5">
                  <Label
                    htmlFor="revoke-switch"
                    className="cursor-pointer text-xs font-semibold"
                  >
                    Revoke tokens on logout & password change
                  </Label>
                  <p className="text-muted-foreground text-[0.6875rem] leading-normal">
                    Force complete token invalidation across all servers on
                    logout or credentials changes.
                  </p>
                </div>
                <Switch
                  id="revoke-switch"
                  checked={revokeOnLogout}
                  onCheckedChange={setRevokeOnLogout}
                />
              </div>
            </div>
          </div>
        );
      case "sessions":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Session Management
              </h2>
              <p className="text-muted-foreground text-xs">
                Set session limits, timeouts, and concurrency policies.
              </p>
            </div>

            <div className="border-border/60 border-t" />

            {/* Session Timeouts */}
            <div className="space-y-5">
              <h3 className="text-sm font-semibold">Session Timeouts</h3>

              <div className="space-y-1.5">
                <Label
                  htmlFor="sess-inactivity"
                  className="text-xs font-semibold"
                >
                  Session inactivity timeout (minutes)
                </Label>
                <Input
                  id="sess-inactivity"
                  type="number"
                  value={sessionInactivity}
                  onChange={(e) => setSessionInactivity(e.target.value)}
                />
                <p className="text-muted-foreground text-[0.6875rem] leading-normal">
                  Time of continuous user inactivity before the session expires.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="sess-max-life"
                  className="text-xs font-semibold"
                >
                  Maximum session lifetime (days)
                </Label>
                <Input
                  id="sess-max-life"
                  type="number"
                  value={sessionMaxLifetime}
                  onChange={(e) => setSessionMaxLifetime(e.target.value)}
                />
                <p className="text-muted-foreground text-[0.6875rem] leading-normal">
                  Absolute validity duration of active user session logins.
                </p>
              </div>
            </div>

            <div className="border-border/60 border-t" />

            {/* Concurrency Control */}
            <div className="space-y-5">
              <h3 className="text-sm font-semibold">Concurrency Control</h3>

              <div className="space-y-1.5">
                <Label
                  htmlFor="sess-concurrent"
                  className="text-xs font-semibold"
                >
                  Maximum concurrent sessions per user
                </Label>
                <Input
                  id="sess-concurrent"
                  type="number"
                  value={maxConcurrentSessions}
                  onChange={(e) => setMaxConcurrentSessions(e.target.value)}
                />
                <p className="text-muted-foreground text-[0.6875rem] leading-normal">
                  Maximum active sessions allowed for a single account
                  simultaneously.
                </p>
              </div>
            </div>
          </div>
        );
      case "passwords":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Password Policy
              </h2>
              <p className="text-muted-foreground text-xs">
                Enforce credential complexity, history limits, and rotation
                rules.
              </p>
            </div>

            <div className="border-border/60 border-t" />

            {/* Complexity Requirements */}
            <div className="space-y-5">
              <h3 className="text-sm font-semibold">Complexity Requirements</h3>

              <div className="space-y-1.5">
                <Label
                  htmlFor="pass-min-length"
                  className="text-xs font-semibold"
                >
                  Minimum password length
                </Label>
                <Input
                  id="pass-min-length"
                  type="number"
                  value={minPasswordLength}
                  onChange={(e) => setMinPasswordLength(e.target.value)}
                />
                <p className="text-muted-foreground text-[0.6875rem] leading-normal">
                  Recommend at least 12 characters to defend against automated
                  guessing.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <Label className="text-muted-foreground text-xs text-[0.625rem] font-semibold tracking-wider uppercase">
                  Password strength requirements
                </Label>
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="req-upper"
                      checked={requireUppercase}
                      onCheckedChange={(checked) =>
                        setRequireUppercase(!!checked)
                      }
                    />
                    <Label
                      htmlFor="req-upper"
                      className="cursor-pointer text-xs font-medium"
                    >
                      Require at least one uppercase letter (A-Z)
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="req-lower"
                      checked={requireLowercase}
                      onCheckedChange={(checked) =>
                        setRequireLowercase(!!checked)
                      }
                    />
                    <Label
                      htmlFor="req-lower"
                      className="cursor-pointer text-xs font-medium"
                    >
                      Require at least one lowercase letter (a-z)
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="req-number"
                      checked={requireNumbers}
                      onCheckedChange={(checked) =>
                        setRequireNumbers(!!checked)
                      }
                    />
                    <Label
                      htmlFor="req-number"
                      className="cursor-pointer text-xs font-medium"
                    >
                      Require at least one numeric digit (0-9)
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="req-special"
                      checked={requireSpecial}
                      onCheckedChange={(checked) =>
                        setRequireSpecial(!!checked)
                      }
                    />
                    <Label
                      htmlFor="req-special"
                      className="cursor-pointer text-xs font-medium"
                    >
                      Require at least one special character (!@#$%^&*)
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-border/60 border-t" />

            {/* Expiration & History */}
            <div className="space-y-5">
              <h3 className="text-sm font-semibold">Expiration & History</h3>

              <div className="space-y-1.5">
                <Label htmlFor="pass-expiry" className="text-xs font-semibold">
                  Password expiration (days)
                </Label>
                <Input
                  id="pass-expiry"
                  type="number"
                  value={passwordExpiry}
                  onChange={(e) => setPasswordExpiry(e.target.value)}
                />
                <p className="text-muted-foreground text-[0.6875rem] leading-normal">
                  Force password change interval in days. Set to 0 to disable
                  expiration.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pass-history" className="text-xs font-semibold">
                  Password history/reuse (last remembered)
                </Label>
                <Input
                  id="pass-history"
                  type="number"
                  value={passwordHistory}
                  onChange={(e) => setPasswordHistory(e.target.value)}
                />
                <p className="text-muted-foreground text-[0.6875rem] leading-normal">
                  Restrict reuse of recent passwords.
                </p>
              </div>
            </div>
          </div>
        );
      case "login":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Login Security
              </h2>
              <p className="text-muted-foreground text-xs">
                Protect login portals from brute force attacks.
              </p>
            </div>

            <div className="border-border/60 border-t" />

            {/* Failed Attempt Lockout */}
            <div className="space-y-5">
              <h3 className="text-sm font-semibold">Failed Attempt Lockout</h3>

              <div className="space-y-1.5">
                <Label
                  htmlFor="max-failed-logins"
                  className="text-xs font-semibold"
                >
                  Maximum failed login attempts
                </Label>
                <Input
                  id="max-failed-logins"
                  type="number"
                  value={maxFailedLogins}
                  onChange={(e) => setMaxFailedLogins(e.target.value)}
                />
                <p className="text-muted-foreground text-[0.6875rem] leading-normal">
                  Attempts allowed before locking user out of authentication.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="lockout-dur" className="text-xs font-semibold">
                  Account lockout duration (minutes)
                </Label>
                <Input
                  id="lockout-dur"
                  type="number"
                  value={lockoutDuration}
                  onChange={(e) => setLockoutDuration(e.target.value)}
                />
                <p className="text-muted-foreground text-[0.6875rem] leading-normal">
                  Time account remains locked after reaching limit thresholds.
                </p>
              </div>
            </div>

            <div className="border-border/60 border-t" />

            {/* Re-Authentication */}
            <div className="space-y-5">
              <h3 className="text-sm font-semibold">Re-Authentication</h3>

              <div className="space-y-1.5">
                <Label htmlFor="reauth-int" className="text-xs font-semibold">
                  Re-authentication interval (hours)
                </Label>
                <Input
                  id="reauth-int"
                  type="number"
                  value={reauthInterval}
                  onChange={(e) => setReauthInterval(e.target.value)}
                />
                <p className="text-muted-foreground text-[0.6875rem] leading-normal">
                  Force credential confirmation interval for protected actions.
                </p>
              </div>
            </div>
          </div>
        );
      case "mfa":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Multi-Factor Auth (MFA)
              </h2>
              <p className="text-muted-foreground text-xs">
                Configure global and admin-level multi-factor authentication
                rules.
              </p>
            </div>

            <div className="border-border/60 border-t" />

            {/* MFA Enforcement */}
            <div className="space-y-5">
              <h3 className="text-sm font-semibold">MFA Enforcement</h3>

              <div className="flex items-center justify-between py-1">
                <div className="space-y-0.5">
                  <Label
                    htmlFor="mfa-switch"
                    className="cursor-pointer text-xs font-semibold"
                  >
                    Enable MFA
                  </Label>
                  <p className="text-muted-foreground text-[0.6875rem] leading-normal">
                    Allow users to configure authenticator apps or security
                    keys.
                  </p>
                </div>
                <Switch
                  id="mfa-switch"
                  checked={enableMfa}
                  onCheckedChange={setEnableMfa}
                />
              </div>

              <div className="flex items-center justify-between py-1">
                <div className="space-y-0.5">
                  <Label
                    htmlFor="mfa-admin-switch"
                    className="cursor-pointer text-xs font-semibold"
                  >
                    Require MFA for administrators
                  </Label>
                  <p className="text-muted-foreground text-[0.6875rem] leading-normal">
                    Force mandatory MFA setup for all administrative
                    credentials.
                  </p>
                </div>
                <Switch
                  id="mfa-admin-switch"
                  checked={requireMfaAdmin}
                  onCheckedChange={setRequireMfaAdmin}
                  disabled={!enableMfa}
                />
              </div>
            </div>
          </div>
        );
      case "recovery":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Account Recovery
              </h2>
              <p className="text-muted-foreground text-xs">
                Manage reset token lifetimes, failed attempts, and security
                constraints.
              </p>
            </div>

            <div className="border-border/60 border-t" />

            {/* Recovery Tokens */}
            <div className="space-y-5">
              <h3 className="text-sm font-semibold">Recovery Tokens</h3>

              <div className="space-y-1.5">
                <Label
                  htmlFor="reset-token-exp"
                  className="text-xs font-semibold"
                >
                  Password reset token expiration (minutes)
                </Label>
                <Input
                  id="reset-token-exp"
                  type="number"
                  value={resetTokenExpiry}
                  onChange={(e) => setResetTokenExpiry(e.target.value)}
                />
                <p className="text-muted-foreground text-[0.6875rem] leading-normal">
                  Lifetime of generated email password reset links.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="reset-attempts"
                  className="text-xs font-semibold"
                >
                  Maximum reset attempts
                </Label>
                <Input
                  id="reset-attempts"
                  type="number"
                  value={maxResetAttempts}
                  onChange={(e) => setMaxResetAttempts(e.target.value)}
                />
                <p className="text-muted-foreground text-[0.6875rem] leading-normal">
                  Failed code verification attempts allowed before invalidating
                  reset link.
                </p>
              </div>
            </div>

            <div className="border-border/60 border-t" />

            {/* Post-Recovery Behavior */}
            <div className="space-y-5">
              <h3 className="text-sm font-semibold">Post-Recovery Behavior</h3>

              <div className="flex items-center justify-between py-1">
                <div className="space-y-0.5">
                  <Label
                    htmlFor="revoke-reset-switch"
                    className="cursor-pointer text-xs font-semibold"
                  >
                    Revoke existing sessions after password reset
                  </Label>
                  <p className="text-muted-foreground text-[0.6875rem] leading-normal">
                    Instantly invalidate active tokens across other devices once
                    password is reset.
                  </p>
                </div>
                <Switch
                  id="revoke-reset-switch"
                  checked={revokeOnReset}
                  onCheckedChange={setRevokeOnReset}
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <PageWrapper
      title="Security Settings"
      subtitle="Manage core IAM security parameters, JWT lifetimes, lockout rules, password policies, and MFA configurations."
    >
      <SidebarProvider className="items-start">
        <Sidebar
          collapsible="none"
          className="settings-sidebar border-border/40 flex shrink-0 border-r bg-transparent pr-0 lg:pr-4"
        >
          <SidebarContent className="gap-4 pt-2">
            {categoriesData.groups.map((group) => (
              <SidebarGroup key={group.label} className="px-0 lg:px-1">
                {group.label && (
                  <SidebarGroupLabel className="hidden capitalize lg:flex">
                    {group.label}
                  </SidebarGroupLabel>
                )}
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => {
                      const isActive = activeCategory === item.id;
                      return (
                        <SidebarMenuItem key={item.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <SidebarMenuButton
                                onClick={() => {
                                  setActiveCategory(item.id);
                                  setSuccessBanner(null);
                                }}
                                isActive={isActive}
                                className={cn(
                                  "mx-auto size-8 justify-center lg:mx-0 lg:h-8 lg:w-full lg:justify-start",
                                  isActive && "bg-muted font-medium"
                                )}
                              >
                                {item.icon}
                                <span className="hidden lg:inline">
                                  {item.name}
                                </span>
                              </SidebarMenuButton>
                            </TooltipTrigger>
                            <TooltipContent
                              side="right"
                              align="center"
                              className="z-100 lg:hidden"
                            >
                              {item.name}
                            </TooltipContent>
                          </Tooltip>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 overflow-y-auto px-2 py-2 md:px-6">
          {successBanner && (
            <div className="mb-6 flex items-center justify-between rounded-md border border-emerald-200 bg-emerald-50/70 p-3 text-xs text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-950/20 dark:text-emerald-400">
              <div className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                />
                <span>{successBanner}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSuccessBanner(null)}
                className="size-6 p-0 text-emerald-800 hover:bg-emerald-100/50 dark:text-emerald-400 dark:hover:bg-emerald-900/30"
              >
                <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
              </Button>
            </div>
          )}

          <form onSubmit={handleSave} className="max-w-xl space-y-6">
            {renderActiveForm()}

            <div className="border-border/60 border-t pt-4" />

            <Button
              type="submit"
              disabled={isSaving}
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 shrink-0 px-4 text-xs font-medium"
            >
              {isSaving ? "Saving..." : "Save preferences"}
            </Button>
          </form>
        </main>
      </SidebarProvider>
    </PageWrapper>
  );
}
