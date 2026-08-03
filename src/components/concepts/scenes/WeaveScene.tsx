import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useScroll, useScrollCamera, easeInOut, clamp01, lerp } from '../scrollCamera'
import { DriftParticles, AMBER } from '../sceneKit'

// ─────────────────────────────────────────────────────────────
// Thread / Weave — living organic growth, three registers:
//   roots  — earthy underground, thick branching strands
//   vines  — green, twisting, climbing
//   moss   — teal forest-floor, many fine fuzzy tendrils + spores
// Camera flies ALONG one amber hero strand; gray/green strands ply
// inward toward it as you scroll (scattered → woven). Amber only.
// ─────────────────────────────────────────────────────────────

export type WeaveVariant = 'roots' | 'vines' | 'moss'

const rand = (n: number) => { const s = Math.sin(n * 127.1) * 43758.5453; return s - Math.floor(s) }

const V: Record<WeaveVariant, {
  bg: string; strand: string; strand2: string; particle: string; shaft: string; substrate: string
  count: number; radius: number; tube: number; twist: number; branches: boolean
}> = {
  roots: { bg: '#140f0a', strand: '#4a3a2a', strand2: '#5a4632', particle: '#caa878', shaft: '#ffe2b0', substrate: '#1c1208', count: 42, radius: 7, tube: 0.12, twist: 1.1, branches: true },
  vines: { bg: '#0b140d', strand: '#3f5a37', strand2: '#4d6b40', particle: '#bcd9a0', shaft: '#e8f3c0', substrate: '#0e1c0f', count: 40, radius: 7, tube: 0.10, twist: 1.9, branches: false },
  moss:  { bg: '#0c1411', strand: '#3a5246', strand2: '#46624f', particle: '#d6ead0', shaft: '#d8f0e6', substrate: '#0f1c18', count: 66, radius: 6, tube: 0.06, twist: 0.8, branches: false },
}

function fiberCurve(seed: number, amp: number, offX: number, offY: number) {
  const pts: THREE.Vector3[] = []
  const N = 12
  for (let i = 0; i <= N; i++) {
    const t = i / N
    pts.push(new THREE.Vector3(
      offX + Math.sin(t * 6 + seed) * amp,
      offY + Math.cos(t * 5 + seed * 1.7) * amp,
      lerp(72, -72, t),
    ))
  }
  return new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5)
}

export function WeaveScene({ variant = 'roots' }: { variant?: WeaveVariant }) {
  const { progress } = useScroll()
  const cfg = V[variant]

  const hero = useMemo(() => fiberCurve(0, 1.1, 0, 0), [])
  const heroGeo = useMemo(() => new THREE.TubeGeometry(hero, 240, 0.17, 10, false), [hero])
  const heroHaloGeo = useMemo(() => new THREE.TubeGeometry(hero, 240, 0.45, 10, false), [hero])
  const heroRef = useRef<THREE.Mesh>(null)
  const heroHaloRef = useRef<THREE.Mesh>(null)

  // Volumetric light shafts angled through the fiber field (2-layer additive).
  const shafts = useMemo(() =>
    Array.from({ length: 5 }, (_, i) => ({
      x: (rand(i * 3.1) - 0.5) * 16,
      y: 6 + rand(i * 2) * 6,
      z: lerp(40, -40, i / 4),
      tiltX: 0.2 + rand(i) * 0.3,
      tiltZ: (rand(i * 4) - 0.5) * 0.3,
      innerR: 0.8 + rand(i) * 1.0,
      outerR: 3 + rand(i * 1.5) * 3,
    })), [])

  const strands = useMemo(() => {
    return Array.from({ length: cfg.count }, (_, i) => {
      const ang = (i / cfg.count) * Math.PI * 2
      const rad = cfg.radius * (0.5 + (i % 5) * 0.18)
      const seed = i * 1.37
      const offX = Math.cos(ang) * rad
      const offY = Math.sin(ang) * rad
      const curve = fiberCurve(seed, (1.2 + (i % 3) * 0.5) * cfg.twist, offX, offY)
      const geo = new THREE.TubeGeometry(curve, 150, cfg.tube + (i % 3) * 0.015, 7, false)
      return { geo, dark: i % 2 === 0 }
    })
  }, [cfg])

  // Branch stubs off the hero (roots only)
  const branchGeos = useMemo(() => {
    if (!cfg.branches) return []
    return [0.25, 0.45, 0.62, 0.78].map((rt, i) => {
      const p = hero.getPointAt(rt)
      const dir = new THREE.Vector3(Math.cos(i * 2) * 4, Math.sin(i * 1.5) * 3, -2)
      const c = new THREE.CatmullRomCurve3([
        p.clone(),
        p.clone().add(dir.clone().multiplyScalar(0.5)),
        p.clone().add(dir),
      ])
      return new THREE.TubeGeometry(c, 40, 0.09, 6, false)
    })
  }, [cfg, hero])

  const strandRefs = useRef<(THREE.Group | null)[]>([])

  const { camCurve, lookCurve } = useMemo(() => {
    const camPts: THREE.Vector3[] = []
    const lookPts: THREE.Vector3[] = []
    const N = 56
    for (let i = 0; i <= N; i++) {
      const t = i / N
      const rt = Math.min(0.95, t * 0.95)
      const p = hero.getPointAt(rt)
      const tan = hero.getTangentAt(rt)
      const back = t > 0.85 ? lerp(3.5, 24, (t - 0.85) / 0.15) : 3.5
      const cam = p.clone().addScaledVector(tan, back)
      cam.x += Math.sin(t * 5) * 1.2
      cam.y += 1.0 + Math.sin(t * 4) * 0.8
      camPts.push(cam)
      lookPts.push(hero.getPointAt(Math.min(1, rt + 0.05)))
    }
    return {
      camCurve: new THREE.CatmullRomCurve3(camPts, false, 'catmullrom', 0.5),
      lookCurve: new THREE.CatmullRomCurve3(lookPts, false, 'catmullrom', 0.5),
    }
  }, [hero])

  useScrollCamera({ curve: camCurve, lookCurve, lookAhead: 0.03, parallax: 0.6, smoothing: 0.1, bank: 0.5 })

  useFrame(() => {
    const eP = easeInOut(clamp01(progress.current))
    const draw = clamp01(eP * 1.2)
    if (heroRef.current?.geometry.index) heroRef.current.geometry.setDrawRange(0, Math.floor(heroRef.current.geometry.index.count * draw))
    if (heroHaloRef.current?.geometry.index) heroHaloRef.current.geometry.setDrawRange(0, Math.floor(heroHaloRef.current.geometry.index.count * draw))
    const gather = easeInOut(clamp01((eP - 0.15) / 0.7))
    strandRefs.current.forEach((g) => {
      if (!g) return
      const s = lerp(1, 0.08, gather)
      g.scale.set(s, s, 1)
    })
  })

  return (
    <group>
      <color attach="background" args={[cfg.bg]} />
      <fog attach="fog" args={[cfg.bg, 26, 150]} />
      <ambientLight intensity={0.85} />
      <directionalLight position={[10, 14, 20]} intensity={1.1} color="#e8eede" />
      <directionalLight position={[-12, -6, -10]} intensity={0.5} color="#9fb0c0" />
      <pointLight position={[0, 0, 0]} intensity={1.6} color={AMBER} distance={46} />

      {/* Graded substrate plane far behind (kills pure-void read) */}
      <mesh position={[0, 0, -60]} rotation={[0, 0, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color={cfg.substrate} roughness={1} side={THREE.DoubleSide} />
      </mesh>

      {/* Hero amber strand — wide translucent halo + bright core */}
      <mesh ref={heroHaloRef} geometry={heroHaloGeo}>
        <meshStandardMaterial color={AMBER} emissive={AMBER} emissiveIntensity={0.5} roughness={0.2} transparent opacity={0.3} toneMapped={false} depthWrite={false} />
      </mesh>
      <mesh ref={heroRef} geometry={heroGeo}>
        <meshStandardMaterial color={AMBER} emissive={AMBER} emissiveIntensity={2.6} roughness={0.5} toneMapped={false} />
      </mesh>

      {/* Volumetric light shafts through the fibers */}
      {shafts.map((s, i) => (
        <group key={`sh${i}`} position={[s.x, s.y, s.z]} rotation={[Math.PI + s.tiltX, 0, s.tiltZ]}>
          <mesh>
            <coneGeometry args={[s.innerR, 40, 8, 1, true]} />
            <meshBasicMaterial color={cfg.shaft} transparent opacity={0.1} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
          </mesh>
          <mesh>
            <coneGeometry args={[s.outerR, 40, 8, 1, true]} />
            <meshBasicMaterial color={cfg.shaft} transparent opacity={0.03} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
          </mesh>
        </group>
      ))}
      {branchGeos.map((g, i) => (
        <mesh key={i} geometry={g}>
          <meshStandardMaterial color={AMBER} emissive={AMBER} emissiveIntensity={1.6} roughness={0.6} toneMapped={false} />
        </mesh>
      ))}

      {/* Organic strands plying inward */}
      {strands.map((s, i) => (
        <group key={i} ref={(el) => { strandRefs.current[i] = el }}>
          <mesh geometry={s.geo}>
            <meshStandardMaterial color={s.dark ? cfg.strand : cfg.strand2} roughness={0.9} metalness={0.05} />
          </mesh>
        </group>
      ))}

      <DriftParticles count={variant === 'moss' ? 340 : 240} spread={70} size={variant === 'moss' ? 0.5 : 0.45} color={cfg.particle} opacity={0.5} />
    </group>
  )
}
