import { useAppDispatch, useAppSelector } from "./hooks";
import { User, clearUser, fetchUserThunk, setUser } from "./slices/appSlice";

export function useAppStore() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.app.data);
  const status = useAppSelector((state) => state.app.status);
  const error = useAppSelector((state) => state.app.error);

  return {
    user,
    status,
    error,
    isLoading: status === "loading",
    setUser: (userData: User | null) => dispatch(setUser(userData)),
    clearUser: () => dispatch(clearUser()),
    fetchUser: (userId: string) => dispatch(fetchUserThunk(userId)),
  };
}
