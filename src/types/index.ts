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

export interface PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
