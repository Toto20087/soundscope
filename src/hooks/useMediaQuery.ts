"use client";

import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

// Convenience hooks for common breakpoints
export function useIsMobile() {
  return !useMediaQuery("(min-width: 768px)");
}

export function useIsDesktop() {
  return useMediaQuery("(min-width: 1024px)");
}
