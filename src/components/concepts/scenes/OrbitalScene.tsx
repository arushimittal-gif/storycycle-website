import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useScroll, useScrollCamera, easeInOut, clamp01, lerp } from '../scrollCamera'
import { DriftParticles, CloudPuffs, useSoftTexture, AMBER, GRAY } from '../sceneKit'

// ─────────────────────────────────────────────────────────────
// Orbital — brand-pure cosmos. Scattered gray fragments adrift in
// a charcoal void fall into ORBIT around a forming amber story-core
// as you scroll (noise → signal). Foreground debris + nebula wisps
// give parallax depth. Ends with a scale-jump pull-back revealing
// the constellation as one node in a wider network.
// ─────────────────────────────────────────────────────────────

const SHARDS = 60
const NODES = 7  // distant network nodes revealed on the scale-jump
const RING = 90  // fine particles in an accretion ring around the core

type Shard = {
  scatter: THREE.Vector3
  radius: number; axis: THREE.Vector3; phase: number; speed: number; spin: THREE.Euler
}

export function OrbitalScene() {
  const { progress } = useScroll()
  const ringTex = useSoftTexture()

  const shards = useMemo<Shard[]>(() => {
    return Array.from({ length: SHARDS }, () => {
      const dir = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize()
      return {
        scatter: dir.clone().multiplyScalar(18 + Math.random() * 26),
        radius: 5 + Math.random() * 12,
        axis: new THREE.Vector3(Math.random() - 0.5, 1, Math.random() - 0.5).normalize(),
        phase: Math.random() * Math.PI * 2,
        speed: 0.2 + Math.random() * 0.5,
        spin: new THREE.Euler(Math.random() * 3, Math.random() * 3, 0),
      }
    })
  }, [])
  const shardRefs = useRef<(THREE.Mesh | null)[]>([])
  const coreRef = useRef<THREE.Mesh>(null)
  const coreHaloRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Points>(null)
  const nodesRef = useRef<THREE.Group>(null)

  // Fine accretion-ring particles orbiting the core in a thin disc.
  const ringGeo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const pos = new Float32Array(RING * 3)
    for (let i = 0; i < RING; i++) {
      const a = Math.random() * Math.PI * 2
      const r = 4 + Math.random() * 8
      pos[i * 3] = Math.cos(a) * r
      pos[i * 3 + 1] = (Math.random() - 0.5) * 1.2
      pos[i * 3 + 2] = Math.sin(a) * r
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return g
  }, [])

  // Camera: approach the forming core through the debris, then scale-jump back.
  const camCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 2, 56),
      new THREE.Vector3(8, -3, 34),
      new THREE.Vector3(-6, 4, 20),
      new THREE.Vector3(3, 1, 12),
      new THREE.Vector3(-2, 0, 16),
      new THREE.Vector3(0, 6, 60),
      new THREE.Vector3(0, 10, 120),  // scale-jump: pull way back
    ], false, 'catmullrom', 0.5)
  }, [])
  const lookCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 20), new THREE.Vector3(0, 0, 10), new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0),
    ], false, 'catmullrom', 0.5)
  }, [])

  useScrollCamera({ curve: camCurve, lookCurve, lookAhead: 0.02, parallax: 0.9, smoothing: 0.09, bank: 0.4 })

  const nodeData = useMemo(() =>
    Array.from({ length: NODES }, (_, i) => {
      const a = (i / NODES) * Math.PI * 2
      const r = 38 + (i % 3) * 10
      return new THREE.Vector3(Math.cos(a) * r, (Math.random() - 0.5) * 20, Math.sin(a) * r - 20)
    }), [])

  useFrame((state) => {
    const eP = easeInOut(clamp01(progress.current))
    const t = state.clock.elapsedTime
    const gather = easeInOut(clamp01((eP - 0.08) / 0.6))   // scatter → orbit

    shardRefs.current.forEach((m, i) => {
      if (!m) return
      const s = shards[i]
      // orbit position
      const ang = s.phase + t * s.speed
      const base = new THREE.Vector3(Math.cos(ang) * s.radius, 0, Math.sin(ang) * s.radius)
      base.applyAxisAngle(s.axis, s.radius * 0.05)
      m.position.lerpVectors(s.scatter, base, gather)
      m.rotation.x = s.spin.x + t * 0.2
      m.rotation.y = s.spin.y + t * 0.15
    })

    if (coreRef.current) {
      coreRef.current.scale.setScalar(lerp(0.15, 2.4, eP))
      const mat = coreRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = lerp(0.2, 3.2, eP)
    }
    if (coreHaloRef.current) {
      coreHaloRef.current.scale.setScalar(lerp(0.2, 3.8, eP))
      const mat = coreHaloRef.current.material as THREE.MeshStandardMaterial
      mat.opacity = lerp(0, 0.22, gather)
    }
    if (ringRef.current) {
      ringRef.current.rotation.y = t * 0.4
      ringRef.current.rotation.x = 0.4
      const mat = ringRef.current.material as THREE.PointsMaterial
      mat.opacity = gather * 0.7
    }
    // Network nodes fade in only at the scale-jump.
    if (nodesRef.current) {
      const show = clamp01((eP - 0.82) / 0.18)
      nodesRef.current.children.forEach((c) => {
        const mat = (c as THREE.Mesh).material as THREE.MeshStandardMaterial
        mat.emissiveIntensity = show * 3
        mat.opacity = show
      })
    }
  })

  return (
    <group>
      <color attach="background" args={['#0a0c0e']} />
      <fog attach="fog" args={['#0a0c0e', 50, 220]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 0]} intensity={2} color={AMBER} distance={60} />

      {/* Amber story-core — translucent halo shell + solid body */}
      <mesh ref={coreHaloRef}>
        <icosahedronGeometry args={[2.4, 1]} />
        <meshStandardMaterial color={AMBER} emissive={AMBER} emissiveIntensity={1.4} roughness={0.3} transparent opacity={0} toneMapped={false} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[2.4, 1]} />
        <meshStandardMaterial color={AMBER} emissive={AMBER} emissiveIntensity={0.2} roughness={0.4} toneMapped={false} />
      </mesh>

      {/* Accretion ring of fine particles around the core */}
      <points ref={ringRef} geometry={ringGeo}>
        <pointsMaterial map={ringTex} color={AMBER} size={0.45} sizeAttenuation transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>

      {/* Gray fragments → orbit */}
      {shards.map((_, i) => (
        <mesh key={i} ref={(el) => { shardRefs.current[i] = el }}>
          <tetrahedronGeometry args={[0.6 + (i % 4) * 0.18, 0]} />
          <meshStandardMaterial color={GRAY} roughness={0.7} metalness={0.2} flatShading />
        </mesh>
      ))}

      {/* Distant network nodes (scale-jump reveal) */}
      <group ref={nodesRef}>
        {nodeData.map((p, i) => (
          <mesh key={i} position={p}>
            <icosahedronGeometry args={[1.1, 0]} />
            <meshStandardMaterial color={AMBER} emissive={AMBER} emissiveIntensity={0} transparent opacity={0} toneMapped={false} />
          </mesh>
        ))}
      </group>

      <CloudPuffs positions={[[14, 8, 24], [-16, -6, 14], [6, 12, -8], [-10, 4, 30], [20, -10, -20], [-8, 14, 6]]} scale={22} color="#7d8aa0" opacity={0.11} />
      <DriftParticles count={500} spread={150} size={0.5} color="#aab2bd" opacity={0.55} />
      <DriftParticles count={320} spread={90} size={0.22} color="#cfd6e0" opacity={0.4} />
    </group>
  )
}
