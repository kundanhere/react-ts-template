import * as React from "react";

import {
  ArrowRight01Icon,
  ViewIcon,
  ViewOffIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface IPasswordStepFormProps {
  newPassword: string;
  setNewPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function PasswordStepForm({
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  isLoading,
  onSubmit,
}: IPasswordStepFormProps) {
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-1 flex-col justify-between pt-1"
    >
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label
            htmlFor="new-password"
            className="text-muted-foreground text-xs font-medium"
          >
            New Password
          </Label>
          <div className="relative">
            <Input
              id="new-password"
              type={showNewPassword ? "text" : "password"}
              placeholder="At least 8 characters"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isLoading}
              className="bg-background/50 border-border/70 focus-visible:border-primary focus-visible:ring-primary/20 h-10 rounded-xl pr-10 text-sm shadow-xs backdrop-blur-sm transition-all"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="text-muted-foreground hover:text-foreground absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3"
              tabIndex={-1}
              aria-label={showNewPassword ? "Hide password" : "Show password"}
            >
              <HugeiconsIcon
                icon={showNewPassword ? ViewOffIcon : ViewIcon}
                className="size-4"
              />
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="confirm-password"
            className="text-muted-foreground text-xs font-medium"
          >
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              className="bg-background/50 border-border/70 focus-visible:border-primary focus-visible:ring-primary/20 h-10 rounded-xl pr-10 text-sm shadow-xs backdrop-blur-sm transition-all"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-muted-foreground hover:text-foreground absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3"
              tabIndex={-1}
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              <HugeiconsIcon
                icon={showConfirmPassword ? ViewOffIcon : ViewIcon}
                className="size-4"
              />
            </button>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="bg-primary text-primary-foreground mt-4 h-10 w-full cursor-pointer gap-2 rounded-xl font-medium shadow-xs transition-all hover:shadow-sm"
      >
        {isLoading ? "Updating Password..." : "Update Password"}
        <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
      </Button>
    </form>
  );
}
