import { useEffect, useRef } from 'react'

// ─────────────────────────────────────────────────────────────
// Night Grid — interaction layer only.
// GridBackdrop (in ConceptGrid) carries the 3 city stills.
// This canvas does:
//   - Light particles traveling along implied grid paths
//   - At p=0: sparse, erratic. At p=1: organized, amber artery
//   - Cool diffuse glow grows as you scroll (p→1)
//   - Cursor-reactive (particles accelerate, brief trail)
//   - Vignette
// Canvas is transparent; backdrop photos show through.
// ─────────────────────────────────────────────────────────────

type Particle = {
  x: number; y: number
  vx: number; vy: number
  axis: 'h' | 'v'       // horizontal or vertical grid path
  speed: number
  brightness: number    // 0–1 base luminosity
  size: number
  phase: number         // for flicker
  artery: boolean       // part of the amber main artery
  trail: { x: number; y: number }[]
}

const rnd = (a: number, b: number) => a + Math.random() * (b - a)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const clamp01 = (t: number) => Math.max(0, Math.min(1, t))
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

const ARTERY_Y = 0.52  // vertical center of the amber artery (normalized)
const ARTERY_BAND = 0.06

function makeParticle(i: number, count: number): Particle {
  const axis = Math.random() > 0.45 ? 'h' : 'v'
  const artery = axis === 'h' && Math.abs((i / count) - 0.5) < 0.08
  return {
    x: Math.random(),
    y: artery ? ARTERY_Y + rnd(-ARTERY_BAND / 2, ARTERY_BAND / 2) : Math.random(),
    vx: axis === 'h' ? rnd(0.0008, 0.003) * (Math.random() > 0.5 ? 1 : -1) : 0,
    vy: axis === 'v' ? rnd(0.0008, 0.003) * (Math.random() > 0.5 ? 1 : -1) : 0,
    axis,
    speed: rnd(0.0008, 0.003),
    brightness: rnd(0.4, 1.0),
    size: rnd(1.2, 3.2),
    phase: rnd(0, Math.PI * 2),
    artery,
    trail: [],
  }
}

export function NightGridStage() {
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
    let w = 0
    let h = 0

    const resize = () => {
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const COUNT = reduce ? 10 : coarse ? 28 : 60
    const particles: Particle[] = Array.from({ length: COUNT }, (_, i) => makeParticle(i, COUNT))

    let raf = 0
    const render = (t: number) => {
      const eP = easeInOut(clamp01(progress.current))
      const shimmer = reduce ? 0 : Math.sin(t / 900) * 0.018

      ctx.clearRect(0, 0, w, h)

      // 1 — cool diffuse glow: grows and warms slightly as grid organizes
      ctx.globalCompositeOperation = 'lighter'
      const glowAlpha = lerp(0.02, 0.09, eP) + shimmer * 0.25
      const glow = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, w * lerp(0.4, 0.75, eP))
      glow.addColorStop(0, `rgba(140,185,240,${glowAlpha})`)
      glow.addColorStop(0.5, `rgba(100,155,220,${glowAlpha * 0.45})`)
      glow.addColorStop(1, 'rgba(80,130,200,0)')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, w, h)

      // Amber artery glow (grows as eP→1)
      if (eP > 0.15) {
        const arteryAlpha = lerp(0, 0.12, (eP - 0.15) / 0.85)
        const arteryGlow = ctx.createLinearGradient(0, h * ARTERY_Y - h * 0.08, 0, h * ARTERY_Y + h * 0.08)
        arteryGlow.addColorStop(0, 'rgba(251,176,59,0)')
        arteryGlow.addColorStop(0.5, `rgba(251,176,59,${arteryAlpha})`)
        arteryGlow.addColorStop(1, 'rgba(251,176,59,0)')
        ctx.fillStyle = arteryGlow
        ctx.fillRect(0, 0, w, h)
      }

      // 2 — particles
      const boost = scrollVel.current
      particles.forEach((p) => {
        if (!reduce) {
          // At low eP, particles wander; at high eP they snap to grid axes
          const orderFactor = lerp(0.05, 1.0, eP)
          const drift = lerp(1.0, 0.0, eP) // erratic drift decreases as grid forms

          if (p.axis === 'h') {
            p.x += (p.vx + boost * 0.2) * (p.artery ? lerp(1.0, 2.2, eP) : orderFactor)
            p.y += Math.sin(p.phase + t * 0.0003) * 0.0004 * drift
          } else {
            p.y += (p.vy + boost * 0.15) * orderFactor
            p.x += Math.sin(p.phase + t * 0.0003) * 0.0004 * drift
          }
          p.phase += 0.008

          // Cursor repulsion (fine pointer only)
          if (pointer.current.active && !coarse) {
            const dx = p.x - pointer.current.x / w
            const dy = p.y - pointer.current.y / h
            const d2 = dx * dx + dy * dy
            if (d2 < 0.018 && d2 > 0) {
              const f = (0.018 - d2) * 2.5
              p.vx += dx * f * 0.1
              p.vy += dy * f * 0.1
            }
          }
          p.vx *= 0.98
          p.vy *= 0.98

          // Wrap
          if (p.x > 1.04) p.x = -0.04
          else if (p.x < -0.04) p.x = 1.04
          if (p.y > 1.04) p.y = -0.04
          else if (p.y < -0.04) p.y = 1.04

          // Trail — store up to 4 positions
          p.trail.unshift({ x: p.x, y: p.y })
          if (p.trail.length > 4) p.trail.pop()
        }

        const px = p.x * w
        const py = p.y * h
        const flicker = Math.sin(p.phase * 1.7 + t * 0.0012) * 0.15 + 0.85
        const a = p.brightness * flicker * lerp(0.3, 0.85, eP)
        const r = p.size * (0.7 + eP * 0.4)

        // Trail
        if (!reduce && p.trail.length > 1) {
          for (let i = 1; i < p.trail.length; i++) {
            const ta = a * (1 - i / p.trail.length) * 0.35
            const tr = r * (1 - i / p.trail.length) * 0.6
            if (p.artery) {
              ctx.fillStyle = `rgba(251,176,59,${ta})`
            } else {
              ctx.fillStyle = `rgba(180,215,255,${ta})`
            }
            ctx.beginPath()
            ctx.arc(p.trail[i].x * w, p.trail[i].y * h, Math.max(0.4, tr), 0, Math.PI * 2)
            ctx.fill()
          }
        }

        // Core glow
        const grad = ctx.createRadialGradient(px, py, 0, px, py, r * 2.2)
        if (p.artery && eP > 0.15) {
          const arteryStrength = (eP - 0.15) / 0.85
          grad.addColorStop(0, `rgba(255,215,100,${a * lerp(0.5, 1.0, arteryStrength)})`)
          grad.addColorStop(0.5, `rgba(251,176,59,${a * 0.4 * arteryStrength})`)
          grad.addColorStop(1, 'rgba(251,140,20,0)')
        } else {
          grad.addColorStop(0, `rgba(200,225,255,${a})`)
          grad.addColorStop(0.5, `rgba(150,195,240,${a * 0.4})`)
          grad.addColorStop(1, 'rgba(120,175,230,0)')
        }
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(px, py, r * 2.2, 0, Math.PI * 2)
        ctx.fill()

        // Bright core dot
        ctx.fillStyle = p.artery && eP > 0.3
          ? `rgba(255,235,180,${a * 0.9})`
          : `rgba(220,240,255,${a * 0.8})`
        ctx.beginPath()
        ctx.arc(px, py, Math.max(0.5, r * 0.35), 0, Math.PI * 2)
        ctx.fill()
      })
      scrollVel.current *= 0.9

      // 3 — vignette
      ctx.globalCompositeOperation = 'source-over'
      const vig = ctx.createRadialGradient(w / 2, h / 2, h * 0.28, w / 2, h / 2, h * 0.88)
      vig.addColorStop(0, 'rgba(0,0,0,0)')
      vig.addColorStop(1, 'rgba(0,0,0,0.62)')
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
      if (reduce) {
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(render)
      }
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
