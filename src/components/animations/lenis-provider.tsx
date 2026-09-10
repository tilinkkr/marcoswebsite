"use client";

import { useEffect, type ReactNode } from "react";

import { useAnimationPreferences } from "@/hooks/use-animation-preferences";

type LenisProviderProps = {
  children: ReactNode;
  enabled?: boolean;
  disableOnMobile?: boolean;
};

export function LenisProvider({
  children,
  enabled = false,
  disableOnMobile = true,
}: LenisProviderProps) {
  const { isMobile, reducedMotion } = useAnimationPreferences();

  useEffect(() => {
    if (!enabled || reducedMotion || (disableOnMobile && isMobile)) return;

    let frame = 0;
    let lenis: import("lenis").default | undefined;
    let cancelled = false;

    void import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;

      lenis = new Lenis({ autoRaf: false });
      const raf = (time: number) => {
        lenis?.raf(time);
        frame = window.requestAnimationFrame(raf);
      };
      frame = window.requestAnimationFrame(raf);
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      lenis?.destroy();
    };
  }, [disableOnMobile, enabled, isMobile, reducedMotion]);

  return children;
}
