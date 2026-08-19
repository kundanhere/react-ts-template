import { lazy } from "react";

import { ErrorBoundary } from "@/components/error-boundary";
import { Layout } from "@/components/layout";
import { RouteGuard } from "@/components/route-guard";

// Define route types
export interface RouteConfig {
  path?: string;
  index?: boolean;
  element?: JSX.Element;
  title?: string;
  description?: string;
  children?: RouteConfig[];
}

// Lazy load page components
const HomePage = lazy(() => import("@/pages/Home"));
const NotFoundPage = lazy(() => import("@/pages/NotFound"));
const DashboardPage = lazy(() => import("@/pages/Dashboard"));
const AnalyticsPage = lazy(() => import("@/pages/IAM/Analytics"));
const UsersPage = lazy(() => import("@/pages/IAM/Users"));
const UserDetailPage = lazy(() => import("@/pages/IAM/UserDetail"));
const RolesPage = lazy(() => import("@/pages/IAM/Roles"));
const RoleDetailPage = lazy(() => import("@/pages/IAM/RoleDetail"));
const PoliciesPage = lazy(() => import("@/pages/IAM/Policies"));
const PolicyBuilderPage = lazy(() => import("@/pages/IAM/PolicyBuilder"));
const PolicyDetailPage = lazy(() => import("@/pages/IAM/PolicyDetail"));
const ModulesPage = lazy(() => import("@/pages/IAM/Modules"));
const SecuritySettingsPage = lazy(() => import("@/pages/IAM/SecuritySettings"));
const SessionsPage = lazy(() => import("@/pages/IAM/Sessions"));
const AuditLogsPage = lazy(() => import("@/pages/IAM/AuditLogs"));
const MyActivityPage = lazy(() => import("@/pages/IAM/MyActivity"));
const AccessMatrixPage = lazy(() => import("@/pages/IAM/AccessMatrix"));
const PolicySimulatorPage = lazy(() => import("@/pages/IAM/PolicySimulator"));
const UpdatesPage = lazy(() => import("@/pages/Updates"));
const InboxPage = lazy(() => import("@/pages/Inbox"));
const SupportPage = lazy(() => import("@/pages/Support"));
const FeedbackPage = lazy(() => import("@/pages/Feedback"));

// DashboardProtected wrapper
const DashboardProtected = () => (
  <ErrorBoundary>
    <RouteGuard requireAuth redirectTo="/">
      <DashboardPage />
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
        element: <HomePage />,
        title: "Home",
        description: "Welcome to Sentry IAM",
      },
      {
        path: "dashboard",
        element: <DashboardProtected />,
        title: "Overview",
        description: "Protected dashboard page",
      },
      {
        path: "iam/dashboard",
        element: <AnalyticsPage />,
        title: "Analytics & Metrics",
        description: "IAM real-time security analytics",
      },
      {
        path: "iam/users",
        element: <UsersPage />,
        title: "Users",
        description: "User Management - IAM",
      },
      {
        path: "iam/users/:id",
        element: <UserDetailPage />,
        title: "User Details",
        description: "User detail and permissions",
      },
      {
        path: "iam/roles",
        element: <RolesPage />,
        title: "Roles",
        description: "Roles Management - IAM",
      },
      {
        path: "iam/roles/:id",
        element: <RoleDetailPage />,
        title: "Role Details",
        description: "Role details and permissions matrix",
      },
      {
        path: "iam/policies",
        element: <PoliciesPage />,
        title: "Policies",
        description: "Policies Registry - IAM",
      },
      {
        path: "iam/policies/new",
        element: <PolicyBuilderPage />,
        title: "Policy Builder",
        description: "Create custom JSON access policy",
      },
      {
        path: "iam/policies/:id",
        element: <PolicyDetailPage />,
        title: "Policy Inspector",
        description: "Inspect JSON policy definition",
      },
      {
        path: "iam/modules",
        element: <ModulesPage />,
        title: "Modules",
        description: "Modules Management - IAM",
      },
      {
        path: "iam/security/settings",
        element: <SecuritySettingsPage />,
        title: "Security Settings",
        description: "Security and MFA settings",
      },
      {
        path: "iam/sessions",
        element: <SessionsPage />,
        title: "Active Sessions",
        description: "Active system sessions management",
      },
      {
        path: "iam/audit",
        element: <AuditLogsPage />,
        title: "Audit Trail",
        description: "System audit log trail",
      },
      {
        path: "iam/audit/logs",
        element: <AuditLogsPage />,
        title: "System Audit Logs",
        description: "System audit logs overview",
      },
      {
        path: "iam/audit/me",
        element: <MyActivityPage />,
        title: "My Activity Log",
        description: "Personal account audit log",
      },
      {
        path: "iam/access-matrix",
        element: <AccessMatrixPage />,
        title: "Access Matrix",
        description: "Role x Module capability grid",
      },
      {
        path: "iam/access/simulate",
        element: <PolicySimulatorPage />,
        title: "Policy Simulator",
        description: "Policy engine testing simulator",
      },
      {
        path: "updates",
        element: <UpdatesPage />,
        title: "Updates",
        description: "System updates and release notes",
      },
      {
        path: "inbox",
        element: <InboxPage />,
        title: "Inbox",
        description: "Notifications and alerts",
      },
      {
        path: "support",
        element: <SupportPage />,
        title: "Support",
        description: "Help center and support",
      },
      {
        path: "feedback",
        element: <FeedbackPage />,
        title: "Feedback",
        description: "User feedback and suggestions",
      },
      {
        path: "*",
        element: <NotFoundPage />,
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
