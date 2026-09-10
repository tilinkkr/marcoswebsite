"use client";

import { motion, type HTMLMotionProps } from "motion/react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function MotionReveal({ children, ...props }: HTMLMotionProps<"div">) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
