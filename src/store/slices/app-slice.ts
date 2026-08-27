import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  AsyncState,
  addAsyncCases,
  createAsyncState,
} from "@/utils/redux-helpers";

export interface IUser {
  id?: string;
  name: string;
  email?: string;
}
export type User = IUser;

export interface IAppState extends AsyncState<IUser> {
  theme: "light" | "dark" | "system";
}
export type AppState = IAppState;

const initialState: AppState = {
  ...createAsyncState<User>(null),
  theme: "system",
};

// Async thunk for fetching user profile details asynchronously
export const fetchUserThunk = createAsyncThunk<User, string>(
  "app/fetchUser",
  async (userId: string, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        id: userId,
        name: `User ${userId}`,
        email: `user${userId}@example.com`,
      };
    } catch (err: unknown) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to fetch user"
      );
    }
  }
);

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.data = action.payload;
    },
    clearUser: (state) => {
      state.data = null;
    },
    setThemeMode: (
      state,
      action: PayloadAction<"light" | "dark" | "system">
    ) => {
      state.theme = action.payload;
    },
  },
  extraReducers: (builder) => {
    addAsyncCases(builder, fetchUserThunk, (state, payload) => {
      state.data = payload;
    });
  },
});

export const { setUser, clearUser, setThemeMode } = appSlice.actions;
export default appSlice.reducer;
