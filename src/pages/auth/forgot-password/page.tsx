import * as React from "react";

import { useNavigate } from "react-router-dom";

import { ThemeToggle } from "@/components/theme-toggle";
import { toast } from "@/components/ui/toast";
import {
  usePasswordResetConfirmMutation,
  usePasswordResetRequestMutation,
  useVerifyOtpMutation,
} from "@/hooks/use-auth";
import type { RecoveryStep } from "@/types";

import { EmailStepForm } from "./components/email-step-form";
import { OtpStepForm } from "./components/otp-step-form";
import { PasswordStepForm } from "./components/password-step-form";
import { RecoveryBlobs } from "./components/recovery-blobs";
import { RecoveryCard } from "./components/recovery-card";
import { RecoveryStepper } from "./components/recovery-stepper";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = React.useState<RecoveryStep>("email");
  const [email, setEmail] = React.useState("");
  const [otpValue, setOtpValue] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [cooldown, setCooldown] = React.useState(0);

  const resetRequestMutation = usePasswordResetRequestMutation();
  const verifyOtpMutation = useVerifyOtpMutation();
  const resetConfirmMutation = usePasswordResetConfirmMutation();

  const isLoading =
    resetRequestMutation.isPending ||
    verifyOtpMutation.isPending ||
    resetConfirmMutation.isPending;

  // Countdown timer for rate-limit resend cooldown
  React.useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Step 1: Send OTP
  const handleSendOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      toast.error("Validation Error", "Please enter your account email");
      return;
    }

    resetRequestMutation.mutate(
      { email: cleanEmail },
      {
        onSuccess: (res) => {
          setStep("otp");
          setOtpValue("");
          // If server provided remainingSeconds or rate limit cooldown
          const remaining =
            (res.payload as { remainingSeconds?: number })?.remainingSeconds ||
            60;
          setCooldown(remaining);
        },
        onError: (err) => {
          const remaining = (err.payload as { remainingSeconds?: number })
            ?.remainingSeconds;
          if (remaining) {
            setCooldown(remaining);
          }
          const description =
            err.messages?.length > 1
              ? err.messages.join(" • ")
              : err.firstMessage;
          toast.error(
            err.messageCode === "TOO_MANY_REQUESTS"
              ? "Rate Limited"
              : "Request Failed",
            description || "Unable to send verification code."
          );
        },
      }
    );
  };

  // Step 2: Verify OTP
  const verifyOtpCode = React.useCallback(
    (code: string) => {
      if (code.length < 6 || verifyOtpMutation.isPending) return;

      verifyOtpMutation.mutate(
        {
          identifier: email.trim(),
          code: code.trim(),
          purpose: "PASSWORD_RESET",
        },
        {
          onSuccess: () => {
            setStep("password");
          },
          onError: (err) => {
            const description =
              err.messages?.length > 1
                ? err.messages.join(" • ")
                : err.firstMessage;
            if (err.messageCode === "OTP_ATTEMPTS_EXCEEDED") {
              toast.error(
                "Attempts Exceeded",
                description ||
                  "Too many failed attempts. Please request a new OTP."
              );
            } else if (err.messageCode === "INVALID_OTP") {
              toast.error(
                "Invalid Code",
                description || "Invalid or expired OTP code."
              );
            } else {
              toast.error(
                "Verification Failed",
                description || "Failed to verify OTP."
              );
            }
          },
        }
      );
    },
    [email, verifyOtpMutation]
  );

  const handleVerifyOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (otpValue.length < 6) return;
    verifyOtpCode(otpValue);
  };

  // Step 3: Set New Password
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !newPassword ||
      newPassword.length < 8 ||
      newPassword !== confirmPassword
    )
      return;

    resetConfirmMutation.mutate(
      { newPassword },
      {
        onSuccess: (res) => {
          toast.success(
            "Password Updated",
            typeof res.message === "string"
              ? res.message
              : "Password updated successfully. Redirecting to login..."
          );
          setTimeout(() => navigate("/login", { replace: true }), 1200);
        },
        onError: (err) => {
          const description =
            err.messages?.length > 1
              ? err.messages.join(" • ")
              : err.firstMessage;
          if (err.messageCode === "BAD_REQUEST") {
            toast.error(
              "Session Expired",
              description ||
                "Reset token is required or session has expired. Please start again."
            );
          } else {
            toast.error(
              "Update Failed",
              description || "Failed to reset password."
            );
          }
        },
      }
    );
  };

  return (
    <section className="bg-background relative flex min-h-screen items-center justify-center overflow-hidden py-8 sm:py-10">
      {/* Theme Switcher in top corner */}
      <div className="absolute top-5 right-5 z-30">
        <ThemeToggle />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex w-full flex-col justify-between gap-10 lg:flex-row lg:items-center lg:gap-16">
          {/* Left Column: Account Recovery steps explanation */}
          <RecoveryStepper step={step} />

          {/* Right Column: Frosted Glassmorphism Card */}
          <RecoveryCard step={step}>
            {step === "email" && (
              <EmailStepForm
                email={email}
                setEmail={setEmail}
                isLoading={isLoading}
                onSubmit={handleSendOtp}
              />
            )}

            {step === "otp" && (
              <OtpStepForm
                email={email}
                otpValue={otpValue}
                setOtpValue={setOtpValue}
                isLoading={isLoading}
                onVerifyOtpCode={verifyOtpCode}
                onSubmit={handleVerifyOtp}
                onChangeEmail={() => setStep("email")}
                onResendCode={() => handleSendOtp()}
                resendCooldown={cooldown}
              />
            )}

            {step === "password" && (
              <PasswordStepForm
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                isLoading={isLoading}
                onSubmit={handleResetPassword}
              />
            )}
          </RecoveryCard>
        </div>
      </div>

      {/* Signature Animated Glowing Blobs background */}
      <RecoveryBlobs />
    </section>
  );
}
