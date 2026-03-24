'use client';

import * as THREE from 'three';
import { useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useScroll, useTransform } from 'framer-motion';

type SceneControllerProps = {
  scrollProgress: React.MutableRefObject<number>;
};

export function SceneController({ scrollProgress }: SceneControllerProps) {
  const { camera } = useThree();

  // 1. Hook nativo do Framer Motion para detectar o scroll da página
  const { scrollYProgress } = useScroll();

  // 2. Transforma o progresso do scroll (0 a 1) na posição Z desejada da câmera
  // Substitui o MathUtils.lerp do Three/GSAP de forma declarativa
  const cameraZ = useTransform(scrollYProgress, [0, 1], [5.4, 1.6]);

  // Configuração inicial da câmera
  useEffect(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;

    camera.fov = 42;
    camera.position.set(0, 0.15, 5.4);
    camera.lookAt(-1.5, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera]);

  // 3. useFrame executa a cada frame do Three.js (60fps)
  // É mais performático que o 'onUpdate' do GSAP pois roda dentro da loop de renderização do WebGL
  useFrame(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;

    // Atualiza a referência de progresso para outros componentes usarem
    scrollProgress.current = scrollYProgress.get();

    // Aplica a nova posição Z com base no scroll
    // O Framer Motion já cuida da suavização através do hook
    camera.position.z = cameraZ.get();
  });

  return null;
}