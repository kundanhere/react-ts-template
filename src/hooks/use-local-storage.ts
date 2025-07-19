import { useCallback } from "react";

import {
  clearStorage,
  getItem,
  removeItem,
  setItem,
} from "../utils/local-storage";

export function useLocalStorage<T = any>(key: string) {
  const set = useCallback((value: T) => setItem(key, value), [key]);
  const get = useCallback(() => getItem<T>(key), [key]);
  const remove = useCallback(() => removeItem(key), [key]);
  const clear = useCallback(() => clearStorage(), []);

  return { set, get, remove, clear };
}
