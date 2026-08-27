import type { IAnalyticsUser } from "@/types/monitoring/analytics";

export function getUser(
  users: IAnalyticsUser[],
  userId: number
): IAnalyticsUser | undefined {
  return users.find((u) => u.id === userId);
}

export function getUserName(users: IAnalyticsUser[], userId: number): string {
  const user = getUser(users, userId);
  return user ? `${user.firstName} ${user.lastName}` : "System Service Account";
}

export function getUserInitials(
  users: IAnalyticsUser[],
  userId: number
): string {
  const user = getUser(users, userId);
  if (!user) return "SA";
  return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
}

export function timeAgo(iso: string): string {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}
