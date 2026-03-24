'use client';

/* eslint-disable react/no-unknown-property */
import type * as THREE from 'three';

import { memo, useRef, useMemo } from 'react';
import { Stars, Float } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';

// ----------------------------------------------------------------------

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float iTime;
  varying vec2 vUv;
  void main() {
    vec2 f = vUv * 2.0 - 1.0;
    float o = 0.0;
    for(float i=1.0; i<10.0; i++) {
      f += cos(f.yx * i + iTime) / i + 0.7;
      o += length(f);
    }
    vec3 col = 0.5 + 0.5 * cos(iTime + f.xyx + vec3(0,2,4));
    gl_FragColor = vec4(col * (1.0/o), 1.0);
  }
`;

// ----------------------------------------------------------------------

function GalacticCube() {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  const uniforms = useMemo(() => ({
    iTime: { value: 0 },
  }), []);

  useFrame((state) => {
    uniforms.iTime.value = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.x += 0.003;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={meshRef}>
        <boxGeometry args={[3, 3, 3]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
        />
      </mesh>
    </Float>
  );
}

// ----------------------------------------------------------------------

export const AuthBackgroundAnimation = memo(() => (
    <div style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 0, background: '#030712' }}>
      <Canvas camera={{ position: [0, 0, 8] }}>
        <color attach="background" args={['#030712']} />
        <ambientLight intensity={0.5} />
        
        <GalacticCube />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      </Canvas>
      
      {/* Vinheta para focar no Login ASPPIBRA */}
      <div style={{
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%',
        background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.8) 100%)',
        pointerEvents: 'none'
      }} />
    </div>
  ));

AuthBackgroundAnimation.displayName = 'AuthBackgroundAnimation';