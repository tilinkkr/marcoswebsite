"use client";

import { useEffect, useState } from "react";

export type AnimationPreferences = {
  isMobile: boolean;
  isLowPower: boolean;
  reducedMotion: boolean;
};

const MOBILE_QUERY = "(max-width: 767px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function useAnimationPreferences(): AnimationPreferences {
  const [preferences, setPreferences] = useState<AnimationPreferences>({
    isMobile: false,
    isLowPower: false,
    reducedMotion: false,
  });

  useEffect(() => {
    const mobileQuery = window.matchMedia(MOBILE_QUERY);
    const reducedMotionQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    const update = () => {
      const hardwareConcurrency = navigator.hardwareConcurrency ?? 4;
      const deviceMemory =
        "deviceMemory" in navigator
          ? Number(
              (navigator as Navigator & { deviceMemory?: number }).deviceMemory,
            )
          : 4;

      setPreferences({
        isMobile: mobileQuery.matches,
        isLowPower: hardwareConcurrency <= 4 || deviceMemory <= 2,
        reducedMotion: reducedMotionQuery.matches,
      });
    };

    update();
    mobileQuery.addEventListener("change", update);
    reducedMotionQuery.addEventListener("change", update);
    return () => {
      mobileQuery.removeEventListener("change", update);
      reducedMotionQuery.removeEventListener("change", update);
    };
  }, []);

  return preferences;
}
