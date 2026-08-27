// Global types for the app

// API Result
export interface IApiResult<T = undefined> {
  paginationInfo: any;
  status: number;
  message: string;
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

export * from "./data-table";
export * from "./iam";
export * from "./monitoring";
export * from "./settings";
