import { createContext, useContext, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { windAt } from './wind'

// ─────────────────────────────────────────────────────────────
// Shared scroll + transition system for the WebGL concept trio.
// - ScrollProvider (DOM side): tracks scroll progress, velocity,
//   pointer, and device flags. Lives OUTSIDE <Canvas>.
// - useScroll(): scene-side access to the live refs.
// - useScrollCamera(): drives the R3F camera along a curve whose
//   bends produce the "axis-turn" multi-directional feel, plus
//   pointer parallax. Scenes key their own portal/scale-jump/wipe
//   behaviour off the eased progress this returns.
// ─────────────────────────────────────────────────────────────

export const clamp01 = (t: number) => Math.max(0, Math.min(1, t))
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
export const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

type ScrollState = {
  progress: { current: number }     // 0..1 raw scroll progress
  velocity: { current: number }     // recent scroll speed magnitude
  pointer: { current: { x: number; y: number; active: boolean } }  // -1..1 normalized
  reduce: boolean
  coarse: boolean
}

const ScrollCtx = createContext<ScrollState | null>(null)

export function useScroll(): ScrollState {
  const ctx = useContext(ScrollCtx)
  if (!ctx) throw new Error('useScroll must be used inside <ScrollProvider>')
  return ctx
}

export function ScrollProvider({ children }: { children: ReactNode }) {
  const progress = useRef(0)
  const velocity = useRef(0)
  const pointer = useRef({ x: 0, y: 0, active: false })

  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const coarse = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      progress.current = scrollable > 0 ? clamp01(window.scrollY / scrollable) : 0
      const dy = window.scrollY - last
      velocity.current = Math.min(0.15, Math.abs(dy) / window.innerHeight)
      last = window.scrollY
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    const onMove = (e: PointerEvent) => {
      pointer.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
        active: true,
      }
    }
    const onLeave = () => { pointer.current.active = false }
    if (!coarse) {
      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerout', onLeave)
    }
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerout', onLeave)
    }
  }, [coarse])

  const value: ScrollState = { progress, velocity, pointer, reduce, coarse }
  return <ScrollCtx.Provider value={value}>{children}</ScrollCtx.Provider>
}

type CameraOpts = {
  // Camera flight path. Camera rides getPointAt(p); the curve's bends
  // create axis-turns (forward → descend → orbit) for free.
  curve: THREE.CatmullRomCurve3
  // Optional separate look-at path; default = a point slightly ahead on `curve`.
  lookCurve?: THREE.CatmullRomCurve3
  lookAhead?: number      // how far ahead on the curve to aim (0..1), default 0.04
  parallax?: number       // pointer parallax strength in world units, default 0.6
  smoothing?: number      // position smoothing 0..1 per frame, default 0.12
  bank?: number           // banshee-POV roll strength (radians at max turn), default 0.6
  windJitter?: number     // camera-as-participant: gust nudges the lens (world units), default 0 (off)
}

const _fwd = new THREE.Vector3()
const _aheadT = new THREE.Vector3()
const _flatA = new THREE.Vector3()
const _flatB = new THREE.Vector3()
const _bankUp = new THREE.Vector3()
const _q = new THREE.Quaternion()

// Drives the active R3F camera — Banshee POV (Avatar rider-on-creature):
// rides the flight curve, looks ahead, and ROLLS into turns by tilting
// `camera.up` proportional to the horizontal turn-rate. Read eased
// progress via useScroll() + easeInOut for object animations.
export function useScrollCamera(opts: CameraOpts) {
  const { progress, pointer, reduce } = useScroll()
  const { camera } = useThree()

  const lookAhead = opts.lookAhead ?? 0.04
  const parallax = opts.parallax ?? 0.6
  const smoothing = opts.smoothing ?? 0.12
  const bank = opts.bank ?? 0.6
  const windJitter = opts.windJitter ?? 0

  const targetPos = useRef(new THREE.Vector3())
  const lookTarget = useRef(new THREE.Vector3())
  const roll = useRef(0)

  useFrame((state) => {
    const eP = easeInOut(clamp01(progress.current))
    const path = opts.lookCurve ? opts.lookCurve : opts.curve

    // Base position on the flight path
    opts.curve.getPointAt(eP, targetPos.current)

    // Camera-as-participant: the SAME wind that moves the world nudges
    // the lens — a gust pushes it laterally and lifts it slightly, so the
    // ride reads as a creature riding the air, not a stable drone.
    if (windJitter > 0 && !reduce) {
      const w = windAt(state.clock.elapsedTime)
      targetPos.current.x += w.x * windJitter
      targetPos.current.y += w.gust * windJitter * 0.4
      targetPos.current.z += w.z * windJitter * 0.5
    }

    // Pointer parallax — nudge perpendicular to view (fine pointer only)
    if (pointer.current.active && !reduce) {
      targetPos.current.x += pointer.current.x * parallax
      targetPos.current.y += -pointer.current.y * parallax
    }

    // Look-at: a point ahead (axis-turn comes from the curve tangent here)
    const la = clamp01(eP + lookAhead)
    path.getPointAt(la, lookTarget.current)

    // ── Banshee banking: measure horizontal turn between two forward
    // samples; roll `camera.up` into the turn proportional to its sharpness.
    let targetRoll = 0
    if (!reduce && bank > 0) {
      path.getPointAt(clamp01(eP + 0.012), _flatA)
      path.getPointAt(clamp01(eP + 0.05), _flatB)
      _flatA.y = 0; _flatB.y = 0
      _flatB.sub(_flatA)                          // forward-ahead (flattened)
      _fwd.copy(lookTarget.current).sub(targetPos.current); _fwd.y = 0
      if (_fwd.lengthSq() > 1e-6 && _flatB.lengthSq() > 1e-6) {
        _fwd.normalize(); _flatB.normalize()
        // signed turn angle (left/right) via cross-product y component
        const cross = _fwd.x * _flatB.z - _fwd.z * _flatB.x
        targetRoll = THREE.MathUtils.clamp(cross * 6, -1, 1) * bank
      }
    }
    // Wind adds a faint roll wobble on top of the turn-bank (lens breathing).
    if (windJitter > 0 && !reduce) {
      targetRoll += windAt(state.clock.elapsedTime).x * 0.03
    }
    // smooth the roll so it eases in/out of turns
    roll.current += (targetRoll - roll.current) * (reduce ? 1 : 0.08)

    // Build a rolled up-vector: rotate world-up around the view forward axis
    _bankUp.set(0, 1, 0)
    if (Math.abs(roll.current) > 1e-4) {
      _aheadT.copy(lookTarget.current).sub(targetPos.current).normalize()
      _q.setFromAxisAngle(_aheadT, roll.current)
      _bankUp.applyQuaternion(_q)
    }

    const s = reduce ? 1 : smoothing
    camera.position.lerp(targetPos.current, s)
    camera.up.lerp(_bankUp, reduce ? 1 : 0.12)
    camera.lookAt(lookTarget.current)
  })
}
