import { ReactNode } from "react";

import { Navigate, useLocation } from "react-router-dom";

interface RouteGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

function hasAppToken(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(localStorage.getItem("APP_TOKEN"));
}

export function RouteGuard({
  children,
  requireAuth = false,
  redirectTo = "/",
}: RouteGuardProps) {
  const location = useLocation();

  // Default authentication check: look for APP_TOKEN in localStorage
  const isAuthenticated = hasAppToken();

  if (requireAuth && !isAuthenticated) {
    // Redirect to login page with return URL
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
