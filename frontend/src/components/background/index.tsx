'use client';

/* eslint-disable react/no-unknown-property */

import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { memo, useRef, useMemo, useEffect, Suspense } from 'react';
import {
  Float,
  PerspectiveCamera,
  PerformanceMonitor
} from '@react-three/drei';

import { GalacticCore } from './galactic';
import { EventHorizon } from './event-horizon';
import { FlowerOfLife } from './flower-of-life';
import { Space, SpaceAtmosphere } from './space';
import { SceneController } from './scene-controller';
import { StellarEvolution } from './stellar-evolution';

// ----------------------------------------------------------------------

const RADIUS = 0.9;

/**
 * Fase inicial da cena
 * isolada para melhorar organização
 */
const InitialPhase = memo(function InitialPhase({
  scrollProgress,
  sharedSphereGeo,
  sharedGlassGeo,
  glassMat
}: {
  scrollProgress: React.MutableRefObject<number>;
  sharedSphereGeo: THREE.SphereGeometry;
  sharedGlassGeo: THREE.SphereGeometry;
  glassMat: THREE.MeshPhysicalMaterial;
}) {
  return (
    <Float
      speed={1.2}
      rotationIntensity={0.15}
      floatIntensity={0.4}
    >
      <group scale={0.42} position={[0.12, -0.08, 0]}>
        <FlowerOfLife
          scrollProgress={scrollProgress}
          sharedSphereGeo={sharedSphereGeo}
          sharedGlassGeo={sharedGlassGeo}
          glassMat={glassMat}
        />
      </group>
    </Float>
  );
});

// ----------------------------------------------------------------------

export const HomeBackground: React.FC = memo(() => {

  const scrollProgress = useRef<number>(0);

  /**
   * Geometrias compartilhadas
   */
  const sharedSphereGeo = useMemo(
    () => new THREE.SphereGeometry(RADIUS, 32, 32),
    []
  );

  const sharedGlassGeo = useMemo(
    () => new THREE.SphereGeometry(RADIUS, 24, 24),
    []
  );

  /**
   * Material físico de vidro
   */
  const glassMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        transmission: 0.9,
        roughness: 0.08,
        thickness: 0.4,
        ior: 1.15,
        transparent: true,
        opacity: 0.25,
        depthWrite: false
      }),
    []
  );

  /**
   * Cleanup de memória GPU
   */
  useEffect(() => {
    return () => {
      sharedSphereGeo.dispose();
      sharedGlassGeo.dispose();
      glassMat.dispose();
    };
  }, [sharedSphereGeo, sharedGlassGeo, glassMat]);

  /**
   * DPR dinâmico
   */
  const dpr = useMemo(() => {
    if (typeof window === 'undefined') return 1;
    return Math.min(window.devicePixelRatio, 2);
  }, []);

  return (
    <Space>
      <Canvas
        dpr={dpr}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true
        }}
      >

        {/* Monitor de performance */}
        <PerformanceMonitor />

        {/* Câmera principal */}
        <PerspectiveCamera
          makeDefault
          position={[0, 0, 6]}
          far={5000}
        />

        <Suspense fallback={null}>

          <SpaceAtmosphere />

          {/* Controle de scroll da cena */}
          <SceneController scrollProgress={scrollProgress} />

          {/* Evolução estelar */}
          <StellarEvolution scrollProgress={scrollProgress} />

          {/* Núcleo galáctico */}
          <GalacticCore scrollProgress={scrollProgress} />

          {/* Horizonte de eventos */}
          <EventHorizon scrollProgress={scrollProgress} />

          {/* Fase inicial */}
          <InitialPhase
            scrollProgress={scrollProgress}
            sharedSphereGeo={sharedSphereGeo}
            sharedGlassGeo={sharedGlassGeo}
            glassMat={glassMat}
          />

        </Suspense>

      </Canvas>
    </Space>
  );
});

HomeBackground.displayName = 'HomeBackground';