// Global types for the app

// API Result
export type ApiResult<T = undefined> = {
  paginationInfo: any;
  status: number;
  message: string;
  messageCode: string;
  payload: T;
};

export type PaginationInfo = {
  currentPage: number;
  nextPage: number | null;
  perPage: number;
  previousPage: number | null;
  total: number;
  totalPages: number;
};

export type ApiResultWithPagination<T = undefined> = {
  paginationInfo: PaginationInfo;
} & ApiResult<T>;

export interface IPaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export type PaginationResponse<T> = IPaginationResponse<T>;

export * from "./data-table";
export * from "./iam";
export * from "./monitoring";
export * from "./settings";
