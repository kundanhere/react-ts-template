import * as React from "react";

import { ShieldKeyIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("kundan@example.com");
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
      toast.success("Access authorized. Redirecting to Sentry IAM...");
      navigate("/dashboard");
    }, 1200);
  };

  return (
    <div
      className={cn("flex w-full max-w-4xl flex-col gap-6", className)}
      {...props}
    >
      <Card className="border-border/80 overflow-hidden p-0 shadow-none dark:border-white/5">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Left Panel: Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center p-8"
          >
            <div className="space-y-6">
              {/* Logo / Title */}
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-xl">
                  <HugeiconsIcon icon={ShieldKeyIcon} className="size-6" />
                </div>
                <h1 className="mt-2 text-xl font-bold tracking-tight">
                  Welcome back
                </h1>
                <p className="text-muted-foreground text-[11px] leading-normal text-balance">
                  Sign in to access Sentry IAM central administrator dashboard
                </p>
              </div>

              {/* Input Fields */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@sentry-iam.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs font-semibold">
                      Password
                    </Label>
                    <button
                      type="button"
                      onClick={() => {
                        toast.info("Password recovery email sent.");
                      }}
                      className="text-primary cursor-pointer border-0 bg-transparent p-0 text-[11px] font-medium hover:underline"
                    >
                      Forgot your password?
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-9 pr-10 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-muted-foreground hover:text-foreground absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3"
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(!!checked)}
                    disabled={isLoading}
                  />
                  <Label
                    htmlFor="remember"
                    className="text-muted-foreground cursor-pointer text-[11px] leading-none"
                  >
                    Keep me signed in on this device
                  </Label>
                </div>
              </div>

              {/* Login Action */}
              <Button
                type="submit"
                disabled={isLoading}
                className="mt-2 h-9 w-full text-xs font-semibold"
              >
                {isLoading ? "Verifying credentials..." : "Sign In to Console"}
              </Button>

              {/* Divider */}
              <div className="relative flex items-center py-1">
                <div className="border-border/60 grow border-t" />
                <span className="text-muted-foreground mx-4 shrink text-[10px] font-bold tracking-wider uppercase">
                  Or secure SSO
                </span>
                <div className="border-border/60 grow border-t" />
              </div>

              {/* Social Buttons */}
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  type="button"
                  disabled={isLoading}
                  onClick={() => {
                    toast.success("Initiating Google Workspace SSO...");
                  }}
                  className="hover:bg-muted/40 h-8 cursor-pointer justify-center gap-0 px-3 text-[11px] font-medium sm:gap-1.5"
                >
                  <svg className="size-3.5 shrink-0" viewBox="0 0 24 24">
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
                  <span className="hidden sm:inline">Google</span>
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  disabled={isLoading}
                  onClick={() => {
                    toast.success("Initiating Apple authentication...");
                  }}
                  className="hover:bg-muted/40 h-8 cursor-pointer justify-center gap-0 px-3 text-[11px] font-medium sm:gap-1.5"
                >
                  <svg
                    className="text-foreground size-3.5 shrink-0"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.7-1.13 1.84-1.01 2.96.97.08 2.07-.54 2.84-1.35z" />
                  </svg>
                  <span className="hidden sm:inline">Apple</span>
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  disabled={isLoading}
                  onClick={() => {
                    toast.success("Initiating Meta Link...");
                  }}
                  className="hover:bg-muted/40 h-8 cursor-pointer justify-center gap-0 px-3 text-[11px] font-medium sm:gap-1.5"
                >
                  <svg
                    className="text-foreground size-3.5 shrink-0"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z" />
                  </svg>
                  <span className="hidden sm:inline">Meta</span>
                </Button>
              </div>
            </div>
          </form>

          {/* Right Panel: Minimalist brand panel */}
          <div className="border-border/60 relative hidden flex-col items-center justify-center border-l bg-zinc-950 p-8 text-white select-none md:flex">
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] bg-size-[4rem_4rem] opacity-35" />

            {/* Squircle brand icon in center */}
            <div className="relative z-10 flex flex-col items-center gap-6">
              <div className="relative flex size-32 items-center justify-center">
                <svg className="absolute inset-0 size-full" viewBox="0 0 96 96">
                  {/* Outermost */}
                  <path
                    d="M 48,0 C 86.4,0 96,9.6 96,48 C 96,86.4 86.4,96 48,96 C 9.6,96 0,86.4 0,48 C 0,9.6 9.6,0 48,0 Z"
                    className="stroke-primary/20 fill-primary/3"
                    strokeWidth="1"
                  />
                  {/* Middle */}
                  <path
                    d="M 48,8 C 80,8 88,16 88,48 C 88,80 80,88 48,88 C 16,88 8,80 8,48 C 8,16 16,8 48,8 Z"
                    className="stroke-primary/40 fill-primary/5"
                    strokeWidth="1.5"
                  />
                  {/* Innermost */}
                  <path
                    d="M 48,20 C 70.4,20 76,25.6 76,48 C 76,70.4 70.4,76 48,76 C 25.6,76 20,70.4 20,48 C 20,25.6 25.6,20 48,20 Z"
                    className="stroke-primary/60 fill-zinc-900"
                    strokeWidth="2"
                  />
                </svg>
                <div className="text-primary relative z-10 flex items-center justify-center drop-shadow-[0_0_12px_rgba(var(--primary),0.5)]">
                  <HugeiconsIcon icon={ShieldKeyIcon} className="size-10" />
                </div>
              </div>

              {/* Slogan */}
              <div className="max-w-xs space-y-2 text-center">
                <h2 className="text-xl font-bold tracking-tight">Sentry IAM</h2>
                <p className="text-xs leading-relaxed text-zinc-400">
                  Enterprise-grade identity governance, granular access
                  controls, and real-time security auditing.
                </p>
              </div>
            </div>

            {/* Version indicator */}
            <div className="absolute bottom-6 text-[10px] tracking-wider text-zinc-600">
              ENTERPRISE PLATFORM v1.0.4
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-muted-foreground text-center text-[10px] leading-normal">
        By continuing, you agree to Sentry IAM's{" "}
        <a
          href="/terms"
          className="hover:text-foreground underline underline-offset-2"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="/privacy"
          className="hover:text-foreground underline underline-offset-2"
        >
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}
