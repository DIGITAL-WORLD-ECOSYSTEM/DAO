'use client';

/* eslint-disable react/no-unknown-property */
import type * as THREE from 'three';

import { memo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

// ----------------------------------------------------------------------

type GlassCubeProps = {
  size?: number;
  rotationSpeed?: number;
  floatSpeed?: number;
  transmission?: number;
  roughness?: number;
  thickness?: number;
  ior?: number;
  opacity?: number;
};

export const GlassCube = memo(({
  size = 5,
  rotationSpeed = 0.05,
  floatSpeed = 0.15,
  transmission = 0.85,
  roughness = 0.12,
  thickness = 0.6,
  ior = 1.2,
  opacity = 0.12,
}: GlassCubeProps) => {

  const cubeRef = useRef<THREE.Mesh | null>(null);

  useFrame((state) => {
    if (!cubeRef.current) return;

    const t = state.clock.getElapsedTime();
    cubeRef.current.rotation.y = t * rotationSpeed;
    cubeRef.current.rotation.x = Math.sin(t * floatSpeed) * 0.05;
  });

  return (
    <mesh ref={cubeRef} castShadow receiveShadow>
      <boxGeometry args={[size, size, size]} />
      <meshPhysicalMaterial
        transmission={transmission}
        roughness={roughness}
        thickness={thickness}
        ior={ior}
        transparent
        opacity={opacity}
        depthWrite={false}
      />
    </mesh>
  );
});

GlassCube.displayName = 'GlassCube';