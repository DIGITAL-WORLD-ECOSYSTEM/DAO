'use client'

import * as THREE from 'three'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'

type GalaxyParams = {
  count: number
  majorCount: number
  gasCount: number
  radius: number
  branches: number
  spin: number
  randomness: number
  randomnessPower: number
}

const PARAMS: GalaxyParams = {
  count: 100000,
  majorCount: 2500,
  gasCount: 45000,
  radius: 8.5,
  branches: 5,
  spin: 1.2,
  randomness: 0.22,
  randomnessPower: 3
}

export function GalacticCore({
  scrollProgress
}: {
  scrollProgress: React.MutableRefObject<number>
}) {

  const groupRef = useRef<THREE.Group>(null!)
  const starsRef = useRef<THREE.Points>(null!)
  const majorRef = useRef<THREE.Points>(null!)
  const gasRef = useRef<THREE.Points>(null!)
  const coreRef = useRef<THREE.Mesh>(null!)
  const glowRef = useRef<THREE.Mesh>(null!)

  /*
  TEXTURA RADIAL OTIMIZADA
  */
  const starTexture = useMemo(() => {

    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64

    const ctx = canvas.getContext('2d')!

    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)

    grad.addColorStop(0, 'rgba(255,255,255,1)')
    grad.addColorStop(0.2, 'rgba(255,255,255,0.8)')
    grad.addColorStop(1, 'rgba(255,255,255,0)')

    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 64, 64)

    const texture = new THREE.CanvasTexture(canvas)

    texture.generateMipmaps = true
    texture.minFilter = THREE.LinearMipMapLinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.needsUpdate = true

    return texture

  }, [])

  /*
  GERAÇÃO DE GEOMETRIA
  */
  const data = useMemo(() => {

    const pos = new Float32Array(PARAMS.count * 3)
    const cols = new Float32Array(PARAMS.count * 3)

    const mPos = new Float32Array(PARAMS.majorCount * 3)
    const mCols = new Float32Array(PARAMS.majorCount * 3)

    const gPos = new Float32Array(PARAMS.gasCount * 3)
    const gCols = new Float32Array(PARAMS.gasCount * 3)

    const colorTemp = new THREE.Color()

    /*
    PALETA
    */
    const cCore = new THREE.Color('#ffffff')
    const cMid = new THREE.Color('#ff00ff')
    const cArm = new THREE.Color('#4400ff')

    const gasPalette = [
      new THREE.Color('#ff00ff').multiplyScalar(0.5),
      new THREE.Color('#4400ff').multiplyScalar(0.5),
      new THREE.Color('#00ffff').multiplyScalar(0.5)
    ]

    /*
    ESTRELAS BASE
    */
    for (let i = 0; i < PARAMS.count; i++) {

      const i3 = i * 3

      const radius = Math.random() * PARAMS.radius

      const spinAngle = radius * PARAMS.spin

      const branchAngle =
        ((i % PARAMS.branches) / PARAMS.branches) * Math.PI * 2

      const isBulge = Math.random() < 0.35

      if (isBulge && radius < 3.0) {

        const r = Math.pow(Math.random(), 0.5) * 1.8

        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)

        pos[i3] = r * Math.sin(phi) * Math.cos(theta)
        pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.5
        pos[i3 + 2] = r * Math.cos(phi)

      } else {

        const mRX =
          Math.pow(Math.random(), PARAMS.randomnessPower) *
          (Math.random() < 0.5 ? 1 : -1) *
          PARAMS.randomness *
          radius

        const mRY =
          Math.pow(Math.random(), PARAMS.randomnessPower) *
          (Math.random() < 0.5 ? 1 : -1) *
          PARAMS.randomness *
          radius *
          0.5

        const mRZ =
          Math.pow(Math.random(), PARAMS.randomnessPower) *
          (Math.random() < 0.5 ? 1 : -1) *
          PARAMS.randomness *
          radius

        pos[i3] =
          Math.cos(branchAngle + spinAngle) * radius + mRX

        pos[i3 + 1] = mRY

        pos[i3 + 2] =
          Math.sin(branchAngle + spinAngle) * radius + mRZ
      }

      const distRatio = radius / PARAMS.radius

      if (distRatio < 0.1) {

        colorTemp.copy(cCore)

      } else if (distRatio < 0.4) {

        colorTemp.copy(cCore).lerp(cMid, (distRatio - 0.1) / 0.3)

      } else {

        colorTemp.copy(cMid).lerp(cArm, (distRatio - 0.4) / 0.6)
      }

      cols[i3] = colorTemp.r
      cols[i3 + 1] = colorTemp.g
      cols[i3 + 2] = colorTemp.b
    }

    /*
    ESTRELAS GRANDES
    */
    for (let i = 0; i < PARAMS.majorCount; i++) {

      const i3 = i * 3

      const r = Math.random() * PARAMS.radius

      const angle =
        r * PARAMS.spin +
        ((i % PARAMS.branches) / PARAMS.branches) * Math.PI * 2

      mPos[i3] = Math.cos(angle) * r + (Math.random() - 0.5) * 0.5
      mPos[i3 + 1] = (Math.random() - 0.5) * 0.6
      mPos[i3 + 2] = Math.sin(angle) * r + (Math.random() - 0.5) * 0.5

      const rand = Math.random()

      if (rand < 0.3) colorTemp.set('#ffffff')
      else if (rand < 0.6) colorTemp.set('#ff00ff')
      else colorTemp.set('#88ccff')

      mCols[i3] = colorTemp.r
      mCols[i3 + 1] = colorTemp.g
      mCols[i3 + 2] = colorTemp.b
    }

    /*
    NEBULAS
    */
    for (let i = 0; i < PARAMS.gasCount; i++) {

      const i3 = i * 3

      const r = Math.random() * PARAMS.radius * 0.85

      const angle =
        r * PARAMS.spin +
        ((i % PARAMS.branches) / PARAMS.branches) * Math.PI * 2

      gPos[i3] =
        Math.cos(angle) * r + (Math.random() - 0.5) * 2.5

      gPos[i3 + 1] =
        (Math.random() - 0.5) * 1.5

      gPos[i3 + 2] =
        Math.sin(angle) * r + (Math.random() - 0.5) * 2.5

      const col =
        gasPalette[Math.floor(Math.random() * gasPalette.length)]

      gCols[i3] = col.r
      gCols[i3 + 1] = col.g
      gCols[i3 + 2] = col.b
    }

    return { pos, cols, mPos, mCols, gPos, gCols }

  }, [])

  /*
  ANIMAÇÃO
  */
  useFrame((state) => {

    const t = state.clock.getElapsedTime()
    const sp = scrollProgress.current

    if (!groupRef.current) return

    groupRef.current.visible = sp > 0.11 && sp < 0.65

    starsRef.current?.rotation &&
      (starsRef.current.rotation.y = t * 0.04)

    gasRef.current?.rotation &&
      (gasRef.current.rotation.y = t * 0.03)

    majorRef.current?.rotation &&
      (majorRef.current.rotation.y = t * 0.035)

    const majorMat =
      majorRef.current?.material as THREE.PointsMaterial

    if (majorMat) {

      majorMat.opacity = 0.6 + Math.sin(t * 2) * 0.3

    }

    const pulse = Math.sin(t * 1.5) * 0.05 + 1

    glowRef.current?.scale.set(pulse, pulse, pulse)

    const s = 0.5 + sp * 1.7

    groupRef.current.scale.set(s, s, s)

  })

  return (
    <group
      ref={groupRef}
      position={[-8, -2, -15]}
      rotation={[0.1, 0, -0.2]}
    >

      <points ref={starsRef}>

        <bufferGeometry>

          <bufferAttribute
            attach="attributes-position"
            args={[data.pos, 3]}
          />

          <bufferAttribute
            attach="attributes-color"
            args={[data.cols, 3]}
          />

        </bufferGeometry>

        <pointsMaterial
          size={0.012}
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

          <bufferAttribute
            attach="attributes-position"
            args={[data.mPos, 3]}
          />

          <bufferAttribute
            attach="attributes-color"
            args={[data.mCols, 3]}
          />

        </bufferGeometry>

        <pointsMaterial
          size={0.04}
          alphaMap={starTexture}
          transparent
          vertexColors
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />

      </points>

      <points ref={gasRef}>

        <bufferGeometry>

          <bufferAttribute
            attach="attributes-position"
            args={[data.gPos, 3]}
          />

          <bufferAttribute
            attach="attributes-color"
            args={[data.gCols, 3]}
          />

        </bufferGeometry>

        <pointsMaterial
          size={0.15}
          alphaMap={starTexture}
          transparent
          vertexColors
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={0.12}
        />

      </points>

      <group>

        <mesh ref={coreRef}>

          <sphereGeometry args={[0.2, 32, 32]} />

          <meshBasicMaterial color="#ffffcc" />

        </mesh>

        <mesh ref={glowRef}>

          <sphereGeometry args={[1.2, 32, 32]} />

          <meshBasicMaterial
            color="#ff6600"
            transparent
            opacity={0.15}
            blending={THREE.AdditiveBlending}
          />

        </mesh>

      </group>

    </group>
  )
}