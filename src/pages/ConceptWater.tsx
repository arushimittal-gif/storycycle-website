import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { DeepWaterStage } from '../components/concepts/DeepWaterStage'

// ─────────────────────────────────────────────────────────────
// Concept prototype: Deep Water. Scroll down = rise toward the light.
// WaterBackdrop: 3 AI-generated naturalistic water stills crossfade
//   as you scroll (deep → mid → surface).
// DeepWaterStage: transparent canvas interaction layer (bubbles +
//   cool diffuse brightening + vignette) over the backdrop.
// Standalone route, no nav/footer.
// ─────────────────────────────────────────────────────────────

const WATER_STILLS = {
  deep: 'https://d8j0ntlcm91z4.cloudfront.net/user_2vClvn2zrTg3LAscW9oOLax1XQN/hf_20260629_230708_b3fa28af-7934-43a2-a08b-1a0a15d1f428.png',
  mid: 'https://d8j0ntlcm91z4.cloudfront.net/user_2vClvn2zrTg3LAscW9oOLax1XQN/hf_20260629_230721_f5a3404d-d8fc-4038-8365-e84928083077.png',
  surface: 'https://d8j0ntlcm91z4.cloudfront.net/user_2vClvn2zrTg3LAscW9oOLax1XQN/hf_20260629_230730_6b759876-125b-46f8-bfb2-5f180abb487e.png',
}

// Scroll-driven crossfade: deep→mid (first half), mid→surface (second half).
// Direct DOM writes — no re-renders on scroll.
function WaterBackdrop() {
  const deepRef = useRef<HTMLImageElement>(null)
  const midRef = useRef<HTMLImageElement>(null)
  const surfaceRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const p = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0

      let deepOp: number, midOp: number, surfaceOp: number
      if (p < 0.5) {
        deepOp = 1 - p * 2
        midOp = p * 2
        surfaceOp = 0
      } else {
        deepOp = 0
        midOp = (1 - p) * 2
        surfaceOp = (p - 0.5) * 2
      }

      if (deepRef.current) deepRef.current.style.opacity = String(deepOp)
      if (midRef.current) midRef.current.style.opacity = String(midOp)
      if (surfaceRef.current) surfaceRef.current.style.opacity = String(surfaceOp)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const base: React.CSSProperties = {
    position: 'fixed', inset: 0, width: '100vw', height: '100vh',
    objectFit: 'cover', zIndex: 0,
  }

  return (
    <>
      <img ref={deepRef} src={WATER_STILLS.deep} alt="" aria-hidden style={{ ...base, opacity: 1 }} />
      <img ref={midRef} src={WATER_STILLS.mid} alt="" aria-hidden style={{ ...base, opacity: 0 }} />
      <img ref={surfaceRef} src={WATER_STILLS.surface} alt="" aria-hidden style={{ ...base, opacity: 0 }} />
    </>
  )
}

const BEATS: { eyebrow: string; line: string; cta?: boolean }[] = [
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

// Thin amber depth gauge — fills as you ascend. Direct DOM write, no re-render.
function DepthGauge() {
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

export function ConceptWater() {
  return (
    <div style={{ position: 'relative', background: '#05090a', minHeight: '100vh' }}>
      <WaterBackdrop />
      <DeepWaterStage />
      <DepthGauge />
      {/* prototype tag */}
      <div style={{ position: 'fixed', left: 20, top: 18, zIndex: 20, fontFamily: 'Montserrat, sans-serif', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>
        Concept · Deep Water <span style={{ color: 'rgba(255,255,255,0.25)' }}>prototype</span>
      </div>
      {BEATS.map((b, i) => (
        <Beat key={i} {...b} />
      ))}
    </div>
  )
}
