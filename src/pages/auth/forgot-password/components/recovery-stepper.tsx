import {
  ArrowLeft01Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import type { RecoveryStep } from "../../../../types/auth";

interface IRecoveryStepperProps {
  step: RecoveryStep;
}

export function RecoveryStepper({ step }: IRecoveryStepperProps) {
  return (
    <div className="flex w-full shrink-0 flex-col justify-center lg:max-w-md xl:max-w-lg">
      <Link
        to="/login"
        className="text-muted-foreground hover:text-foreground group mb-6 inline-flex w-fit items-center gap-2 text-xs font-medium transition-colors"
      >
        <HugeiconsIcon
          icon={ArrowLeft01Icon}
          className="size-3.5 transition-transform group-hover:-translate-x-0.5"
        />
        Back to login
      </Link>

      <Badge
        variant="outline"
        className="border-border/80 bg-muted/50 text-foreground/80 mb-3.5 inline-flex w-fit items-center gap-2 rounded-full px-3 py-4 text-xs font-medium"
      >
        <span className="bg-primary size-1.5 rounded-full" />
        Identity Verification
      </Badge>

      <h1 className="text-foreground text-3xl font-bold tracking-tight md:text-4xl">
        Account Recovery
      </h1>

      <p className="text-muted-foreground mt-3 mb-8 text-sm leading-relaxed">
        Securely reset your credentials in three simple steps. We&apos;ll
        confirm your identity before granting access to set a new password.
      </p>

      <div className="space-y-3">
        {/* Step 1: Verify Email */}
        <div className="flex items-start gap-3.5">
          <div
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold transition-colors",
              step === "email" &&
                "bg-primary text-primary-foreground shadow-xs",
              (step === "otp" || step === "password") &&
                "border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
              step !== "email" &&
                step !== "otp" &&
                step !== "password" &&
                "bg-muted/70 text-muted-foreground"
            )}
          >
            {step === "otp" || step === "password" ? (
              <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-4" />
            ) : (
              "01"
            )}
          </div>
          <div>
            <h2
              className={cn(
                "text-sm font-semibold transition-colors",
                step === "email" ? "text-foreground" : "text-muted-foreground"
              )}
            >
              Verify Email
            </h2>
            <p className="text-muted-foreground mt-0.5 text-xs">
              Enter the email registered to your account
            </p>
          </div>
        </div>

        {/* Connector */}
        <div className="bg-border/60 my-2.5 ml-4 h-4 w-px" />

        {/* Step 2: Verification Code */}
        <div className="flex items-start gap-3.5">
          <div
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold transition-colors",
              step === "otp" && "bg-primary text-primary-foreground shadow-xs",
              step === "password" &&
                "border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
              step !== "otp" &&
                step !== "password" &&
                "bg-muted/70 text-muted-foreground"
            )}
          >
            {step === "password" ? (
              <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-4" />
            ) : (
              "02"
            )}
          </div>
          <div>
            <h2
              className={cn(
                "text-sm font-semibold transition-colors",
                step === "otp" ? "text-foreground" : "text-muted-foreground"
              )}
            >
              Enter Verification Code
            </h2>
            <p className="text-muted-foreground mt-0.5 text-xs">
              Type in the 6-digit OTP sent to your email
            </p>
          </div>
        </div>

        {/* Connector */}
        <div className="bg-border/60 my-2.5 ml-4 h-4 w-px" />

        {/* Step 3: Create New Password */}
        <div className="flex items-start gap-3.5">
          <div
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold transition-colors",
              step === "password"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted/70 text-muted-foreground"
            )}
          >
            03
          </div>
          <div>
            <h2
              className={cn(
                "text-sm font-semibold transition-colors",
                step === "password"
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              Create New Password
            </h2>
            <p className="text-muted-foreground mt-0.5 text-xs">
              Set a strong, secure password for your account
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
