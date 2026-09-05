import * as React from "react";

import {
  AddCircleIcon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  MailValidation01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";

export default function EmailsTab() {
  const [emails, setEmails] = React.useState([
    { address: "kundan@example.com", isPrimary: true, isVerified: true },
    {
      address: "kundan.backup@example.com",
      isPrimary: false,
      isVerified: true,
    },
    { address: "kundan.temp@example.com", isPrimary: false, isVerified: false },
  ]);
  const [newEmail, setNewEmail] = React.useState("");
  const [keepPrivate, setKeepPrivate] = React.useState(true);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null
  );

  const [isAddingEmail, setIsAddingEmail] = React.useState(false);
  const [isSavingPreferences, setIsSavingPreferences] = React.useState(false);

  const handleAddEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newEmail.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (
      emails.some(
        (em) => em.address.toLowerCase() === newEmail.trim().toLowerCase()
      )
    ) {
      toast.error("Email address is already added.");
      return;
    }
    setIsAddingEmail(true);
    setTimeout(() => {
      setIsAddingEmail(false);
      setEmails([
        ...emails,
        { address: newEmail.trim(), isPrimary: false, isVerified: false },
      ]);
      setNewEmail("");
      toast.success(`Verification email sent to "${newEmail.trim()}".`);
    }, 450);
  };

  const handleRemoveEmail = (address: string) => {
    setEmails(emails.filter((em) => em.address !== address));
    toast.success(`Email "${address}" removed.`);
  };

  const handleSetPrimary = (address: string) => {
    setEmails(
      emails.map((em) => ({
        ...em,
        isPrimary: em.address === address,
      }))
    );
    toast.success(`"${address}" set as primary email.`);
  };

  const handleResendVerification = (address: string) => {
    toast.success(`Verification email resent to "${address}".`);
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPreferences(true);
    setTimeout(() => {
      setIsSavingPreferences(false);
      setSuccessMessage("Email preferences updated successfully.");
      toast.success("Email preferences updated");
      setTimeout(() => setSuccessMessage(null), 5000);
    }, 450);
  };

  const primaryEmail = emails.find((em) => em.isPrimary)?.address || "";

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
        <h2 className="text-xl font-semibold tracking-tight">Emails</h2>
        <p className="text-muted-foreground text-xs">
          Manage your email addresses, configure primary contact options, and
          set email privacy settings.
        </p>
      </div>

      <div className="border-border/60 border-t" />

      <div className="space-y-6">
        {/* Email Addresses List */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold">Email addresses</h3>
            <p className="text-muted-foreground text-xs">
              Configure which email addresses you use to receive notifications,
              sign in, or recover your account.
            </p>
          </div>

          <div className="divide-border/60 border-border/80 bg-card divide-y overflow-hidden rounded-lg border">
            {emails.map((em) => (
              <div
                key={em.address}
                className="flex flex-wrap items-center justify-between gap-3 p-3.5"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-muted text-muted-foreground rounded-md p-2">
                    <HugeiconsIcon
                      icon={MailValidation01Icon}
                      className="size-4.5"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-foreground text-xs font-semibold">
                        {em.address}
                      </span>
                      {em.isPrimary && (
                        <Badge
                          variant="secondary"
                          className="border-emerald-200 bg-emerald-50 px-1.5 py-0 text-[0.5625rem] font-medium text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-400"
                        >
                          Primary
                        </Badge>
                      )}
                      {em.isVerified ? (
                        <Badge
                          variant="outline"
                          className="border-border px-1.5 py-0 text-[0.5625rem] font-medium"
                        >
                          Verified
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-amber-200 bg-amber-50/50 px-1.5 py-0 text-[0.5625rem] font-medium text-amber-700 dark:border-amber-500/20 dark:bg-amber-950/30 dark:text-amber-400"
                        >
                          Unverified
                        </Badge>
                      )}
                    </div>
                    {!em.isVerified && (
                      <p className="text-muted-foreground mt-1 text-[0.625rem]">
                        Unverified emails cannot be used for login or recovery.{" "}
                        <button
                          type="button"
                          className="text-primary animate-none font-medium hover:underline"
                          onClick={() => handleResendVerification(em.address)}
                        >
                          Resend verification
                        </button>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!em.isPrimary && em.isVerified && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2.5 text-xs font-medium"
                      onClick={() => handleSetPrimary(em.address)}
                    >
                      Make primary
                    </Button>
                  )}
                  {!em.isPrimary && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive h-7 px-2.5 text-xs font-medium"
                      onClick={() => handleRemoveEmail(em.address)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add Email Form */}
          <form onSubmit={handleAddEmail} className="space-y-2 pt-2">
            <Label htmlFor="new-email" className="text-xs font-semibold">
              Add email address
            </Label>
            <div className="flex max-w-md gap-2">
              <Input
                id="new-email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="e.g. alternate@example.com"
                className="bg-card"
              />
              <Button
                type="submit"
                disabled={isAddingEmail}
                variant="outline"
                className="h-7 shrink-0 px-3 py-0 text-xs font-medium"
              >
                <HugeiconsIcon icon={AddCircleIcon} className="size-3.5" />
                {isAddingEmail ? "Adding..." : "Add"}
              </Button>
            </div>
          </form>
        </div>

        <div className="border-border/60 border-t" />

        {/* Primary Email Address Section */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold">Primary email address</h3>
            <p className="text-muted-foreground text-xs">
              Your primary email address is used for critical account
              notifications, security alerts, and billing. Verification is
              required.
            </p>
          </div>

          <div className="space-y-2 pt-1">
            <div className="w-full max-w-xl">
              <Select
                value={primaryEmail}
                onValueChange={(val) => val && handleSetPrimary(val)}
              >
                <SelectTrigger
                  id="primary-email-select"
                  className="bg-card w-full"
                >
                  <SelectValue placeholder="Select email" />
                </SelectTrigger>
                <SelectContent>
                  {emails
                    .filter((em) => em.isVerified)
                    .map((em) => (
                      <SelectItem key={em.address} value={em.address}>
                        {em.address}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="border-border/60 border-t" />

        {/* Email Preferences / Privacy Section */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold">Email Preferences</h3>
            <p className="text-muted-foreground text-xs">
              Configure email privacy options for account notifications and
              public visibility.
            </p>
          </div>

          <form onSubmit={handleSavePreferences} className="space-y-5">
            <div className="space-y-4 pt-1">
              {/* Keep Email Private */}
              <div className="flex items-start gap-2.5">
                <Checkbox
                  id="keep-private"
                  checked={keepPrivate}
                  onCheckedChange={(checked) => setKeepPrivate(!!checked)}
                  className="mt-0.5"
                />
                <div className="grid gap-0.5">
                  <Label
                    htmlFor="keep-private"
                    className="cursor-pointer text-xs font-semibold"
                  >
                    Keep my email address private
                  </Label>
                  <span className="text-muted-foreground text-[0.6875rem] leading-normal">
                    Hide your email address from public views, profiles, and API
                    responses to protect your privacy.
                  </span>
                </div>
              </div>
            </div>

            <div className="border-border/60 border-t pt-4" />

            <Button
              type="submit"
              disabled={isSavingPreferences}
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 shrink-0 px-4 text-xs font-medium"
            >
              {isSavingPreferences ? "Saving..." : "Save email preferences"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
