import { ActionReducerMapBuilder } from "@reduxjs/toolkit";

export type AsyncStatus = "idle" | "loading" | "succeeded" | "failed";

export interface IAsyncState<T> {
  data: T | null;
  status: AsyncStatus;
  error: string | null;
}

/**
 * Creates a standardized initial state object for async slice operations
 */
export function createAsyncState<T>(
  initialData: T | null = null
): IAsyncState<T> {
  return {
    data: initialData,
    status: "idle",
    error: null,
  };
}

export interface IAsyncThunkLike {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pending: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fulfilled: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rejected: any;
}

/**
 * Standardized builder callback helper to handle pending/fulfilled/rejected cases for an AsyncThunk.
 *
 * @example
 * extraReducers: (builder) => {
 *   addAsyncCases(builder, fetchUserThunk, (state, payload) => {
 *     state.data = payload;
 *   });
 * }
 */
export function addAsyncCases<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Thunk extends IAsyncThunkLike,
>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  builder: ActionReducerMapBuilder<any>,
  thunk: Thunk,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSuccess?: (state: any, payload: any) => void
) {
  builder
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .addCase(thunk.pending, (state: any) => {
      state.status = "loading";
      state.error = null;
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .addCase(thunk.fulfilled, (state: any, action: any) => {
      state.status = "succeeded";
      state.error = null;
      if (onSuccess) {
        onSuccess(state, action.payload);
      }
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .addCase(thunk.rejected, (state: any, action: any) => {
      state.status = "failed";
      state.error =
        (action.payload as string) ||
        action.error?.message ||
        "An unexpected error occurred";
    });
}
