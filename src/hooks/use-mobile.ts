import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * Custom hook to determine if the current viewport width is within mobile breakpoint.
 * @param breakpoint - Optional custom breakpoint in pixels (default: 768)
 * @returns boolean indicating if the screen width is less than breakpoint
 */
export function useIsMobile(breakpoint: number = MOBILE_BREAKPOINT): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < breakpoint;
    }
    return false;
  });

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < breakpoint);

    return () => mql.removeEventListener("change", onChange);
  }, [breakpoint]);

  return isMobile;
}

export default useIsMobile;
