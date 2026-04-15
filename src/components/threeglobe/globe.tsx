'use client';

/* eslint-disable react/no-unknown-property */

import './polyfill';

import type { Hotspot, GlobeConfig } from './types';

import * as THREE from 'three';
import { useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

import countries from 'src/assets/data/world.json';

interface WorldProps {
  hotspots?: Hotspot[];
  globeConfig?: GlobeConfig;
}

interface GeoFeatureCollection {
  features: any[];
}

// ======================================================
// CONFIG
// ======================================================

const DEFAULT_CONFIG: Required<GlobeConfig> = {
  arcTime: 2000,
  arcLength: 0.4,
  maxRings: 8,
  globeColor: '#020617',
  polygonColor: 'rgba(255,255,255,0.7)',
};

const VISUAL_CONFIG = {
  ringSpeed: 2,
};

// ======================================================
// HUBS
// ======================================================

const HUBS: Hotspot[] = [
  { lat: -23.5505, lng: -46.6333, size: 1.4 },
  { lat: 40.7128, lng: -74.006, size: 1.3 },
  { lat: 51.5072, lng: -0.1276, size: 1.2 },
  { lat: 48.8566, lng: 2.3522, size: 1.1 },
  { lat: 35.6762, lng: 139.6503, size: 1.3 },
  { lat: 1.3521, lng: 103.8198, size: 1.2 },
  { lat: 31.2304, lng: 121.4737, size: 1.2 },
  { lat: 28.6139, lng: 77.209, size: 1.2 },
];

// ======================================================
// UTILS
// ======================================================

const seededRandom = (seed: number): number => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// ======================================================
// HTML NODE
// ======================================================

const createHexNode = (color: string): HTMLDivElement => {
  const wrapper = document.createElement('div');
  wrapper.style.cssText = `
    width:24px;
    height:24px;
    display:flex;
    align-items:center;
    justify-content:center;
  `;

  const hex = document.createElement('div');
  hex.style.cssText = `
    width:14px;
    height:14px;
    border:2px solid ${color};
    clip-path:polygon(25% 5%,75% 5%,100% 50%,75% 95%,25% 95%,0% 50%);
    box-shadow:0 0 8px ${color};
    position:relative;
  `;

  const center = document.createElement('div');
  center.style.cssText = `
    width:4px;
    height:4px;
    border-radius:50%;
    background:${color};
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    box-shadow:0 0 6px ${color};
  `;

  hex.appendChild(center);
  wrapper.appendChild(hex);

  return wrapper;
};

// ======================================================
// ANIMATION
// ======================================================

function GlobeAnimator({ globe }: { globe: any }) {
  useFrame(({ clock }) => {
    if (!globe) return;
    const material = globe.globeMaterial() as THREE.MeshPhongMaterial | null;
    if (!material) return;

    const t = clock.getElapsedTime();
    material.emissiveIntensity = 0.85 + Math.sin(t * 1.4) * 0.1;
  });

  return null;
}

// ======================================================
// GLOBE LOGIC
// ======================================================

function useGlobeLogic(globe: any, hotspots: Hotspot[], config: Required<GlobeConfig>) {
  const material = useMemo(
    () =>
      new THREE.MeshPhongMaterial({
        color: new THREE.Color(config.globeColor),
        emissive: new THREE.Color('#0f172a'),
        shininess: 40,
        transparent: true,
        opacity: 0.96,
      }),
    [config.globeColor]
  );

  useEffect(() => {
    if (!globe) return undefined;
    globe.globeMaterial(material);
    return () => material.dispose();
  }, [globe, material]);

  useEffect(() => {
    if (!globe) return undefined;

    const geo = countries as GeoFeatureCollection;

    globe
      .hexPolygonsData(geo.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.6)
      .hexPolygonColor(() => config.polygonColor);

    globe
      .htmlElementsData(hotspots)
      .htmlLat((d: object) => (d as Hotspot).lat)
      .htmlLng((d: object) => (d as Hotspot).lng)
      .htmlAltitude(0.02)
      .htmlElement((d: object) => createHexNode((d as Hotspot).color ?? '#60a5fa'));

    globe
      .ringsData(hotspots)
      .ringLat((d: object) => (d as Hotspot).lat)
      .ringLng((d: object) => (d as Hotspot).lng)
      .ringColor(() => (t: number) => `rgba(96,165,250,${1 - t})`)
      .ringMaxRadius(config.maxRings)
      .ringPropagationSpeed(VISUAL_CONFIG.ringSpeed)
      .ringRepeatPeriod((d: object) => 1200 + seededRandom((d as Hotspot).lat) * 800);

    return () => {
      globe.ringsData([]).hexPolygonsData([]).htmlElementsData([]);
    };
  }, [globe, hotspots, config]);
}

// ======================================================
// MAIN COMPONENT
// ======================================================

export default function World({ hotspots = HUBS, globeConfig = {} }: WorldProps) {
  const config = useMemo(
    () => ({
      ...DEFAULT_CONFIG,
      ...globeConfig,
    }),
    [globeConfig]
  );

  const [globe, setGlobe] = useState<any>(null);

  useEffect(() => {
    let instance: any = null;

    // Async import explicitly blocks Node.js Turbopack compilation
    // guaranteeing initialization strictly on browser runtime.
    import('three-globe').then((mod) => {
      const ThreeGlobeClass = mod.default;
      instance = new ThreeGlobeClass();
      setGlobe(instance);
    });

    return () => {
      if (instance) {
        instance.dispose?.();
      }
    };
  }, []);

  useGlobeLogic(globe, hotspots, config);

  return (
    <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
      <PerspectiveCamera makeDefault position={[0, 0, 380]} fov={50} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.6}
        minPolarAngle={Math.PI / 2}
        maxPolarAngle={Math.PI / 2}
      />

      <ambientLight intensity={1.2} />

      <directionalLight position={[-300, 200, 300]} intensity={1.8} />

      <pointLight position={[200, 300, 200]} intensity={1.5} color="#60a5fa" />

      {globe && <primitive object={globe} />}
      {globe && <GlobeAnimator globe={globe} />}
    </Canvas>
  );
}
