import { Component, ReactNode, useState } from "react";

import {
  AlertCircleIcon,
  AlertDiamondIcon,
  Bug02Icon,
  CheckmarkCircle02Icon,
  CircleArrowReload01Icon,
  Copy01Icon,
  Home01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";
import { logger } from "@/utils/logger";

export interface IErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  resetKey?: string;
  variant?: "page" | "root" | "component";
}

export interface IErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface IErrorBoundaryFallbackProps {
  error: Error;
  // eslint-disable-next-line react/no-unused-prop-types
  resetError: () => void;
}

/* ==========================================================================
   1. PAGE LEVEL FALLBACK (Default)
   - Matches the open, clean design pattern of the 404 page.
   - For route-level failures inside the main Dashboard layout shell.
   ========================================================================== */
export function PageErrorBoundaryFallback({
  error,
  resetError,
}: IErrorBoundaryFallbackProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const textToCopy = `${error.name}: ${error.message}\n\nStack Trace:\n${error.stack || "No stack trace available"}`;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      logger.error("Failed to copy error details: ", err);
    }
  };

  return (
    <Empty className="py-20">
      <EmptyHeader className="max-w-lg">
        <div className="bg-destructive/10 mb-3 flex size-12 items-center justify-center rounded-lg">
          <HugeiconsIcon
            icon={AlertCircleIcon}
            size={24}
            className="text-destructive"
          />
        </div>

        <span className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
          System Error
        </span>

        <Typography variant="h3" className="mt-2 tracking-tight">
          We couldn&apos;t load this view
        </Typography>

        <EmptyDescription className="mt-2 max-w-md text-sm">
          We&apos;ve recorded the error for troubleshooting. Please try again or
          return to the dashboard.
        </EmptyDescription>
      </EmptyHeader>

      <EmptyContent className="flex w-full max-w-md flex-col gap-4">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button variant="default" onClick={resetError} size="sm">
            <HugeiconsIcon icon={CircleArrowReload01Icon} size={14} />
            Try Again
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              window.location.href = "/";
            }}
            size="sm"
          >
            <HugeiconsIcon icon={Home01Icon} size={14} />
            Dashboard
          </Button>

          <Button
            variant="ghost"
            onClick={() => setShowDetails(!showDetails)}
            size="sm"
          >
            <HugeiconsIcon icon={Bug02Icon} size={14} />
            {showDetails ? "Hide Logs" : "Technical Details"}
          </Button>
        </div>

        <Collapsible open={showDetails} className="w-full text-left">
          <CollapsibleContent className="mt-4 space-y-2">
            <span className="text-muted-foreground/80 block text-[10px] font-bold tracking-wider uppercase">
              Error Details
            </span>

            <div className="border-border bg-muted/30 relative overflow-hidden rounded-lg border p-4 font-mono text-[11px] select-text">
              <button
                type="button"
                onClick={handleCopy}
                className="hover:bg-muted bg-background/50 border-border text-muted-foreground hover:text-foreground absolute top-2.5 right-2.5 cursor-pointer rounded-md border p-1 shadow-xs transition-colors"
                title="Copy log to clipboard"
              >
                <HugeiconsIcon
                  icon={copied ? CheckmarkCircle02Icon : Copy01Icon}
                  size={13}
                  className={cn(copied && "text-emerald-500")}
                />
              </button>

              <div className="max-h-48 overflow-y-auto pr-8">
                <span className="text-destructive block font-semibold">
                  {error.name}: {error.message}
                </span>
                {error.stack && (
                  <span className="text-muted-foreground mt-2 block overflow-x-auto font-mono leading-normal whitespace-pre-wrap">
                    {error.stack}
                  </span>
                )}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </EmptyContent>
    </Empty>
  );
}

/* ==========================================================================
   2. ROOT LEVEL FALLBACK
   - Overlay full screen view (useful when global state/sidebar/providers crash).
   - Minimalist, high contrast, centered layout.
   ========================================================================== */
export function RootErrorBoundaryFallback({
  error,
}: IErrorBoundaryFallbackProps) {
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const textToCopy = `${error.name}: ${error.message}\n\nStack Trace:\n${error.stack || "No stack trace available"}`;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      logger.error("Failed to copy error details: ", err);
    }
  };

  const handleClearCache = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/";
    } catch (err) {
      window.location.reload();
    }
  };

  return (
    <div className="bg-background animate-in fade-in fixed inset-0 z-50 flex h-screen w-screen flex-col items-center justify-center overflow-y-auto p-6 duration-300 select-none">
      <div className="flex w-full max-w-lg flex-col items-center gap-6 text-center">
        {/* Warning Icon Badge */}
        <div className="bg-destructive/10 text-destructive border-destructive/20 flex size-14 items-center justify-center rounded-xl border shadow-xs">
          <HugeiconsIcon icon={AlertDiamondIcon} size={28} />
        </div>

        {/* Text Headers */}
        <div className="flex max-w-md flex-col gap-2">
          <span className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
            Critical System Failure
          </span>
          <Typography
            variant="h2"
            className="text-foreground font-semibold tracking-tight"
          >
            System crashed
          </Typography>
          <p className="text-muted-foreground mt-1 text-sm leading-relaxed text-balance">
            A critical core dependency failed to initialize. We have
            automatically saved a diagnostic trace. You can reload the system,
            reset cache, or contact technical support.
          </p>
        </div>

        {/* Core Controls */}
        <div className="flex w-full flex-col items-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button
              variant="default"
              onClick={() => window.location.reload()}
              size="sm"
            >
              <HugeiconsIcon icon={CircleArrowReload01Icon} size={14} />
              Reload Application
            </Button>

            <Button variant="outline" onClick={handleClearCache} size="sm">
              <HugeiconsIcon icon={Home01Icon} size={14} />
              Reset Cache & Home
            </Button>

            <Button
              variant="ghost"
              onClick={() => setShowDiagnostics(!showDiagnostics)}
              size="sm"
            >
              <HugeiconsIcon icon={Bug02Icon} size={14} />
              {showDiagnostics ? "Hide Diagnostics" : "Diagnostics"}
            </Button>
          </div>

          {/* Expandable Debugger Panel */}
          <Collapsible open={showDiagnostics} className="w-full text-left">
            <CollapsibleContent className="mt-2 space-y-2">
              <span className="text-muted-foreground/80 block text-[10px] font-bold tracking-wider uppercase">
                Diagnostics Trace
              </span>

              <div className="border-border bg-muted/40 relative overflow-hidden rounded-lg border p-4 font-mono text-[11px] shadow-xs select-text">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="hover:bg-muted bg-background/50 border-border text-muted-foreground hover:text-foreground absolute top-2.5 right-2.5 cursor-pointer rounded-md border p-1 shadow-xs transition-colors"
                  title="Copy log to clipboard"
                >
                  <HugeiconsIcon
                    icon={copied ? CheckmarkCircle02Icon : Copy01Icon}
                    size={13}
                    className={cn(copied && "text-emerald-500")}
                  />
                </button>

                <div className="max-h-56 overflow-y-auto pr-8">
                  <span className="text-destructive block font-semibold">
                    {error.name}: {error.message}
                  </span>
                  {error.stack && (
                    <span className="text-muted-foreground mt-2 block overflow-x-auto font-mono leading-normal whitespace-pre-wrap">
                      {error.stack}
                    </span>
                  )}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   3. COMPONENT LEVEL FALLBACK (Widgets/Cards)
   - Highly compact, fits inside small cards/panels (e.g. charts, lists).
   - Prevents a single component crash from breaking the entire page.
   ========================================================================== */
export function ComponentErrorBoundaryFallback({
  error,
  resetError,
}: IErrorBoundaryFallbackProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const textToCopy = `${error.name}: ${error.message}\n\nStack Trace:\n${error.stack || "No stack trace available"}`;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      logger.error("Failed to copy error details: ", err);
    }
  };

  return (
    <div className="border-border bg-muted/10 flex h-full min-h-50 w-full flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center select-none">
      {/* Red Alert Circle Icon */}
      <div className="bg-destructive/10 text-destructive mb-2 rounded-full p-2.5">
        <HugeiconsIcon icon={Bug02Icon} size={20} />
      </div>

      {/* Mini Title */}
      <span className="text-foreground text-xs font-semibold">
        Component crashed
      </span>

      {/* Truncated Error Message */}
      <p className="text-muted-foreground mt-1 line-clamp-3 max-w-65 px-2 text-[10px] leading-normal">
        {error.message ||
          "An unhandled exception occurred in this dynamic module."}
      </p>

      {/* Mini Control Row */}
      <div className="mt-4 flex items-center gap-1.5">
        <Button
          variant="outline"
          onClick={resetError}
          size="xs"
          className="h-6 px-2.5 text-[10px] font-medium"
        >
          <HugeiconsIcon icon={CircleArrowReload01Icon} size={11} />
          Retry
        </Button>

        <Button
          variant="ghost"
          onClick={handleCopy}
          size="icon-xs"
          className="text-muted-foreground hover:text-foreground hover:border-border hover:bg-background h-6 w-6 border border-transparent shadow-none"
          title="Copy diagnostics to clipboard"
        >
          <HugeiconsIcon
            icon={copied ? CheckmarkCircle02Icon : Copy01Icon}
            size={11}
            className={cn(copied && "text-emerald-500")}
          />
        </Button>
      </div>
    </div>
  );
}

/* ==========================================================================
   4. ERROR BOUNDARY MAIN CLASS COMPONENT
   ========================================================================== */
export class ErrorBoundary extends Component<
  IErrorBoundaryProps,
  IErrorBoundaryState
> {
  constructor(props: IErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): IErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidUpdate(prevProps: IErrorBoundaryProps) {
    // Reset state automatically if the route (pathname/resetKey) changes
    const { hasError } = this.state;
    const { resetKey } = this.props;

    if (hasError && resetKey !== prevProps.resetKey) {
      this.resetError();
    }
  }

  componentDidCatch(_error: Error, _errorInfo: unknown) {
    // Proactively log details to developer console
    logger.error("ErrorBoundary caught an exception:", _error, _errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    const { hasError, error } = this.state;
    const { fallback, children, variant = "page" } = this.props;

    if (hasError && error) {
      // Allow custom functional overrides
      if (typeof fallback === "function") {
        return fallback(error, this.resetError);
      }
      // Allow static component overrides
      if (fallback) {
        return fallback;
      }

      // Render fallback according to requested variant
      if (variant === "root") {
        return (
          <RootErrorBoundaryFallback
            error={error}
            resetError={this.resetError}
          />
        );
      }
      if (variant === "component") {
        return (
          <ComponentErrorBoundaryFallback
            error={error}
            resetError={this.resetError}
          />
        );
      }

      // Default: Page Level Boundary
      return (
        <PageErrorBoundaryFallback error={error} resetError={this.resetError} />
      );
    }

    return children;
  }
}
