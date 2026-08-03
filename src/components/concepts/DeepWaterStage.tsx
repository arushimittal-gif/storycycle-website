import { useEffect, useRef } from 'react'

// ─────────────────────────────────────────────────────────────
// Deep Water — interaction layer (upgraded).
// WaterBackdrop carries the real photo grade + caustics.
// This canvas adds:
//   1. Cool diffuse brightening tied to eP
//   2. Sticky rising bubbles — briefly pause on screen before releasing
//   3. Rotating caustic light streaks — broad soft beams, NOT laser shafts
//   4. Phytoplankton — tiny cyan/blue glowing dots, cursor-reactive
//   5. Vignette
// Transparent canvas; backdrop shows through.
// prefers-reduced-motion: static brightening only.
// pointer: coarse: no cursor reactivity, fewer particles.
// ─────────────────────────────────────────────────────────────

const rnd = (a: number, b: number) => a + Math.random() * (b - a)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const clamp01 = (t: number) => Math.max(0, Math.min(1, t))
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

// ── Bubble (sticky behaviour) ──────────────────────────────
type Bubble = {
  x: number; y: number; r: number
  vy: number; depth: number; phase: number; wob: number
  // sticky: countdown frames where bubble is "stuck" before releasing
  stickyFrames: number; stickyMax: number; stuck: boolean
}

function makeBubble(): Bubble {
  return {
    x: rnd(0, 1), y: rnd(0.1, 1.05),
    r: rnd(1.2, 5), vy: rnd(0.008, 0.038),
    depth: rnd(0.35, 1), phase: rnd(0, Math.PI * 2), wob: rnd(0.2, 0.7),
    stickyFrames: 0, stickyMax: Math.random() < 0.28 ? Math.round(rnd(30, 90)) : 0,
    stuck: false,
  }
}

// ── Phytoplankton (tiny glowing dot) ──────────────────────
type Plankton = {
  x: number; y: number
  r: number           // base radius 0.6–1.8
  phase: number       // for pulse
  speed: number       // drift speed
  angle: number       // drift direction
  brightness: number
  hue: number         // 170–200 (cyan → blue-green)
}

function makePlankton(): Plankton {
  return {
    x: rnd(0, 1), y: rnd(0, 1),
    r: rnd(0.6, 1.8),
    phase: rnd(0, Math.PI * 2),
    speed: rnd(0.00015, 0.0006),
    angle: rnd(0, Math.PI * 2),
    brightness: rnd(0.5, 1.0),
    hue: Math.round(rnd(170, 205)),
  }
}

// ── Caustic streak ─────────────────────────────────────────
type Streak = {
  angle: number       // current rotation angle (radians)
  speed: number       // rotation speed (rad/frame)
  cx: number; cy: number  // center (normalized)
  len: number         // half-length (normalized, relative to h)
  width: number       // beam width in px at center
  alpha: number       // base opacity
  phase: number       // flicker offset
}

function makeStreak(i: number, count: number): Streak {
  return {
    angle: (i / count) * Math.PI + rnd(0, 0.4),
    speed: rnd(0.00015, 0.0004) * (Math.random() > 0.5 ? 1 : -1),
    cx: rnd(0.2, 0.8), cy: rnd(0.0, 0.55),
    len: rnd(0.28, 0.52),
    width: rnd(55, 130),
    alpha: rnd(0.04, 0.09),
    phase: rnd(0, Math.PI * 2),
  }
}

export function DeepWaterStage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const progress = useRef(0)
  const scrollVel = useRef(0)
  const pointer = useRef({ x: -1, y: -1, active: false })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0; let h = 0

    const resize = () => {
      w = canvas.clientWidth; h = canvas.clientHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    // Particle counts — scale down on coarse/reduced
    const BUBBLE_COUNT  = reduce ? 10 : coarse ? 20 : 48
    const PLANKTON_COUNT = reduce ? 0  : coarse ? 40 : 110
    const STREAK_COUNT  = reduce ? 0  : coarse ? 2  : 5

    const bubbles:  Bubble[]  = Array.from({ length: BUBBLE_COUNT },  () => makeBubble())
    const plankton: Plankton[] = Array.from({ length: PLANKTON_COUNT }, () => makePlankton())
    const streaks:  Streak[]  = Array.from({ length: STREAK_COUNT },  (_, i) => makeStreak(i, STREAK_COUNT))

    let raf = 0

    const render = (t: number) => {
      const eP = easeInOut(clamp01(progress.current))
      const shimmer = reduce ? 0 : Math.sin(t / 1100) * 0.022

      ctx.clearRect(0, 0, w, h)

      // ── 1. Cool diffuse brightening ──────────────────────
      ctx.globalCompositeOperation = 'lighter'
      const brightenAlpha = lerp(0.03, 0.12, eP) + shimmer * 0.3
      const brighten = ctx.createRadialGradient(w * 0.58, h * -0.08, 0, w * 0.58, h * 0.25, h * lerp(0.55, 1.0, eP))
      brighten.addColorStop(0, `rgba(155,215,240,${brightenAlpha})`)
      brighten.addColorStop(0.5, `rgba(120,185,225,${brightenAlpha * 0.4})`)
      brighten.addColorStop(1, 'rgba(100,170,215,0)')
      ctx.fillStyle = brighten
      ctx.fillRect(0, 0, w, h)

      // ── 2. Rotating caustic light streaks ────────────────
      // Broad, soft, low-opacity beams that slowly rotate — water caustic movement
      if (!reduce) {
        streaks.forEach((s) => {
          s.angle += s.speed
          s.phase += 0.008

          const flicker = 0.82 + Math.sin(s.phase) * 0.18
          // Streaks brighten slightly as eP→1 (approaching surface)
          const a = s.alpha * flicker * lerp(0.5, 1.0, eP)
          if (a < 0.01) return

          const cx = s.cx * w
          const cy = s.cy * h
          const len = s.len * h
          const dx = Math.cos(s.angle) * len
          const dy = Math.sin(s.angle) * len

          // Soft beam via a wide linear gradient perpendicular to the beam axis
          const nx = -Math.sin(s.angle) * s.width * 0.5
          const ny =  Math.cos(s.angle) * s.width * 0.5

          const grad = ctx.createLinearGradient(cx + nx, cy + ny, cx - nx, cy - ny)
          grad.addColorStop(0,   'rgba(180,230,255,0)')
          grad.addColorStop(0.3, `rgba(195,235,255,${a * 0.55})`)
          grad.addColorStop(0.5, `rgba(210,242,255,${a})`)
          grad.addColorStop(0.7, `rgba(195,235,255,${a * 0.55})`)
          grad.addColorStop(1,   'rgba(180,230,255,0)')

          ctx.save()
          ctx.beginPath()
          // Draw beam as a parallelogram along the streak axis
          ctx.moveTo(cx - dx + nx, cy - dy + ny)
          ctx.lineTo(cx + dx + nx, cy + dy + ny)
          ctx.lineTo(cx + dx - nx, cy + dy - ny)
          ctx.lineTo(cx - dx - nx, cy - dy - ny)
          ctx.closePath()
          ctx.fillStyle = grad
          ctx.globalAlpha = 1
          ctx.fill()
          ctx.restore()
        })
      }

      // ── 3. Phytoplankton — tiny pulsing cyan/blue dots ───
      if (!reduce) {
        const boost = scrollVel.current
        plankton.forEach((p) => {
          p.phase += 0.022
          // Slow drift with gentle wander
          p.angle += rnd(-0.01, 0.01)
          p.x += Math.cos(p.angle) * p.speed + boost * 0.05 * (Math.random() - 0.5)
          p.y -= p.speed * 0.4  // very slow upward drift

          // Cursor scatter (fine pointer only)
          if (pointer.current.active && !coarse) {
            const dx = p.x - pointer.current.x / w
            const dy = p.y - pointer.current.y / h
            const d2 = dx * dx + dy * dy
            if (d2 < 0.008 && d2 > 0) {
              const f = (0.008 - d2) * 4
              p.x += dx * f * 0.15
              p.y += dy * f * 0.15
            }
          }

          // Wrap
          if (p.x > 1.02) p.x = -0.02
          else if (p.x < -0.02) p.x = 1.02
          if (p.y < -0.02) p.y = 1.02
          else if (p.y > 1.02) p.y = -0.02

          const pulse = 0.65 + Math.sin(p.phase) * 0.35
          const a = p.brightness * pulse * lerp(0.25, 0.7, eP) * 0.9
          if (a < 0.05) return

          const px = p.x * w; const py = p.y * h
          const r = p.r * (0.7 + pulse * 0.5)

          const g = ctx.createRadialGradient(px, py, 0, px, py, r * 2.5)
          g.addColorStop(0, `hsla(${p.hue},90%,75%,${a})`)
          g.addColorStop(0.6, `hsla(${p.hue},80%,60%,${a * 0.3})`)
          g.addColorStop(1, `hsla(${p.hue},70%,50%,0)`)
          ctx.fillStyle = g
          ctx.beginPath()
          ctx.arc(px, py, r * 2.5, 0, Math.PI * 2)
          ctx.fill()

          // Bright core dot
          ctx.fillStyle = `hsla(${p.hue},100%,90%,${a * 0.8})`
          ctx.beginPath()
          ctx.arc(px, py, Math.max(0.3, r * 0.3), 0, Math.PI * 2)
          ctx.fill()
        })
      }

      // ── 4. Sticky rising bubbles ──────────────────────────
      const boost = scrollVel.current
      bubbles.forEach((b) => {
        if (!reduce) {
          if (b.stuck) {
            // Stuck: wobble in place, count down
            b.x += Math.sin(b.phase + t * 0.001) * 0.0003
            b.phase += 0.012
            b.stickyFrames--
            if (b.stickyFrames <= 0) b.stuck = false
          } else {
            b.y -= (b.vy + boost * 0.35) * b.depth * (1 + eP * 0.25)
            b.phase += 0.009
            b.x += Math.sin(b.phase) * 0.0005 * b.wob

            // Cursor nudge (fine pointer)
            if (pointer.current.active && !coarse) {
              const dx = b.x - pointer.current.x / w
              const dy = b.y - pointer.current.y / h
              const d2 = dx * dx + dy * dy
              if (d2 < 0.018 && d2 > 0) {
                const f = (0.018 - d2) * 2.0
                b.x += dx * f
                b.y += dy * f
              }
            }

            // Check if bubble should stick near top third of screen
            if (b.stickyMax > 0 && b.y < rnd(0.05, 0.35) && !b.stuck) {
              b.stuck = true
              b.stickyFrames = b.stickyMax
            }

            // Reset when leaves top
            if (b.y < -0.06) {
              b.y = rnd(1.0, 1.1); b.x = Math.random()
              b.stickyMax = Math.random() < 0.28 ? Math.round(rnd(30, 90)) : 0
              b.stuck = false
            }
            if (b.x < -0.06) b.x = 1.06
            else if (b.x > 1.06) b.x = -0.06
          }
        }

        const bx = b.x * w; const by = b.y * h
        const rad = b.r * (0.6 + b.depth * 0.6)
        const a = (0.18 + b.depth * 0.1) + eP * 0.06

        const warmR = Math.round(lerp(218, 232, eP * 0.35))
        const warmG = Math.round(lerp(238, 236, eP * 0.15))
        const g = ctx.createRadialGradient(bx, by, 0, bx, by, rad)
        g.addColorStop(0, `rgba(${warmR},${warmG},255,${a})`)
        g.addColorStop(0.65, `rgba(155,202,242,${a * 0.38})`)
        g.addColorStop(1, 'rgba(140,190,232,0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(bx, by, rad, 0, Math.PI * 2)
        ctx.fill()

        // Rim highlight — dome-port look
        ctx.fillStyle = `rgba(228,250,255,${a * (b.stuck ? 1.1 : 0.82)})`
        ctx.beginPath()
        ctx.arc(bx - rad * 0.22, by - rad * 0.22, Math.max(0.5, rad * 0.2), 0, Math.PI * 2)
        ctx.fill()
      })
      scrollVel.current *= 0.88

      // ── 5. Vignette ───────────────────────────────────────
      ctx.globalCompositeOperation = 'source-over'
      const vig = ctx.createRadialGradient(w / 2, h / 2, h * 0.28, w / 2, h / 2, h * 0.88)
      vig.addColorStop(0, 'rgba(0,0,0,0)')
      vig.addColorStop(1, 'rgba(0,0,0,0.48)')
      ctx.fillStyle = vig
      ctx.fillRect(0, 0, w, h)

      if (!reduce) raf = requestAnimationFrame(render)
    }

    let lastScroll = window.scrollY
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      progress.current = scrollable > 0 ? window.scrollY / scrollable : 0
      const dy = window.scrollY - lastScroll
      scrollVel.current = Math.min(0.12, Math.abs(dy) / window.innerHeight)
      lastScroll = window.scrollY
      if (reduce) { cancelAnimationFrame(raf); raf = requestAnimationFrame(render) }
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    const onMove = (e: PointerEvent) => { pointer.current = { x: e.clientX, y: e.clientY, active: true } }
    const onLeave = () => { pointer.current.active = false }
    if (!coarse) {
      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerout', onLeave)
    }

    onScroll()
    raf = requestAnimationFrame(render)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerout', onLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', display: 'block', zIndex: 1 }}
    />
  )
}
