import { lazy } from "react";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Layout } from "@/components/layout";
import { RouteGuard } from "@/components/route-guard";
import BlogIndex from "@/pages/BlogIndex";

// Define route types
interface RouteConfig {
  path?: string;
  index?: boolean;
  element?: JSX.Element;
  title?: string;
  description?: string;
  children?: RouteConfig[];
}

// Lazy load components for better performance
const Home = lazy(() => import("@/pages/Home"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));
const UserProfile = lazy(() => import("@/pages/UserProfile"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));

// DashboardProtected wrapper
const DashboardProtected = () => (
  <ErrorBoundary>
    <RouteGuard requireAuth={true} redirectTo="/">
      <Dashboard />
    </RouteGuard>
  </ErrorBoundary>
);

// Route configuration object
export const routes: RouteConfig[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
        title: "Home",
        description: "Welcome to React TS Template",
      },
      {
        path: "blog",
        children: [
          {
            index: true,
            element: <BlogIndex />,
            title: "Blog",
            description: "Blog index page",
          },
          {
            path: ":slug",
            element: <BlogPost />,
            title: "Blog Post",
            description: "Blog post details",
          },
        ],
      },
      {
        path: "user/:id",
        element: <UserProfile />,
        title: "User Profile",
        description: "User profile details",
      },
      {
        path: "dashboard",
        element: <DashboardProtected />,
        title: "Dashboard",
        description: "Protected dashboard page",
      },
      {
        path: "*",
        element: <NotFound />,
        title: "404 - Not Found",
        description: "Page not found",
      },
    ],
  },
];

// Helper function to get route by path
export const getRouteByPath = (path: string): RouteConfig | null => {
  const findRoute = (
    routeList: RouteConfig[],
    targetPath: string
  ): RouteConfig | null => {
    for (const route of routeList) {
      if (route.path === targetPath) {
        return route;
      }
      if (route.children) {
        const childRoute = findRoute(route.children, targetPath);
        if (childRoute) return childRoute;
      }
    }
    return null;
  };

  return findRoute(routes, path);
};

// Helper function to get all route paths
export const getAllRoutePaths = (): string[] => {
  const paths: string[] = [];

  const extractPaths = (routeList: RouteConfig[]) => {
    routeList.forEach((route: RouteConfig) => {
      if (route.path) {
        paths.push(route.path);
      }
      if (route.children) {
        extractPaths(route.children);
      }
    });
  };

  extractPaths(routes);
  return paths;
};
