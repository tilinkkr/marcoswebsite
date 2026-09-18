"use client";

import { useEffect, type ReactNode } from "react";

import { useAnimationPreferences } from "@/hooks/use-animation-preferences";
import { getGSAP } from "@/lib/animations/gsap";

type LenisProviderProps = {
  children: ReactNode;
  enabled?: boolean;
  disableOnMobile?: boolean;
  disableOnLowPower?: boolean;
};

export function LenisProvider({
  children,
  enabled = true,
  disableOnMobile = true,
  disableOnLowPower = true,
}: LenisProviderProps) {
  const { isLowPower, isMobile, reducedMotion } = useAnimationPreferences();

  useEffect(() => {
    const mobileViewport = window.matchMedia("(max-width: 767px)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const hardwareConcurrency = navigator.hardwareConcurrency ?? 4;
    const deviceMemory =
      "deviceMemory" in navigator
        ? Number(
            (navigator as Navigator & { deviceMemory?: number }).deviceMemory,
          )
        : 8;
    const saveData = Boolean(
      (navigator as Navigator & { connection?: { saveData?: boolean } })
        .connection?.saveData,
    );
    const constrainedHardware =
      hardwareConcurrency <= 2 ||
      deviceMemory <= 2 ||
      (hardwareConcurrency <= 4 && deviceMemory <= 4);

    if (
      !enabled ||
      reducedMotion ||
      prefersReducedMotion ||
      (disableOnMobile && (isMobile || mobileViewport)) ||
      (disableOnLowPower &&
        (isLowPower || saveData || constrainedHardware))
    ) {
      document.documentElement.removeAttribute("data-lenis-active");
      return;
    }

    let lenis: import("lenis").default | undefined;
    let cancelled = false;
    let cleanupRefreshListeners: (() => void) | undefined;
    let updateScrollTrigger: (() => void) | undefined;
    const { ScrollTrigger } = getGSAP();

    void import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;

      lenis = new Lenis({
        autoRaf: true,
        lerp: 0.16,
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1,
        infinite: false,
      });

      updateScrollTrigger = () => ScrollTrigger.update();
      lenis.on("scroll", updateScrollTrigger);
      lenis.resize();
      document.documentElement.setAttribute("data-lenis-active", "true");

      ScrollTrigger.config({ ignoreMobileResize: true, limitCallbacks: false });

      const refresh = () => {
        if (cancelled) return;
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            if (cancelled) return;
            lenis?.resize();
            ScrollTrigger.sort();
            ScrollTrigger.refresh(true);
            ScrollTrigger.update();
          });
        });
      };

      refresh();
      void document.fonts?.ready.then(refresh);
      void Promise.allSettled(
        Array.from(document.images, (image) =>
          image.complete ? Promise.resolve() : image.decode(),
        ),
      ).then(refresh);
      window.addEventListener("load", refresh, { once: true });
      window.addEventListener("pageshow", refresh);

      cleanupRefreshListeners = () => {
        window.removeEventListener("load", refresh);
        window.removeEventListener("pageshow", refresh);
      };
    });

    return () => {
      cancelled = true;
      cleanupRefreshListeners?.();
      if (lenis && updateScrollTrigger) {
        lenis.off("scroll", updateScrollTrigger);
      }
      lenis?.destroy();
      document.documentElement.removeAttribute("data-lenis-active");
    };
  }, [
    disableOnLowPower,
    disableOnMobile,
    enabled,
    isLowPower,
    isMobile,
    reducedMotion,
  ]);

  return children;
}
