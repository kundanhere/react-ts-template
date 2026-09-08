import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { IAuthUser, ISessionUser } from "@/types";

export type { ISessionUser, IAuthUser };
export type IUser = IAuthUser;

export interface IAppState {
  data: IAuthUser | null;
  theme: "light" | "dark" | "system";
}

const initialState: IAppState = {
  data: null,
  theme: "system",
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser | null>) => {
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
});

export const { setUser, clearUser, setThemeMode } = appSlice.actions;
export default appSlice.reducer;
