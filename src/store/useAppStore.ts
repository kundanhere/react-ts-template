import { useAppDispatch, useAppSelector } from "./hooks";
import { setUser } from "./slices/appSlice";

export function useAppStore() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.app.user);

  return {
    user,
    setUser: (user: { name: string } | null) => dispatch(setUser(user)),
  };
}
