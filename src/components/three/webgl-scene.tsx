"use client";

import { Canvas } from "@react-three/fiber";
import type { ReactNode } from "react";

type WebGLSceneProps = {
  children?: ReactNode;
};

export default function WebGLScene({ children }: WebGLSceneProps) {
  return (
    <div aria-hidden className="h-full min-h-64 w-full">
      <Canvas dpr={[1, 1.5]} frameloop="demand">
        {children}
      </Canvas>
    </div>
  );
}
