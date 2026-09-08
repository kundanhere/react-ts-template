import {
  ICurrentUserPayload,
  ICurrentUserResponse,
  ILoginRequest,
  ILoginResponse,
} from "@/types";
import featuredFetch, { CustomError } from "@/utils/api-client";

/**
 * Submits login credentials. Session cookies are set by the backend.
 */
export const loginApi = async (
  credentials: ILoginRequest
): Promise<ILoginResponse> =>
  featuredFetch<ILoginResponse>({
    input: "/iam/auth/login",
    init: {
      method: "POST",
      body: JSON.stringify(credentials),
    },
  });

/**
 * Fetches current user profile and permissions from /iam/auth/me.
 */
export const getAuthMeApi = async (): Promise<ICurrentUserPayload> => {
  const response = await featuredFetch<ICurrentUserResponse>({
    input: "/iam/auth/me",
    init: {
      method: "GET",
    },
  });

  if (!response || response.status === 0 || !response.payload?.user) {
    throw new CustomError(
      401,
      response?.message || "Authorization token required",
      response?.messageCode || "UNAUTHORIZED",
      response?.status ?? 0,
      response?.payload
    );
  }

  return response.payload;
};

/**
 * Logs out current session and clears cookies.
 */
export const logoutApi = async (): Promise<void> =>
  featuredFetch<void>({
    input: "/iam/auth/logout",
    init: {
      method: "POST",
    },
  });

/**
 * Refreshes session tokens using the refresh cookie.
 */
export const refreshAuthSessionApi = async (): Promise<ILoginResponse> =>
  featuredFetch<ILoginResponse>({
    input: "/iam/auth/refresh",
    init: {
      method: "POST",
    },
  });
