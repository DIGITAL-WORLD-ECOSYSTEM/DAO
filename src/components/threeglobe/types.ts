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
