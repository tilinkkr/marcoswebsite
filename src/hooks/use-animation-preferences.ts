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
        : 8;
      const saveData = Boolean(
        (navigator as Navigator & { connection?: { saveData?: boolean } })
          .connection?.saveData,
      );

      // Four logical cores alone is not a reliable low-power signal. Treating
      // it as one disabled smooth scrolling on many capable laptops.
      const constrainedHardware =
        hardwareConcurrency <= 2 ||
        deviceMemory <= 2 ||
        (hardwareConcurrency <= 4 && deviceMemory <= 4);

      setPreferences({
        isMobile: mobileQuery.matches,
        isLowPower: saveData || constrainedHardware,
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
