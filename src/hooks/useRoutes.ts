import { useLocation, useNavigate } from "react-router-dom";

import { getAllRoutePaths, getRouteByPath } from "@/routes/routes.config";

export function useRoutes() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get current route information
  const currentRoute = getRouteByPath(location.pathname);

  // Get all available route paths
  const allPaths = getAllRoutePaths();

  // Navigation helpers
  const goTo = (path: string) => {
    navigate(path);
  };

  const goBack = () => {
    navigate(-1);
  };

  const goForward = () => {
    navigate(1);
  };

  const goHome = () => {
    navigate("/");
  };

  // Check if current path matches a route
  const isCurrentPath = (path: string) => location.pathname === path;

  // Check if current path starts with a given path
  const isPathActive = (path: string) => location.pathname.startsWith(path);

  return {
    // Current route info
    currentPath: location.pathname,
    currentRoute,

    // Available routes
    allPaths,

    // Navigation functions
    goTo,
    goBack,
    goForward,
    goHome,

    // Path checking functions
    isCurrentPath,
    isPathActive,
  };
}
