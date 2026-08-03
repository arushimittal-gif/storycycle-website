import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { NightGridStage } from '../components/concepts/NightGridStage'

// ─────────────────────────────────────────────────────────────
// Concept prototype: Night Grid. Scroll down = grid organizes.
// GridBackdrop: 3 AI city stills crossfade as you scroll
//   (isolated → organizing → connected).
// NightGridStage: transparent canvas interaction layer
//   (particles + amber artery + glow + vignette).
// Standalone route, no nav/footer.
// ─────────────────────────────────────────────────────────────

const GRID_STILLS = {
  isolated: 'https://d8j0ntlcm91z4.cloudfront.net/user_2vClvn2zrTg3LAscW9oOLax1XQN/hf_20260629_222643_518e0ec8-85be-40d4-b824-528c78264f72.png',
  organizing: 'https://d8j0ntlcm91z4.cloudfront.net/user_2vClvn2zrTg3LAscW9oOLax1XQN/hf_20260629_222646_e80bdb91-2478-41df-8b8c-c7c7991806bb.png',
  connected: 'https://d8j0ntlcm91z4.cloudfront.net/user_2vClvn2zrTg3LAscW9oOLax1XQN/hf_20260629_222648_cd97baa3-d004-430f-ba02-0f42b4a29660.png',
}

// Scroll-driven crossfade: isolated→organizing (first half), organizing→connected (second half).
// Direct DOM writes — no re-renders on scroll.
function GridBackdrop() {
  const isolatedRef = useRef<HTMLImageElement>(null)
  const organizingRef = useRef<HTMLImageElement>(null)
  const connectedRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const p = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0

      let isoOp: number, orgOp: number, conOp: number
      if (p < 0.5) {
        isoOp = 1 - p * 2
        orgOp = p * 2
        conOp = 0
      } else {
        isoOp = 0
        orgOp = (1 - p) * 2
        conOp = (p - 0.5) * 2
      }

      if (isolatedRef.current) isolatedRef.current.style.opacity = String(isoOp)
      if (organizingRef.current) organizingRef.current.style.opacity = String(orgOp)
      if (connectedRef.current) connectedRef.current.style.opacity = String(conOp)
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
      <img ref={isolatedRef} src={GRID_STILLS.isolated} alt="" aria-hidden style={{ ...base, opacity: 1 }} />
      <img ref={organizingRef} src={GRID_STILLS.organizing} alt="" aria-hidden style={{ ...base, opacity: 0 }} />
      <img ref={connectedRef} src={GRID_STILLS.connected} alt="" aria-hidden style={{ ...base, opacity: 0 }} />
    </>
  )
}

const BEATS: { eyebrow: string; line: string; cta?: boolean }[] = [
  { eyebrow: 'Signal', line: "Your pipeline is full.\nYour sales aren't converting." },
  { eyebrow: 'Noise', line: "The spend is real.\nThe returns aren't." },
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
        <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(2rem, 4.5vw, 3.75rem)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.02em', color: 'white', textTransform: 'uppercase', whiteSpace: 'pre-line', margin: 0, textShadow: '0 2px 30px rgba(0,0,0,0.7)' }}>
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

// Amber grid gauge — fills as the grid organizes. Direct DOM write.
function GridGauge() {
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
    <div style={{ position: 'fixed', right: 28, top: '50%', transform: 'translateY(-50%)', height: '34vh', width: 2, background: 'rgba(255,255,255,0.1)', zIndex: 20, borderRadius: 2 }}>
      <div ref={fillRef} style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '0%', background: '#FBB03B', borderRadius: 2, transition: 'height 0.15s linear' }} />
    </div>
  )
}

export function ConceptGrid() {
  return (
    <div style={{ position: 'relative', background: '#06080f', minHeight: '100vh' }}>
      <GridBackdrop />
      <NightGridStage />
      <GridGauge />
      {/* prototype tag */}
      <div style={{ position: 'fixed', left: 20, top: 18, zIndex: 20, fontFamily: 'Montserrat, sans-serif', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>
        Concept · Night Grid <span style={{ color: 'rgba(255,255,255,0.25)' }}>prototype</span>
      </div>
      {BEATS.map((b, i) => (
        <Beat key={i} {...b} />
      ))}
    </div>
  )
}
