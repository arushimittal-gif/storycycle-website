import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, DepthOfField, Bloom } from '@react-three/postprocessing'
import { ScrollProvider } from './scrollCamera'

// ─────────────────────────────────────────────────────────────
// Shared scaffold for the WebGL concept trio (orbital / map / weave).
// Renders: fixed <Canvas> (scene + DoF + bloom), the 8 beat-copy
// reveals, an amber progress gauge, the prototype tag, and a
// concept switcher for side-by-side testing. Scenes plug into the
// <Canvas> slot and consume the scroll system from scrollCamera.tsx.
// ─────────────────────────────────────────────────────────────

// Shared copy — identical to ConceptWater / ConceptGrid.
export const BEATS: { eyebrow: string; line: string; cta?: boolean }[] = [
  { eyebrow: 'Hero', line: "Your pipeline is full.\nYour sales aren't converting." },
  { eyebrow: 'Diagnostic', line: "The spend is real.\nThe returns aren't." },
  { eyebrow: 'Phase 01 · Diagnose', line: 'Five business days. A senior strategist audits your commercial story.' },
  { eyebrow: 'Phase 02 · Align', line: 'One unified story. Built from the audit.' },
  { eyebrow: 'Phase 03 · Activate', line: 'Every channel, every team, aligned.' },
  { eyebrow: 'Phase 04 · Optimize', line: '60 and 90 days after activation, we come back.' },
  { eyebrow: 'Results', line: 'Documented results across five verticals.' },
  { eyebrow: 'Start', line: 'Break the cycle of slow.\nStart with a five-day diagnosis.', cta: true },
]

function Beat({ eyebrow, line, cta }: { eyebrow: string; line: string; cta?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setShown(true) },
      { threshold: 0.4 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <section className="relative min-h-screen flex items-center" style={{ zIndex: 10 }}>
      <div
        ref={ref}
        style={{
          maxWidth: 620,
          paddingLeft: 'clamp(24px, 7vw, 120px)',
          paddingRight: 24,
          opacity: shown ? 1 : 0,
          transform: shown ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 1.1s ease, transform 1.1s ease',
        }}
      >
        <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600, color: '#FBB03B', margin: '0 0 18px' }}>
          {eyebrow}
        </p>
        <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(2rem, 4.5vw, 3.75rem)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.02em', color: 'white', textTransform: 'uppercase', whiteSpace: 'pre-line', margin: 0, textShadow: '0 2px 30px rgba(0,0,0,0.6)' }}>
          {line}
        </h2>
        {cta && (
          <Link
            to="/fast-positioning-audit"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 32, background: '#FBB03B', color: '#25282A', padding: '16px 26px', fontFamily: 'Montserrat, sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', textDecoration: 'none' }}
          >
            Request Your Fast Positioning Audit <ArrowRight size={16} />
          </Link>
        )}
      </div>
    </section>
  )
}

// Amber progress gauge — fills as you scroll. Direct DOM write, no re-render.
function ProgressGauge() {
  const fillRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const p = scrollable > 0 ? window.scrollY / scrollable : 0
      if (fillRef.current) fillRef.current.style.height = `${Math.round(p * 100)}%`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div style={{ position: 'fixed', right: 28, top: '50%', transform: 'translateY(-50%)', height: '34vh', width: 2, background: 'rgba(255,255,255,0.12)', zIndex: 20, borderRadius: 2 }}>
      <div ref={fillRef} style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '0%', background: '#FBB03B', borderRadius: 2, transition: 'height 0.15s linear' }} />
    </div>
  )
}

const CONCEPTS = [
  { to: '/concept/pacific', label: 'Pacific NW' },
  { to: '/concept/weave', label: 'Thread' },
  { to: '/concept/orbital', label: 'Orbital' },
]

// Fixed corner nav to flip between the three prototypes for testing.
function ConceptSwitcher() {
  const { pathname } = useLocation()
  return (
    <div style={{ position: 'fixed', left: 20, bottom: 20, zIndex: 20, display: 'flex', gap: 6 }}>
      {CONCEPTS.map((c) => {
        const active = pathname === c.to
        return (
          <Link
            key={c.to}
            to={c.to}
            style={{
              fontFamily: 'Montserrat, sans-serif', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
              fontWeight: 700, textDecoration: 'none',
              padding: '7px 12px', borderRadius: 999,
              color: active ? '#25282A' : 'rgba(255,255,255,0.7)',
              background: active ? '#FBB03B' : 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {c.label}
          </Link>
        )
      })}
    </div>
  )
}

export function WebGLConceptShell({ scene, tag, dofFocus = 0.045, dofFocal = 0.025, dofBokeh = 2.2 }: { scene: ReactNode; tag: string; dofFocus?: number; dofFocal?: number; dofBokeh?: number }) {
  return (
    <div style={{ position: 'relative', background: '#0a0c0e', minHeight: '100vh' }}>
      {/* Fixed WebGL backdrop */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 1 }}>
        <Canvas
          dpr={[1, 2]}
          camera={{ fov: 55, position: [0, 0, 8], near: 0.1, far: 400 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          <ScrollProvider>
            {scene}
            <EffectComposer>
              <DepthOfField focusDistance={dofFocus} focalLength={dofFocal} bokehScale={dofBokeh} height={480} />
              <Bloom intensity={0.85} luminanceThreshold={0.55} luminanceSmoothing={0.3} mipmapBlur />
            </EffectComposer>
          </ScrollProvider>
        </Canvas>
      </div>

      <ProgressGauge />

      {/* prototype tag */}
      <div style={{ position: 'fixed', left: 20, top: 18, zIndex: 20, fontFamily: 'Montserrat, sans-serif', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>
        Concept · {tag} <span style={{ color: 'rgba(255,255,255,0.25)' }}>prototype</span>
      </div>

      {BEATS.map((b, i) => (
        <Beat key={i} {...b} />
      ))}

      <ConceptSwitcher />
    </div>
  )
}
