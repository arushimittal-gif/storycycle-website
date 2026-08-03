import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useScroll, useScrollCamera, easeInOut, clamp01, lerp } from '../scrollCamera'
import { DriftParticles, CloudPuffs, useSoftTexture } from '../sceneKit'
import { windAt } from '../wind'

// ─────────────────────────────────────────────────────────────
// Pacific Northwest — one cinematic macro→vista film.
// Open tiny among roots/moss/ferns of a temperate rainforest; a
// glowing stream (the through-line, as WATER not a drawn line)
// winds through, igniting life as it passes. God-ray sun shafts
// break through the canopy. Camera flies banshee-POV low through
// the forest, then lifts over the treeline to a mountain valley
// where all the connections glow at once. Macro → grand reveal.
// ─────────────────────────────────────────────────────────────

const WATER = '#ffcf8a'
const MOSS_LO = '#3f5a36'
const MOSS_HI = '#1c2a18'
const BARK = '#2c2118'
const BARK_LIGHT = '#3d3026'
const MOSS_RING = '#2e4a22'

const BG_FOREST = new THREE.Color('#10160f')
const BG_VISTA  = new THREE.Color('#1e3426')

const rand = (n: number) => { const s = Math.sin(n * 127.1) * 43758.5453; return s - Math.floor(s) }
const floorAt = (x: number, z: number) =>
  Math.sin(x * 0.06) * 1.6 + Math.cos(z * 0.05) * 1.4 + Math.sin((x + z) * 0.09) * 0.8

// Stream route through the forest, toward the distant valley (-z).
const STREAM: [number, number][] = [
  [-6, 70], [4, 50], [-5, 30], [3, 10], [-4, -12], [2, -34], [-3, -58], [0, -82],
]

export function PacificScene() {
  const { progress } = useScroll()

  // ── Mossy forest floor ─────────────────────────────────────
  const floor = useMemo(() => {
    const geo = new THREE.PlaneGeometry(220, 320, 120, 150)
    geo.rotateX(-Math.PI / 2)
    const pos = geo.attributes.position as THREE.BufferAttribute
    const colors = new Float32Array(pos.count * 3)
    const lo = new THREE.Color(MOSS_LO), hi = new THREE.Color(MOSS_HI), tmp = new THREE.Color()
    let mn = Infinity, mx = -Infinity
    for (let i = 0; i < pos.count; i++) { const y = floorAt(pos.getX(i), pos.getZ(i)); pos.setY(i, y); if (y < mn) mn = y; if (y > mx) mx = y }
    for (let i = 0; i < pos.count; i++) {
      const t = THREE.MathUtils.clamp((pos.getY(i) - mn) / (mx - mn), 0, 1) * (0.6 + rand(i) * 0.4)
      tmp.copy(lo).lerp(hi, t)
      colors[i * 3] = tmp.r; colors[i * 3 + 1] = tmp.g; colors[i * 3 + 2] = tmp.b
    }
    geo.computeVertexNormals()
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return geo
  }, [])

  // ── Glowing stream ─────────────────────────────────────────
  const streamCurve = useMemo(() => {
    const pts = STREAM.map(([x, z]) => new THREE.Vector3(x, floorAt(x, z) + 0.25, z))
    return new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.4)
  }, [])
  const streamHaloGeo = useMemo(() => new THREE.TubeGeometry(streamCurve, 420, 1.4, 8, false), [streamCurve])
  const streamCoreGeo = useMemo(() => new THREE.TubeGeometry(streamCurve, 420, 0.45, 8, false), [streamCurve])
  const streamHaloRef = useRef<THREE.Mesh>(null)
  const streamCoreRef = useRef<THREE.Mesh>(null)

  // ── Ground mist sheets (horizontal additive planes at floor) ──
  const mistData = useMemo<{ pos: [number,number,number]; rot: [number,number,number]; w: number; h: number }[]>(() => [
    { pos: [2, 1.2, 32],  rot: [-0.07,  0.30, 0], w: 120, h: 60 },
    { pos: [-4, 0.7, 4],  rot: [-0.05, -0.22, 0], w: 150, h: 75 },
    { pos: [3, 1.4, -28], rot: [-0.09,  0.15, 0], w: 100, h: 50 },
    { pos: [-2, 0.6, -60],rot: [-0.06, -0.12, 0], w: 160, h: 80 },
    { pos: [5, 1.7, -90], rot: [-0.11,  0.20, 0], w: 130, h: 65 },
  ], [])

  // ── Banshee cam: beat-driven elevation matching the storyboard ─
  // 8 beats: Ground Zero → Water Wakes → Vein → Trunks → Communion
  //           → Shaft Break → Lift → Valley Reveal
  const { camCurve, lookCurve } = useMemo(() => {
    // Each entry: [scrollT, camY, backDist]
    const WAYPOINTS = [
      [0.00,  0.3,  4.2],  // 01 Ground Zero — extreme ground macro
      [0.13,  0.5,  3.6],  // 02 Water Wakes — fern level
      [0.25,  1.2,  3.4],  // 03 Vein Wakes — stream enters
      [0.38,  1.8,  3.0],  // 04 Between Trunks — banking through gap
      [0.50,  1.3,  2.8],  // 05 Stream Communion — drop to water
      [0.63,  2.8,  3.6],  // 06 Shaft Break — rise to shafts
      [0.73,  6.0,  4.5],  // 07a Lift begins
      [0.85, 22.0,  6.0],  // 07b Mid-lift
      [1.00, 46.0,  8.0],  // 08 Valley Revealed
    ]

    function beatLerp(t: number, key: number) {
      for (let i = 0; i < WAYPOINTS.length - 1; i++) {
        const [t0, v0] = WAYPOINTS[i]; const [t1, v1] = WAYPOINTS[i + 1]
        if (t >= t0 && t <= t1) {
          const lt = (t - t0) / (t1 - t0)
          // ease the cam elevation transitions (softer entry/exit)
          const et = lt < 0.5 ? 2 * lt * lt : 1 - Math.pow(-2 * lt + 2, 2) / 2
          return (v0 as number) + ((v1 as number) - (v0 as number)) * et
        }
      }
      return WAYPOINTS[WAYPOINTS.length - 1][key] as number
    }

    const camPts: THREE.Vector3[] = []
    const lookPts: THREE.Vector3[] = []
    const N = 80
    for (let i = 0; i <= N; i++) {
      const t = i / N
      const rt = Math.min(0.97, t * 0.92)
      const p = streamCurve.getPointAt(rt)
      const tan = streamCurve.getTangentAt(rt)
      // Right-hand perpendicular to tangent (for lateral offset)
      const perp = new THREE.Vector3().crossVectors(tan, new THREE.Vector3(0, 1, 0)).normalize()

      const dy   = beatLerp(t, 1)
      const back = beatLerp(t, 2)

      // Base cam: stream-chase from behind
      const cam = p.clone().addScaledVector(tan, -back)
      cam.y += dy
      cam.x += Math.sin(t * 4.6 + 0.8) * (t < 0.65 ? 1.1 : lerp(1.1, 0, (t - 0.65) / 0.1))

      // Beat 01-02 (t < 0.28): camera BESIDE stream — stream runs past us, not ahead
      if (t < 0.28) {
        const side = clamp01(1 - t / 0.24) * 3.8
        cam.addScaledVector(perp, side)
      }

      // Beat 05 (t 0.48-0.62): camera drops ONTO stream surface — back distance → 0
      if (t > 0.48 && t < 0.62) {
        const onT = Math.sin(clamp01((t - 0.48) / 0.07) * Math.PI)
        const effectiveBack = lerp(back, 0, onT)
        cam.copy(p.clone().addScaledVector(tan, -effectiveBack))
        cam.y = p.y + lerp(dy, 0.8, onT)
        cam.x = p.x + Math.sin(t * 4.6 + 0.8) * lerp(1.1, 0.4, onT)
      }

      camPts.push(cam)

      // Look target — beside-beats look ACROSS at the stream; shaft break tilts up; vista drops to valley
      let look: THREE.Vector3
      if (t < 0.20) {
        // Camera is beside stream — look ACROSS at it (not along it)
        look = streamCurve.getPointAt(rt)
      } else if (t < 0.30) {
        // Discovery pivot: blend from across-look to forward-look
        const bl = (t - 0.20) / 0.10
        look = new THREE.Vector3().lerpVectors(
          streamCurve.getPointAt(rt),
          streamCurve.getPointAt(Math.min(1, rt + 0.045)),
          bl,
        )
      } else if (t > 0.80) {
        look = new THREE.Vector3(0, lerp(p.y, 6, (t - 0.80) / 0.20), lerp(p.z, -150, (t - 0.80) / 0.20))
      } else if (t > 0.58 && t < 0.68) {
        const lp = streamCurve.getPointAt(Math.min(1, rt + 0.04))
        const tiltUp = Math.sin(((t - 0.58) / 0.10) * Math.PI) * 4
        look = new THREE.Vector3(lp.x, lp.y + tiltUp, lp.z)
      } else {
        look = streamCurve.getPointAt(Math.min(1, rt + 0.045))
      }
      lookPts.push(look)
    }
    return {
      camCurve: new THREE.CatmullRomCurve3(camPts, false, 'catmullrom', 0.5),
      lookCurve: new THREE.CatmullRomCurve3(lookPts, false, 'catmullrom', 0.5),
    }
  }, [streamCurve])

  useScrollCamera({ curve: camCurve, lookCurve, lookAhead: 0.02, parallax: 0.6, smoothing: 0.1, bank: 0.6, windJitter: 0.35 })

  // ── Big macro tree trunks ───────────────────────────────────
  const trees = useMemo(() => {
    const out: { pos: [number, number, number]; r: number; h: number }[] = []
    for (let i = 0; i < 46; i++) {
      const x = (rand(i * 2.3) - 0.5) * 200
      const z = (rand(i * 3.9) - 0.5) * 300
      if (STREAM.some(([sx, sz]) => Math.hypot(sx - x, sz - z) < 7)) continue
      out.push({ pos: [x, floorAt(x, z), z], r: 1.4 + rand(i) * 2.2, h: 34 + rand(i * 5) * 26 })
    }
    return out
  }, [])

  // ── Ferns / undergrowth ────────────────────────────────────
  const ferns = useMemo(() => {
    const out: { pos: [number, number, number]; s: number }[] = []
    for (let i = 0; i < 120; i++) {
      const x = (rand(i * 7.1) - 0.5) * 150
      const z = (rand(i * 4.3) - 0.5) * 220
      out.push({ pos: [x, floorAt(x, z), z], s: 0.6 + rand(i * 2) * 1.1 })
    }
    return out
  }, [])

  // ── Hanging vines ──────────────────────────────────────────
  const vines = useMemo(() => Array.from({ length: 10 }, (_, i) => {
    const x = (rand(i * 13.7) - 0.5) * 80
    const z = (rand(i * 8.3) - 0.5) * 120
    const h = 18 + rand(i * 3) * 16
    return { x, z: z + 10, h, thick: 0.06 + rand(i) * 0.06 }
  }), [])

  // ── Fallen logs ────────────────────────────────────────────
  const logs = useMemo(() => Array.from({ length: 5 }, (_, i) => {
    const x = (rand(i * 17.1) - 0.5) * 60
    const z = (rand(i * 11.9) - 0.5) * 80 + 10
    const gy = floorAt(x, z)
    return { x, y: gy + 0.5, z, len: 8 + rand(i) * 10, r: 0.5 + rand(i * 2) * 0.4, rot: rand(i) * Math.PI }
  }), [])

  // ── God-rays: 2-layer with per-shaft animation refs ────────
  const shafts = useMemo(() => Array.from({ length: 7 }, (_, i) => ({
    x: (rand(i * 3.1) - 0.5) * 70,
    z: 30 - i * 20,
    tiltX: 0.18 + rand(i * 2) * 0.2,
    tiltZ: (rand(i * 4) - 0.5) * 0.25,
    innerR: 1.2 + rand(i) * 1.4,
    outerR: 4 + rand(i * 1.5) * 5,
    phase: rand(i * 9) * Math.PI * 2,
    freq: 0.5 + rand(i * 11) * 0.6,
  })), [])
  const shaftInnerRefs = useRef<(THREE.Mesh | null)[]>([])
  const shaftOuterRefs = useRef<(THREE.Mesh | null)[]>([])

  // ── Distant valley network nodes ──────────────────────────
  const nodes = useMemo(() =>
    Array.from({ length: 9 }, (_, i) => new THREE.Vector3(
      (rand(i * 5.5) - 0.5) * 160, 4 + rand(i) * 14, -110 - rand(i * 2) * 70,
    )), [])
  const nodesRef = useRef<THREE.Group>(null)

  // ── Valley connections: arcing tubes between nodes ─────────
  const connGeos = useMemo(() => {
    const pairs = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[0,5],[2,7]]
    return pairs.map(([a, b]) => {
      const na = nodes[Math.min(a, nodes.length - 1)]
      const nb = nodes[Math.min(b, nodes.length - 1)]
      const mid = new THREE.Vector3().addVectors(na, nb).multiplyScalar(0.5)
      mid.y += 10 + rand((a + b) * 7.3) * 14
      return new THREE.TubeGeometry(new THREE.CatmullRomCurve3([na, mid, nb]), 60, 0.16, 5, false)
    })
  }, [nodes])
  const connRefs = useRef<(THREE.Mesh | null)[]>([])

  // ── Moving point light + valley reveal light ──────────────
  const movingLightRef  = useRef<THREE.PointLight>(null)
  const valleyLightRef  = useRef<THREE.PointLight>(null)

  // ── Alive ambient: refs ───────────────────────────────────
  const gnatRefs    = useRef<(THREE.Object3D | null)[]>([])
  const fireflyRef  = useRef<THREE.Object3D>(null)
  const birdPairRef = useRef<THREE.Group>(null)   // one recurring pair, crosses at beats 2/4/7
  const flockRef    = useRef<THREE.Object3D>(null) // distant flocks — beat 9 scale cue only
  const rippleRefs  = useRef<(THREE.Mesh | null)[]>([])
  const dripperRefs = useRef<(THREE.Mesh | null)[]>([])
  const fernRefs    = useRef<(THREE.Mesh | null)[]>([])
  const vineRefs    = useRef<(THREE.Mesh | null)[]>([])
  const mistRefs    = useRef<(THREE.Mesh | null)[]>([])
  const fireflyTex  = useSoftTexture()

  // Shared wind vector, refreshed at the top of every frame so dust
  // (via DriftParticles windRef) streams from the same cause as everything else.
  const windRef = useRef<{ x: number; z: number }>({ x: 0, z: 0 })

  // Ripple phases — kicked to 0 when the paired dripper lands (event-driven, not free-loop).
  const ripplePhase = useRef<number[]>([])
  const dripPrev    = useRef<number[]>([])

  // Gnats — one Points cluster per shaft, geometry built from shaft radius
  const gnatGeos = useMemo(() => shafts.map((s, i) => {
    const g = new THREE.BufferGeometry()
    const pts = new Float32Array(18 * 3)
    for (let j = 0; j < 18; j++) {
      pts[j * 3]     = (rand(i * 100 + j * 3    ) - 0.5) * s.innerR * 1.6
      pts[j * 3 + 1] = rand(i * 200 + j * 3 + 1) * 10
      pts[j * 3 + 2] = (rand(i * 300 + j * 3 + 2) - 0.5) * s.innerR * 1.6
    }
    g.setAttribute('position', new THREE.BufferAttribute(pts, 3))
    return g
  }), [shafts])

  // Stream-embers — ≤4 amber points that LIFT off the water and fade
  // (the signal shedding light), only at beats 3 & 5. Each carries a
  // base stream point + rise speed + phase so they recycle independently.
  const EMBERS = 4
  const emberBase = useMemo(() =>
    Array.from({ length: EMBERS }, (_, i) => {
      const p = streamCurve.getPointAt(0.1 + i * 0.1)
      return {
        x: p.x + (rand(i * 31.7) - 0.5) * 2.5,
        y: p.y + 0.25,
        z: p.z + (rand(i * 19.3) - 0.5) * 2.5,
        rise: 0.35 + rand(i * 5.1) * 0.3,
        phase: rand(i * 7.7),
      }
    }), [streamCurve])
  const fireflyGeo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const pts = new Float32Array(EMBERS * 3)
    for (let i = 0; i < EMBERS; i++) {
      pts[i * 3] = emberBase[i].x; pts[i * 3 + 1] = emberBase[i].y; pts[i * 3 + 2] = emberBase[i].z
    }
    g.setAttribute('position', new THREE.BufferAttribute(pts, 3))
    return g
  }, [emberBase])

  // Ripple rings + paired drippers — a drip swells, falls, and TICKS its
  // ripple on landing. The ripple expands from that event, not on a free loop.
  const rippleData = useMemo(() =>
    [0.05, 0.15, 0.25, 0.35, 0.45].map((t, i) => {
      const p = streamCurve.getPointAt(t)
      return {
        pos: new THREE.Vector3(p.x, p.y + 0.28, p.z), // ripple at surface
        dripTop: p.y + 2.6 + rand(i * 4.4) * 1.4,     // dripper release height
        surfaceY: p.y + 0.3,                          // where the drip "lands"
        rate: 0.18 + rand(i * 9.1) * 0.12,            // fall cycles/sec (slow, staggered)
        offset: rand(i * 13.3),                       // desync the drippers
      }
    }), [streamCurve])

  // Bird pair crossing windows — same pair recurs at beats 2 / 4 / 7,
  // entering and exiting via the frame EDGES (worldX swept far→far), never fading in place.
  const BIRD_WINDOWS = useMemo(() => [
    { s: 0.10, e: 0.20, y: 30, z: -88 },  // beat 2
    { s: 0.34, e: 0.46, y: 26, z: -70 },  // beat 4 (lower, through the shaft gap)
    { s: 0.70, e: 0.80, y: 40, z: -100 }, // beat 7 (silhouetted across a shaft)
  ], [])

  // Distant flocks — tiny far-sky points, beat 9 scale cue only.
  const flockGeo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const n = 40
    const pts = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      pts[i * 3]     = (rand(i * 2.7) - 0.5) * 160
      pts[i * 3 + 1] = 30 + rand(i * 5.3) * 28
      pts[i * 3 + 2] = -150 - rand(i * 3.9) * 60
    }
    g.setAttribute('position', new THREE.BufferAttribute(pts, 3))
    return g
  }, [])

  useFrame((state, dt) => {
    const eP = easeInOut(clamp01(progress.current))
    const t = state.clock.elapsedTime

    // ── ONE wind signal — every animated system below reads this ──
    const wind = windAt(t)
    windRef.current.x = wind.x
    windRef.current.z = wind.z

    // Foliage sway — ferns nod, vines (hanging) sway ~3×. Per-element
    // phase via rand(i) so they don't lockstep but share the wind's
    // direction + timing. Trunks/logs stay rooted (correct).
    fernRefs.current.forEach((m, i) => {
      if (!m) return
      const ph = 0.6 + rand(i * 2)
      m.rotation.z = wind.x * 0.05 * ph + Math.sin(t * 1.3 + i) * 0.006
      m.rotation.x = wind.z * 0.04 * ph
    })
    vineRefs.current.forEach((m, i) => {
      if (!m) return
      const ph = 0.7 + rand(i * 3)
      m.rotation.z = wind.x * 0.09 * ph + Math.sin(t * 0.9 + i) * 0.012
      m.rotation.x = wind.z * 0.07 * ph
    })

    // Mist sheets creep along the wind (were fully static).
    mistRefs.current.forEach((m, i) => {
      if (!m) return
      m.position.x = mistData[i].pos[0] + Math.sin(t * 0.08 + i) * 3 + wind.x * 2.5
      m.position.z = mistData[i].pos[2] + wind.z * 2.0
    })

    // Stream draw-in
    const draw = clamp01(eP * 1.1)
    if (streamCoreRef.current?.geometry.index)  streamCoreRef.current.geometry.setDrawRange(0, Math.floor((streamCoreGeo.index?.count ?? 0) * draw))
    if (streamHaloRef.current?.geometry.index)  streamHaloRef.current.geometry.setDrawRange(0, Math.floor((streamHaloGeo.index?.count ?? 0) * draw))

    // Stream flow pulse
    if (streamCoreRef.current) {
      const mat = streamCoreRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = 2.6 + Math.sin(t * 2.4) * 1.0
    }
    if (streamHaloRef.current) {
      const mat = streamHaloRef.current.material as THREE.MeshStandardMaterial
      mat.opacity = 0.28 + Math.sin(t * 1.7 + 1.0) * 0.07
    }

    // God-ray shafts — per-shaft texture flicker PLUS a shared wind.gust
    // term so they all brighten/lean on the same gust (one cause, not
    // decoupled timers). The shared term is what reads as real.
    const gustLift = (wind.gust - 0.5) * 0.05
    shaftInnerRefs.current.forEach((m, i) => {
      if (!m) return
      const s = shafts[i]
      ;(m.material as THREE.MeshBasicMaterial).opacity = 0.10 + Math.sin(t * s.freq + s.phase) * 0.03 + gustLift
      m.parent && (m.parent.rotation.z = s.tiltZ + wind.x * 0.03)
    })
    shaftOuterRefs.current.forEach((m, i) => {
      if (!m) return
      const s = shafts[i]
      ;(m.material as THREE.MeshBasicMaterial).opacity = 0.028 + Math.sin(t * s.freq * 0.7 + s.phase + 1.3) * 0.008 + gustLift * 0.4
    })

    // Ambient light rides the stream — casts live shadows on trunks
    if (movingLightRef.current) {
      const rt = clamp01(eP * 0.88)
      const lp = streamCurve.getPointAt(rt)
      movingLightRef.current.position.set(lp.x, lp.y + 3.5, lp.z)
      movingLightRef.current.intensity = lerp(0.3, 2.2, clamp01(eP * 2.5))
    }

    // Valley connections staggered draw-in
    const connShow = clamp01((eP - 0.77) / 0.23)
    connRefs.current.forEach((m, i) => {
      if (!m || !m.geometry.index) return
      const localT = clamp01((connShow * (connGeos.length + 2) - i) / 2)
      m.geometry.setDrawRange(0, Math.floor(m.geometry.index.count * localT))
      ;(m.material as THREE.MeshStandardMaterial).opacity = localT * 0.88
    })

    // Valley nodes pulse
    if (nodesRef.current) {
      const show = clamp01((eP - 0.80) / 0.20)
      nodesRef.current.children.forEach((c, i) => {
        const mat = (c as THREE.Mesh).material as THREE.MeshStandardMaterial
        const tw = 0.55 + Math.sin(t * (1.1 + i * 0.19) + i * 1.6) * 0.45
        mat.emissiveIntensity = show * 4.5 * tw
        mat.opacity = show
      })
    }

    // Valley ambient: warm bloom floods in on reveal
    if (valleyLightRef.current) {
      valleyLightRef.current.intensity = clamp01((eP - 0.78) / 0.22) * 4
    }

    // Background color shifts from dark forest to open-sky green on lift
    const bgFac = clamp01((eP - 0.72) / 0.28)
    if (state.scene.background instanceof THREE.Color) {
      state.scene.background.copy(BG_FOREST).lerp(BG_VISTA, bgFac)
    }

    // Gnats — each cluster oscillates inside its shaft zone
    gnatRefs.current.forEach((m, i) => {
      if (!m) return
      const s = shafts[i]
      m.position.set(
        s.x + Math.sin(t * (0.7 + i * 0.11) + i) * 1.3,
        20 + Math.sin(t * (0.5 + i * 0.09) + i * 2.1) * 4,
        s.z + Math.cos(t * (0.6 + i * 0.13) + i * 3.3) * 1.0,
      )
    })

    // Stream-embers — lift off the water and fade; ONLY at beats 3 & 5.
    if (fireflyRef.current) {
      const pts = fireflyRef.current as unknown as THREE.Points
      const win = Math.max(
        clamp01(1 - Math.abs(eP - 0.25) / 0.06),   // beat 3
        clamp01(1 - Math.abs(eP - 0.50) / 0.06),   // beat 5
      )
      const pa = pts.geometry.attributes.position as THREE.BufferAttribute
      for (let i = 0; i < EMBERS; i++) {
        const b = emberBase[i]
        const cyc = (t * b.rise + b.phase) % 1       // 0..1 rise then recycle
        pa.setXYZ(i, b.x + Math.sin(t * 0.5 + i) * 0.3, b.y + cyc * 3.4, b.z + wind.x * cyc * 1.6)
      }
      pa.needsUpdate = true
      ;(pts.material as THREE.PointsMaterial).opacity = win * (0.45 + Math.sin(t * 1.7) * 0.2)
    }

    // Bird pair — crosses edge→edge at beats 2/4/7; fully off-frame otherwise.
    if (birdPairRef.current) {
      let active = -1
      for (let i = 0; i < BIRD_WINDOWS.length; i++) {
        const w = BIRD_WINDOWS[i]
        if (eP >= w.s && eP <= w.e) { active = i; break }
      }
      if (active >= 0) {
        const w = BIRD_WINDOWS[active]
        const u = clamp01((eP - w.s) / (w.e - w.s))
        birdPairRef.current.visible = true
        birdPairRef.current.position.set(lerp(120, -120, u), w.y + Math.sin(t * 0.6) * 1.4, w.z)
        birdPairRef.current.children.forEach((bird, bi) => {
          bird.children.forEach((wing, wi) => {
            const flap = Math.sin(t * 6 + bi * 1.3) * 0.4
            ;(wing as THREE.Mesh).rotation.z = (wi === 0 ? 0.28 + flap : -0.28 - flap)
          })
        })
      } else {
        birdPairRef.current.visible = false
      }
    }

    // Distant flocks — beat 9 scale cue only.
    if (flockRef.current) {
      const show = clamp01((eP - 0.85) / 0.15)
      ;((flockRef.current as unknown as THREE.Points).material as THREE.PointsMaterial).opacity = show * 0.5
    }

    // Drip→ripple — dripper swells, falls, and TICKS its ripple on landing.
    dripperRefs.current.forEach((m, i) => {
      if (!m) return
      const d = rippleData[i]
      const cyc = (t * d.rate + d.offset) % 1
      if (cyc < 0.25) {
        // swell at the source before release
        m.position.set(d.pos.x, d.dripTop, d.pos.z)
        m.scale.setScalar(0.5 + (cyc / 0.25) * 0.6)
        m.visible = true
      } else {
        const fall = (cyc - 0.25) / 0.75
        m.position.set(d.pos.x, lerp(d.dripTop, d.surfaceY, fall), d.pos.z)
        m.scale.setScalar(0.6 * (1 - fall * 0.35))
        m.visible = fall < 0.97
      }
      // landing = cycle wrapped → kick the paired ripple to 0 (start expanding)
      const prev = dripPrev.current[i] ?? cyc
      if (cyc < prev) ripplePhase.current[i] = 0
      dripPrev.current[i] = cyc
    })

    rippleRefs.current.forEach((m, i) => {
      if (!m) return
      let ph = ripplePhase.current[i]
      if (ph === undefined) ph = 1
      ph = Math.min(1, ph + dt * 0.7)          // expand after a kick, then rest at 1
      ripplePhase.current[i] = ph
      const scl = 0.4 + ph * 3.6
      m.scale.set(scl, 1, scl)
      ;(m.material as THREE.MeshBasicMaterial).opacity = Math.max(0, (1 - ph) * 0.55)
    })
  })

  return (
    <group>
      <color attach="background" args={['#10160f']} />
      <fog attach="fog" args={['#141d12', 22, 230]} />
      <ambientLight intensity={0.5} color="#bcd0a8" />
      <directionalLight position={[-30, 60, 40]} intensity={1.4} color="#ffe6b8" castShadow={false} />
      <hemisphereLight args={['#7d9a5e', '#0c130a', 0.55]} />

      {/* Moving stream light — rides the water, illuminates surrounding trunks */}
      <pointLight ref={movingLightRef} color={WATER} intensity={0} distance={34} decay={2} />
      {/* Valley reveal bloom */}
      <pointLight ref={valleyLightRef} position={[0, 10, -140]} color={WATER} intensity={0} distance={160} decay={1.2} />

      {/* Forest floor */}
      <mesh geometry={floor}>
        <meshStandardMaterial vertexColors flatShading roughness={1} metalness={0} />
      </mesh>

      {/* Ground mist sheets — additive, wide horizontal planes near the floor */}
      {mistData.map((m, i) => (
        <mesh key={`mist${i}`} ref={(el) => { mistRefs.current[i] = el }} position={m.pos} rotation={m.rot}>
          <planeGeometry args={[m.w, m.h]} />
          <meshBasicMaterial color="#c8dcc0" transparent opacity={0.065} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* Stream: outer water-body halo */}
      <mesh ref={streamHaloRef} geometry={streamHaloGeo}>
        <meshStandardMaterial color={WATER} emissive={WATER} emissiveIntensity={0.5} roughness={0.1} transparent opacity={0.32} toneMapped={false} depthWrite={false} />
      </mesh>
      {/* Stream: inner bright glowing core */}
      <mesh ref={streamCoreRef} geometry={streamCoreGeo}>
        <meshStandardMaterial color="#fff4d6" emissive={WATER} emissiveIntensity={3.2} roughness={0.2} toneMapped={false} />
      </mesh>

      {/* Macro tree trunks */}
      {trees.map((t, i) => (
        <group key={i}>
          <mesh position={[t.pos[0], t.pos[1] + t.h / 2, t.pos[2]]}>
            <cylinderGeometry args={[t.r * 0.7, t.r, t.h, 6]} />
            <meshStandardMaterial color={i % 3 === 0 ? BARK_LIGHT : BARK} roughness={1} flatShading />
          </mesh>
          <mesh position={[t.pos[0], t.pos[1] + 0.12, t.pos[2]]} rotation={[-Math.PI / 2, 0, rand(i) * 2]}>
            <torusGeometry args={[t.r + 0.5, 0.35, 4, 12]} />
            <meshStandardMaterial color={MOSS_RING} roughness={1} flatShading />
          </mesh>
        </group>
      ))}

      {/* Ferns / undergrowth */}
      {ferns.map((f, i) => (
        <mesh key={i} ref={(el) => { fernRefs.current[i] = el }} position={[f.pos[0], f.pos[1] + f.s * 0.5, f.pos[2]]} rotation={[0, rand(i) * 6, 0]}>
          <coneGeometry args={[f.s * 0.9, f.s * 1.6, 5]} />
          <meshStandardMaterial color={i % 3 === 0 ? '#2f4a26' : '#243d1d'} roughness={1} flatShading />
        </mesh>
      ))}

      {/* Hanging vines from canopy */}
      {vines.map((v, i) => (
        <mesh key={i} ref={(el) => { vineRefs.current[i] = el }} position={[v.x, floorAt(v.x, v.z) + v.h / 2, v.z]}>
          <cylinderGeometry args={[v.thick * 0.6, v.thick, v.h, 4]} />
          <meshStandardMaterial color="#1a3019" roughness={1} flatShading />
        </mesh>
      ))}

      {/* Fallen logs on the forest floor */}
      {logs.map((l, i) => (
        <mesh key={i} position={[l.x, l.y, l.z]} rotation={[0, l.rot, Math.PI / 2]}>
          <cylinderGeometry args={[l.r, l.r * 1.1, l.len, 6]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#1e1610' : BARK} roughness={1} flatShading />
        </mesh>
      ))}

      {/* God-rays: 2-layer with per-shaft flicker animation */}
      {shafts.map((s, i) => (
        <group key={i} position={[s.x, 50, s.z]} rotation={[Math.PI + s.tiltX, 0, s.tiltZ]}>
          <mesh ref={(el) => { shaftInnerRefs.current[i] = el }}>
            <coneGeometry args={[s.innerR, 55, 8, 1, true]} />
            <meshBasicMaterial color="#ffe8bd" transparent opacity={0.13} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
          </mesh>
          <mesh ref={(el) => { shaftOuterRefs.current[i] = el }}>
            <coneGeometry args={[s.outerR, 55, 8, 1, true]} />
            <meshBasicMaterial color="#ffe0a8" transparent opacity={0.035} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
          </mesh>
        </group>
      ))}

      {/* Distant treeline + mountain silhouettes */}
      <group position={[0, 0, -150]}>
        {[[-60, 34, -40], [10, 46, -70], [70, 38, -50], [-20, 28, -10]].map((m, i) => (
          <mesh key={i} position={[m[0], m[1] / 2 - 4, m[2]]}>
            <coneGeometry args={[m[1] * 0.9, m[1], 5]} />
            <meshStandardMaterial color="#1e2c25" flatShading roughness={1} />
          </mesh>
        ))}
        {Array.from({ length: 60 }, (_, i) => {
          const x = (rand(i * 9) - 0.5) * 180
          const z = 10 - rand(i * 3) * 30
          const h = 6 + rand(i) * 8
          return (
            <mesh key={`t${i}`} position={[x, h / 2 - 4, z]}>
              <coneGeometry args={[h * 0.35, h, 5]} />
              <meshStandardMaterial color="#16241a" flatShading roughness={1} />
            </mesh>
          )
        })}
      </group>

      {/* Valley connection tubes — draw in staggered at the reveal */}
      {connGeos.map((g, i) => (
        <mesh key={`conn${i}`} ref={(el) => { connRefs.current[i] = el }} geometry={g}>
          <meshStandardMaterial color={WATER} emissive={WATER} emissiveIntensity={2.4} roughness={0.2} transparent opacity={0} toneMapped={false} depthWrite={false} />
        </mesh>
      ))}

      {/* Valley network nodes — ignite at the reveal */}
      <group ref={nodesRef}>
        {nodes.map((p, i) => (
          <mesh key={i} position={p}>
            <icosahedronGeometry args={[1.8, 1]} />
            <meshStandardMaterial color={WATER} emissive={WATER} emissiveIntensity={0} transparent opacity={0} toneMapped={false} />
          </mesh>
        ))}
      </group>

      {/* Mist + pollen — dust streams WITH the shared wind (one cause) */}
      <CloudPuffs positions={[[6, 4, 30], [-8, 3, 4], [4, 5, -28], [-6, 6, -58], [0, 8, -90]]} scale={20} color="#cfdcc2" opacity={0.12} />
      <DriftParticles count={260} spread={120} size={0.55} color="#ffe7bf" opacity={0.45} windRef={windRef} />
      {/* Bioluminescent spore halo around stream */}
      <DriftParticles count={160} spread={20} size={0.28} color={WATER} opacity={0.55} windRef={windRef} />
      {/* Water-mist micro-particles — drip/condensation near trunk bases */}
      <DriftParticles count={90} spread={12} size={0.16} color="#d8eeff" opacity={0.6} windRef={windRef} />

      {/* ── Alive ambient ─────────────────────────────────── */}

      {/* Water drops on fern tips — glisten under DoF as dew */}
      {ferns.slice(0, 50).map((f, i) => (
        <mesh
          key={`drop${i}`}
          position={[
            f.pos[0] + (rand(i * 23.1) - 0.5) * 0.45,
            f.pos[1] + f.s * 1.3 + rand(i * 7) * 0.3,
            f.pos[2] + (rand(i * 11.7) - 0.5) * 0.35,
          ]}
        >
          <sphereGeometry args={[0.065 + rand(i * 5) * 0.04, 5, 5]} />
          <meshStandardMaterial roughness={0} metalness={0.3} color="#d8f0ff" transparent opacity={0.88} />
        </mesh>
      ))}

      {/* Gnats — erratic micro-particles inside god-ray shaft volumes */}
      {shafts.map((_, i) => (
        <points key={`gnat${i}`} ref={(el) => { gnatRefs.current[i] = el }} geometry={gnatGeos[i]}>
          <pointsMaterial size={0.055} color="#fffbe0" transparent opacity={0.65} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
        </points>
      ))}

      {/* Stream-embers — ≤4 amber points that lift off the water (beats 3 & 5) */}
      <points ref={fireflyRef} geometry={fireflyGeo}>
        <pointsMaterial map={fireflyTex} size={0.34} color="#ffcf8a" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
      </points>

      {/* Bird pair — ONE recurring pair, crosses edge→edge at beats 2/4/7.
          Position + visibility driven in useFrame; cool silhouette only. */}
      <group ref={birdPairRef} visible={false}>
        {[[-3, 0.6, 0], [3, -0.6, 2]].map((o, bi) => (
          <group key={`bird${bi}`} position={[o[0], o[1], o[2]]}>
            <mesh position={[-0.28, 0, 0]} rotation={[0, 0, 0.28]}>
              <boxGeometry args={[0.5, 0.04, 0.18]} />
              <meshBasicMaterial color="#16202e" />
            </mesh>
            <mesh position={[0.28, 0, 0]} rotation={[0, 0, -0.28]}>
              <boxGeometry args={[0.5, 0.04, 0.18]} />
              <meshBasicMaterial color="#16202e" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Distant flocks — beat 9 scale cue only (tiny far-sky points) */}
      <points ref={flockRef} geometry={flockGeo}>
        <pointsMaterial size={0.5} color="#1b2636" transparent opacity={0} depthWrite={false} sizeAttenuation />
      </points>

      {/* Drippers — swell at a fern/canopy point, fall, and tick a ripple */}
      {rippleData.map((d, i) => (
        <mesh key={`drip${i}`} ref={(el) => { dripperRefs.current[i] = el }} position={[d.pos.x, d.dripTop, d.pos.z]}>
          <sphereGeometry args={[0.09, 6, 6]} />
          <meshStandardMaterial roughness={0} metalness={0.2} color="#d8f0ff" transparent opacity={0.9} />
        </mesh>
      ))}

      {/* Stream ripple rings — expanding tori at stream surface, looping */}
      {rippleData.map((r, i) => (
        <mesh key={`ripple${i}`} ref={(el) => { rippleRefs.current[i] = el }} position={r.pos}>
          <torusGeometry args={[0.5, 0.04, 4, 18]} />
          <meshBasicMaterial color={WATER} transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </group>
  )
}
