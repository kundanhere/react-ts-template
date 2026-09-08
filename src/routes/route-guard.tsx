import { ReactNode } from "react";

import { Navigate, useLocation } from "react-router-dom";

import { useCurrentAuth } from "@/hooks/use-auth";
import { IModuleAccess } from "@/types";

export interface IRouteGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  guestOnly?: boolean;
  redirectTo?: string;
  requiredModule?: string;
  requiredAction?: keyof IModuleAccess;
}

export function RouteGuard({
  children,
  requireAuth = false,
  guestOnly = false,
  redirectTo,
  requiredModule,
  requiredAction = "view",
}: IRouteGuardProps) {
  const location = useLocation();
  const { isAuthenticated, isLoading, isRestoring, isRevalidating, access } =
    useCurrentAuth();

  // Storage cache restoration: wait only for local persistence hydration
  if (isRestoring) {
    return (
      <div className="flex min-h-[60vh] flex-1 items-center justify-center">
        <div className="border-primary/20 border-t-primary h-8 w-8 animate-spin rounded-full border-4" />
      </div>
    );
  }

  // Guest-only routes (e.g. /login, /forgot-password)
  if (guestOnly) {
    if (isAuthenticated) {
      const defaultRedirect =
        (location.state as { from?: { pathname: string } })?.from?.pathname ||
        "/";
      return <Navigate to={redirectTo || defaultRedirect} replace />;
    }
    return <>{children}</>;
  }

  // Show spinner while validating session on cold start or when required permissions are in flight
  const isPermissionsLoading =
    Boolean(requiredModule) &&
    isRevalidating &&
    (!access || !access[requiredModule!]);

  if (requireAuth && (isLoading || isPermissionsLoading)) {
    return (
      <div className="flex min-h-[60vh] flex-1 items-center justify-center">
        <div className="border-primary/20 border-t-primary h-8 w-8 animate-spin rounded-full border-4" />
      </div>
    );
  }

  // 4. Protected routes with unauthenticated user: redirect to login
  if (requireAuth && !isAuthenticated) {
    const loginRedirect = redirectTo || "/login";
    return <Navigate to={loginRedirect} state={{ from: location }} replace />;
  }

  // 4. Authorization check:
  // If route requires a specific module permission
  if (requireAuth && isAuthenticated && requiredModule) {
    const modulePerms = access[requiredModule];
    const hasAccess = Boolean(
      modulePerms?.full || (modulePerms && modulePerms[requiredAction])
    );

    if (!hasAccess) {
      return (
        <div className="flex min-h-[80vh] flex-col items-center justify-center gap-3 p-6 text-center">
          <div className="bg-destructive/10 text-destructive rounded-full p-3">
            <svg
              className="size-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold">Access Denied</h2>
          <p className="text-muted-foreground max-w-sm text-sm">
            You do not have permission to access the{" "}
            <span className="text-foreground font-semibold">
              {requiredModule}
            </span>{" "}
            module with{" "}
            <span className="text-foreground font-semibold">
              {requiredAction}
            </span>{" "}
            action.
          </p>
        </div>
      );
    }
  }

  return <>{children}</>;
}
