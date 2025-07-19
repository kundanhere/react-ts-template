/**
 * Fetch API with interceptor, token validation feature
 * @param input : same as first parameter of fetch API
 * @param init : same as second parameter of fetch API
 * @param tokenValidation : Whether token is validate or not
 * @param interceptor : Interceptor function
 */
import { APP_TOKEN, APP_USERINFO } from "@/constants";
import { env } from "@/env";

import { getItem, removeItem } from "./local-storage";

type CustomRequestInit = RequestInit & {
  method: "GET" | "POST" | "PUT" | "DELETE";
};

type FeaturedFetchType = {
  input: RequestInfo | URL;
  init?: CustomRequestInit | undefined;
  tokenValidation?: boolean;
  interceptorCb?: () => void;
};

class CustomError extends Error {
  constructor(
    public status: number,
    public message: string,
    public messageCode: string,
    public responseStatus: number
  ) {
    super(message);
    this.name = "CustomError";
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

const featuredFetch = async <ResponseType>(props: FeaturedFetchType) => {
  const {
    input,
    init,
    interceptorCb = () => {},
    tokenValidation = true,
  } = props;

  const TOKEN = getItem(APP_TOKEN);

  const BASE_URL = env.VITE_API_URL;

  const header: HeadersInit = {};

  if (init?.body && !(init.body instanceof FormData)) {
    header["Content-Type"] = "application/json";
  }

  if (tokenValidation) {
    header.Authorization = `Bearer ${TOKEN}`;
  }

  interceptorCb && interceptorCb();

  try {
    const response = await fetch(`${BASE_URL}/${input}`, {
      method: init?.method,
      body: init?.body,
      headers: {
        ...header,
        ...init?.headers,
      },
    });

    if (response.status === 401) {
      removeItem(APP_USERINFO);
      removeItem(APP_TOKEN);
      window.location.href = "/auth/login";
      return null;
    }

    const responseData = await response.json();

    if (!response.ok) {
      throw new CustomError(
        response.status,
        responseData.message,
        responseData.messageCode,
        responseData.status
      );
    }

    return responseData as ResponseType;
  } catch (error) {
    if (error instanceof CustomError || error instanceof Error) {
      throw error.message;
    } else {
      throw new Error("Something went wrong !");
    }
  }
};

export default featuredFetch;
