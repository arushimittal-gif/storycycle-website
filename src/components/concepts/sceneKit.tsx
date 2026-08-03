import { useMemo, useRef } from 'react'
import type { MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ─────────────────────────────────────────────────────────────
// Shared "stylized rich" texture/atmosphere kit for all 3 scenes.
// Designed, not photoreal: soft particles, cloud puffs you fly
// through, and helpers for graded surfaces. Keeps the brand grade
// (cool gray noise + amber signal over charcoal void).
// ─────────────────────────────────────────────────────────────

export const AMBER = '#FBB03B'
export const GRAY = '#53565A'
export const CHARCOAL = '#0a0c0e'

// A soft radial-alpha sprite texture (white core → transparent edge).
// Generated once on the client; reused for particles + cloud puffs.
export function useSoftTexture(): THREE.Texture {
  return useMemo(() => {
    const s = 128
    const c = document.createElement('canvas')
    c.width = c.height = s
    const ctx = c.getContext('2d')!
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
    g.addColorStop(0, 'rgba(255,255,255,1)')
    g.addColorStop(0.35, 'rgba(255,255,255,0.55)')
    g.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, s, s)
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])
}

// Drifting dust/motes — parallax + DoF bokeh fodder. Slowly wander.
// Pass `windRef` to make the motes stream WITH the shared wind signal
// instead of just bobbing (the Pacific film couples dust to one cause).
export function DriftParticles({
  count = 220, spread = 120, size = 0.7, color = GRAY, opacity = 0.5, windRef,
}: {
  count?: number; spread?: number; size?: number; color?: string; opacity?: number
  windRef?: MutableRefObject<{ x: number; z: number }>
}) {
  const tex = useSoftTexture()
  const ref = useRef<THREE.Points>(null)
  const half = spread / 2

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * spread
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.6
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return g
  }, [count, spread])

  useFrame((_, dt) => {
    if (!ref.current) return
    const p = ref.current.geometry.attributes.position as THREE.BufferAttribute
    if (windRef?.current) {
      // Stream along the shared wind; wrap within the spread box so the
      // field never depletes. Gentle Y-bob retained for life.
      const wx = windRef.current.x * dt * 2.2
      const wz = windRef.current.z * dt * 2.2
      for (let i = 0; i < p.count; i++) {
        let x = p.getX(i) + wx
        let z = p.getZ(i) + wz
        if (x > half) x -= spread; else if (x < -half) x += spread
        if (z > half) z -= spread; else if (z < -half) z += spread
        p.setX(i, x)
        p.setZ(i, z)
        p.setY(i, p.getY(i) + Math.sin(i + performance.now() * 0.0002) * 0.004)
      }
    } else {
      ref.current.rotation.y += dt * 0.012
      for (let i = 0; i < p.count; i++) {
        p.setY(i, p.getY(i) + Math.sin(i + performance.now() * 0.0002) * 0.004)
      }
    }
    p.needsUpdate = true
  })

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        map={tex} color={color} size={size} sizeAttenuation transparent
        opacity={opacity} depthWrite={false} blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// Soft cloud puffs you fly through. Each is a billboarded soft sprite;
// they double as transition cover (fly into cloud → scene swap).
export function CloudPuffs({
  positions, scale = 26, color = '#cfd6dd', opacity = 0.16,
}: { positions: [number, number, number][]; scale?: number; color?: string; opacity?: number }) {
  const tex = useSoftTexture()
  return (
    <group>
      {positions.map((p, i) => (
        <sprite key={i} position={p} scale={[scale * (0.7 + (i % 3) * 0.3), scale * 0.7, 1]}>
          <spriteMaterial
            map={tex} color={color} transparent opacity={opacity}
            depthWrite={false} blending={THREE.AdditiveBlending}
          />
        </sprite>
      ))}
    </group>
  )
}

// Vertex-color a geometry by height: cool-gray in valleys → darker
// charcoal on peaks, for the "graded surface" read (no flat wireframe).
export function gradeByHeight(geo: THREE.BufferGeometry, lo: number, hi: number) {
  const pos = geo.attributes.position as THREE.BufferAttribute
  const colors = new Float32Array(pos.count * 3)
  const cLow = new THREE.Color('#3a4046')
  const cHigh = new THREE.Color('#13161a')
  const tmp = new THREE.Color()
  for (let i = 0; i < pos.count; i++) {
    const t = THREE.MathUtils.clamp((pos.getY(i) - lo) / (hi - lo), 0, 1)
    tmp.copy(cLow).lerp(cHigh, t)
    colors[i * 3] = tmp.r; colors[i * 3 + 1] = tmp.g; colors[i * 3 + 2] = tmp.b
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
}
