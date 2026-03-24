'use client';

/* eslint-disable react/no-unknown-property */
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { memo, useRef, useMemo } from 'react';

// ----------------------------------------------------------------------

interface FlowerOfLifeProps {
  scrollProgress: React.MutableRefObject<number>;
  sharedSphereGeo: THREE.BufferGeometry;
  sharedGlassGeo: THREE.BufferGeometry;
  glassMat: THREE.Material;
}

/* =========================
   Shaders: Gênese Visual
   Implementa a pulsação original dos 7 núcleos sagrados
========================= */

const vertexShader = `
varying vec3 vPos;
void main() {
  vPos = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * viewMatrix * vec4(vPos, 1.0);
}
`;

const fragmentShader = `
precision highp float;
#define NUCLEI 7

uniform float iTime;
uniform vec3 nucleusPos[NUCLEI];
uniform vec3 nucleusColor[NUCLEI];

varying vec3 vPos;

void main(){
  vec3 col = vec3(0.0);
  for(int i = 0; i < NUCLEI; i++){
    float d = distance(vPos, nucleusPos[i]);
    col += nucleusColor[i] * exp(-d * 3.2) * abs(sin(d * 6.0 - iTime * 1.5));
  }
  float alpha = smoothstep(0.05, 0.5, length(col));
  gl_FragColor = vec4(col, alpha);
}
`;

/* =========================
   Componente: Alfa (Início)
========================= */

export const FlowerOfLife = memo(
  ({ scrollProgress, sharedSphereGeo, sharedGlassGeo, glassMat }: FlowerOfLifeProps) => {
    const flowerRef = useRef<THREE.Group>(null!);
    const r = 0.9;

    const nucleusPositions = useMemo<THREE.Vector3[]>(() => {
      const p: THREE.Vector3[] = [new THREE.Vector3(0, 0, 0)];
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        p.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0));
      }
      return p;
    }, [r]);

    const intermediatePositions = useMemo<THREE.Vector3[]>(() => {
      const p: THREE.Vector3[] = [];
      for (let i = 0; i < 6; i++) {
        const a1 = (i / 6) * Math.PI * 2;
        const a2 = ((i + 1) / 6) * Math.PI * 2;
        const mid = new THREE.Vector3(
          Math.cos(a1) * r + Math.cos(a2) * r,
          Math.sin(a1) * r + Math.sin(a2) * r,
          0
        ).multiplyScalar(0.5);
        p.push(mid);
      }
      return p;
    }, [r]);

    const covenantColors = useMemo<THREE.Vector3[]>(() => [
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(1, 0.55, 0),
      new THREE.Vector3(1, 1, 0),
      new THREE.Vector3(0, 0.7, 0.1),
      new THREE.Vector3(0, 0.2, 1),
      new THREE.Vector3(0.4, 0, 0.9),
      new THREE.Vector3(1, 0.3, 1)
    ], []);

    const uniformsRef = useRef({
      iTime: { value: 0 },
      scrollProgress: { value: 0 },
      nucleusPos: { value: nucleusPositions },
      nucleusColor: { value: covenantColors }
    });

    useFrame((state) => {
      const t = state.clock.getElapsedTime();
      const sp = scrollProgress.current;
      const u = uniformsRef.current;

      u.iTime.value = t;
      u.scrollProgress.value = sp;

      if (flowerRef.current) {
        // LÓGICA DE FASE: ALFA (0.00 a 0.33)
        if (sp <= 0.12) {
          flowerRef.current.visible = true;

          // GIRO DO COLAPSO: Aceleração angular conforme o scroll avança para a Fase 2
          // O multiplicador (sp * 8.0) cria o efeito de "vórtice" antes da explosão
          flowerRef.current.rotation.z = t * (0.12 + sp * 8.0);
          flowerRef.current.rotation.y = Math.cos(t * 0.3) * 0.15;

          // CRESCIMENTO E COMPRESSÃO: 
          // Cresce até o Ecosystem e começa a "vibrar" para a Supernova
          const growth = THREE.MathUtils.lerp(1.1, 1.8, sp / 0.12);
          flowerRef.current.scale.setScalar(growth);

        } else {
          // Desativa renderização após a explosão (Integrations)
          flowerRef.current.visible = false;
        }
      }
    });

    return (
      <group ref={flowerRef}>
        {nucleusPositions.map((pos, i) => (
          <mesh key={`core-${i}`} position={pos} geometry={sharedSphereGeo}>
            <shaderMaterial
              transparent
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              uniforms={uniformsRef.current}
              vertexShader={vertexShader}
              fragmentShader={fragmentShader}
            />
          </mesh>
        ))}

        {intermediatePositions.map((pos, i) => (
          <mesh
            key={`glass-${i}`}
            position={pos}
            material={glassMat}
            geometry={sharedGlassGeo}
          />
        ))}
      </group>
    );
  }
);

FlowerOfLife.displayName = 'FlowerOfLife';