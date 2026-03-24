'use client';

/* eslint-disable react/no-unknown-property */

import * as THREE from 'three';
import ThreeGlobe from 'three-globe';
import { useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

import countries from 'src/assets/data/world.json';

// ======================================================
// TYPES
// ======================================================

export interface ArcData {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt?: number;
  color: string;
}

export interface Hotspot {
  lat: number;
  lng: number;
  size: number;
  connections?: number;
  color?: string;
}

export interface GlobeConfig {
  arcTime?: number;
  arcLength?: number;
  maxRings?: number;
  globeColor?: string;
  polygonColor?: string;
}

interface WorldProps {
  data: ArcData[];
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
  arcStroke: 0.7,
  arcDashGap: 2.4,
  ringSpeed: 2,
  arcsTransition: 1000,
};

const MAX_CONNECTIONS = 3;

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

const distance = (a: ArcData): number =>
  Math.sqrt(
    (a.startLat - a.endLat) ** 2 +
    (a.startLng - a.endLng) ** 2
  );

const calculateArcAltitude = (arc: ArcData): number => {
  const d = distance(arc) / 90;
  return THREE.MathUtils.clamp(d * 0.7, 0.15, 0.6);
};

// ======================================================
// NETWORK GENERATION
// ======================================================

const generateClusterArcs = (hubs: Hotspot[]): ArcData[] => {

  const arcs: ArcData[] = [];
  let order = 0;

  hubs.forEach((hub, i) => {

    const targets = hubs
      .map((h, idx) => ({ hub: h, idx }))
      .filter(({ idx }) => idx !== i)
      .sort(() => Math.random() - 0.5)
      .slice(0, hub.connections ?? MAX_CONNECTIONS);

    targets.forEach(({ hub: target, idx }) => {

      if (i < idx) {
        arcs.push({
          order: order++,
          startLat: hub.lat,
          startLng: hub.lng,
          endLat: target.lat,
          endLng: target.lng,
          color: '#60a5fa',
        });
      }

    });

  });

  return arcs;

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

function GlobeAnimator({ globe }: { globe: ThreeGlobe }) {

  useFrame(({ clock }) => {

    const material =
      globe.globeMaterial() as THREE.MeshPhongMaterial | null;

    if (!material) return;

    const t = clock.getElapsedTime();

    material.emissiveIntensity =
      0.85 + Math.sin(t * 1.4) * 0.1;

  });

  return null;

}

// ======================================================
// GLOBE LOGIC
// ======================================================

function useGlobeLogic(
  globe: ThreeGlobe,
  arcs: ArcData[],
  hotspots: Hotspot[],
  config: Required<GlobeConfig>
) {

  const material = useMemo(() =>
    new THREE.MeshPhongMaterial({
      color: new THREE.Color(config.globeColor),
      emissive: new THREE.Color('#0f172a'),
      shininess: 40,
      transparent: true,
      opacity: 0.96,
    }),
  [config.globeColor]);

  useEffect(() => {

    globe.globeMaterial(material);

    return () => material.dispose();

  }, [globe, material]);

  useEffect(() => {

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
      .htmlElement((d: object) =>
        createHexNode((d as Hotspot).color ?? '#60a5fa')
      );

    globe
      .ringsData(hotspots)
      .ringLat((d: object) => (d as Hotspot).lat)
      .ringLng((d: object) => (d as Hotspot).lng)
      .ringColor(() => (t: number) => `rgba(96,165,250,${1 - t})`)
      .ringMaxRadius(config.maxRings)
      .ringPropagationSpeed(VISUAL_CONFIG.ringSpeed)
      .ringRepeatPeriod((d: object) =>
        1200 + seededRandom((d as Hotspot).lat) * 800
      );

    globe
      .arcsData(arcs)
      .arcStartLat((d: object) => (d as ArcData).startLat)
      .arcStartLng((d: object) => (d as ArcData).startLng)
      .arcEndLat((d: object) => (d as ArcData).endLat)
      .arcEndLng((d: object) => (d as ArcData).endLng)
      .arcColor((d: object) => (d as ArcData).color)
      .arcAltitude((d: object) => {

        const arc = d as ArcData;
        return arc.arcAlt ?? calculateArcAltitude(arc);

      })
      .arcStroke(VISUAL_CONFIG.arcStroke)
      .arcDashLength(config.arcLength)
      .arcDashGap(VISUAL_CONFIG.arcDashGap)
      .arcDashAnimateTime((d: object) => {

        const arc = d as ArcData;
        const dist = distance(arc);

        return THREE.MathUtils.mapLinear(
          dist,
          5,
          120,
          1200,
          4000
        );

      })
      .arcsTransitionDuration(VISUAL_CONFIG.arcsTransition);

    return () => {

      globe
        .arcsData([])
        .ringsData([])
        .hexPolygonsData([])
        .htmlElementsData([]);

    };

  }, [globe, arcs, hotspots, config]);

}

// ======================================================
// MAIN COMPONENT
// ======================================================

export function World({
  data,
  hotspots = HUBS,
  globeConfig = {},
}: WorldProps) {

  const config = useMemo(() => ({
    ...DEFAULT_CONFIG,
    ...globeConfig,
  }), [globeConfig]);

  const globe = useMemo(() => new ThreeGlobe(), []);

  useEffect(() => {
    return () => {
      (globe as any).dispose?.();
    };
  }, [globe]);

  const clusterArcs = useMemo(
    () => generateClusterArcs(hotspots),
    [hotspots]
  );

  const arcs = useMemo(
    () => [...data, ...clusterArcs],
    [data, clusterArcs]
  );

  useGlobeLogic(globe, arcs, hotspots, config);

  return (

    <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>

      <PerspectiveCamera
        makeDefault
        position={[0, 0, 380]}
        fov={50}
      />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.6}
      />

      <ambientLight intensity={1.2} />

      <directionalLight
        position={[-300, 200, 300]}
        intensity={1.8}
      />

      <pointLight
        position={[200, 300, 200]}
        intensity={1.5}
        color="#60a5fa"
      />

      <primitive object={globe} />

      <GlobeAnimator globe={globe} />

    </Canvas>

  );

}