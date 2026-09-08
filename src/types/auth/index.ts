import type { IApiResult } from "../index";

export type RecoveryStep = "email" | "otp" | "password";

export interface ILoginRequest {
  identifier: string;
  password: string;
}

export interface IUserRole {
  ID: number;
  name: string;
  slug: string;
}

export interface IAuthUser {
  ID: number;
  uuid: string;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  roles: IUserRole[];
  phone?: string | null;
  isVerified?: boolean;
  lastLoginAt?: number;
  createdAt?: number;
}

export interface IModuleAccess {
  view: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
  full: boolean;
}

export type IUserAccess = Record<string, IModuleAccess>;

export interface ICurrentUserPayload {
  user: IAuthUser;
  access: IUserAccess;
}

export type ISessionUser = IAuthUser;
export type ICurrentUserResponse = IApiResult<ICurrentUserPayload>;
export type ILoginResponse = IApiResult<ICurrentUserPayload>;
export type ILoginErrorResponse = IApiResult<Record<string, unknown>>;

// Password Recovery & OTP Types
export interface IPasswordResetRequestPayload {
  otp?: string;
  remainingSeconds?: number;
}

export interface IPasswordResetRequestReq {
  email: string;
}

export type IPasswordResetRequestResponse =
  IApiResult<IPasswordResetRequestPayload>;

export interface IOtpVerifyReq {
  identifier: string;
  code: string;
  purpose?: string;
}

export interface IOtpVerifyPayload {
  verified: boolean;
  purpose: string;
}

export type IOtpVerifyResponse = IApiResult<IOtpVerifyPayload>;

export interface IPasswordResetConfirmReq {
  newPassword: string;
}

export type IPasswordResetConfirmResponse = IApiResult<Record<string, unknown>>;
