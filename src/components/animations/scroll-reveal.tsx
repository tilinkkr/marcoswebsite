"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { getGSAP } from "@/lib/animations/gsap";
import { cn } from "@/lib/utils/cn";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function ScrollReveal({
  children,
  className,
  delay = 0,
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!elementRef.current || reducedMotion) return;

    const { gsap, ScrollTrigger } = getGSAP();
    const context = gsap.context(() => {
      gsap.fromTo(
        elementRef.current,
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          delay,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: elementRef.current,
            start: "top 88%",
            once: true,
          },
        },
      );
    }, elementRef);

    return () => {
      context.revert();
      ScrollTrigger.refresh();
    };
  }, [delay, reducedMotion]);

  return (
    <div
      ref={elementRef}
      className={cn(reducedMotion && "opacity-100", className)}
    >
      {children}
    </div>
  );
}
