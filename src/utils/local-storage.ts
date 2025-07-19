// Utility functions for localStorage CRUD operations

export function setItem<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function getItem<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  const item = localStorage.getItem(key);
  if (!item) return null;
  try {
    return JSON.parse(item) as T;
  } catch {
    return null;
  }
}

export function removeItem(key: string) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
}

export function clearStorage() {
  if (typeof window === "undefined") return;
  localStorage.clear();
}
