'use client';

import * as THREE from 'three';
import { memo, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

// ----------------------------------------------------------------------

type HectohedronProps = {
  scrollProgress: React.MutableRefObject<number>;
};

export const Hectohedron = memo(({ scrollProgress }: HectohedronProps) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null!);
  const linesRef = useRef<THREE.LineSegments>(null!);

  // Criar geometria base
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(4.2, 1), []);

  // Extrair arestas para criar conexões
  const edgesGeometry = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const sp = scrollProgress.current;

    if (!meshRef.current || !linesRef.current) return;

    // ----------------------------------------------------
    // FASE FINAL DA LANDING
    // ----------------------------------------------------
    if (sp > 0.88) {
      meshRef.current.visible = true;
      linesRef.current.visible = true;

      const omegaFactor = (sp - 0.88) / 0.12;

      // Rotação
      meshRef.current.rotation.y = t * 0.15;
      meshRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;

      linesRef.current.rotation.copy(meshRef.current.rotation);

      // Escala
      const targetScale = (1.2 * omegaFactor) + Math.sin(t * 0.5) * 0.02;
      meshRef.current.scale.setScalar(targetScale);
      linesRef.current.scale.copy(meshRef.current.scale);

      // Material do cristal
      if (materialRef.current) {
        materialRef.current.opacity = THREE.MathUtils.lerp(0, 0.45, omegaFactor);
        materialRef.current.thickness = THREE.MathUtils.lerp(0.5, 1.5, omegaFactor);
      }

      // ------------------------------------------------
      // ANIMAÇÃO DAS CONEXÕES (efeito rede Web3)
      // ------------------------------------------------

      const lineMaterial = linesRef.current.material as THREE.LineBasicMaterial;

      // pulsação energética
      const pulse = (Math.sin(t * 3) + 1) * 0.5;

      lineMaterial.opacity = 0.2 + pulse * 0.6;

    } else {
      meshRef.current.visible = false;
      linesRef.current.visible = false;
    }
  });

  return (
    <group>

      {/* CRISTAL CENTRAL */}
      <mesh
        ref={meshRef}
        visible={false}
        castShadow
        receiveShadow
        geometry={geometry}
      >
        <meshPhysicalMaterial
          ref={materialRef}
          color="#ffffff"
          metalness={0.1}
          roughness={0.02}
          transmission={0.96}
          ior={1.45}
          transparent
          opacity={0}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* CONEXÕES WEB3 */}
      <lineSegments
        ref={linesRef}
        geometry={edgesGeometry}
        visible={false}
      >
        <lineBasicMaterial
          color="#6fa8ff"
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

    </group>
  );
});

Hectohedron.displayName = 'Hectohedron';