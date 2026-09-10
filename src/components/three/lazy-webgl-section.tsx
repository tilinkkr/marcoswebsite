"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

const WebGLScene = dynamic(() => import("./webgl-scene"), {
  ssr: false,
  loading: () => null,
});

type LazyWebGLSectionProps = {
  children?: ReactNode;
  enabled?: boolean;
};

export function LazyWebGLSection({
  children,
  enabled = false,
}: LazyWebGLSectionProps) {
  if (!enabled) return null;
  return <WebGLScene>{children}</WebGLScene>;
}
