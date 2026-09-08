import { useCallback, useEffect } from "react";

import { useIsRestoring, useMutation, useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";

import { getAuthMeApi, loginApi, logoutApi } from "@/api/iam/auth";
import { toast } from "@/components/ui/toast";
import { queryKeys } from "@/constants";
import {
  IAuthUser,
  ICurrentUserPayload,
  ILoginRequest,
  ILoginResponse,
  IModuleAccess,
  IUserAccess,
} from "@/types";
import { CustomError } from "@/utils/api-client";
import { queryClient } from "@/utils/query-client";

const AUTH_SYNC_CHANNEL = "sentry_auth_sync_channel";
const AUTH_SYNC_STORAGE_KEY = "sentry_auth_sync_event";

export type AuthSyncEvent =
  { type: "LOGOUT"; timestamp: number } | { type: "LOGIN"; timestamp: number };

let authChannel: BroadcastChannel | null = null;

function getAuthBroadcastChannel(): BroadcastChannel | null {
  if (typeof window === "undefined" || !("BroadcastChannel" in window)) {
    return null;
  }
  if (!authChannel) {
    authChannel = new BroadcastChannel(AUTH_SYNC_CHANNEL);
  }
  return authChannel;
}

/**
 * Broadcasts an authentication event (LOGOUT / LOGIN) to other open tabs.
 */
export function broadcastAuthSync(event: AuthSyncEvent): void {
  // 1. BroadcastChannel (zero-latency modern standard)
  try {
    const channel = getAuthBroadcastChannel();
    if (channel) {
      channel.postMessage(event);
    }
  } catch {
    // Ignore channel errors
  }

  // 2. Fallback when BroadcastChannel is unavailable
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(AUTH_SYNC_STORAGE_KEY, JSON.stringify(event));
    }
  } catch {
    // Ignore storage errors
  }
}

/**
 * Hook to synchronize authentication state across multiple open tabs in real-time.
 * Listens on BroadcastChannel and window 'storage' events.
 * When any tab logs out, all other open tabs immediately clear their session and redirect to /login.
 */
export function useAuthSync(): void {
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleSyncEvent = (event: AuthSyncEvent) => {
      if (event.type === "LOGOUT") {
        queryClient.cancelQueries({ queryKey: queryKeys.auth.currentUser() });
        queryClient.clear();
        queryClient.setQueryData(queryKeys.auth.currentUser(), null);
        try {
          window.localStorage.removeItem("SENTRY_QUERY_CACHE");
        } catch {
          // Ignore storage errors
        }
        navigate("/login", { replace: true });
      } else if (event.type === "LOGIN") {
        // Re-sync session when another tab signs in
        queryClient.invalidateQueries({
          queryKey: queryKeys.auth.currentUser(),
        });
      }
    };

    // 1. BroadcastChannel listener (standard zero-latency cross-tab communication)
    const channel = getAuthBroadcastChannel();
    const handleChannelMessage = (msg: MessageEvent<AuthSyncEvent>) => {
      if (msg?.data?.type) {
        handleSyncEvent(msg.data);
      }
    };
    if (channel) {
      channel.addEventListener("message", handleChannelMessage);
    }

    // 2. Window storage event fallback (fires in other tabs when localStorage is updated)
    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === AUTH_SYNC_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue) as AuthSyncEvent;
          if (parsed?.type) {
            handleSyncEvent(parsed);
          }
        } catch {
          // Ignore invalid payload
        }
      }
    };
    window.addEventListener("storage", handleStorageEvent);

    return () => {
      if (channel) {
        channel.removeEventListener("message", handleChannelMessage);
      }
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, [navigate]);
}

/**
 * Fetches current user session and permissions from /iam/auth/me.
 */
export function useCurrentUserQuery() {
  return useQuery<ICurrentUserPayload, CustomError>({
    queryKey: queryKeys.auth.currentUser(),
    queryFn: getAuthMeApi,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    refetchOnWindowFocus: (query) => {
      // Don't ping /me when user is already known to be unauthenticated (null or error)
      const data = query.state.data as ICurrentUserPayload | null | undefined;
      return Boolean(data?.user);
    },
    refetchOnReconnect: (query) => {
      const data = query.state.data as ICurrentUserPayload | null | undefined;
      return Boolean(data?.user);
    },
    retry: (failureCount, error) => {
      // Never retry 401 Unauthorized or 403 Forbidden
      if (
        error instanceof CustomError &&
        (error.status === 401 ||
          error.status === 403 ||
          error.responseStatus === 401 ||
          error.responseStatus === 403 ||
          error.messageCode === "UNAUTHORIZED" ||
          error.messageCode === "FORBIDDEN")
      ) {
        return false;
      }
      return failureCount < 2;
    },
  });
}

/**
 * Returns current auth state and permissions.
 */
export function useCurrentAuth() {
  const isRestoring = useIsRestoring();
  const currentUserQuery = useCurrentUserQuery();

  const payload = currentUserQuery.data;
  const user = payload?.user ?? null;
  const access: IUserAccess = payload?.access ?? {};
  const roles = user?.roles ?? [];

  const isAuthenticated = Boolean(user);
  const isLoading =
    isRestoring ||
    (currentUserQuery.isLoading && !user && !currentUserQuery.isError);
  const isRevalidating = currentUserQuery.isFetching && Boolean(user);

  return {
    user,
    access,
    roles,
    isAuthenticated,
    isLoading,
    isRevalidating,
    isRestoring,
    isError: currentUserQuery.isError,
    error: currentUserQuery.error,
    refetch: currentUserQuery.refetch,
  };
}

/**
 * Checks whether current user has permission for a given module and action.
 */
export function useHasPermission(
  moduleName: string,
  action: keyof IModuleAccess = "view"
): boolean {
  const { access } = useCurrentAuth();
  const modulePerms = access[moduleName];
  if (!modulePerms) return false;
  return Boolean(modulePerms.full || modulePerms[action]);
}

/**
 * Mutation hook for user sign-in.
 */
export function useLoginMutation() {
  const navigate = useNavigate();
  const location = useLocation();

  return useMutation<ILoginResponse, CustomError, ILoginRequest>({
    mutationFn: (credentials) => loginApi(credentials),
    onSuccess: (loginResponse) => {
      // Seed query cache with complete user profile + access matrix from login response
      if (loginResponse?.payload?.user) {
        queryClient.setQueryData(
          queryKeys.auth.currentUser(),
          loginResponse.payload
        );
      }

      broadcastAuthSync({ type: "LOGIN", timestamp: Date.now() });

      const from =
        (location.state as { from?: { pathname: string } })?.from?.pathname ||
        "/";
      navigate(from, { replace: true });
    },
    onError: (error) => {
      const description =
        error.messages.length > 1
          ? error.messages.join(" • ")
          : error.firstMessage;

      if (error.messageCode === "ACCOUNT_LOCKED") {
        toast.error("Account Locked", description);
      } else if (error.messageCode === "INVALID_CREDENTIALS") {
        toast.error("Sign-in Failed", description);
      } else if (error.messageCode === "VALIDATION_ERROR") {
        toast.error("Validation Error", description);
      } else {
        toast.error(
          "Sign In Error",
          description || "An error occurred during sign in"
        );
      }
    },
  });
}

/**
 * Clears the session on server and client, then redirects to /login.
 */
export function useLogout() {
  const navigate = useNavigate();

  return useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      // Ignore network errors on logout API call
    } finally {
      // Cancel any in-flight auth queries
      await queryClient.cancelQueries({
        queryKey: queryKeys.auth.currentUser(),
      });

      // Clear all cached application queries
      queryClient.clear();

      // Explicitly set currentUser to null to keep the cache occupied and prevent refetch loops
      queryClient.setQueryData(queryKeys.auth.currentUser(), null);

      try {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem("SENTRY_QUERY_CACHE");
        }
      } catch {
        // Ignore storage errors
      }

      // Broadcast logout immediately to all other open tabs
      broadcastAuthSync({ type: "LOGOUT", timestamp: Date.now() });

      navigate("/login", { replace: true });
    }
  }, [navigate]);
}

/**
 * Returns currently authenticated user, or null if unauthenticated.
 */
export function useCurrentUser(): IAuthUser | null {
  const { user } = useCurrentAuth();
  return user;
}
