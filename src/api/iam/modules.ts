import { IApiResult, IUserModuleGroup } from "@/types";
import featuredFetch from "@/utils/api-client";

/**
 * Fetches modules accessible to the current user.
 * @param variant 'group' | 'flat' | 'default' (defaults to 'group')
 */
export const getMyModulesApi = async (
  variant: string = "group"
): Promise<IUserModuleGroup[]> => {
  const response = await featuredFetch<IApiResult<IUserModuleGroup[]>>({
    input: `/iam/modules/my-modules?variant=${encodeURIComponent(variant)}`,
    init: {
      method: "GET",
    },
  });

  return response?.payload ?? [];
};
