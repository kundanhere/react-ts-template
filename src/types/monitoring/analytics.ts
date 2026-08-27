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
export type AnalyticsUser = IAnalyticsUser;

export interface IAnalyticsRole {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  description: string;
}
export type AnalyticsRole = IAnalyticsRole;

export interface IAnalyticsPolicy {
  id: number;
  name: string;
  slug: string;
  effect: "ALLOW" | "DENY";
  actions: string[];
  resources: string[];
  conditions: Record<string, any>;
}
export type AnalyticsPolicy = IAnalyticsPolicy;

export interface IAnalyticsModule {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  priority: number;
  active: boolean;
}
export type AnalyticsModule = IAnalyticsModule;

export interface IAnalyticsSession {
  id: string;
  userId: number;
  device: string;
  ip: string;
  createdAt: string;
  lastActiveAt: string;
}
export type AnalyticsSession = IAnalyticsSession;

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
export type AnalyticsAuditLog = IAnalyticsAuditLog;

export type TimeRange = "24h" | "7d" | "30d";

export type AuditFilter = "ALL" | "ALLOW" | "DENY";

export interface IActiveSessionsCardProps {
  sessions: IAnalyticsSession[];
  users: IAnalyticsUser[];
  onRevokeSession: (sessionId: string) => void;
}
export type ActiveSessionsCardProps = IActiveSessionsCardProps;

export interface IAnalyticsDomainBannerProps {
  moduleCount: number;
}
export type AnalyticsDomainBannerProps = IAnalyticsDomainBannerProps;

export interface IAnalyticsKpiCardsProps {
  users: IAnalyticsUser[];
  sessions: IAnalyticsSession[];
  roles: IAnalyticsRole[];
  policies: IAnalyticsPolicy[];
}
export type AnalyticsKpiCardsProps = IAnalyticsKpiCardsProps;

export interface ICloudAuditLogsCardProps {
  auditLogs: IAnalyticsAuditLog[];
  users: IAnalyticsUser[];
  auditFilter: AuditFilter;
  setAuditFilter: (filter: AuditFilter) => void;
}
export type CloudAuditLogsCardProps = ICloudAuditLogsCardProps;

export interface IPolicyRatioCardProps {
  policies: IAnalyticsPolicy[];
}
export type PolicyRatioCardProps = IPolicyRatioCardProps;

export interface IPolicyThroughputCardProps {
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
}
export type PolicyThroughputCardProps = IPolicyThroughputCardProps;

export interface ISecurityFindingsCardProps {
  users: IAnalyticsUser[];
}
export type SecurityFindingsCardProps = ISecurityFindingsCardProps;

export interface ITopAccessModulesCardProps {
  modules: IAnalyticsModule[];
}
export type TopAccessModulesCardProps = ITopAccessModulesCardProps;
