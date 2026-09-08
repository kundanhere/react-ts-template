// Global types for the app

// API Result
export interface IApiResult<T = unknown> {
  paginationInfo?: IPaginationInfo | null;
  status: number;
  message: string | string[];
  messageCode: string;
  payload: T;
}

export interface IPaginationInfo {
  currentPage: number;
  nextPage: number | null;
  perPage: number;
  previousPage: number | null;
  total: number;
  totalPages: number;
}

export interface IApiResultWithPagination<T = undefined> extends IApiResult<T> {
  paginationInfo: IPaginationInfo;
}

export interface IPaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export * from "./auth";
export * from "./data-table";
export * from "./iam";
export * from "./monitoring";
export * from "./settings";
