import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Menu, Plus, X } from 'lucide-react'
import { COLORS } from '../lib/brand'

// ─────────────────────────────────────────────────────────────
// Concept prototype: Create Template — faithful recreation of
// the "Create · Agency & Design Studio" Framer template by
// Tamas Bodo, verified against the live demo
// (createstudio.framer.media) on 2026-07-18: near-black ground
// with off-white body sections, giant split-color display
// wordmark ("Create\Studio" → "Story\Cycle"), Fragment Mono
// "// 00.01°" coordinate micro-labels, live local-time clock,
// infinite marquee, duplicated-label text-roll hover buttons,
// count-up stat band with //001 indices, +-marked accordion,
// mono tech-tag rows on project cards. Mapped to StoryCycle
// brand per the Hydra-port precedent: charcoal #25282A (for
// #141414), amber #FBB03B (for #FF6041), warm off-white #F3F1EC
// (for #F2F2F2), Montserrat display (for Figtree), PT Mono (for
// Fragment Mono). The template's photography slots (flower-face
// hero collage, project photos) are replaced with graphical
// schematic/halftone panels (Andy 7/16 bar: static-first,
// graphical, no stock photography). Motion is the template's
// micro-interaction set only — hero stagger, marquee, count-ups,
// text-roll hovers, accordion, IO fade-ups; no scroll-scrub,
// no parallax, no pinning. Copy verbatim from the locked
// wireframe / storycycle-v5.vercel.app. Template's pricing,
// team, FAQ, and testimonial sections are dropped — no v5 copy
// exists for them and the locked-copy rule forbids inventing it.
// ECD round 2 (2026-07-18, Enrique-approved): three deliberate
// deviations from the template for Andy-bar fit — marquee rows
// settle once instead of looping, both live clocks cut, hero
// inverted so the USP headline leads and the split-color
// wordmark recedes to a secondary line.
// ─────────────────────────────────────────────────────────────

const FONT = 'Montserrat, ui-sans-serif, sans-serif'
const MONO = '"PT Mono", "Courier New", monospace'
const INK = COLORS.charcoal // #25282A (template #141414)
const AMBER = COLORS.amber // #FBB03B (template #FF6041)
const GROUND = '#F3F1EC' // template #F2F2F2
const INK_SOFT = 'rgba(37,40,42,0.72)'
const AMBER_DEEP = '#8A6116' // amber legible at mono-label size on the off-white ground

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=PT+Mono&display=swap');

/* hero load-in stagger (the one ambient moment) */
@keyframes crtFadeUp { from { opacity: 0; transform: translateY(26px); } to { opacity: 1; transform: translateY(0); } }
.crt-fade-1 { animation: crtFadeUp 0.8s cubic-bezier(0.2,0.6,0.2,1) 0.05s both; }
.crt-fade-2 { animation: crtFadeUp 0.8s cubic-bezier(0.2,0.6,0.2,1) 0.2s both; }
.crt-fade-3 { animation: crtFadeUp 0.8s cubic-bezier(0.2,0.6,0.2,1) 0.35s both; }
.crt-fade-4 { animation: crtFadeUp 0.8s cubic-bezier(0.2,0.6,0.2,1) 0.5s both; }

/* wordmark character stagger */
@keyframes crtChar { from { opacity: 0; transform: translateY(0.35em); } to { opacity: 1; transform: translateY(0); } }
.crt-char { display: inline-block; animation: crtChar 0.6s cubic-bezier(0.2,0.6,0.2,1) both; }

/* scroll-into-view reveals (one-shot IO, no scrub) */
.crt-reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.7s cubic-bezier(0.2,0.6,0.2,1), transform 0.7s cubic-bezier(0.2,0.6,0.2,1); }
.crt-reveal.crt-in { opacity: 1; transform: translateY(0); }

/* marquee rows settle once and rest (ECD round 2: no perpetual motion — static-first bar) */
@keyframes crtSettleL { from { transform: translateX(-64px); opacity: 0.3; } to { transform: translateX(0); opacity: 1; } }
@keyframes crtSettleR { from { transform: translateX(64px); opacity: 0.3; } to { transform: translateX(0); opacity: 1; } }
.crt-marquee-track { display: flex; width: max-content; animation: crtSettleL 1.1s cubic-bezier(0.2,0.6,0.2,1) both; }
.crt-marquee-track.crt-marquee-rev { animation-name: crtSettleR; }

/* duplicated-label text-roll buttons (template's SEE WORK / LET'S CHAT).
   Vertical padding lives on the rolled spans, not the container — overflow
   clips at the padding box, so container padding would leak the second label. */
.crt-roll { overflow: hidden; }
.crt-roll-inner { display: flex; flex-direction: column; transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); }
.crt-roll-inner > span { display: block; padding: 14px 0; line-height: 16px; height: 44px; box-sizing: border-box; white-space: nowrap; }
.crt-roll:hover .crt-roll-inner { transform: translateY(-50%); }

/* accordion rows */
.crt-acc-body { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.45s cubic-bezier(0.4,0,0.2,1); }
.crt-acc-body.crt-open { grid-template-rows: 1fr; }
.crt-acc-body > div { overflow: hidden; }
.crt-acc-plus { transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); }
.crt-acc-plus.crt-open { transform: rotate(45deg); }
.crt-acc-row:hover { background: rgba(37,40,42,0.03); }

/* card + row hovers */
a.crt-card:hover .crt-card-ico { background: ${AMBER}; color: ${INK}; }
.crt-card-ico { transition: background 0.25s ease, color 0.25s ease; }
a.crt-row:hover { background: rgba(37,40,42,0.03); }

.crt-burger { display: none !important; }
@media (max-width: 940px) {
  .crt-links { display: none !important; }
  .crt-burger { display: inline-flex !important; }
  .crt-hero-side { display: none !important; }
}
@media (max-width: 560px) {
  .crt-navcta { display: none !important; }
  .crt-hero-meta { flex-direction: column; align-items: flex-start !important; gap: 18px !important; }
}
@media (max-width: 700px) {
  .crt-ind-row { grid-template-columns: 1fr !important; }
  .crt-ind-right { text-align: left !important; }
  .crt-acc-head { grid-template-columns: 1fr 44px !important; }
  .crt-acc-tag { grid-column: 1 / -1; }
}

@media (prefers-reduced-motion: reduce) {
  .crt-fade-1, .crt-fade-2, .crt-fade-3, .crt-fade-4, .crt-char { animation: none; }
  .crt-marquee-track { animation: none; }
  .crt-reveal { opacity: 1; transform: none; transition: none; }
  .crt-roll-inner, .crt-acc-body, .crt-acc-plus { transition: none; }
}
`

const REDUCED = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// PT Mono coordinate micro-label — the template's signature "// 00.01°"
function Coord({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <span aria-hidden style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '0.04em', color: light ? 'rgba(255,255,255,0.6)' : 'rgba(37,40,42,0.6)' }}>
      {children}
    </span>
  )
}

// Mono uppercase section eyebrow
function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p style={{ fontFamily: MONO, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.08em', color: light ? AMBER : INK, margin: '0 0 22px' }}>
      {children}
    </p>
  )
}

// Text-roll button (duplicated label slides up on hover)
function RollLink({
  to,
  children,
  variant = 'solid',
}: {
  to: string
  children: string
  variant?: 'solid' | 'line' | 'lineLight'
}) {
  const solid = variant === 'solid'
  const light = variant === 'lineLight'
  return (
    <Link
      to={to}
      className="crt-roll"
      style={{
        display: 'inline-block',
        fontFamily: MONO,
        fontSize: 13,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        textDecoration: 'none',
        background: solid ? AMBER : 'transparent',
        color: solid ? INK : light ? '#fff' : INK,
        border: solid ? `1px solid ${AMBER}` : `1px solid ${light ? 'rgba(255,255,255,0.4)' : 'rgba(37,40,42,0.4)'}`,
        borderRadius: 4,
        padding: '0 22px',
        height: 46,
        boxSizing: 'border-box',
      }}
    >
      <span className="crt-roll-inner">
        <span>{children}</span>
        <span aria-hidden>{children}</span>
      </span>
    </Link>
  )
}

// One-shot IntersectionObserver reveal wrapper
function Reveal({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (REDUCED()) {
      el.classList.add('crt-in')
      return
    }
    const io = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          el.classList.add('crt-in')
          io.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className="crt-reveal" style={{ transitionDelay: `${delay}ms`, ...style }}>
      {children}
    </div>
  )
}

// Count-up stat — fires once on scroll-into-view (template's performance band)
function CountUp({ prefix = '', value, decimals = 0, suffix = '' }: { prefix?: string; value: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(REDUCED() ? value : 0)
  useEffect(() => {
    const el = ref.current
    if (!el || REDUCED()) return
    let raf = 0
    const io = new IntersectionObserver(
      entries => {
        if (!entries[0].isIntersecting) return
        io.disconnect()
        const t0 = performance.now()
        const dur = 1400
        const step = (t: number) => {
          const p = Math.min((t - t0) / dur, 1)
          const eased = 1 - Math.pow(1 - p, 3)
          setDisplay(value * eased)
          if (p < 1) raf = requestAnimationFrame(step)
        }
        raf = requestAnimationFrame(step)
      },
      { threshold: 0.4 }
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [value])
  return (
    <span ref={ref}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  )
}

// The split-color wordmark: Story\Cycle (template's Create\Studio) — receded
// to a secondary line per ECD round 2 (USP leads the hero, not the brand)
function Wordmark() {
  const chars = [
    ...'Story'.split('').map(c => ({ c, color: AMBER })),
    ...'Cycle'.split('').map(c => ({ c, color: '#fff' })),
  ]
  return (
    <p
      aria-label="StoryCycle"
      style={{
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: 'clamp(1.5rem, 3.4vw, 2.8rem)',
        lineHeight: 1,
        letterSpacing: '-0.02em',
        margin: 0,
        whiteSpace: 'nowrap',
      }}
    >
      {chars.map((ch, i) => (
        <span key={i} aria-hidden className="crt-char" style={{ color: ch.color, animationDelay: `${0.25 + i * 0.045}s` }}>
          {ch.c}
        </span>
      ))}
    </p>
  )
}

// Graphical hero backdrop (replaces the template's flower-face photo —
// Andy 7/16 bar): the four-phase cycle as faint orbital line-work.
function CycleSchematic() {
  const phases = ['01', '02', '03', '04']
  return (
    <svg aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid slice" viewBox="0 0 1280 800">
      <circle cx="640" cy="400" r="260" fill="none" stroke="rgba(251,176,59,0.14)" strokeWidth="1" />
      <circle cx="640" cy="400" r="380" fill="none" stroke="rgba(251,176,59,0.07)" strokeWidth="1" />
      {phases.map((p, i) => {
        const a = (i / phases.length) * Math.PI * 2 - Math.PI / 2
        const x = 640 + Math.cos(a) * 260
        const y = 400 + Math.sin(a) * 260
        return (
          <g key={p}>
            <circle cx={x} cy={y} r="5" fill="rgba(251,176,59,0.4)" />
            <circle cx={x} cy={y} r="14" fill="none" stroke="rgba(251,176,59,0.2)" strokeWidth="1" />
            <text x={x + 24} y={y + 4} fontFamily={MONO} fontSize="12" fill="rgba(251,176,59,0.35)">
              {`// ${p}`}
            </text>
          </g>
        )
      })}
      {/* faint halftone field, lower third */}
      {Array.from({ length: 10 }, (_, r) =>
        Array.from({ length: 32 }, (_, c) => (
          <circle key={`${r}-${c}`} cx={20 + c * 40} cy={580 + r * 24} r={Math.max(0.4, 1.6 - r * 0.15)} fill="rgba(255,255,255,0.1)" />
        ))
      )}
    </svg>
  )
}

// Converging line-work panel for the industry cards (graphical image slot)
function CardLines({ seed = 0 }: { seed?: number }) {
  const pts: [number, number][] = [
    [0, 40 + seed * 30],
    [0, 190],
    [0, 340 - seed * 20],
    [120 + seed * 40, 0],
    [280 - seed * 30, 0],
  ]
  return (
    <svg aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid slice" viewBox="0 0 400 400">
      {pts.map(([x, y], i) => (
        <line key={i} x1={x} y1={y} x2="330" y2="330" stroke="rgba(251,176,59,0.35)" strokeWidth="1" />
      ))}
      <circle cx="330" cy="330" r="5" fill="rgba(251,176,59,0.7)" />
      <circle cx="330" cy="330" r="14" fill="none" stroke="rgba(251,176,59,0.45)" strokeWidth="1" />
    </svg>
  )
}

// Halftone dot panel (case-study feature graphical slot)
function Halftone() {
  return (
    <svg aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid slice" viewBox="0 0 600 400">
      {Array.from({ length: 14 }, (_, r) =>
        Array.from({ length: 22 }, (_, c) => (
          <circle key={`${r}-${c}`} cx={16 + c * 28} cy={16 + r * 28} r={Math.max(0.5, 3.4 - (r + c) * 0.11)} fill="rgba(251,176,59,0.28)" />
        ))
      )}
    </svg>
  )
}

const NAV = [
  ['How It Works', '/how-it-works'],
  ["Who It's For", '/who-its-for'],
  ['Results', '/results'],
  ['Insights', '/insights'],
  ['About', '/about'],
] as const

const PHASES = [
  {
    tag: 'PHASE 01 · DIAGNOSE',
    title: 'Fast Positioning Audit',
    body: '5 business days. A senior strategist runs structured discovery, audits your commercial story, delivers a written diagnosis with named differentiators and three priority interventions.',
  },
  {
    tag: 'PHASE 02 · ALIGN',
    title: 'Your Unified Story',
    body: '4–6 weeks. Leadership alignment. One unified story built from the audit — across every channel and team.',
  },
  {
    tag: 'PHASE 03 · ACTIVATE',
    title: 'Activate Across Every Channel',
    body: '8–12 weeks. Every channel, every team, aligned. Website, sales enablement, content, paid acquisition — synchronized.',
  },
  {
    tag: 'PHASE 04 · OPTIMIZE',
    title: '60/90-Day Audits',
    body: 'The market moves. The competitive frame shifts. We audit what got into the wild and tune it.',
  },
]

// v5 industry notes re-set as the template's mono tag rows (same words, no new
// copy). Category lists become chips; claim sentences stay body lines — mixing
// registers in the chip container mislabels a claim as a taxonomy (ECD P1-3).
const INDUSTRIES: { name: string; band: string; tags: string[]; note: string; to: string }[] = [
  { name: 'Professional Services', band: '$25M–$250M', tags: ['ACCOUNTING', 'CONSULTING', 'FINANCIAL ADVISORY', 'STAFFING'], note: '', to: '/who-its-for/professional-services' },
  { name: 'Home Services & Trades', band: '$25M–$250M', tags: ['HVAC', 'CONTRACTORS', 'LUXURY RESIDENTIAL'], note: '', to: '/who-its-for/home-services-trades' },
  { name: 'Law Firms', band: '$25M–$250M+', tags: [], note: 'Misaligned messaging is a tax on the firm.', to: '/who-its-for/law-firms' },
  { name: 'PE Operating Partners', band: '$100M–$5B AUM', tags: [], note: 'Portfolio value creation.', to: '/who-its-for/private-equity' },
  { name: 'Mission-Driven', band: '', tags: ['UNIVERSITIES', 'COLLEGES', 'NONPROFITS', 'FOUNDATIONS'], note: '', to: '/who-its-for/mission-driven' },
]

const STATS: { prefix: string; value: number; decimals: number; suffix: string; label: string }[] = [
  { prefix: '$', value: 2.8, decimals: 1, suffix: 'M+', label: 'PE PORTFOLIO · YEAR-1 REVENUE LIFT' },
  { prefix: '+', value: 40, decimals: 0, suffix: '%', label: 'HOME SERVICES · QUALIFIED LEADS' },
  { prefix: '+', value: 25, decimals: 0, suffix: '%', label: 'HOME SERVICES · CLOSE RATE' },
  { prefix: '+', value: 35, decimals: 0, suffix: '%', label: 'PE PORTFOLIO · AVG QUALIFIED LEADS' },
  { prefix: '+', value: 22, decimals: 0, suffix: '%', label: 'PE PORTFOLIO · SALES CYCLE COMPRESSION' },
  { prefix: '+', value: 18, decimals: 0, suffix: '%', label: 'HOME SERVICES · REVENUE PER CUSTOMER' },
]

function MarqueeRow({ text, reverse = false, outline = false }: { text: string; reverse?: boolean; outline?: boolean }) {
  const cell = (
    <span
      style={{
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: 'clamp(2.6rem, 7vw, 6rem)',
        letterSpacing: '-0.02em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        padding: '0 28px',
        // ghost fill, not -webkit-text-stroke: Montserrat 800's overlapping
        // glyph contours render stray construction lines when stroked
        color: outline ? 'rgba(37,40,42,0.45)' : INK,
      }}
    >
      {text} <span style={{ color: AMBER, WebkitTextStroke: '0px' }}>·</span>
    </span>
  )
  // content duplicated so translateX(-50%) loops seamlessly
  const half = (
    <div style={{ display: 'flex' }}>
      {cell}
      {cell}
      {cell}
    </div>
  )
  return (
    // decorative duplication — the full tagline is exposed to AT once, statically, by the parent section
    <div aria-hidden style={{ overflow: 'hidden', padding: '10px 0' }}>
      <div className={`crt-marquee-track${reverse ? ' crt-marquee-rev' : ''}`}>
        {half}
        {half}
      </div>
    </div>
  )
}

export function ConceptCreateTemplate() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openPhase, setOpenPhase] = useState<number | null>(0)

  return (
    <div style={{ background: GROUND, minHeight: '100vh' }}>
      <style>{CSS}</style>

      {/* prototype tag */}
      <div style={{ position: 'fixed', left: '50%', transform: 'translateX(-50%)', bottom: 10, zIndex: 40, fontFamily: MONO, fontSize: 10, textTransform: 'uppercase', color: 'rgba(37,40,42,0.4)', mixBlendMode: 'difference' }}>
        Concept · Create Template
      </div>

      {/* ── Nav: slim dark bar, mono links, amber CTA ── */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 18,
          background: 'rgba(37,40,42,0.92)',
          backdropFilter: 'blur(8px)',
          padding: '16px clamp(18px, 3vw, 40px)',
        }}
      >
        <Link to="/" style={{ fontFamily: FONT, fontWeight: 800, fontSize: 17, letterSpacing: '0.02em', color: AMBER, textDecoration: 'none', whiteSpace: 'nowrap' }}>
          STORYCYCLE<sup style={{ fontSize: 8 }}>™</sup>
        </Link>
        <nav className="crt-links" style={{ display: 'flex', gap: 26 }}>
          {NAV.map(([label, to]) => (
            <Link key={to} to={to} style={{ fontFamily: MONO, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.85)', textDecoration: 'none', whiteSpace: 'nowrap' }}>
              {label}
            </Link>
          ))}
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="crt-navcta">
            <RollLink to="/fast-positioning-audit">Request an Audit</RollLink>
          </span>
          <button
            className="crt-burger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            style={{ alignItems: 'center', justifyContent: 'center', width: 38, height: 38, border: '1px solid rgba(255,255,255,0.25)', borderRadius: 6, background: 'transparent', color: '#fff', cursor: 'pointer' }}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        {menuOpen && (
          <nav style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: INK, padding: '18px clamp(18px, 3vw, 40px) 26px', display: 'flex', flexDirection: 'column', gap: 16, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            {NAV.map(([label, to]) => (
              <Link key={to} to={to} onClick={() => setMenuOpen(false)} style={{ fontFamily: MONO, fontSize: 14, textTransform: 'uppercase', color: '#fff', textDecoration: 'none' }}>
                {label}
              </Link>
            ))}
            <Link to="/fast-positioning-audit" onClick={() => setMenuOpen(false)} style={{ fontFamily: MONO, fontSize: 14, textTransform: 'uppercase', color: AMBER, textDecoration: 'none' }}>
              Request an Audit
            </Link>
          </nav>
        )}
      </header>

      {/* ── Hero: full-viewport charcoal, coordinate labels, giant wordmark, clock ── */}
      <section style={{ position: 'relative', overflow: 'hidden', background: INK, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 'clamp(120px, 16vh, 180px) clamp(18px, 3.5vw, 48px) clamp(28px, 4vh, 44px)' }}>
        <CycleSchematic />

        {/* top annotation row: receded wordmark left, eyebrow right (ECD round 2:
            USP leads the hero; the name-in-lights slot now carries the promise) */}
        <div className="crt-fade-1" style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24, marginBottom: 'auto' }}>
          <div>
            <Coord light>{'// 00.01°'}</Coord>
            <div style={{ marginTop: 12 }}>
              <Wordmark />
            </div>
          </div>
          <div className="crt-hero-side" style={{ textAlign: 'right' }}>
            <Coord light>{'// 00.02°'}</Coord>
            <p style={{ fontFamily: MONO, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', lineHeight: 1.7, color: AMBER, margin: '10px 0 0' }}>
              The story underneath
              <br />
              your pipeline
            </p>
          </div>
        </div>

        {/* the USP, largest element above the fold */}
        <div className="crt-fade-2" style={{ position: 'relative', zIndex: 2, margin: '36px 0 26px' }}>
          <Coord light>{'// 00.03°'}</Coord>
          <h1
            style={{
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: 'clamp(2.2rem, 6.8vw, 5.8rem)',
              lineHeight: 1.02,
              letterSpacing: '-0.025em',
              textTransform: 'uppercase',
              margin: '14px 0 0',
              maxWidth: 1200,
            }}
          >
            <span style={{ color: '#fff' }}>Your pipeline is full.</span>
            <br />
            <span style={{ color: AMBER }}>Your sales aren't converting.</span>
          </h1>
        </div>

        {/* supporting line */}
        <p className="crt-fade-3" style={{ position: 'relative', zIndex: 2, fontFamily: FONT, fontSize: 'clamp(1rem, 1.5vw, 1.2rem)', fontWeight: 500, lineHeight: 1.5, color: 'rgba(255,255,255,0.85)', margin: '0 0 38px', maxWidth: 560 }}>
          StoryCycle fixes it at the system level — one commercial narrative, operationalized across every channel and team.
        </p>

        {/* bottom meta row: CTAs (clock cut per ECD round 2) */}
        <div className="crt-fade-4 crt-hero-meta" style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <RollLink to="/fast-positioning-audit">Request Your Fast Positioning Audit</RollLink>
            <RollLink to="/how-it-works" variant="lineLight">
              How It Works
            </RollLink>
          </div>
          <Coord light>{'// 00.04°'}</Coord>
        </div>
      </section>

      {/* ── Marquee: the stacked-word block as opposing tickers ── */}
      <section style={{ padding: 'clamp(56px, 8vw, 100px) 0 clamp(28px, 4vw, 50px)', borderBottom: '1px solid rgba(37,40,42,0.12)' }}>
        {/* full tagline, once, for assistive tech — the marquee rows are decorative */}
        <p style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)', whiteSpace: 'nowrap', margin: -1 }}>
          It's not your marketing. It's the story underneath it.
        </p>
        <MarqueeRow text="It's not your marketing." />
        <MarqueeRow text="It's the story underneath it." reverse outline />
      </section>

      {/* ── Intro editorial ── */}
      <section style={{ padding: 'clamp(80px, 10vw, 140px) clamp(18px, 3.5vw, 48px)', maxWidth: 1280, margin: '0 auto' }}>
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 26 }}>
            <Eyebrow>Introduction</Eyebrow>
            <Coord>{'// 01.00°'}</Coord>
          </div>
          <p style={{ fontFamily: FONT, fontWeight: 600, fontSize: 'clamp(1.5rem, 3.2vw, 2.6rem)', lineHeight: 1.25, letterSpacing: '-0.015em', color: INK, margin: '0 0 22px', maxWidth: 900 }}>
            Marketing spend goes up. Pipeline volume goes up. Conversion stays flat. Buyers see five versions of you and pick the one easiest to commoditize.
          </p>
          <p style={{ fontFamily: FONT, fontSize: 17, lineHeight: 1.65, color: INK_SOFT, margin: 0, maxWidth: 680 }}>
            StoryCycle is the operating system that fixes this. Not a campaign, not a rebrand. A unified commercial narrative, operationalized across every channel and team, measured against pipeline conversion.
          </p>
        </Reveal>
      </section>

      {/* ── Industries: template's project cards w/ mono tag rows ── */}
      <section style={{ padding: '0 clamp(18px, 3.5vw, 48px) clamp(80px, 10vw, 140px)', maxWidth: 1280, margin: '0 auto' }}>
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 12 }}>
            <Eyebrow>Who It's For</Eyebrow>
            <Coord>{'// 02.00°'}</Coord>
          </div>
          <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 'clamp(2rem, 4.6vw, 3.8rem)', lineHeight: 1.05, letterSpacing: '-0.02em', textTransform: 'uppercase', color: INK, margin: '0 0 14px' }}>
            Different industries.
            <br />
            Same broken story.
          </h2>
          <p style={{ fontFamily: FONT, fontSize: 16, lineHeight: 1.6, color: INK_SOFT, margin: '0 0 48px' }}>Different categories. Same root cause.</p>
        </Reveal>
        <div style={{ display: 'grid', gap: 0 }}>
          {INDUSTRIES.map((ind, i) => (
            <Reveal key={ind.name} delay={Math.min(i * 60, 180)}>
              <Link
                to={ind.to}
                className="crt-row crt-ind-row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(180px, 1.1fr) 2fr auto',
                  alignItems: 'center',
                  gap: 'clamp(16px, 3vw, 40px)',
                  padding: '30px 8px',
                  borderTop: '1px solid rgba(37,40,42,0.14)',
                  borderBottom: i === INDUSTRIES.length - 1 ? '1px solid rgba(37,40,42,0.14)' : 'none',
                  textDecoration: 'none',
                }}
              >
                <div style={{ position: 'relative', minHeight: 96, borderRadius: 8, overflow: 'hidden', background: INK }}>
                  <CardLines seed={i} />
                  <span style={{ position: 'absolute', left: 12, bottom: 10, fontFamily: MONO, fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>{`//00${i + 1}`}</span>
                </div>
                <div>
                  <p style={{ fontFamily: FONT, fontWeight: 700, fontSize: 'clamp(1.3rem, 2.6vw, 2rem)', letterSpacing: '-0.01em', color: INK, margin: '0 0 10px' }}>{ind.name}</p>
                  {ind.tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {ind.tags.map(t => (
                        <span key={t} style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.04em', color: INK_SOFT, border: '1px solid rgba(37,40,42,0.25)', borderRadius: 3, padding: '4px 8px' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  {ind.note && (
                    <p style={{ fontFamily: FONT, fontSize: 15, lineHeight: 1.5, color: INK_SOFT, margin: 0, maxWidth: 480 }}>{ind.note}</p>
                  )}
                </div>
                <div className="crt-ind-right" style={{ textAlign: 'right' }}>
                  {ind.band && (
                    <p style={{ fontFamily: MONO, fontSize: 12, color: INK_SOFT, margin: '0 0 10px' }}>{ind.band}</p>
                  )}
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: MONO, fontSize: 12, textTransform: 'uppercase', color: INK }}>
                    Learn More <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Performance: count-up stat band with //00X indices ── */}
      <section style={{ background: INK, padding: 'clamp(80px, 10vw, 140px) clamp(18px, 3.5vw, 48px)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <Reveal>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 12 }}>
              <Eyebrow light>Performance</Eyebrow>
              <Coord light>{'// 03.00°'}</Coord>
            </div>
            <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 'clamp(2rem, 4.6vw, 3.8rem)', lineHeight: 1.05, letterSpacing: '-0.02em', textTransform: 'uppercase', color: '#fff', margin: '0 0 56px' }}>
              Documented across
              <br />
              five verticals.
            </h2>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 0 }}>
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={Math.min(i * 70, 210)}>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.14)', padding: '28px 18px 34px 8px' }}>
                  <p style={{ fontFamily: MONO, fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: '0 0 16px' }}>{`//00${i + 1}`}</p>
                  <p style={{ fontFamily: FONT, fontWeight: 800, fontSize: 'clamp(2.8rem, 5vw, 4.4rem)', letterSpacing: '-0.02em', color: AMBER, margin: '0 0 10px' }}>
                    <CountUp prefix={s.prefix} value={s.value} decimals={s.decimals} suffix={s.suffix} />
                  </p>
                  <p style={{ fontFamily: MONO, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.65)', margin: 0 }}>{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Four phases: template's + accordion ── */}
      <section style={{ padding: 'clamp(80px, 10vw, 140px) clamp(18px, 3.5vw, 48px)', maxWidth: 1280, margin: '0 auto' }}>
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 12 }}>
            <Eyebrow>How It Works</Eyebrow>
            <Coord>{'// 04.00°'}</Coord>
          </div>
          <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 'clamp(2rem, 4.6vw, 3.8rem)', lineHeight: 1.05, letterSpacing: '-0.02em', textTransform: 'uppercase', color: INK, margin: '0 0 14px' }}>
            Four phases.
            <br />
            One operating system.
          </h2>
          <p style={{ fontFamily: FONT, fontSize: 16, lineHeight: 1.6, color: INK_SOFT, margin: '0 0 48px', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.02em' }}>
            Stop improvising. Start operating.
          </p>
        </Reveal>
        <div>
          {PHASES.map((p, i) => {
            const open = openPhase === i
            return (
              <Reveal key={p.tag} delay={Math.min(i * 60, 180)}>
                <div className="crt-acc-row" style={{ borderTop: '1px solid rgba(37,40,42,0.14)', borderBottom: i === PHASES.length - 1 ? '1px solid rgba(37,40,42,0.14)' : 'none' }}>
                  <button
                    onClick={() => setOpenPhase(open ? null : i)}
                    aria-expanded={open}
                    className="crt-acc-head"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'minmax(140px, 220px) 1fr auto',
                      alignItems: 'center',
                      gap: 'clamp(14px, 3vw, 40px)',
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      padding: '26px 8px',
                    }}
                  >
                    <span className="crt-acc-tag" style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '0.06em', color: AMBER_DEEP }}>{p.tag}</span>
                    <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 'clamp(1.25rem, 2.4vw, 1.9rem)', letterSpacing: '-0.01em', color: INK }}>{p.title}</span>
                    <span
                      className={`crt-acc-plus${open ? ' crt-open' : ''}`}
                      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, borderRadius: '50%', border: '1px solid rgba(37,40,42,0.3)', color: INK }}
                    >
                      <Plus size={17} />
                    </span>
                  </button>
                  <div className={`crt-acc-body${open ? ' crt-open' : ''}`}>
                    <div>
                      <p style={{ fontFamily: FONT, fontSize: 16, lineHeight: 1.65, color: INK_SOFT, margin: 0, padding: '0 8px 30px', maxWidth: 640 }}>{p.body}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
        <Reveal>
          <p style={{ fontFamily: MONO, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em', color: INK_SOFT, marginTop: 30 }}>
            One senior strategist, start to finish. No handoffs.
          </p>
        </Reveal>
      </section>

      {/* ── Featured case study: dark band (template's Blackwell Motors slot) ── */}
      <section style={{ padding: '0 clamp(18px, 3.5vw, 48px) clamp(80px, 10vw, 140px)', maxWidth: 1280, margin: '0 auto' }}>
        <Reveal>
          <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 12, background: INK, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, padding: 'clamp(36px, 5vw, 72px)' }}>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <p style={{ fontFamily: MONO, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.08em', color: AMBER, margin: '0 0 22px' }}>Case Study · Harth Builders</p>
              <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 'clamp(1.8rem, 3.6vw, 3rem)', lineHeight: 1.08, letterSpacing: '-0.02em', textTransform: 'uppercase', color: '#fff', margin: '0 0 18px' }}>
                Selling like a commodity.
                <br />
                Despite exceptional work.
              </h2>
              <p style={{ fontFamily: FONT, fontSize: 16, lineHeight: 1.65, color: 'rgba(255,255,255,0.75)', margin: '0 0 32px', maxWidth: 520 }}>
                Harth Builders, luxury residential design-build on Philadelphia's Main Line. A story that wasn't reaching the buyers it deserved.
              </p>
              <RollLink to="/results/harth-builders">Read the Harth Case Study</RollLink>
            </div>
            <div style={{ position: 'relative', minHeight: 260, borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.12)' }}>
              <Halftone />
              <span style={{ position: 'absolute', right: 14, bottom: 12, fontFamily: MONO, fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{'\\\\2026'}</span>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── The Spread: statement + node schematic (why-us slot) ── */}
      <section style={{ padding: '0 clamp(18px, 3.5vw, 48px) clamp(80px, 10vw, 140px)', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'clamp(36px, 6vw, 80px)', alignItems: 'center' }}>
          <Reveal>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 22 }}>
              <Eyebrow>The Spread</Eyebrow>
              <Coord>{'// 05.00°'}</Coord>
            </div>
            <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 'clamp(1.8rem, 3.6vw, 3rem)', lineHeight: 1.08, letterSpacing: '-0.02em', textTransform: 'uppercase', color: INK, margin: '0 0 18px' }}>
              One story. Every channel.
              <br />
              More qualified leads.
            </h2>
            <p style={{ fontFamily: FONT, fontSize: 16, lineHeight: 1.65, color: INK_SOFT, margin: '0 0 12px', maxWidth: 520 }}>
              StoryCycle puts one unified story to work across every team and touchpoint — simultaneously. Not a campaign. An operating system.
            </p>
            <p style={{ fontFamily: FONT, fontSize: 16, lineHeight: 1.65, color: INK_SOFT, margin: 0, maxWidth: 520 }}>
              When these three tell the same story, pipeline converts. When they don't, it leaks.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <svg viewBox="0 0 520 400" style={{ width: '100%', height: 'auto' }} aria-label="One story feeding Sales, Marketing, and Leadership">
              {[
                [260, 90],
                [110, 300],
                [410, 300],
              ].map(([x, y], i) => (
                <line key={i} x1="260" y1="205" x2={x} y2={y} stroke="rgba(37,40,42,0.35)" strokeWidth="1.2" />
              ))}
              <circle cx="260" cy="205" r="46" fill={AMBER} />
              <text x="260" y="209" textAnchor="middle" fontFamily={MONO} fontSize="11" fill={INK}>
                ONE STORY
              </text>
              {[
                ['SALES', 260, 90],
                ['MARKETING', 110, 300],
                ['LEADERSHIP', 410, 300],
              ].map(([label, x, y]) => (
                <g key={label as string}>
                  <circle cx={x as number} cy={y as number} r="8" fill={AMBER} />
                  <circle cx={x as number} cy={y as number} r="16" fill="none" stroke="rgba(37,40,42,0.25)" strokeWidth="1" />
                  <text x={x as number} y={(y as number) + 38} textAnchor="middle" fontFamily={MONO} fontSize="12" fill={INK}>
                    {label}
                  </text>
                </g>
              ))}
            </svg>
          </Reveal>
        </div>
      </section>

      {/* ── Insights ── */}
      <section style={{ padding: '0 clamp(18px, 3.5vw, 48px) clamp(80px, 10vw, 140px)', maxWidth: 1280, margin: '0 auto' }}>
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 12 }}>
            <Eyebrow>Insights</Eyebrow>
            <Coord>{'// 06.00°'}</Coord>
          </div>
          <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 'clamp(2rem, 4.6vw, 3.8rem)', lineHeight: 1.05, letterSpacing: '-0.02em', textTransform: 'uppercase', color: INK, margin: '0 0 44px' }}>
            Written for the operator.
            <br />
            Not the agency.
          </h2>
          {/* index rows per the Hydra-port ECD fix — placeholder titles, consistent with the sitewide placeholder state */}
          <div style={{ borderTop: '1px solid rgba(37,40,42,0.14)', marginBottom: 32 }}>
            {['01', '02', '03'].map(n => (
              <Link
                key={n}
                to="/insights"
                className="crt-row"
                style={{ display: 'grid', gridTemplateColumns: 'minmax(40px, 60px) 1fr auto', alignItems: 'center', gap: 20, padding: '22px 8px', borderBottom: '1px solid rgba(37,40,42,0.14)', textDecoration: 'none' }}
              >
                <span style={{ fontFamily: MONO, fontSize: 12, color: 'rgba(37,40,42,0.6)' }}>{`//0${n.slice(1)}`}</span>
                <span style={{ fontFamily: FONT, fontSize: 'clamp(1.05rem, 2vw, 1.4rem)', fontWeight: 600, color: INK }}>Article {n}</span>
                <span style={{ fontFamily: MONO, fontSize: 12, textTransform: 'uppercase', color: INK, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  Read on LinkedIn <ArrowUpRight size={14} />
                </span>
              </Link>
            ))}
          </div>
          <RollLink to="/insights" variant="line">
            See All 13 Articles
          </RollLink>
        </Reveal>
      </section>

      {/* ── Final CTA + footer: dark, giant type, live clock ── */}
      <footer style={{ background: INK, padding: 'clamp(90px, 12vw, 160px) clamp(18px, 3.5vw, 48px) 36px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <Reveal>
            <p style={{ fontFamily: MONO, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.08em', color: AMBER, margin: '0 0 26px' }}>The Fast Positioning Audit</p>
            <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 'clamp(2.2rem, 6vw, 5rem)', lineHeight: 1.02, letterSpacing: '-0.025em', textTransform: 'uppercase', color: '#fff', margin: '0 0 22px', maxWidth: 1080 }}>
              Break the cycle of slow.
              <br />
              <span style={{ color: AMBER }}>Start with a five-day diagnosis.</span>
            </h2>
            <p style={{ fontFamily: FONT, fontSize: 16, lineHeight: 1.6, color: 'rgba(255,255,255,0.7)', margin: '0 0 36px', maxWidth: 560 }}>
              The Fast Positioning Audit is valuable whether or not you proceed. Most clients say so.
            </p>
            <RollLink to="/fast-positioning-audit">Request Your Fast Positioning Audit</RollLink>
          </Reveal>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(28px, 5vw, 64px)', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.12)', marginTop: 'clamp(56px, 8vw, 100px)', paddingTop: 40 }}>
            <div>
              <p style={{ fontFamily: MONO, fontSize: 12, textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', margin: '0 0 16px' }}>{'// Pages'}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {NAV.map(([label, to]) => (
                  <Link key={to} to={to} style={{ fontFamily: MONO, fontSize: 13, textTransform: 'uppercase', color: '#fff', textDecoration: 'none' }}>
                    {label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontFamily: MONO, fontSize: 12, textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', margin: '0 0 16px' }}>{'// Social'}</p>
              <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: MONO, fontSize: 13, textTransform: 'uppercase', color: '#fff', textDecoration: 'none' }}>
                LinkedIn <ArrowUpRight size={14} />
              </a>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', marginTop: 48 }}>
            <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 'clamp(2.4rem, 9vw, 7.5rem)', letterSpacing: '-0.03em', lineHeight: 1, color: 'rgba(255,255,255,0.12)', whiteSpace: 'nowrap' }}>
              STORYCYCLE™
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.12)', marginTop: 32, paddingTop: 22 }}>
            <span style={{ fontFamily: MONO, fontSize: 11, textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>©2026 StoryCycle™ · Bowstring Studios</span>
            <span style={{ fontFamily: MONO, fontSize: 11, textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>{'\\\\ Concept · Create Template'}</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
