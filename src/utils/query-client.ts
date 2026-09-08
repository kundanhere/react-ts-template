import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/constants";

import featuredFetch, { CustomError, setAuthEventHandlers } from "./api-client";

/**
 * Backward compatibility alias for CustomError
 */
export const ApiError = CustomError;

/**
 * Fetch wrapper for React Query queryFn/mutationFn using featuredFetch.
 */
export async function apiFetcher<T = unknown>(
  url: string,
  options?: RequestInit
): Promise<T> {
  return featuredFetch<T>({
    input: url,
    init: options as any,
  });
}

/**
 * Global QueryClient instance configured with production-ready defaults:
 * - 5 min staleTime: avoids hammering GET /iam/auth/me on every tab switch
 * - 24h gcTime: ensures persisted cache aligns with memory retention
 * - retry: strictly ignores 401 and 403 to prevent loops on auth/permission failures
 * - refetchOnWindowFocus & reconnect: keeps permissions and session state authoritative
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 24 * 60 * 60 * 1000, // 24 hours (aligned with persistence maxAge)
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: (failureCount, error) => {
        // Do not retry 401 or 403 errors
        if (
          error instanceof CustomError &&
          (error.status === 401 ||
            error.status === 403 ||
            error.responseStatus === 401 ||
            error.responseStatus === 403)
        ) {
          return false;
        }
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});

export const queryPersister = createAsyncStoragePersister({
  storage: typeof window !== "undefined" ? window.localStorage : undefined,
  key: "SENTRY_QUERY_CACHE",
});

/**
 * Query persistence options. Only dehydrates 'currentUser' query.
 */
export const queryPersistOptions = {
  persister: queryPersister,
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  buster: "v1.2",
  dehydrateOptions: {
    shouldDehydrateQuery: (query: {
      queryKey: readonly unknown[];
      state: { status: string };
    }) => {
      const key = query.queryKey;
      const isCurrentUser =
        Array.isArray(key) &&
        (key.includes("currentUser") ||
          (key[0] === "auth" && key[1] === "currentUser"));
      return isCurrentUser && query.state.status === "success";
    },
  },
};

// Sync API client auth events with query cache
setAuthEventHandlers({
  onUnauthenticated: () => {
    // Set query data to null so active observers cleanly resolve as unauthenticated
    // DO NOT call removeQueries() while observers are mounted as it triggers immediate refetch loops
    queryClient.setQueryData(queryKeys.auth.currentUser(), null);
  },
  onUnauthorized: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.auth.currentUser() });
  },
});

/**
 * Utility helpers for working with TanStack React Query outside of React components
 */
export const queryHelpers = {
  /**
   * Invalidate queries matching a specific query key
   */
  invalidate: (queryKey: readonly unknown[]) =>
    queryClient.invalidateQueries({ queryKey }),

  /**
   * Prefetch query data ahead of user interaction (e.g. on link hover)
   */
  prefetch: <T>(queryKey: readonly unknown[], queryFn: () => Promise<T>) =>
    queryClient.prefetchQuery({ queryKey, queryFn }),

  /**
   * Manually update the cached data for a query key
   */
  setData: <T>(
    queryKey: readonly unknown[],
    data: T | ((old: T | undefined) => T)
  ) => queryClient.setQueryData<T>(queryKey, data),

  /**
   * Get cached data for a query key
   */
  getData: <T>(queryKey: readonly unknown[]): T | undefined =>
    queryClient.getQueryData<T>(queryKey),

  /**
   * Remove cached queries matching a specific query key
   */
  removeQueries: (queryKey: readonly unknown[]) =>
    queryClient.removeQueries({ queryKey }),

  /**
   * Clear all cached queries
   */
  clear: () => queryClient.clear(),
};
