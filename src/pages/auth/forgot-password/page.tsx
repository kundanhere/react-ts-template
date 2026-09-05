import * as React from "react";

import { useNavigate } from "react-router-dom";

import { ThemeToggle } from "@/components/theme-toggle";
import { toast } from "@/components/ui/toast";

import type { RecoveryStep } from "../../../types/auth";
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
  const [isLoading, setIsLoading] = React.useState(false);

  // Step 1: Send OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your account email");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("otp");
      toast.success(`Verification code sent to ${email}`);
    }, 1000);
  };

  // Step 2: Verify OTP
  const verifyOtpCode = React.useCallback(
    (code: string) => {
      if (code.length < 6 || isLoading) return;

      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setStep("password");
        toast.success("Code verified. Please set your new password.");
      }, 700);
    },
    [isLoading]
  );

  const handleVerifyOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (otpValue.length < 6) {
      toast.error("Please enter the complete 6-digit verification code");
      return;
    }
    verifyOtpCode(otpValue);
  };

  // Step 3: Set New Password
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Password updated successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1200);
    }, 1000);
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
                onResendCode={() => {
                  toast.success(`New verification code sent to ${email}`);
                }}
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
