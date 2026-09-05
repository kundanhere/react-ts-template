import * as React from "react";

import {
  ArrowRight01Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";

interface IOtpStepFormProps {
  email: string;
  otpValue: string;
  setOtpValue: (val: string) => void;
  isLoading: boolean;
  onVerifyOtpCode: (code: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  onChangeEmail: () => void;
  onResendCode: () => void;
}

export function OtpStepForm({
  email,
  otpValue,
  setOtpValue,
  isLoading,
  onVerifyOtpCode,
  onSubmit,
  onChangeEmail,
  onResendCode,
}: IOtpStepFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-1 flex-col justify-between pt-1"
    >
      <div className="space-y-3">
        <div className="border-primary/20 bg-primary/5 text-muted-foreground flex items-start gap-2.5 rounded-xl border p-2.5 text-xs leading-relaxed backdrop-blur-sm">
          <HugeiconsIcon
            icon={InformationCircleIcon}
            className="text-primary mt-0.5 size-4 shrink-0"
          />
          <span className="truncate">
            Code sent to{" "}
            <strong className="text-foreground font-semibold">{email}</strong>
          </span>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="otp"
              className="text-muted-foreground text-xs font-medium"
            >
              Verification Code
            </Label>
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={onChangeEmail}
              className="text-primary h-auto cursor-pointer p-0 text-xs hover:underline"
            >
              Change email
            </Button>
          </div>

          <div className="flex justify-center py-1">
            <InputOTP
              maxLength={6}
              value={otpValue}
              onChange={(val) => {
                setOtpValue(val);
                if (val.length === 6) {
                  onVerifyOtpCode(val);
                }
              }}
              disabled={isLoading}
              autoFocus
            >
              <InputOTPGroup className="gap-2">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot
                    key={i}
                    index={i}
                    className="border-border/70 bg-background/60 size-11 rounded-xl border text-base font-semibold shadow-xs backdrop-blur-md"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>
      </div>

      <div className="space-y-1.5 pt-2">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-primary text-primary-foreground h-10 w-full cursor-pointer gap-2 rounded-xl font-medium shadow-xs transition-all hover:shadow-sm"
        >
          {isLoading ? "Verifying..." : "Verify Code"}
          <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
        </Button>

        <div className="text-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onResendCode}
            className="text-muted-foreground hover:text-foreground h-6 cursor-pointer text-xs"
          >
            Didn&apos;t receive code? Resend
          </Button>
        </div>
      </div>
    </form>
  );
}
