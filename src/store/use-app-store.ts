import { useCurrentAuth } from "@/hooks/use-auth";

import { useAppDispatch, useAppSelector } from "./hooks";
import {
  ISessionUser,
  clearUser,
  setThemeMode,
  setUser,
} from "./slices/app-slice";

export function useAppStore() {
  const dispatch = useAppDispatch();
  const { user } = useCurrentAuth();
  const theme = useAppSelector((state) => state.app.theme);

  return {
    user,
    theme,
    setUser: (userData: ISessionUser | null) => dispatch(setUser(userData)),
    clearUser: () => dispatch(clearUser()),
    setThemeMode: (mode: "light" | "dark" | "system") =>
      dispatch(setThemeMode(mode)),
  };
}
