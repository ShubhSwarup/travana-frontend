// src/hooks/useBreakpoint.ts
import { useEffect, useState } from "react";

export type Breakpoint = "base" | "sm" | "md" | "lg" | "xl" | "2xl";

const breakpoints: Record<Breakpoint, number> = {
  base: 0, // custom base fallback
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("base");

  useEffect(() => {
    function getCurrent(): Breakpoint {
      const width = window.innerWidth;
      if (width >= breakpoints["2xl"]) return "2xl";
      if (width >= breakpoints["xl"]) return "xl";
      if (width >= breakpoints["lg"]) return "lg";
      if (width >= breakpoints["md"]) return "md";
      if (width >= breakpoints["sm"]) return "sm";
      return "base";
    }

    function handleResize() {
      setBreakpoint(getCurrent());
    }

    handleResize(); // set on mount

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return breakpoint;
}
