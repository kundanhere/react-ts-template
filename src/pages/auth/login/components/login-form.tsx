import * as React from "react";

import {
  LockKeyIcon,
  Mail02Icon,
  ViewIcon,
  ViewOffIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("name@example.com");
  const [password, setPassword] = React.useState("password123");
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all credentials");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Welcome back! Redirecting to dashboard...");
      navigate("/dashboard");
    }, 900);
  };

  const handleSocialLogin = (provider: string) => {
    toast.info(`Initiating ${provider} authentication...`);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`Authenticated with ${provider}. Redirecting...`);
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className={cn("flex w-full flex-col gap-5", className)} {...props}>
      {/* Social Login Buttons: Google & Apple */}
      <div className="grid w-full grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          onClick={() => handleSocialLogin("Google")}
          className="border-border/80 bg-background/80 hover:bg-muted/60 h-10 w-full cursor-pointer gap-2 rounded-xl text-xs font-medium transition-colors"
        >
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
          <span>Google</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          onClick={() => handleSocialLogin("Apple")}
          className="border-border/80 bg-background/80 hover:bg-muted/60 h-10 w-full cursor-pointer gap-2 rounded-xl text-xs font-medium transition-colors"
        >
          <svg
            className="text-foreground size-4 shrink-0 fill-current"
            viewBox="0 0 24 24"
          >
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.7-1.13 1.84-1.01 2.96.97.08 2.07-.54 2.84-1.35z" />
          </svg>
          <span>Apple</span>
        </Button>
      </div>

      {/* Clean Divider */}
      <div className="relative flex items-center justify-center py-1">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="bg-background text-muted-foreground relative px-3 text-[0.6875rem] font-medium tracking-wider uppercase">
          or continue with
        </div>
      </div>

      {/* Credentials Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-1.5">
          <Label
            htmlFor="email"
            className="text-foreground/80 text-xs font-medium"
          >
            Email
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
              className="border-border/80 bg-muted/30 focus-visible:bg-background h-10 rounded-xl pl-10 text-sm transition-colors"
            />
            <HugeiconsIcon
              icon={Mail02Icon}
              className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <Label
            htmlFor="password"
            className="text-foreground/80 text-xs font-medium"
          >
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="border-border/80 bg-muted/30 focus-visible:bg-background h-10 rounded-xl pr-10 pl-10 text-sm transition-colors"
            />
            <HugeiconsIcon
              icon={LockKeyIcon}
              className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-muted-foreground hover:text-foreground absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3.5"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <HugeiconsIcon
                icon={showPassword ? ViewOffIcon : ViewIcon}
                className="size-4"
              />
            </button>
          </div>
        </div>

        {/* Remember me & Forgot Password */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(!!checked)}
              disabled={isLoading}
            />
            <Label
              htmlFor="remember"
              className="text-muted-foreground cursor-pointer text-xs font-normal select-none"
            >
              Remember me
            </Label>
          </div>
          <Link
            to="/forgot-password"
            className="text-primary font-medium transition-colors hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 w-full cursor-pointer rounded-xl text-sm font-medium shadow-xs transition-all"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>

        {/* Request Access */}
        <p className="text-muted-foreground pt-1 text-center text-xs">
          Don&apos;t have an access?{" "}
          <button
            type="button"
            onClick={() =>
              toast.info(
                "Access request submitted to administrators for review."
              )
            }
            className="text-foreground hover:text-primary cursor-pointer font-medium underline underline-offset-4 transition-colors"
          >
            Request access
          </button>
        </p>

        {/* Legal Disclaimer */}
        <p className="text-muted-foreground/70 pt-2 text-center text-[0.6875rem] leading-relaxed">
          By continuing, you agree to our{" "}
          <a
            href="/support"
            className="hover:text-foreground underline underline-offset-2"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="/support"
            className="hover:text-foreground underline underline-offset-2"
          >
            Privacy Policy
          </a>
          .
        </p>
      </form>
    </div>
  );
}
