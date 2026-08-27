export interface AnalyticsUser {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  status: string;
  locked: boolean;
  lastLoginAt: string;
  createdAt: string;
}

export interface AnalyticsRole {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  description: string;
}

export interface AnalyticsPolicy {
  id: number;
  name: string;
  slug: string;
  effect: "ALLOW" | "DENY";
  actions: string[];
  resources: string[];
  conditions: Record<string, any>;
}

export interface AnalyticsModule {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  priority: number;
  active: boolean;
}

export interface AnalyticsSession {
  id: string;
  userId: number;
  device: string;
  ip: string;
  createdAt: string;
  lastActiveAt: string;
}

export interface AnalyticsAuditLog {
  id: string;
  userId: number;
  action: string;
  resourceType: string;
  resourceId: number | null;
  result: "ALLOW" | "DENY";
  ip: string;
  ts: string;
  detail: string;
}

export type TimeRange = "24h" | "7d" | "30d";

export type AuditFilter = "ALL" | "ALLOW" | "DENY";

export interface ActiveSessionsCardProps {
  sessions: AnalyticsSession[];
  users: AnalyticsUser[];
  onRevokeSession: (sessionId: string) => void;
}

export interface AnalyticsDomainBannerProps {
  moduleCount: number;
}

export interface AnalyticsKpiCardsProps {
  users: AnalyticsUser[];
  sessions: AnalyticsSession[];
  roles: AnalyticsRole[];
  policies: AnalyticsPolicy[];
}

export interface CloudAuditLogsCardProps {
  auditLogs: AnalyticsAuditLog[];
  users: AnalyticsUser[];
  auditFilter: AuditFilter;
  setAuditFilter: (filter: AuditFilter) => void;
}

export interface PolicyRatioCardProps {
  policies: AnalyticsPolicy[];
}

export interface PolicyThroughputCardProps {
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
}

export interface SecurityFindingsCardProps {
  users: AnalyticsUser[];
}

export interface TopAccessModulesCardProps {
  modules: AnalyticsModule[];
}
