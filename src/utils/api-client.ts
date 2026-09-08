/**
 * Fetch API wrapper with cookie-based credentials and interceptor support
 * @param input : Request URL path or RequestInfo
 * @param init : Custom RequestInit options
 * @param interceptorCb : Optional interceptor callback
 */
import { env } from "@/env";

type CustomRequestInit = RequestInit & {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
};

export type FeaturedFetchType = {
  input: RequestInfo | URL;
  init?: CustomRequestInit | undefined;
  interceptorCb?: () => void;
  _isRetry?: boolean;
};

export class CustomError<TPayload = unknown> extends Error {
  public status: number;

  public messageCode: string;

  public responseStatus: number;

  public payload?: TPayload;

  public rawMessage: string | string[];

  public messages: string[];

  public firstMessage: string;

  constructor(
    status: number,
    message: string | string[],
    messageCode: string,
    responseStatus: number,
    payload?: TPayload
  ) {
    const messagesArray = Array.isArray(message)
      ? message.filter(Boolean)
      : [message || "Request failed"];
    const firstMsg = messagesArray[0] || "Request failed";

    // Formatted readable summary for Error.message
    super(messagesArray.join(" • "));

    this.name = "CustomError";
    this.status = status;
    this.messageCode = messageCode;
    this.responseStatus = responseStatus;
    this.payload = payload;
    this.rawMessage = message;
    this.messages = messagesArray;
    this.firstMessage = firstMsg;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

type AuthEventHandlers = {
  onUnauthenticated?: () => void;
  onUnauthorized?: () => void;
};

let authEventHandlers: AuthEventHandlers = {};

export const setAuthEventHandlers = (handlers: AuthEventHandlers): void => {
  authEventHandlers = { ...authEventHandlers, ...handlers };
};

// Deduplicate concurrent refresh requests
let refreshPromise: Promise<boolean> | null = null;

const requestSilentRefresh = async (): Promise<boolean> => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const BASE_URL = env.VITE_API_URL;
      const cleanBaseUrl = BASE_URL.replace(/\/+$/, "");
      const response = await fetch(`${cleanBaseUrl}/iam/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      return response.ok;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

const featuredFetch = async <ResponseType>(
  props: FeaturedFetchType
): Promise<ResponseType> => {
  const { input, init, interceptorCb = () => {}, _isRetry = false } = props;

  const BASE_URL = env.VITE_API_URL;
  const cleanBaseUrl = BASE_URL.replace(/\/+$/, "");
  let requestUrl: RequestInfo | URL = input;

  if (typeof input === "string") {
    const cleanInput = input.replace(/^\/+/, "");
    requestUrl = `${cleanBaseUrl}/${cleanInput}`;
  }

  const header: HeadersInit = {};

  if (init?.body && !(init.body instanceof FormData)) {
    header["Content-Type"] = "application/json";
  }

  if (interceptorCb) {
    interceptorCb();
  }

  try {
    const response = await fetch(requestUrl, {
      method: init?.method,
      body: init?.body,
      credentials: "include",
      headers: {
        ...header,
        ...init?.headers,
      },
    });

    const isAuthEndpoint =
      typeof input === "string" &&
      (input.includes("/auth/login") ||
        input.includes("/auth/refresh") ||
        input.includes("/auth/register") ||
        input.includes("/auth/logout") ||
        input.includes("/auth/me"));

    let responseData: any = {};
    try {
      responseData = await response.json();
    } catch {
      responseData = {};
    }

    const isUnauthorized =
      response.status === 401 ||
      (responseData &&
        typeof responseData === "object" &&
        responseData.status === 0 &&
        responseData.messageCode === "UNAUTHORIZED");

    const isForbidden =
      response.status === 403 ||
      (responseData &&
        typeof responseData === "object" &&
        responseData.status === 0 &&
        responseData.messageCode === "FORBIDDEN");

    const isSuccess =
      response.ok &&
      (!responseData ||
        typeof responseData !== "object" ||
        !("status" in responseData) ||
        responseData.status === 1);

    // Attempt silent refresh on 401 for non-auth endpoints
    if (isUnauthorized) {
      if (!isAuthEndpoint && !_isRetry) {
        const refreshed = await requestSilentRefresh();
        if (refreshed) {
          return await featuredFetch<ResponseType>({
            ...props,
            _isRetry: true,
          });
        }
      }

      // If refresh failed or was not eligible, notify unauthenticated session handler
      if (!isAuthEndpoint && authEventHandlers.onUnauthenticated) {
        authEventHandlers.onUnauthenticated();
      }

      throw new CustomError(
        401,
        responseData.message || "Authorization token required",
        responseData.messageCode || "UNAUTHORIZED",
        responseData.status ?? 0,
        responseData.payload
      );
    }

    // Trigger permission revalidation on unexpected 403 / FORBIDDEN
    if (isForbidden) {
      if (!isAuthEndpoint && authEventHandlers.onUnauthorized) {
        authEventHandlers.onUnauthorized();
      }

      throw new CustomError(
        403,
        responseData.message || "Access forbidden",
        responseData.messageCode || "FORBIDDEN",
        responseData.status ?? 0,
        responseData.payload
      );
    }

    if (!isSuccess) {
      const computedStatus = !response.ok ? response.status : 400;

      throw new CustomError(
        computedStatus,
        responseData.message || response.statusText || "Request failed",
        responseData.messageCode || "ERROR",
        responseData.status ?? 0,
        responseData.payload
      );
    }

    return responseData as ResponseType;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Something went wrong !");
  }
};

export default featuredFetch;
