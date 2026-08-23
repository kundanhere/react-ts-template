export interface User {
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

export interface Role {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  description: string;
}

export interface Policy {
  id: number;
  name: string;
  slug: string;
  effect: "ALLOW" | "DENY";
  actions: string[];
  resources: string[];
  conditions: Record<string, any>;
}

export interface Module {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  priority: number;
  active: boolean;
}

export interface Session {
  id: string;
  userId: number;
  device: string;
  ip: string;
  createdAt: string;
  lastActiveAt: string;
}

export interface AuditLog {
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
