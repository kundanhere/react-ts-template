// Global constants for the app

export const APP_NAME = "SENTRY_IAM_ACCESS_CONSOLE";

/**
 * Centralized Query Key Factory for TanStack React Query.
 * Provides hierarchical, strongly-typed query keys to prevent cache collisions.
 */
export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    currentUser: () => [...queryKeys.auth.all, "currentUser"] as const,
    session: () => [...queryKeys.auth.all, "session"] as const,
  },
  users: {
    all: ["users"] as const,
    lists: () => [...queryKeys.users.all, "list"] as const,
    list: (params?: Record<string, unknown>) =>
      [...queryKeys.users.lists(), params] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (id: string | number) =>
      [...queryKeys.users.details(), String(id)] as const,
  },
  roles: {
    all: ["roles"] as const,
    list: (params?: Record<string, unknown>) =>
      [...queryKeys.roles.all, "list", params] as const,
    detail: (id: string | number) =>
      [...queryKeys.roles.all, "detail", String(id)] as const,
  },
  policies: {
    all: ["policies"] as const,
    list: (params?: Record<string, unknown>) =>
      [...queryKeys.policies.all, "list", params] as const,
    detail: (id: string | number) =>
      [...queryKeys.policies.all, "detail", String(id)] as const,
  },
  monitoring: {
    all: ["monitoring"] as const,
    activity: (params?: Record<string, unknown>) =>
      [...queryKeys.monitoring.all, "activity", params] as const,
    auditLogs: (params?: Record<string, unknown>) =>
      [...queryKeys.monitoring.all, "audit-logs", params] as const,
  },
  modules: {
    all: ["modules"] as const,
    myModules: (variant: string = "group") =>
      [...queryKeys.modules.all, "myModules", variant] as const,
    list: (params?: Record<string, unknown>) =>
      [...queryKeys.modules.all, "list", params] as const,
    detail: (id: string | number) =>
      [...queryKeys.modules.all, "detail", String(id)] as const,
  },
} as const;
