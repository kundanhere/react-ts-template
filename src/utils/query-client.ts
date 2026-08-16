import { QueryClient } from "@tanstack/react-query";

/**
 * Custom API Error class for handling HTTP response errors in React Query
 */
export class ApiError extends Error {
  status: number;

  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/**
 * Type-safe fetch wrapper tailored for React Query queryFn / mutationFn
 * Automatically handles JSON parsing, non-2xx HTTP errors, and request headers.
 */
export async function apiFetcher<T = unknown>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let errorData: unknown;
    try {
      errorData = await response.json();
    } catch {
      errorData = null;
    }
    throw new ApiError(
      `HTTP error ${response.status}: ${response.statusText}`,
      response.status,
      errorData
    );
  }

  // Handle 244 / Empty Content responses
  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}

/**
 * Global QueryClient instance configured with production-ready defaults
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Don't retry on 404 or 401
        if (
          error instanceof ApiError &&
          (error.status === 404 || error.status === 401)
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

/**
 * Utility helpers for working with TanStack React Query outside of React components
 */
export const queryHelpers = {
  /**
   * Invalidate queries matching a specific query key
   */
  invalidate: (queryKey: unknown[]) =>
    queryClient.invalidateQueries({ queryKey }),

  /**
   * Prefetch query data ahead of user interaction (e.g. on link hover)
   */
  prefetch: <T>(queryKey: unknown[], queryFn: () => Promise<T>) =>
    queryClient.prefetchQuery({ queryKey, queryFn }),

  /**
   * Manually update the cached data for a query key
   */
  setData: <T>(queryKey: unknown[], data: T | ((old: T | undefined) => T)) =>
    queryClient.setQueryData<T>(queryKey, data),

  /**
   * Get cached data for a query key
   */
  getData: <T>(queryKey: unknown[]): T | undefined =>
    queryClient.getQueryData<T>(queryKey),

  /**
   * Clear all cached queries
   */
  clear: () => queryClient.clear(),
};
