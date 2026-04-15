'use client';

import * as THREE from 'three';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

const PARAMS = {
  ringParticles: 60000,
  radius: 4,
  thickness: 0.05,
};

export function EventHorizon({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null!);
  const ringRef = useRef<THREE.Points>(null!);
  const holeRef = useRef<THREE.Mesh>(null!);
  const dopplerRef = useRef<THREE.Mesh>(null!);

  // 1. Gerador do Disco de Acreção
  const [ringPos, ringCols] = useMemo(() => {
    const pos = new Float32Array(PARAMS.ringParticles * 3);
    const cols = new Float32Array(PARAMS.ringParticles * 3);
    const color = new THREE.Color();

    for (let i = 0; i < PARAMS.ringParticles; i++) {
      const i3 = i * 3;
      const angle = Math.random() * Math.PI * 2;
      
      const r = PARAMS.radius + Math.pow(Math.random(), 2) * 6;
      
      pos[i3] = Math.cos(angle) * r;
      pos[i3 + 1] = (Math.random() - 0.5) * PARAMS.thickness * (r * 0.5);
      pos[i3 + 2] = Math.sin(angle) * r;

      const t = (r - PARAMS.radius) / 6;
      color.setHSL(0.05 + t * 0.5, 0.9, 0.6);
      cols[i3] = color.r; cols[i3 + 1] = color.g; cols[i3 + 2] = color.b;
    }
    return [pos, cols];
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const sp = scrollProgress.current;

    if (groupRef.current) {
      // Ativação baseada no scroll (Fade In)
      const fadeIn = THREE.MathUtils.clamp((sp - 0.60) / 0.08, 0.0, 1.0);
      groupRef.current.visible = fadeIn > 0.0;
      
      const ringMat = ringRef.current?.material as THREE.PointsMaterial;
      if (ringMat) ringMat.opacity = 0.8 * fadeIn;

      const dopplerMat = dopplerRef.current?.material as THREE.MeshBasicMaterial;
      if (dopplerMat) dopplerMat.opacity = 0.2 * fadeIn;

      // Rotação do disco
      ringRef.current.rotation.y = t * (0.5 + sp);
      
      // Pulsação e Escala da Singularidade
      const pulse = Math.max(0.01, fadeIn * (1 + Math.sin(t * 2) * 0.05));
      holeRef.current.scale.set(pulse, pulse, pulse);

      // ✅ AJUSTE DE POSIÇÃO: Movido para o lado DIREITO
      // X: 8 (Positivo move para a direita)
      // Y: 0 (Centralizado verticalmente, ajuste se necessário)
      // Z: -15 (Mantém a profundidade para escala visual)
      groupRef.current.position.set(2, 0, -45);
    }
  });

  return (
    <group ref={groupRef}>
      {/* O Disco de Acreção */}
      <points ref={ringRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[ringPos, 3]} />
          <bufferAttribute attach="attributes-color" args={[ringCols, 3]} />
        </bufferGeometry>
        <pointsMaterial 
          size={0.02} 
          vertexColors 
          transparent 
          opacity={0.8} 
          blending={THREE.AdditiveBlending} 
          depthWrite={false} 
        />
      </points>

      {/* A Singularidade (O "Buraco" Negro) */}
      <mesh ref={holeRef}>
        <sphereGeometry args={[PARAMS.radius * 0.95, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Brilho de Doppler */}
      <mesh ref={dopplerRef}>
        <sphereGeometry args={[PARAMS.radius, 64, 64]} />
        <meshBasicMaterial 
          color="#ffaa00" 
          transparent 
          opacity={0.2} 
          blending={THREE.AdditiveBlending} 
          side={THREE.BackSide} 
        />
      </mesh>
    </group>
  );
}