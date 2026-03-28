'use client';

import * as THREE from 'three';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

const PARTICLE_COUNT = 100000;

interface StellarEvolutionProps {
  scrollProgress: React.MutableRefObject<number>;
}

export function StellarEvolution({ scrollProgress }: StellarEvolutionProps) {
  const pointsRef = useRef<THREE.Points>(null!);
  const materialRef = useRef<THREE.PointsMaterial>(null!);

  // --------------------------------------------------------------------------
  // 1. GERAÇÃO DE DADOS (POSIÇÕES E CORES)
  // --------------------------------------------------------------------------
  const [posExplode, posGalaxy, colors] = useMemo(() => {
    const pExplode = new Float32Array(PARTICLE_COUNT * 3);
    const pGalaxy = new Float32Array(PARTICLE_COUNT * 3);
    const cols = new Float32Array(PARTICLE_COUNT * 3);
    const color = new THREE.Color();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      // EXPLOSÃO: Esfera inicial
      const rE = 2 + Math.random() * 28; 
      const thetaE = Math.random() * Math.PI * 2;
      const phiE = Math.acos((Math.random() * 2) - 1);
      
      pExplode[i3]     = rE * Math.sin(phiE) * Math.cos(thetaE);
      pExplode[i3 + 1] = rE * Math.sin(phiE) * Math.sin(thetaE);
      pExplode[i3 + 2] = rE * Math.cos(phiE);

      // GALÁXIA: Destino final das partículas
      const angle = Math.random() * Math.PI * 2;
      const rG = 40 + Math.random() * 110; 
      const spiral = rG * 0.2; 
      
      pGalaxy[i3]     = Math.cos(angle + spiral) * rG;
      pGalaxy[i3 + 1] = (Math.random() - 0.5) * 8; 
      pGalaxy[i3 + 2] = Math.sin(angle + spiral) * rG;

      color.setHSL(0.55 + (Math.random() * 0.05), 0.8, 0.75);
      cols[i3]     = color.r; 
      cols[i3 + 1] = color.g; 
      cols[i3 + 2] = color.b;
    }
    return [pExplode, pGalaxy, cols];
  }, []);

  // --------------------------------------------------------------------------
  // 2. TEXTURA DAS ESTRELAS
  // --------------------------------------------------------------------------
  const starTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.4, 'rgba(200,255,255,0.3)'); 
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
  }, []);

  // --------------------------------------------------------------------------
  // 3. ANIMAÇÃO E TRANSIÇÃO (ATUALIZADO)
  // --------------------------------------------------------------------------
  useFrame(() => {
    const sp = scrollProgress.current;

    // AJUSTE: Inicia em 0.18 para cobrir a saída da Flor da Vida
    if (sp < 0.18 || sp > 0.75) {
      if (pointsRef.current.visible) pointsRef.current.visible = false;
      return;
    }
    pointsRef.current.visible = true;

    const geo = pointsRef.current.geometry;
    const positions = geo.attributes.position.array as Float32Array;
    
    // AJUSTE: A morfagem agora começa em 0.18 e dura até 0.60
    const t = Math.max(0, Math.min(1, (sp - 0.18) / 0.42));
    const easeT = THREE.MathUtils.smoothstep(t, 0, 1);

    for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
      positions[i] = THREE.MathUtils.lerp(posExplode[i], posGalaxy[i], easeT);
    }
    geo.attributes.position.needsUpdate = true;

    if (materialRef.current) {
      // Opacidade baseada no progresso da transição
      materialRef.current.opacity = Math.sin(t * Math.PI) * 0.8;
      
      // Ajuste do tamanho para nascer pequeno em 0.18 e crescer
      materialRef.current.size = sp < 0.35 
        ? THREE.MathUtils.lerp(0.05, 0.15, (sp - 0.18) / 0.17)
        : 0.20;
    }

    // Rotação constante para dar vida ao conjunto
    pointsRef.current.rotation.y += 0.001 + (easeT * 0.004);
  });

  return (
    <points ref={pointsRef} frustumCulled={false} visible={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[new Float32Array(posExplode), 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial 
        ref={materialRef}
        map={starTexture}
        size={0.1} 
        vertexColors 
        transparent 
        blending={THREE.AdditiveBlending} 
        depthWrite={false}
        sizeAttenuation 
      />
    </points>
  );
}