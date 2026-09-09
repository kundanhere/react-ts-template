import { useQuery } from "@tanstack/react-query";

import { getMyModulesApi } from "@/api/iam/modules";
import { queryKeys } from "@/constants";
import { useCurrentAuth } from "@/hooks/use-auth";
import { IUserModuleGroup } from "@/types";
import { CustomError } from "@/utils/api-client";
import { queryClient } from "@/utils/query-client";

/**
 * React Query hook to fetch dynamic sidebar navigation modules for current user.
 * - Uses persisted cache to eliminate redundant API calls across page loads.
 * - Only calls the API when cache is missing or stale.
 * - Does not re-fetch on window focus or component mount if cached data is present.
 */
export function useMyModulesQuery(variant: string = "group") {
  const { isAuthenticated } = useCurrentAuth();

  return useQuery<IUserModuleGroup[], CustomError>({
    queryKey: queryKeys.modules.myModules(variant),
    queryFn: () => getMyModulesApi(variant),
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000, // 2 minutes fresh cache
    refetchInterval: 2 * 60 * 1000, // 2 minutes refetch interval to keep cache fresh
    gcTime: 24 * 60 * 60 * 1000, // 24 hours garbage collection / persistence alignment
    refetchOnWindowFocus: false, // Avoid refetching when switching tabs
    refetchOnReconnect: false, // Avoid refetching on transient reconnects when cache is present
  });
}

/**
 * Immediately invalidates and refreshes the user's modules cache (e.g., when CMS/modules configuration changes).
 */
export function invalidateMyModulesCache() {
  return queryClient.invalidateQueries({
    queryKey: queryKeys.modules.all,
  });
}
