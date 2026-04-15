'use client';

/* eslint-disable react/no-unknown-property */

import * as THREE from 'three';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

type GalaxyParams = {
  count: number;
  majorCount: number;
  gasCount: number;
  size: number;
  majorSize: number;
  gasSize: number;
  radius: number;
  branches: number;
  spin: number;
  randomness: number;
  randomnessPower: number;
  coreColor: string;
  midColor: string;
  armColor: string;
  edgeColor: string;
  starCenterColor: string;
}

const PARAMS: GalaxyParams = {
  count: 100000,
  majorCount: 2500,
  gasCount: 45000,
  size: 0.015,
  majorSize: 0.06,
  gasSize: 0.18,
  radius: 5.5,
  branches: 5,
  spin: 1.2,
  randomness: 0.22,
  randomnessPower: 3,
  coreColor: '#fff5e6',
  midColor: '#ff9d5c',
  armColor: '#3d6ef5',
  edgeColor: '#1a1a40',
  starCenterColor: '#ffffcc'
};

export function GalacticCore({
  scrollProgress
}: {
  scrollProgress: React.MutableRefObject<number>
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const starsRef = useRef<THREE.Points>(null!);
  const majorRef = useRef<THREE.Points>(null!);
  const gasRef = useRef<THREE.Points>(null!);
  const centralStarRef = useRef<THREE.Mesh>(null!);
  const centralGlowRef = useRef<THREE.Mesh>(null!);
  const outerGlowRef = useRef<THREE.Mesh>(null!);

  const starTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32; canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.Texture();
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);
    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, []);

  const data = useMemo(() => {
    const colorTemp = new THREE.Color();
    const cCore = new THREE.Color(PARAMS.coreColor);
    const cMid = new THREE.Color(PARAMS.midColor);
    const cArm = new THREE.Color(PARAMS.armColor);
    const cEdge = new THREE.Color(PARAMS.edgeColor);

    // BASE STARS
    const pos = new Float32Array(PARAMS.count * 3);
    const initPos = new Float32Array(PARAMS.count * 3);
    const cols = new Float32Array(PARAMS.count * 3);

    for (let i = 0; i < PARAMS.count; i++) {
        const i3 = i * 3;
        const radius = Math.random() * PARAMS.radius;
        const spinAngle = radius * PARAMS.spin;
        const branchAngle = ((i % PARAMS.branches) / PARAMS.branches) * Math.PI * 2;

        const isBulge = Math.random() < 0.2 && radius < 1.5;
        let x, y, z;

        if (isBulge) {
            const r = Math.pow(Math.random(), 0.5) * 1.2;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            x = r * Math.sin(phi) * Math.cos(theta);
            y = r * Math.sin(phi) * Math.sin(theta) * 0.8;
            z = r * Math.cos(phi);
        } else {
            const mixedRandX = Math.pow(Math.random(), PARAMS.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * PARAMS.randomness * radius;
            const mixedRandY = Math.pow(Math.random(), PARAMS.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * PARAMS.randomness * radius * 0.5;
            const mixedRandZ = Math.pow(Math.random(), PARAMS.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * PARAMS.randomness * radius;
            x = Math.cos(branchAngle + spinAngle) * radius + mixedRandX;
            y = mixedRandY;
            z = Math.sin(branchAngle + spinAngle) * radius + mixedRandZ;
        }

        pos[i3] = x; pos[i3+1] = y; pos[i3+2] = z;
        initPos[i3] = (Math.random() - 0.5) * 0.1;
        initPos[i3+1] = (Math.random() - 0.5) * 0.1;
        initPos[i3+2] = (Math.random() - 0.5) * 0.1;

        const distRatio = radius / PARAMS.radius;
        if (distRatio < 0.2) colorTemp.copy(cCore).lerp(cMid, distRatio / 0.2);
        else if (distRatio < 0.6) colorTemp.copy(cMid).lerp(cArm, (distRatio - 0.2) / 0.4);
        else colorTemp.copy(cArm).lerp(cEdge, (distRatio - 0.6) / 0.4);

        cols[i3] = colorTemp.r; cols[i3+1] = colorTemp.g; cols[i3+2] = colorTemp.b;
    }

    // MAJOR STARS
    const mPos = new Float32Array(PARAMS.majorCount * 3);
    const mInitPos = new Float32Array(PARAMS.majorCount * 3);
    const mCols = new Float32Array(PARAMS.majorCount * 3);

    for (let i = 0; i < PARAMS.majorCount; i++) {
        const i3 = i * 3;
        const r = Math.random() * PARAMS.radius;
        const angle = r * PARAMS.spin + ((i % PARAMS.branches) / PARAMS.branches) * Math.PI * 2;
        mPos[i3] = Math.cos(angle) * r + (Math.random() - 0.5) * 0.5;
        mPos[i3+1] = (Math.random() - 0.5) * 0.6;
        mPos[i3+2] = Math.sin(angle) * r + (Math.random() - 0.5) * 0.5;

        mInitPos[i3] = (Math.random() - 0.5) * 0.05;
        mInitPos[i3+1] = (Math.random() - 0.5) * 0.05;
        mInitPos[i3+2] = (Math.random() - 0.5) * 0.05;

        const rand = Math.random();
        if (rand < 0.3) colorTemp.set('#ffffff'); 
        else if (rand < 0.6) colorTemp.set('#88ccff');
        else colorTemp.set('#ffcc88');
        mCols[i3] = colorTemp.r; mCols[i3+1] = colorTemp.g; mCols[i3+2] = colorTemp.b;
    }

    // GAS
    const gPos = new Float32Array(PARAMS.gasCount * 3);
    const gInitPos = new Float32Array(PARAMS.gasCount * 3);
    const gCols = new Float32Array(PARAMS.gasCount * 3);
    const gPalette = [new THREE.Color('#4f1b84'), new THREE.Color('#228b8e'), new THREE.Color('#b82c5a')];

    for (let i = 0; i < PARAMS.gasCount; i++) {
        const i3 = i * 3;
        const r = Math.random() * PARAMS.radius * 0.85;
        const angle = r * PARAMS.spin + ((i % PARAMS.branches) / PARAMS.branches) * Math.PI * 2;
        gPos[i3] = Math.cos(angle) * r + (Math.random() - 0.5) * 1.8;
        gPos[i3+1] = (Math.random() - 0.5) * 1.2;
        gPos[i3+2] = Math.sin(angle) * r + (Math.random() - 0.5) * 1.8;

        gInitPos[i3] = (Math.random() - 0.5) * 0.2;
        gInitPos[i3+1] = (Math.random() - 0.5) * 0.2;
        gInitPos[i3+2] = (Math.random() - 0.5) * 0.2;

        const col = gPalette[Math.floor(Math.random() * 3)].clone().multiplyScalar(0.6);
        gCols[i3] = col.r; gCols[i3+1] = col.g; gCols[i3+2] = col.b;
    }

    return { pos, initPos, cols, mPos, mInitPos, mCols, gPos, gInitPos, gCols };
  }, []);

  const lerpPositions = (initial: Float32Array, final: Float32Array, attr: THREE.BufferAttribute, progress: number) => {
    const posAttr = attr.array as Float32Array;
    for (let i = 0; i < posAttr.length; i += 3) {
      const ease = Math.pow(progress, 0.5);
      const angleOffset = (1 - progress) * 10.0;
      
      const targetX = final[i];
      const targetY = final[i+1];
      const targetZ = final[i+2];
      
      const startX = initial[i];
      const startY = initial[i+1];
      const startZ = initial[i+2];

      const x = THREE.MathUtils.lerp(startX, targetX, ease);
      const y = THREE.MathUtils.lerp(startY, targetY, ease);
      const z = THREE.MathUtils.lerp(startZ, targetZ, ease);

      const s = Math.sin(angleOffset);
      const c = Math.cos(angleOffset);
      
      posAttr[i] = x * c - z * s;
      posAttr[i+1] = y;
      posAttr[i+2] = x * s + z * c;
    }
    attr.needsUpdate = true;
  };

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const sp = scrollProgress.current;

    if (!groupRef.current) return;

    // Cross-fade out suavemente próximo ao Buraco Negro (sp=0.60 to 0.65)
    const fadeOut = THREE.MathUtils.clamp(1.0 - (sp - 0.60) / 0.05, 0.0, 1.0);
    groupRef.current.visible = fadeOut > 0.0 && sp > 0.005;

    if (!groupRef.current.visible) return;

    // Para igualar a transição exata do scroll do HTML:
    const explosionProgress = Math.min(1.0, sp * 1.5); 

    if (starsRef.current) lerpPositions(data.initPos, data.pos, starsRef.current.geometry.attributes.position as THREE.BufferAttribute, explosionProgress);
    if (majorRef.current) lerpPositions(data.mInitPos, data.mPos, majorRef.current.geometry.attributes.position as THREE.BufferAttribute, explosionProgress);
    if (gasRef.current) lerpPositions(data.gInitPos, data.gPos, gasRef.current.geometry.attributes.position as THREE.BufferAttribute, explosionProgress);

    // Rotação exata do código fornecido
    const rotationSpeed = 0.0006 * explosionProgress;

    if (starsRef.current) starsRef.current.rotation.y += rotationSpeed * 10; 
    if (gasRef.current) gasRef.current.rotation.y += rotationSpeed * 8;
    
    if (majorRef.current) {
        majorRef.current.rotation.y += rotationSpeed * 9;
        const mat = majorRef.current.material as THREE.PointsMaterial;
        mat.opacity = (0.7 + Math.sin(time * 2) * 0.3) * fadeOut;
    }

    if (centralStarRef.current && centralGlowRef.current && outerGlowRef.current) {
        centralStarRef.current.rotation.y += 0.01;
        const pulse = (Math.sin(time * 1.5) * 0.1 + 1) * explosionProgress;
        centralGlowRef.current.scale.set(pulse, pulse, pulse);
        outerGlowRef.current.scale.set(explosionProgress, explosionProgress, explosionProgress);
        centralStarRef.current.scale.set(explosionProgress, explosionProgress, explosionProgress);
    }
  });

  return (
    <group
      ref={groupRef}
      // O HTML do usuário posiciona a câmera em (6, 5, 8). Nossa câmera está em (0, 0.15, 5.4).
      // Para o disco da galáxia deitar e rotacionar como se visto de cima sem mudar a câmera, rotacionamos o grupo.
      position={[-0.5, -0.2, -1.0]} 
      rotation={[0.5, -0.4, 0]}
      scale={[0.7, 0.7, 0.7]}
    >
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[new Float32Array(data.initPos), 3]} />
          <bufferAttribute attach="attributes-color" args={[data.cols, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={PARAMS.size}
          alphaMap={starTexture}
          transparent
          vertexColors
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={0.8}
        />
      </points>

      <points ref={majorRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[new Float32Array(data.mInitPos), 3]} />
          <bufferAttribute attach="attributes-color" args={[data.mCols, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={PARAMS.majorSize}
          alphaMap={starTexture}
          transparent
          vertexColors
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <points ref={gasRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[new Float32Array(data.gInitPos), 3]} />
          <bufferAttribute attach="attributes-color" args={[data.gCols, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={PARAMS.gasSize}
          alphaMap={starTexture}
          transparent
          vertexColors
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={0.12}
        />
      </points>

      <group>
        <mesh ref={centralStarRef}>
            <sphereGeometry args={[0.18, 32, 32]} />
            <meshBasicMaterial color={PARAMS.starCenterColor} depthWrite={false} />
        </mesh>
        <mesh ref={centralGlowRef}>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshBasicMaterial
                color="#ffaa44"
                transparent
                opacity={0.4}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </mesh>
        <mesh ref={outerGlowRef}>
            <sphereGeometry args={[1.2, 32, 32]} />
            <meshBasicMaterial
                color="#ff6600"
                transparent
                opacity={0.1}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </mesh>
      </group>
    </group>
  );
}