import {
  ICurrentUserPayload,
  ICurrentUserResponse,
  ILoginRequest,
  ILoginResponse,
  IOtpVerifyReq,
  IOtpVerifyResponse,
  IPasswordResetConfirmReq,
  IPasswordResetConfirmResponse,
  IPasswordResetRequestResponse,
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

/**
 * Requests an OTP code for password recovery.
 */
export const passwordResetRequestApi = async (data: {
  email: string;
}): Promise<IPasswordResetRequestResponse> =>
  featuredFetch<IPasswordResetRequestResponse>({
    input: "/iam/auth/password/reset-request",
    init: {
      method: "POST",
      body: JSON.stringify(data),
    },
  });

/**
 * Verifies OTP code for password recovery. Backend attaches HttpOnly resetToken cookie upon success.
 */
export const verifyOtpApi = async (
  data: IOtpVerifyReq
): Promise<IOtpVerifyResponse> =>
  featuredFetch<IOtpVerifyResponse>({
    input: "/iam/auth/otp/verify",
    init: {
      method: "POST",
      body: JSON.stringify(data),
    },
  });

/**
 * Confirms password reset using HttpOnly resetToken cookie and new password.
 */
export const passwordResetConfirmApi = async (
  data: IPasswordResetConfirmReq
): Promise<IPasswordResetConfirmResponse> =>
  featuredFetch<IPasswordResetConfirmResponse>({
    input: "/iam/auth/password/reset-confirm",
    init: {
      method: "POST",
      body: JSON.stringify(data),
    },
  });
