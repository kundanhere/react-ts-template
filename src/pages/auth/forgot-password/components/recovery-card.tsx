import * as React from "react";

import { ArrowRight01Icon, LockKeyIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { RecoveryStep } from "../../../../types/auth";

interface IRecoveryCardProps {
  step: RecoveryStep;
  children: React.ReactNode;
}

export function RecoveryCard({ step, children }: IRecoveryCardProps) {
  const stepNumber = { email: "1", otp: "2", password: "3" }[step];

  return (
    <div className="flex w-full shrink-0 justify-center lg:w-auto lg:max-w-md lg:justify-end xl:max-w-lg">
      <div className="group relative w-full sm:w-105 md:w-110">
        {/* Soft ambient glow backlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-1 -z-10 rounded-3xl bg-linear-to-r from-blue-500/10 via-purple-500/10 to-emerald-500/10 opacity-35 blur-xl transition-opacity duration-500 group-hover:opacity-50"
        />

        <Card className="bg-card/80 dark:bg-card/50 relative flex max-h-121.25 min-h-121.25 flex-col justify-between overflow-hidden border border-white/20 shadow-md shadow-black/5 backdrop-blur-xl dark:border-white/10 dark:shadow-black/25">
          {/* Top Radiant Shimmer Edge */}
          <div className="via-primary/40 absolute inset-x-0 top-0 h-[1.5px] bg-linear-to-r from-transparent to-transparent" />

          {/* Card Header */}
          <CardHeader className="px-6 pt-6 pb-3">
            {/* Step Badge & Mini Progress Line */}
            <div className="mb-3 flex items-center justify-between">
              <span className="border-primary/20 bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium backdrop-blur-sm">
                <span className="bg-primary size-1.5 animate-pulse rounded-full" />
                Step {stepNumber} of 3
              </span>
              <div className="flex items-center gap-1.5">
                <div className="bg-primary h-1 w-6 rounded-full transition-all duration-300" />
                <div
                  className={cn(
                    "h-1 w-6 rounded-full transition-all duration-300",
                    step === "otp" || step === "password"
                      ? "bg-primary"
                      : "bg-muted/60"
                  )}
                />
                <div
                  className={cn(
                    "h-1 w-6 rounded-full transition-all duration-300",
                    step === "password" ? "bg-primary" : "bg-muted/60"
                  )}
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="font-heading text-foreground text-2xl font-bold tracking-tight">
                  {step === "email" && "Reset Password"}
                  {step === "otp" && "Verify Code"}
                  {step === "password" && "New Password"}
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-1 h-4 text-xs leading-relaxed">
                  {step === "email" &&
                    "Enter your email to receive a recovery code"}
                  {step === "otp" &&
                    "Enter the 6-digit code sent to your email"}
                  {step === "password" && "Choose a new strong password"}
                </CardDescription>
              </div>
              <div className="border-primary/25 bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-xl border shadow-xs">
                <HugeiconsIcon icon={LockKeyIcon} className="size-5" />
              </div>
            </div>
          </CardHeader>

          {/* Card Content */}
          <CardContent className="flex flex-1 flex-col justify-between px-6 pt-1 pb-2">
            {children}
          </CardContent>

          {/* Card Footer */}
          <CardFooter className="border-border/40 mt-auto items-center justify-center border-t px-6 py-4">
            <p className="text-muted-foreground text-xs">
              Remember your password?{" "}
              <Link
                to="/login"
                className="text-primary ml-1 inline-flex items-center gap-1 font-semibold hover:underline"
              >
                Sign in
                <HugeiconsIcon icon={ArrowRight01Icon} className="size-3" />
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
