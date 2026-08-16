import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface User {
  id?: string;
  name: string;
  email?: string;
}

export interface AppState {
  user: User | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AppState = {
  user: null,
  status: "idle",
  error: null,
};

// Async thunk for fetching user profile details asynchronously
export const fetchUserThunk = createAsyncThunk(
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
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchUserThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to load user";
      });
  },
});

export const { setUser, clearUser } = appSlice.actions;
export default appSlice.reducer;
