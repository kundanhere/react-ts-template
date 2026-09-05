import * as React from "react";

import {
  ArrowRight01Icon,
  InformationCircleIcon,
  Mail02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface IEmailStepFormProps {
  email: string;
  setEmail: (val: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function EmailStepForm({
  email,
  setEmail,
  isLoading,
  onSubmit,
}: IEmailStepFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-1 flex-col justify-between pt-1"
    >
      <div className="space-y-3.5">
        <div className="border-primary/20 bg-primary/5 text-muted-foreground flex items-start gap-2.5 rounded-xl border p-3 text-xs leading-relaxed backdrop-blur-sm">
          <HugeiconsIcon
            icon={InformationCircleIcon}
            className="text-primary mt-0.5 size-4 shrink-0"
          />
          <span>
            Enter the email address associated with your account. We&apos;ll
            send you a verification code.
          </span>
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="email"
            className="text-muted-foreground text-xs font-medium"
          >
            Email Address
          </Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="bg-background/50 border-border/70 focus-visible:border-primary focus-visible:ring-primary/20 h-10 rounded-xl pl-10 text-sm shadow-xs backdrop-blur-sm transition-all"
            />
            <HugeiconsIcon
              icon={Mail02Icon}
              className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="bg-primary text-primary-foreground mt-4 h-10 w-full cursor-pointer gap-2 rounded-xl font-medium shadow-xs transition-all hover:shadow-sm"
      >
        {isLoading ? "Sending Code..." : "Send Verification Code"}
        <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
      </Button>
    </form>
  );
}
