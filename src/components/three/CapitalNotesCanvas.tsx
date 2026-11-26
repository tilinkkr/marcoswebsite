"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const ASSET_ROOT = "/images/marcos/capital-motion";

type NoteSpec = {
  id: string;
  file: string;
  size: [number, number];
  /** Rest position in 3D space (kept right-weighted so left copy stays crisp) */
  basePos: [number, number, number];
  /** Scroll displacement vector over progress 0 -> 1 */
  scrollPos: [number, number, number];
  baseRot: [number, number, number];
  scrollRot: [number, number, number];
  floatAmp: number;
  floatSpeed: number;
  phase: number;
  opacity: number;
  bend: number;
};

const NOTE_SPECS: readonly NoteSpec[] = [
  {
    id: "hero-01",
    file: "note-hero-01.webp",
    size: [4.6, 2.75],
    basePos: [2.7, -0.35, 1.35],
    scrollPos: [-0.85, 0.72, 0.65],
    baseRot: [-0.14, -0.34, -0.18],
    scrollRot: [0.24, 0.42, 0.28],
    floatAmp: 0.16,
    floatSpeed: 0.75,
    phase: 0.2,
    opacity: 0.94,
    bend: 0.22,
  },
  {
    id: "hero-02",
    file: "note-hero-02.webp",
    size: [4.1, 2.45],
    basePos: [4.1, 1.85, 0.35],
    scrollPos: [1.25, -1.05, 1.2],
    baseRot: [0.16, -0.45, 0.24],
    scrollRot: [-0.32, 0.36, -0.34],
    floatAmp: 0.14,
    floatSpeed: 0.9,
    phase: 1.7,
    opacity: 0.86,
    bend: -0.2,
  },
  {
    id: "mid-01",
    file: "note-mid-01.webp",
    size: [3.2, 2.15],
    basePos: [1.35, 2.15, -1.1],
    scrollPos: [1.45, -1.55, 0.95],
    baseRot: [0.1, -0.22, -0.26],
    scrollRot: [-0.22, 0.52, 0.3],
    floatAmp: 0.18,
    floatSpeed: 0.68,
    phase: 2.9,
    opacity: 0.72,
    bend: 0.18,
  },
  {
    id: "mid-02",
    file: "note-mid-02.webp",
    size: [3.35, 2.25],
    basePos: [3.85, -2.15, -0.65],
    scrollPos: [-1.4, 1.65, 1.15],
    baseRot: [-0.18, -0.28, 0.22],
    scrollRot: [0.3, -0.35, 0.42],
    floatAmp: 0.15,
    floatSpeed: 0.82,
    phase: 4.1,
    opacity: 0.78,
    bend: -0.18,
  },
  {
    id: "far-01",
    file: "note-far-01.webp",
    size: [2.45, 1.65],
    basePos: [4.95, 0.25, -2.5],
    scrollPos: [-2.1, 1.1, 0.8],
    baseRot: [0.12, 0.22, -0.32],
    scrollRot: [-0.28, -0.4, 0.45],
    floatAmp: 0.2,
    floatSpeed: 0.56,
    phase: 5.2,
    opacity: 0.52,
    bend: 0.15,
  },
  {
    id: "far-02",
    file: "note-far-02.webp",
    size: [2.25, 1.5],
    basePos: [0.45, -2.6, -2.9],
    scrollPos: [2.2, 1.8, 0.75],
    baseRot: [-0.15, 0.18, 0.3],
    scrollRot: [0.25, -0.32, -0.38],
    floatAmp: 0.17,
    floatSpeed: 0.62,
    phase: 0.95,
    opacity: 0.46,
    bend: -0.14,
  },
];

function createCurvedNoteGeometry(width: number, height: number, bend: number) {
  const geo = new THREE.PlaneGeometry(width, height, 16, 10);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i += 1) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const nx = x / (width * 0.5);
    const ny = y / (height * 0.5);
    // Gentle aerodynamic S-curve so each note catches light like real paper
    const z =
      Math.sin(nx * Math.PI * 0.55) * bend +
      Math.cos(ny * Math.PI * 0.5) * (bend * 0.32);
    pos.setZ(i, z);
  }
  geo.computeVertexNormals();
  return geo;
}

function FloatingNote({
  spec,
  texture,
  scrollProgressRef,
}: {
  spec: NoteSpec;
  texture: THREE.Texture;
  scrollProgressRef: React.RefObject<number>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const smoothProgress = useRef(0);

  const geometry = useMemo(
    () => createCurvedNoteGeometry(spec.size[0], spec.size[1], spec.bend),
    [spec.size, spec.bend],
  );

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const clampedDelta = Math.min(delta, 0.05);
    const targetProgress = scrollProgressRef.current ?? 0;
    smoothProgress.current = THREE.MathUtils.damp(
      smoothProgress.current,
      targetProgress,
      5.2,
      clampedDelta,
    );
    const p = smoothProgress.current;
    const t = state.clock.elapsedTime;

    const bobY = Math.sin(t * spec.floatSpeed + spec.phase) * spec.floatAmp;
    const bobX =
      Math.cos(t * spec.floatSpeed * 0.7 + spec.phase) * (spec.floatAmp * 0.45);
    const flutterRotX =
      Math.sin(t * spec.floatSpeed * 0.9 + spec.phase) * 0.045;
    const flutterRotY =
      Math.cos(t * spec.floatSpeed * 0.65 + spec.phase) * 0.055;

    mesh.position.set(
      spec.basePos[0] + spec.scrollPos[0] * p + bobX,
      spec.basePos[1] + spec.scrollPos[1] * p + bobY,
      spec.basePos[2] + spec.scrollPos[2] * p,
    );

    mesh.rotation.set(
      spec.baseRot[0] + spec.scrollRot[0] * p + flutterRotX,
      spec.baseRot[1] + spec.scrollRot[1] * p + flutterRotY,
      spec.baseRot[2] + spec.scrollRot[2] * p,
    );
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        map={texture}
        transparent
        opacity={spec.opacity}
        roughness={0.58}
        metalness={0.14}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function AmbientCopperMotes({
  scrollProgressRef,
}: {
  scrollProgressRef: React.RefObject<number>;
}) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 42;
    const data = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      // Deterministic golden-ratio spread so SSR/hydration & rerenders never jitter
      const u = ((i * 0.6180339887) % 1) * 2 - 1;
      const v = ((i * 0.3819660113 + 0.17) % 1) * 2 - 1;
      const w = ((i * 0.7548776662) % 1) * 2 - 1;
      data[i * 3] = 2.4 + u * 4.4;
      data[i * 3 + 1] = v * 3.6;
      data[i * 3 + 2] = -1.2 + w * 2.8;
    }
    return data;
  }, []);

  useFrame((state) => {
    const pts = pointsRef.current;
    if (!pts) return;
    const t = state.clock.elapsedTime;
    const p = scrollProgressRef.current ?? 0;
    pts.rotation.y = t * 0.03 + p * 0.35;
    pts.position.y = Math.sin(t * 0.25) * 0.18 + p * 0.4;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#d99a6c"
        size={0.045}
        transparent
        opacity={0.45}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function NotesScene({
  scrollProgressRef,
  onReady,
}: {
  scrollProgressRef: React.RefObject<number>;
  onReady?: () => void;
}) {
  const [textures, setTextures] = useState<Record<string, THREE.Texture>>({});

  useEffect(() => {
    let cancelled = false;
    const loader = new THREE.TextureLoader();
    const loaded: Record<string, THREE.Texture> = {};
    let remaining = NOTE_SPECS.length;

    const finishOne = () => {
      remaining -= 1;
      if (remaining === 0 && !cancelled) {
        setTextures({ ...loaded });
        onReady?.();
      }
    };

    for (const spec of NOTE_SPECS) {
      loader.load(
        `${ASSET_ROOT}/${spec.file}`,
        (tex) => {
          if (cancelled) {
            tex.dispose();
            return;
          }
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = 4;
          loaded[spec.id] = tex;
          finishOne();
        },
        undefined,
        () => {
          finishOne();
        },
      );
    }

    return () => {
      cancelled = true;
      Object.values(loaded).forEach((tex) => tex.dispose());
    };
  }, [onReady]);

  return (
    <>
      <ambientLight intensity={1.15} color="#efe4d7" />
      <directionalLight position={[5, 4, 6]} intensity={1.35} color="#f6d5ba" />
      <pointLight
        position={[4.5, -1.5, 3]}
        intensity={1.6}
        distance={14}
        color="#c97941"
      />
      <pointLight
        position={[-2, 2.5, 2]}
        intensity={0.9}
        distance={12}
        color="#a62932"
      />
      <AmbientCopperMotes scrollProgressRef={scrollProgressRef} />
      {NOTE_SPECS.map((spec) => {
        const texture = textures[spec.id];
        if (!texture) return null;
        return (
          <FloatingNote
            key={spec.id}
            spec={spec}
            texture={texture}
            scrollProgressRef={scrollProgressRef}
          />
        );
      })}
    </>
  );
}

export type CapitalNotesCanvasProps = {
  scrollProgressRef: React.RefObject<number>;
  onReady?: () => void;
};

export default function CapitalNotesCanvas({
  scrollProgressRef,
  onReady,
}: CapitalNotesCanvasProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 7.6], fov: 42, near: 0.1, far: 40 }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      }}
      style={{ width: "100%", height: "100%", pointerEvents: "none" }}
    >
      <NotesScene scrollProgressRef={scrollProgressRef} onReady={onReady} />
    </Canvas>
  );
}
