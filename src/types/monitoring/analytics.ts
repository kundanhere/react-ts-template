export interface IAnalyticsUser {
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

export interface IAnalyticsRole {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  description: string;
}

export interface IAnalyticsPolicy {
  id: number;
  name: string;
  slug: string;
  effect: "ALLOW" | "DENY";
  actions: string[];
  resources: string[];
  conditions: Record<string, any>;
}

export interface IAnalyticsModule {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  priority: number;
  active: boolean;
}

export interface IAnalyticsSession {
  id: string;
  userId: number;
  device: string;
  ip: string;
  createdAt: string;
  lastActiveAt: string;
}

export interface IAnalyticsAuditLog {
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

export interface IActiveSessionsCardProps {
  sessions: IAnalyticsSession[];
  users: IAnalyticsUser[];
  onRevokeSession: (sessionId: string) => void;
}

export interface IAnalyticsDomainBannerProps {
  moduleCount: number;
}

export interface IAnalyticsKpiCardsProps {
  users: IAnalyticsUser[];
  sessions: IAnalyticsSession[];
  roles: IAnalyticsRole[];
  policies: IAnalyticsPolicy[];
}

export interface ICloudAuditLogsCardProps {
  auditLogs: IAnalyticsAuditLog[];
  users: IAnalyticsUser[];
  auditFilter: AuditFilter;
  setAuditFilter: (filter: AuditFilter) => void;
}

export interface IPolicyRatioCardProps {
  policies: IAnalyticsPolicy[];
}

export interface IPolicyThroughputCardProps {
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
}

export interface ISecurityFindingsCardProps {
  users: IAnalyticsUser[];
}

export interface ITopAccessModulesCardProps {
  modules: IAnalyticsModule[];
}
