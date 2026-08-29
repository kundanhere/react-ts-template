import { lazy } from "react";

import { ErrorBoundary } from "@/app/error-boundary";
import { Layout } from "@/layout";
import { RouteGuard } from "@/routes/route-guard";

// Define route types
export interface IRouteConfig {
  path?: string;
  index?: boolean;
  element?: JSX.Element;
  title?: string;
  description?: string;
  children?: IRouteConfig[];
}

// Lazy load page components
const HomePage = lazy(() => import("@/pages/home/page"));
const NotFoundPage = lazy(() => import("@/pages/not-found/page"));
const DashboardPage = lazy(() => import("@/pages/dashboard/page"));
const AnalyticsPage = lazy(() => import("@/pages/monitoring/analytics/page"));
const UsersPage = lazy(() => import("@/pages/iam/users/page"));
const UserDetailPage = lazy(() => import("@/pages/iam/users/user-detail"));
const RolesPage = lazy(() => import("@/pages/iam/roles/page"));
const RoleDetailPage = lazy(() => import("@/pages/iam/roles/role-detail"));
const PoliciesPage = lazy(() => import("@/pages/iam/policies/page"));
const PolicyBuilderPage = lazy(
  () => import("@/pages/iam/policies/policy-builder")
);
const PolicyDetailPage = lazy(
  () => import("@/pages/iam/policies/policy-detail")
);
const ModulesPage = lazy(() => import("@/pages/iam/modules/page"));
const SettingsPage = lazy(() => import("@/pages/settings/page"));
const SessionsPage = lazy(() => import("@/pages/iam/sessions/page"));
const AuditLogsPage = lazy(() => import("@/pages/monitoring/audit-logs/page"));
const MyActivityPage = lazy(() => import("@/pages/monitoring/activity/page"));
const AccessMatrixPage = lazy(() => import("@/pages/iam/access-matrix/page"));
const PolicySimulatorPage = lazy(
  () => import("@/pages/iam/policies/policy-simulator")
);
const UpdatesPage = lazy(() => import("@/pages/updates/page"));
const InboxPage = lazy(() => import("@/pages/inbox/page"));
const SupportPage = lazy(() => import("@/pages/support/page"));
const FeedbackPage = lazy(() => import("@/pages/feedback/page"));

// DashboardProtected wrapper
const DashboardProtected = () => (
  <ErrorBoundary>
    <RouteGuard requireAuth redirectTo="/">
      <DashboardPage />
    </RouteGuard>
  </ErrorBoundary>
);

// Route configuration object
export const routes: IRouteConfig[] = [
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
        element: <HomePage />,
        title: "Security Settings",
        description: "Security and MFA settings",
      },
      {
        path: "/settings",
        element: <SettingsPage />,
        title: "Settings",
        description: "System settings",
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
export const getRouteByPath = (path: string): IRouteConfig | null => {
  const findRoute = (
    routeList: IRouteConfig[],
    targetPath: string
  ): IRouteConfig | null => {
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

  const extractPaths = (routeList: IRouteConfig[]) => {
    routeList.forEach((route: IRouteConfig) => {
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
