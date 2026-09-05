import * as React from "react";

import {
  AlertCircleIcon,
  BiometricAccessIcon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Key01Icon,
  LockIcon,
  LockKeyIcon,
  MailValidation01Icon,
  Shield01Icon,
  ShieldCheck,
  SmartPhone01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useSearchParams } from "react-router-dom";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";

import { AuthenticatorModal } from "./authenticator-modal";

const GoogleLogo = () => (
  <svg className="size-4 shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

const AppleLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.7-1.13 1.84-1.01 2.96.97.08 2.07-.54 2.84-1.35z" />
  </svg>
);

export default function SecurityTab() {
  const [, setSearchParams] = useSearchParams();

  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(true);
  const [isAuthenticatorModalOpen, setIsAuthenticatorModalOpen] =
    React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null
  );

  // Password States
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isChangePasswordOpen, setIsChangePasswordOpen] = React.useState(false);

  // OAuth 2.0 State
  const [oauthProviders, setOauthProviders] = React.useState({
    google: { connected: true, email: "kundan@gmail.com" },
    apple: { connected: false, email: null as string | null },
  });

  // Passkeys State
  const [passkeys, setPasskeys] = React.useState([
    {
      id: "pk-1",
      name: "Kundan's MacBook Pro (Touch ID)",
      createdAt: "Aug 28, 2026",
      lastUsed: "Today",
    },
    {
      id: "pk-2",
      name: "YubiKey 5C NFC",
      createdAt: "Jul 15, 2026",
      lastUsed: "2 weeks ago",
    },
  ]);

  // Sessions list for danger zone state
  const [sessions, setSessions] = React.useState([
    { id: "sess-1", isCurrent: true },
    { id: "sess-2", isCurrent: false },
  ]);

  const [isUpdatingPassword, setIsUpdatingPassword] = React.useState(false);

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }
    setIsUpdatingPassword(true);
    setTimeout(() => {
      setIsUpdatingPassword(false);
      setSuccessMessage("Password updated successfully.");
      toast.success("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsChangePasswordOpen(false);
      setTimeout(() => setSuccessMessage(null), 5000);
    }, 450);
  };

  const handleToggleOauth = (provider: "google" | "apple") => {
    const isConnected = oauthProviders[provider].connected;
    if (isConnected) {
      setOauthProviders({
        ...oauthProviders,
        [provider]: { connected: false, email: null },
      });
      toast.success(
        `Disconnected from ${provider === "google" ? "Google" : "Apple"}.`
      );
    } else {
      setOauthProviders({
        ...oauthProviders,
        [provider]: {
          connected: true,
          email:
            provider === "google" ? "kundan@gmail.com" : "kundan@icloud.com",
        },
      });
      toast.success(
        `Connected to ${provider === "google" ? "Google" : "Apple"} successfully.`
      );
    }
  };

  const handleAddPasskey = () => {
    const nextNum = passkeys.length + 1;
    const name = `Passkey #${nextNum}`;
    const newPk = {
      id: `pk-${Date.now()}`,
      name,
      createdAt: "Today",
      lastUsed: "Never",
    };
    setPasskeys([...passkeys, newPk]);
    toast.success(`Passkey "${name}" registered successfully.`);
  };

  const handleDeletePasskey = (id: string, name: string) => {
    setPasskeys(passkeys.filter((pk) => pk.id !== id));
    toast.success(`Passkey "${name}" removed.`);
  };

  const handleToggle2FA = () => {
    const nextVal = !twoFactorEnabled;
    setTwoFactorEnabled(nextVal);
    toast.success(
      nextVal
        ? "Two-factor authentication enabled successfully."
        : "Two-factor authentication disabled."
    );
  };

  const handleRevokeAllOther = () => {
    setSessions(sessions.filter((s) => s.isCurrent));
    toast.success("All other active sessions revoked successfully.");
  };

  const handleRevokeAll = () => {
    setSessions([]);
    toast.success("All sessions revoked. Redirecting to login...");
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Success Banner */}
      {successMessage && (
        <div className="flex items-center justify-between rounded-md border border-emerald-200 bg-emerald-50/70 p-3 text-xs text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-950/20 dark:text-emerald-400">
          <div className="flex items-center gap-2">
            <HugeiconsIcon
              icon={CheckmarkCircle02Icon}
              className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
            />
            <span>{successMessage}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSuccessMessage(null)}
            className="size-6 p-0 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/30"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
          </Button>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          Password & Security
        </h2>
        <p className="text-muted-foreground text-xs">
          Configure authentication credentials, secure sign-in methods, active
          sessions, and access token settings.
        </p>
      </div>

      <div className="border-border/60 border-t" />

      <div className="space-y-6">
        {/* Sign-in Methods Section */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold">Sign-in methods</h3>
            <p className="text-muted-foreground text-xs">
              Manage the passwords, emails, passkeys, and connected accounts
              used to access your account.
            </p>
          </div>

          <div className="border-border/80 bg-muted/20 space-y-4 rounded-lg border p-4">
            {/* Password Item (Collapsible) */}
            <div className="border-border/60 space-y-4 border-b pb-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <span className="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                    <HugeiconsIcon
                      icon={LockKeyIcon}
                      className="text-muted-foreground size-4"
                    />
                    Password
                  </span>
                  <p className="text-muted-foreground text-[0.6875rem]">
                    Change your password regularly and use a strong, random
                    password to keep your account secure.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 shrink-0 text-xs font-medium"
                  onClick={() => setIsChangePasswordOpen(!isChangePasswordOpen)}
                >
                  {isChangePasswordOpen ? "Cancel" : "Change password"}
                </Button>
              </div>

              {isChangePasswordOpen && (
                <form
                  onSubmit={handleUpdatePassword}
                  className="space-y-4 pt-2"
                >
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="current-pass"
                        className="text-xs font-semibold"
                      >
                        Current password
                      </Label>
                      <Input
                        id="current-pass"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="bg-card"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="new-pass"
                        className="text-xs font-semibold"
                      >
                        New password
                      </Label>
                      <Input
                        id="new-pass"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="bg-card"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="confirm-pass"
                        className="text-xs font-semibold"
                      >
                        Confirm new password
                      </Label>
                      <Input
                        id="confirm-pass"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="bg-card"
                      />
                    </div>
                  </div>

                  <div className="bg-card/60 text-muted-foreground space-y-1.5 rounded-md border p-3.5 text-[0.6875rem] leading-relaxed">
                    <p className="text-foreground mb-1 text-xs font-semibold">
                      Password requirements:
                    </p>
                    <ul className="list-inside list-disc space-y-0.5">
                      <li>Make it at least 8 characters long</li>
                      <li>
                        Include at least one uppercase letter and one lowercase
                        letter
                      </li>
                      <li>Include at least one number or special character</li>
                    </ul>
                  </div>

                  <div className="border-border/60 border-t pt-4" />

                  <div className="flex items-center justify-between">
                    <Button
                      type="submit"
                      disabled={isUpdatingPassword}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 shrink-0 px-4 text-xs font-medium"
                    >
                      {isUpdatingPassword ? "Updating..." : "Update password"}
                    </Button>
                    <button
                      type="button"
                      className="text-primary cursor-pointer border-0 bg-transparent p-0 text-xs font-medium hover:underline"
                      onClick={(e) => {
                        e.preventDefault();
                        toast.info("Password reset email sent.");
                      }}
                    >
                      Forgot password?
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Passkeys Item */}
            <div className="border-border/60 space-y-3.5 border-b pb-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <span className="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                    <HugeiconsIcon
                      icon={BiometricAccessIcon}
                      className="text-muted-foreground size-4"
                    />
                    Passkeys
                  </span>
                  <p className="text-muted-foreground text-[0.6875rem]">
                    Use your device's biometric sensors, PIN, or a security key
                    as passwordless credentials.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 shrink-0 text-xs font-medium"
                  onClick={handleAddPasskey}
                >
                  Add a passkey
                </Button>
              </div>

              {passkeys.length === 0 ? (
                <div className="bg-card flex flex-col items-center justify-center rounded-md border border-dashed py-6 text-center">
                  <div className="bg-muted mb-2 flex size-9 items-center justify-center rounded-full">
                    <HugeiconsIcon
                      icon={BiometricAccessIcon}
                      className="text-muted-foreground size-4.5"
                    />
                  </div>
                  <p className="text-muted-foreground text-xs font-medium">
                    No passkeys registered
                  </p>
                  <p className="text-muted-foreground mt-0.5 max-w-sm text-[0.625rem]">
                    Register a passkey to sign in securely without entering your
                    password.
                  </p>
                </div>
              ) : (
                <div className="divide-border/60 border-border/80 bg-card divide-y overflow-hidden rounded-md border">
                  {passkeys.map((pk) => (
                    <div
                      key={pk.id}
                      className="flex items-center justify-between p-3"
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="bg-muted text-muted-foreground mt-0.5 rounded p-1.5">
                          <HugeiconsIcon
                            icon={BiometricAccessIcon}
                            className="size-4"
                          />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-foreground text-xs font-semibold">
                            {pk.name}
                          </p>
                          <p className="text-muted-foreground text-[0.625rem]">
                            Added on {pk.createdAt} • Last used: {pk.lastUsed}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive h-7 px-2.5 text-xs"
                        onClick={() => handleDeletePasskey(pk.id, pk.name)}
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Emails Item */}
            <div className="border-border/60 space-y-3.5 border-b pb-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <span className="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                    <HugeiconsIcon
                      icon={MailValidation01Icon}
                      className="text-muted-foreground size-4"
                    />
                    Emails
                  </span>
                  <p className="text-muted-foreground text-[0.6875rem]">
                    Manage the verified email addresses associated with your
                    account for sign-in, notifications, and account recovery.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 shrink-0 text-xs font-medium"
                  onClick={() => setSearchParams({ tab: "emails" })}
                >
                  Manage
                </Button>
              </div>
            </div>

            {/* OAuth 2.0 Connected Accounts */}
            <div className="space-y-3.5">
              <div className="space-y-0.5">
                <span className="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                  <HugeiconsIcon
                    icon={Shield01Icon}
                    className="text-muted-foreground size-4"
                  />
                  OAuth 2.0 Social Sign-in
                </span>
                <p className="text-muted-foreground text-[0.6875rem]">
                  Link your Google or Apple account to sign in instantly with
                  one click.
                </p>
              </div>

              <div className="divide-border/60 border-border/80 bg-card divide-y overflow-hidden rounded-md border">
                {/* Google */}
                <div className="flex items-center justify-between p-3.5">
                  <div className="flex items-start gap-3">
                    <div className="bg-muted shrink-0 rounded-md p-2">
                      <GoogleLogo />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground text-xs font-semibold">
                          Google Account
                        </span>
                        {oauthProviders.google.connected && (
                          <Badge
                            variant="secondary"
                            className="border-emerald-200 bg-emerald-50 px-1.5 py-0 text-[0.5625rem] font-medium text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-400"
                          >
                            Connected
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground text-[0.65625rem]">
                        {oauthProviders.google.connected
                          ? `Linked to ${oauthProviders.google.email}`
                          : "Not connected to a Google account"}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={
                      oauthProviders.google.connected ? "ghost" : "outline"
                    }
                    size="sm"
                    className={
                      oauthProviders.google.connected
                        ? "text-destructive hover:bg-destructive/10 hover:text-destructive h-8 text-xs font-medium"
                        : "h-8 text-xs font-medium"
                    }
                    onClick={() => handleToggleOauth("google")}
                  >
                    {oauthProviders.google.connected ? "Disconnect" : "Connect"}
                  </Button>
                </div>

                {/* Apple */}
                <div className="flex items-center justify-between p-3.5">
                  <div className="flex items-start gap-3">
                    <div className="bg-muted text-foreground shrink-0 rounded-md p-2">
                      <AppleLogo className="size-4" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground text-xs font-semibold">
                          Apple ID
                        </span>
                        {oauthProviders.apple.connected && (
                          <Badge
                            variant="secondary"
                            className="border-emerald-200 bg-emerald-50 px-1.5 py-0 text-[0.5625rem] font-medium text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-400"
                          >
                            Connected
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground text-[0.65625rem]">
                        {oauthProviders.apple.connected
                          ? `Linked to ${oauthProviders.apple.email}`
                          : "Not connected to an Apple ID"}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={
                      oauthProviders.apple.connected ? "ghost" : "outline"
                    }
                    size="sm"
                    className={
                      oauthProviders.apple.connected
                        ? "text-destructive hover:bg-destructive/10 hover:text-destructive h-8 text-xs font-medium"
                        : "h-8 text-xs font-medium"
                    }
                    onClick={() => handleToggleOauth("apple")}
                  >
                    {oauthProviders.apple.connected ? "Disconnect" : "Connect"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-border/60 border-t pt-6" />

        {/* Two-Factor Authentication Section */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold">Two-factor authentication</h3>
            <p className="text-muted-foreground text-xs">
              Add an extra layer of security to your account by requiring an
              additional verification code when signing in.
            </p>
          </div>

          {twoFactorEnabled ? (
            <div className="flex flex-wrap items-start justify-between gap-4 rounded-lg border border-emerald-200/80 bg-emerald-50/40 p-4 sm:flex-nowrap dark:border-emerald-500/25 dark:bg-emerald-950/20">
              <div className="flex items-start gap-2.5">
                <HugeiconsIcon
                  icon={ShieldCheck}
                  className="mt-0.5 size-4.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                />
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-400">
                    Two-factor authentication is enabled
                  </p>
                  <p className="text-[0.6875rem] leading-relaxed text-emerald-700/90 dark:text-emerald-400/80">
                    Your account is secured with 2FA. When signing in, you will
                    be prompted to verify your identity using one of your
                    registered methods.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-background hover:bg-muted h-8 shrink-0 text-xs font-medium"
                onClick={handleToggle2FA}
              >
                Disable 2FA
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap items-start justify-between gap-4 rounded-lg border border-amber-200 bg-amber-50/40 p-4 sm:flex-nowrap dark:border-amber-500/25 dark:bg-amber-950/20">
              <div className="flex items-start gap-2.5">
                <HugeiconsIcon
                  icon={AlertCircleIcon}
                  className="mt-0.5 size-4.5 shrink-0 text-amber-600 dark:text-amber-400"
                />
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-amber-800 dark:text-amber-400">
                    Two-factor authentication is disabled
                  </p>
                  <p className="text-[0.6875rem] leading-relaxed text-amber-700/90 dark:text-amber-400/80">
                    2FA is not set up for your account. We strongly suggest
                    configuring it to protect your credentials from unauthorized
                    access.
                  </p>
                </div>
              </div>
              <Button
                variant="default"
                size="sm"
                className="h-8 shrink-0 text-xs font-medium"
                onClick={handleToggle2FA}
              >
                Enable 2FA
              </Button>
            </div>
          )}

          <div className="space-y-3">
            <h4 className="text-foreground text-xs font-semibold">
              Two-factor methods
            </h4>

            <div className="divide-border/60 border-border/80 bg-card divide-y overflow-hidden rounded-lg border">
              {/* Authenticator App */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-muted text-muted-foreground rounded-md p-2">
                    <HugeiconsIcon
                      icon={SmartPhone01Icon}
                      className="size-4.5"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold">
                        Authenticator app (TOTP)
                      </span>
                      {twoFactorEnabled && (
                        <Badge
                          variant="secondary"
                          className="border-emerald-200 bg-emerald-50 px-1.5 py-0 text-[0.5625rem] font-medium text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-400"
                        >
                          Active
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground max-w-xl text-[0.6875rem] leading-normal">
                      Use a mobile authenticator app (such as Google
                      Authenticator, Microsoft Authenticator, or Authy) to
                      generate one-time verification codes.
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs"
                  onClick={() => setIsAuthenticatorModalOpen(true)}
                >
                  {twoFactorEnabled ? "Edit" : "Set up"}
                </Button>
              </div>

              {/* Security Keys */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-muted text-muted-foreground rounded-md p-2">
                    <HugeiconsIcon icon={Key01Icon} className="size-4.5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-semibold">Security keys</span>
                    <p className="text-muted-foreground max-w-xl text-[0.6875rem] leading-normal">
                      Use hardware security keys (such as YubiKeys) or
                      device-level authenticators to verify your identity.
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs"
                  onClick={() => toast.info("Security key setup clicked")}
                >
                  Add
                </Button>
              </div>

              {/* SMS / Text Messages */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-muted text-muted-foreground rounded-md p-2">
                    <HugeiconsIcon icon={LockIcon} className="size-4.5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-semibold">
                      SMS / Text messages
                    </span>
                    <p className="text-muted-foreground max-w-xl text-[0.6875rem] leading-normal">
                      Receive one-time verification codes via SMS text messages
                      to your registered mobile phone number.
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs"
                  onClick={() => toast.info("SMS setup clicked")}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>

          {twoFactorEnabled && (
            <div className="space-y-3 pt-1">
              <h4 className="text-foreground text-xs font-semibold">
                Recovery options
              </h4>

              <div className="border-border/80 bg-card overflow-hidden rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className="bg-muted text-muted-foreground rounded-md p-2">
                      <HugeiconsIcon icon={Clock01Icon} className="size-4.5" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-semibold">
                        Recovery codes
                      </span>
                      <p className="text-muted-foreground max-w-xl text-[0.6875rem] leading-normal">
                        Use recovery codes to sign in if you lose access to your
                        mobile device or authentication app.
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 shrink-0 px-3 text-xs"
                    onClick={() =>
                      toast.success(
                        "Recovery codes generated and copied to clipboard!"
                      )
                    }
                  >
                    View codes
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-border/60 border-t pt-6" />

        {/* Sessions Section */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold">Sessions</h3>
              <p className="text-muted-foreground text-xs">
                Review and manage the active web sessions currently authorized
                to access your account.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 shrink-0 text-xs font-medium"
              onClick={() => setSearchParams({ tab: "sessions" })}
            >
              Manage sessions
            </Button>
          </div>
        </div>

        <div className="border-border/60 border-t pt-6" />

        {/* Danger Zone Section */}
        <div className="space-y-4">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-red-600 dark:text-red-400">
              <HugeiconsIcon
                icon={AlertCircleIcon}
                className="size-4 shrink-0 text-red-600 dark:text-red-400"
              />
              Danger Zone
            </h3>
            <p className="text-muted-foreground text-xs">
              Critical, irreversible actions regarding your active sessions and
              account.
            </p>
          </div>

          <div className="divide-y divide-red-200/50 overflow-hidden rounded-lg border border-red-500/60 bg-red-50/15 dark:divide-red-900/30 dark:border-red-500/40 dark:bg-red-950/10">
            {/* Revoke All Other Sessions */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 transition-colors hover:bg-red-500/2 dark:hover:bg-red-950/2">
              <div className="space-y-0.5">
                <span className="text-foreground text-xs font-semibold">
                  Revoke other active sessions
                </span>
                <p className="text-muted-foreground max-w-xl text-[0.6875rem]">
                  Terminate all active sign-in sessions on other devices. This
                  will invalidate all active sessions except your current
                  browser session.
                </p>
              </div>
              {sessions.length > 1 ? (
                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-8 shrink-0 font-medium transition-colors"
                      />
                    }
                  >
                    Revoke other sessions
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure you want to revoke other sessions?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This will sign you out of all other devices. You will
                        need to sign in again on each device to regain access.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        variant="destructive"
                        onClick={handleRevokeAllOther}
                      >
                        Revoke other sessions
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <Button
                  disabled
                  size="sm"
                  variant="destructive"
                  className="h-8 shrink-0 cursor-not-allowed font-medium transition-colors"
                >
                  Revoke other sessions
                </Button>
              )}
            </div>

            {/* Revoke All Sessions */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 transition-colors hover:bg-red-500/2 dark:hover:bg-red-950/2">
              <div className="space-y-0.5">
                <span className="text-foreground text-xs font-semibold">
                  Revoke all sessions (Sign out everywhere)
                </span>
                <p className="text-muted-foreground max-w-xl text-[0.6875rem]">
                  Terminate all active sessions immediately. This will sign you
                  out of this browser session and all other devices.
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger
                  render={
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-8 shrink-0 font-medium transition-colors"
                    />
                  }
                >
                  Revoke all sessions
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to revoke all sessions?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will immediately sign you out of all active sessions,
                      including this current browser session. You will be
                      redirected to the sign-in page.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      variant="destructive"
                      onClick={handleRevokeAll}
                    >
                      Revoke all sessions
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            {/* Delete Account */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 transition-colors hover:bg-red-500/2 dark:hover:bg-red-950/2">
              <div className="space-y-0.5">
                <span className="text-foreground text-xs font-semibold">
                  Delete account
                </span>
                <p className="text-muted-foreground max-w-xl text-[0.6875rem]">
                  Permanently delete your account, data, and configurations.
                  This action is irreversible.
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger
                  render={
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-8 shrink-0 border border-transparent bg-red-600 text-xs font-medium text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
                    />
                  }
                >
                  Delete account
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to delete your account?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete your account and all
                      associated data. This action is irreversible and cannot be
                      undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      variant="destructive"
                      onClick={() => toast.error("Account deletion requested.")}
                    >
                      Delete account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
      <AuthenticatorModal
        open={isAuthenticatorModalOpen}
        onOpenChange={setIsAuthenticatorModalOpen}
        onConfirm={() => {
          setTwoFactorEnabled(true);
          toast.success("Authenticator app set up successfully.");
        }}
      />
    </div>
  );
}
