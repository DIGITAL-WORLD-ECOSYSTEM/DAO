'use client';

/* eslint-disable react/no-unknown-property */
import type { PropsWithChildren } from 'react';

import { memo, Suspense } from 'react';
import { Stars } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

const STARS_CONFIG = {
  radius: 120,
  depth: 60,
  count: 6000,
  factor: 4,
  fade: true,
};

const LIGHT_CONFIG = {
  ambientIntensity: 0.5,
  pointPosition: [-3, 2, 5] as [number, number, number],
  pointIntensity: 1.2,
};

/* ================================
   Componente de Fundo (Layout)
   Ajustado para servir como base profunda (Layer 0)
================================ */
export const Space = memo(({ children }: PropsWithChildren) => (
  <Box
    id="space-background"
    sx={{
      position: 'fixed',
      inset: 0,
      zIndex: -1, // Crucial: Coloca o fundo atrás de todo o conteúdo (inclusive o header)
      background: '#010411', // Cor base do espaço profundo
      overflow: 'hidden',
      pointerEvents: 'none', // Garante que o fundo não "roube" cliques de botões ou links
    }}
  >
    {children}
  </Box>
));

/* ================================
   Atmosfera 3D (Cena)
================================ */
export const SpaceAtmosphere = memo(() => (
  <Suspense fallback={null}>
    <Stars {...STARS_CONFIG} />
    <ambientLight intensity={LIGHT_CONFIG.ambientIntensity} />
    <pointLight
      position={LIGHT_CONFIG.pointPosition}
      intensity={LIGHT_CONFIG.pointIntensity}
    />
  </Suspense>
));

/* ================================
   Componente Completo com Canvas
================================ */
export const SpaceScene = memo(() => (
  <Space>
    <Canvas
      camera={{ position: [0, 0, 10], fov: 75 }}
      gl={{ antialias: true, alpha: true }}
      // Estilo inline para garantir que o canvas não intercepte o mouse
      style={{ pointerEvents: 'none' }} 
    >
      <SpaceAtmosphere />
    </Canvas>
  </Space>
));