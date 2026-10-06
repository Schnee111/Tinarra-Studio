"use client";

import { useSyncExternalStore } from "react";

const DEFAULT_BREAKPOINT = 768;

export function useIsMobile(breakpoint = DEFAULT_BREAKPOINT) {
  return useSyncExternalStore(
    (callback) => {
      const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);
      mediaQuery.addEventListener("change", callback);
      return () => mediaQuery.removeEventListener("change", callback);
    },
    () => window.matchMedia(`(max-width: ${breakpoint}px)`).matches,
    () => false
  );
}
