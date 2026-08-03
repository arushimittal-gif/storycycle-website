import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Menu, Plus, X } from 'lucide-react'
import { COLORS } from '../lib/brand'

// ─────────────────────────────────────────────────────────────
// Concept prototype: Hydra Template — faithful recreation of the
// Flowit Supply "Hydra" Framer/Webflow template design language,
// verified against the live demo (hydra-template.webflow.io) on
// 2026-07-18: off-white ground, floating card nav, PT Mono
// highlight-chip eyebrows, big sentence-case grotesk headlines,
// 4-up accent cards with + buttons and dark mono tags, split
// stats band (pattern panel + dark panel), large project cards,
// textured full-bleed CTA band, dark footer with ↳ columns.
// Mapped to StoryCycle brand: charcoal #25282A,
// amber #FBB03B (in place of Hydra lime #E1FCAD), warm off-white.
// Hydra's photography slots are replaced with graphical panels
// (Andy 7/16 bar: static-first, graphical, no stock photography).
// One ambient moment: hero fade-up on load. Copy verbatim from
// the locked wireframe / storycycle-v5.vercel.app.
// Distinct file from ConceptHydra.tsx (killed as a slate candidate
// 7/18 ECD round 1 — kept only as internal reference) — this is
// the actual-template recreation, positioned as a finish-bar
// reference beside /concept/create-template (per that concept's
// 7/18 round-2: perpetual motion killed, clocks cut, hero leads
// USP). Live footer clock removed here 7/20 to match.
// ─────────────────────────────────────────────────────────────

const FONT = 'Montserrat, ui-sans-serif, sans-serif'
const MONO = '"PT Mono", "Courier New", monospace'
const INK = COLORS.charcoal // #25282A
const AMBER = COLORS.amber // #FBB03B
const GROUND = '#F3F1EC'
const AMBER_PALE = '#FBDFA6'
const NAV_BG = '#E9E7E1'

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=PT+Mono&display=swap');
@keyframes hydtFadeUp { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
.hydt-fade { animation: hydtFadeUp 0.9s cubic-bezier(0.2,0.6,0.2,1) both; }
.hydt-fade-2 { animation: hydtFadeUp 0.9s cubic-bezier(0.2,0.6,0.2,1) 0.12s both; }
.hydt-fade-3 { animation: hydtFadeUp 0.9s cubic-bezier(0.2,0.6,0.2,1) 0.24s both; }
@media (prefers-reduced-motion: reduce) { .hydt-fade, .hydt-fade-2, .hydt-fade-3 { animation: none; } }
a.hydt-btn:hover .hydt-btn-ico { transform: translate(1px,-1px); }
.hydt-btn-ico { transition: transform 0.15s ease; }
.hydt-row:hover { background: rgba(37,40,42,0.03); }
a.hydt-card:hover .hydt-card-btn { background: rgba(37,40,42,0.22); }
.hydt-card-btn { transition: background 0.2s ease; }
.hydt-burger { display: none !important; }
@media (max-width: 940px) {
  .hydt-links { display: none !important; }
  .hydt-burger { display: inline-flex !important; }
}
@media (max-width: 560px) {
  .hydt-navcta { display: none !important; }
}
`

// PT Mono uppercase label inside a highlight chip (Hydra's signature eyebrow)
function Chip({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      style={{
        display: 'inline-block',
        fontFamily: MONO,
        fontSize: 13,
        textTransform: 'uppercase',
        letterSpacing: '0.02em',
        background: dark ? INK : AMBER_PALE,
        color: dark ? AMBER : INK,
        padding: '6px 12px',
        borderRadius: 3,
      }}
    >
      {children}
    </span>
  )
}

// Hydra's button: dark rounded rect, label + small light rounded-square arrow tile
function HydraButton({ to, children, light = false }: { to: string; children: React.ReactNode; light?: boolean }) {
  return (
    <Link
      to={to}
      className="hydt-btn"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        background: light ? '#fff' : INK,
        color: light ? INK : '#fff',
        fontFamily: FONT,
        fontSize: 15,
        fontWeight: 600,
        textDecoration: 'none',
        padding: '12px 12px 12px 20px',
        borderRadius: 10,
      }}
    >
      {children}
      <span
        className="hydt-btn-ico"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 26,
          height: 26,
          borderRadius: 6,
          background: light ? INK : '#fff',
          color: light ? '#fff' : INK,
        }}
      >
        <ArrowUpRight size={15} />
      </span>
    </Link>
  )
}

function SectionHead({ chip, children, maxWidth = 1080 }: { chip: string; children: React.ReactNode; maxWidth?: number }) {
  return (
    <div style={{ marginBottom: 'clamp(36px, 5vw, 56px)' }}>
      <Chip>{chip}</Chip>
      <h2
        style={{
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: 'clamp(2rem, 4.6vw, 3.6rem)',
          lineHeight: 1.08,
          letterSpacing: '-0.02em',
          color: INK,
          margin: '26px 0 0',
          maxWidth,
        }}
      >
        {children}
      </h2>
    </div>
  )
}

// Concentric-rings pattern (Hydra's "Our Numbers" panel texture) — pure SVG
function Rings({ stroke, opacity = 1, bold = false }: { stroke: string; opacity?: number; bold?: boolean }) {
  return (
    <svg aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity }} preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 600">
      {Array.from({ length: bold ? 14 : 9 }, (_, i) => (
        <circle key={i} cx="200" cy="300" r={bold ? 40 + i * 52 : 70 + i * 85} fill="none" stroke={stroke} strokeWidth={bold ? 18 : 1.2} />
      ))}
    </svg>
  )
}

// Thematic backdrop: the one-story node schematic as faint hero line-work
// (replaces decorative rings — ECD P0-2: graphics explain, never decorate)
function HeroSchematic() {
  const nodes: [number, number][] = [
    [640, 180],
    [200, 420],
    [1080, 420],
    [400, 60],
    [880, 60],
  ]
  return (
    <svg aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid slice" viewBox="0 0 1280 640">
      {nodes.map(([x, y], i) => (
        <line key={i} x1="640" y1="320" x2={x} y2={y} stroke="rgba(251,176,59,0.14)" strokeWidth="1" />
      ))}
      <circle cx="640" cy="320" r="120" fill="none" stroke="rgba(251,176,59,0.12)" strokeWidth="1" />
      <circle cx="640" cy="320" r="240" fill="none" stroke="rgba(251,176,59,0.07)" strokeWidth="1" />
      {nodes.map(([x, y], i) => (
        <circle key={`n${i}`} cx={x} cy={y} r="4" fill="rgba(251,176,59,0.35)" />
      ))}
    </svg>
  )
}

// Faint converging line-work for result cards (same schematic family)
function CardLines({ opacity = 0.16 }: { opacity?: number }) {
  return (
    <svg aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid slice" viewBox="0 0 400 400">
      {[
        [0, 60],
        [0, 200],
        [0, 340],
        [130, 0],
        [270, 0],
      ].map(([x, y], i) => (
        <line key={i} x1={x} y1={y} x2="330" y2="330" stroke={`rgba(251,176,59,${opacity})`} strokeWidth="1" />
      ))}
      <circle cx="330" cy="330" r="5" fill={`rgba(251,176,59,${opacity * 2.4})`} />
    </svg>
  )
}

// "+" pattern texture (Hydra's CTA band)
function PlusField({ color }: { color: string }) {
  const cells: React.ReactNode[] = []
  for (let r = 0; r < 6; r++)
    for (let c = 0; c < 14; c++) {
      const x = 30 + c * 58 + (r % 2 ? 29 : 0)
      const y = 30 + r * 58
      cells.push(<path key={`${r}-${c}`} d={`M${x - 7} ${y} H${x + 7} M${x} ${y - 7} V${y + 7}`} stroke={color} strokeWidth="1.5" />)
    }
  return (
    <svg aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid slice" viewBox="0 0 840 360">
      {cells}
    </svg>
  )
}

const PHASES = [
  {
    tag: 'Phase 01 · Diagnose',
    title: 'Fast Positioning Audit',
    body: '5 business days. A senior strategist runs structured discovery, audits your commercial story, delivers a written diagnosis with named differentiators and three priority interventions.',
  },
  {
    tag: 'Phase 02 · Align',
    title: 'Your Unified Story',
    body: '4–6 weeks. Leadership alignment. One unified story built from the audit — across every channel and team.',
  },
  {
    tag: 'Phase 03 · Activate',
    title: 'Activate Across Every Channel',
    body: '8–12 weeks. Every channel, every team, aligned. Website, sales enablement, content, paid acquisition — synchronized.',
  },
  {
    tag: 'Phase 04 · Optimize',
    title: '60/90-Day Audits',
    body: 'The market moves. The competitive frame shifts. We audit what got into the wild and tune it.',
  },
]

const INDUSTRIES = [
  { name: 'Professional Services', note: '$25M–$250M. Accounting, consulting, financial advisory, staffing.', to: '/who-its-for/professional-services' },
  { name: 'Home Services & Trades', note: '$25M–$250M. HVAC, contractors, luxury residential.', to: '/who-its-for/home-services-trades' },
  { name: 'Law Firms', note: '$25M–$250M+. Misaligned messaging is a tax on the firm.', to: '/who-its-for/law-firms' },
  { name: 'PE Operating Partners', note: '$100M–$5B AUM. Portfolio value creation.', to: '/who-its-for/private-equity' },
  { name: 'Mission-Driven', note: 'Universities, colleges, nonprofits, foundations.', to: '/who-its-for/mission-driven' },
]

// Four strongest, 2×2 at giant scale (Hydra's "Our Numbers" grid; ECD P1-3)
const STATS = [
  { num: '$2.8M+', label: 'PE Portfolio · Year-1 revenue lift' },
  { num: '+40%', label: 'Home Services · Qualified leads' },
  { num: '+25%', label: 'Home Services · Close rate' },
  { num: '+22%', label: 'PE Portfolio · Sales cycle compression' },
]

const RESULT_CARDS = [
  { name: 'Harth Builders', tag: 'Luxury residential design-build', to: '/results/harth-builders' },
  { name: "Donnelly's HVAC", tag: 'Home services', to: '/results/donnellys-hvac' },
  { name: 'PE Portfolio', tag: 'Six PE-backed engagements', to: '/results/pe-portfolio' },
]

export function ConceptHydraTemplate() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div style={{ background: GROUND, minHeight: '100vh' }}>
      <style>{CSS}</style>

      {/* page-wide thin vertical gridlines (Hydra) */}
      <div aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
        {[25, 50, 75].map(p => (
          <div key={p} style={{ position: 'absolute', top: 0, bottom: 0, left: `${p}%`, width: 1, background: 'rgba(37,40,42,0.05)' }} />
        ))}
      </div>

      {/* prototype tag */}
      <div style={{ position: 'fixed', left: '50%', transform: 'translateX(-50%)', bottom: 10, zIndex: 40, fontFamily: MONO, fontSize: 10, textTransform: 'uppercase', color: 'rgba(37,40,42,0.4)' }}>
        Concept · Hydra Template
      </div>

      {/* ── Nav: floating light card + separate dark CTA pill ── */}
      <header style={{ position: 'fixed', top: 14, left: 14, right: 14, zIndex: 30, display: 'flex', gap: 10 }}>
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: NAV_BG,
            borderRadius: 12,
            padding: '16px 22px',
          }}
        >
          <Link to="/" style={{ fontFamily: FONT, fontWeight: 800, fontSize: 19, letterSpacing: '0.02em', color: INK, textDecoration: 'none', whiteSpace: 'nowrap', marginRight: 24 }}>
            STORYCYCLE<sup style={{ fontSize: 9 }}>™</sup>
          </Link>
          <nav className="hydt-links" style={{ display: 'flex', gap: 24, justifyContent: 'flex-end' }}>
            {[
              ['How It Works', '/how-it-works'],
              ["Who It's For", '/who-its-for'],
              ['Results', '/results'],
              ['Insights', '/insights'],
              ['About', '/about'],
            ].map(([label, to]) => (
              <Link key={to} to={to} style={{ fontFamily: MONO, fontSize: 12, textTransform: 'uppercase', color: INK, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                {label}
              </Link>
            ))}
          </nav>
          <button
            className="hydt-burger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            style={{ alignItems: 'center', justifyContent: 'center', width: 36, height: 36, border: 'none', borderRadius: 8, background: 'rgba(37,40,42,0.08)', color: INK, cursor: 'pointer' }}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        {menuOpen && (
          <nav style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, background: NAV_BG, borderRadius: 12, padding: '14px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              ['How It Works', '/how-it-works'],
              ["Who It's For", '/who-its-for'],
              ['Results', '/results'],
              ['Insights', '/insights'],
              ['About', '/about'],
            ].map(([label, to]) => (
              <Link key={to} to={to} onClick={() => setMenuOpen(false)} style={{ fontFamily: MONO, fontSize: 14, textTransform: 'uppercase', color: INK, textDecoration: 'none' }}>
                {label}
              </Link>
            ))}
          </nav>
        )}
        <Link
          to="/fast-positioning-audit"
          className="hydt-navcta"
          style={{ display: 'flex', alignItems: 'center', gap: 10, background: INK, color: '#fff', borderRadius: 12, padding: '0 22px', fontFamily: FONT, fontSize: 15, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}
        >
          Request an Audit
          <span style={{ display: 'inline-flex', width: 24, height: 24, borderRadius: 6, background: AMBER, color: INK, alignItems: 'center', justifyContent: 'center' }}>
            <ArrowUpRight size={14} />
          </span>
        </Link>
      </header>

      {/* ── Hero: inset rounded charcoal panel, graphical (no photo) ── */}
      <section style={{ padding: '92px 14px 14px' }}>
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 18,
            background: INK,
            minHeight: 'calc(100vh - 106px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(56px, 8vw, 120px) 24px',
          }}
        >
          <HeroSchematic />
          <div className="hydt-fade" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
            <span style={{ display: 'inline-block', fontFamily: MONO, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.02em', background: 'rgba(255,255,255,0.1)', color: AMBER, padding: '6px 12px', borderRadius: 3 }}>
              The story underneath your pipeline
            </span>
          </div>
          <h1
            className="hydt-fade"
            style={{
              position: 'relative',
              zIndex: 2,
              fontFamily: FONT,
              fontWeight: 600,
              fontSize: 'clamp(2.6rem, 6.4vw, 5.4rem)',
              lineHeight: 1.05,
              letterSpacing: '-0.025em',
              color: '#fff',
              textAlign: 'center',
              maxWidth: 1060,
              margin: '30px 0 28px',
            }}
          >
            Your pipeline is full. Your sales aren't converting.
          </h1>
          <p
            className="hydt-fade-2"
            style={{ position: 'relative', zIndex: 2, fontFamily: FONT, fontSize: 'clamp(1rem, 1.6vw, 1.25rem)', lineHeight: 1.55, color: 'rgba(255,255,255,0.78)', textAlign: 'center', maxWidth: 620, margin: '0 0 40px' }}
          >
            StoryCycle fixes it at the system level — one commercial narrative, operationalized across every channel and team.
          </p>
          <div className="hydt-fade-3" style={{ position: 'relative', zIndex: 2 }}>
            <Link
              to="/fast-positioning-audit"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', background: AMBER, color: INK, fontFamily: FONT, fontSize: 16, fontWeight: 600, padding: '16px 28px', borderRadius: 999 }}>
                Request Your Fast Positioning Audit
              </span>
              <span style={{ display: 'inline-flex', width: 54, height: 54, borderRadius: '50%', background: AMBER, color: INK, alignItems: 'center', justifyContent: 'center' }}>
                <ArrowUpRight size={20} />
              </span>
            </Link>
          </div>
          <span style={{ position: 'absolute', bottom: 26, left: '50%', transform: 'translateX(-50%)', zIndex: 2, fontFamily: MONO, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)' }}>
            Scroll down
          </span>
        </div>
      </section>

      {/* ── Introduction: editorial statement ── */}
      <section style={{ position: 'relative', zIndex: 2, padding: 'clamp(88px, 11vw, 150px) 24px', maxWidth: 1240, margin: '0 auto' }}>
        <Chip>Introduction</Chip>
        <h2
          style={{
            fontFamily: FONT,
            fontWeight: 600,
            fontSize: 'clamp(2rem, 4.6vw, 3.6rem)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: INK,
            margin: '28px 0 20px',
            maxWidth: 980,
          }}
        >
          It's not your marketing. It's the story underneath it.
        </h2>
        <p style={{ fontFamily: FONT, fontSize: 17, lineHeight: 1.65, color: 'rgba(37,40,42,0.75)', maxWidth: 720, margin: '0 0 14px' }}>
          Marketing spend goes up. Pipeline volume goes up. Conversion stays flat. Buyers see five versions of you and pick the one easiest to commoditize.
        </p>
        <p style={{ fontFamily: FONT, fontSize: 17, lineHeight: 1.65, color: 'rgba(37,40,42,0.75)', maxWidth: 720, margin: '0 0 36px' }}>
          StoryCycle is the operating system that fixes this. Not a campaign, not a rebrand. A unified commercial narrative, operationalized across every channel and team, measured against pipeline conversion.
        </p>
        <HydraButton to="/how-it-works">How It Works</HydraButton>
      </section>

      {/* ── Four phases: 4-up accent cards ── */}
      <section style={{ position: 'relative', zIndex: 2, padding: '0 24px clamp(88px, 11vw, 150px)', maxWidth: 1240, margin: '0 auto' }}>
        <SectionHead chip="How It Works">Stop improvising. Start operating.</SectionHead>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 14 }}>
          {PHASES.map(p => (
            <Link key={p.tag} to="/how-it-works" className="hydt-card" style={{ position: 'relative', background: AMBER_PALE, borderRadius: 16, padding: '24px 22px', minHeight: 340, display: 'flex', flexDirection: 'column', textDecoration: 'none' }}>
              <span
                className="hydt-card-btn"
                style={{ position: 'absolute', top: 18, right: 18, display: 'inline-flex', width: 38, height: 38, borderRadius: '50%', background: 'rgba(37,40,42,0.12)', color: INK, alignItems: 'center', justifyContent: 'center' }}
              >
                <Plus size={17} />
              </span>
              <div style={{ marginTop: 'auto' }}>
                <span style={{ display: 'inline-block', fontFamily: MONO, fontSize: 12, textTransform: 'uppercase', background: INK, color: AMBER, padding: '5px 10px', borderRadius: 3, marginBottom: 14 }}>
                  {p.tag}
                </span>
                <p style={{ fontFamily: FONT, fontSize: 19, fontWeight: 700, color: INK, margin: '0 0 10px' }}>{p.title}</p>
                <p style={{ fontFamily: FONT, fontSize: 14.5, lineHeight: 1.6, color: 'rgba(37,40,42,0.78)', margin: 0 }}>{p.body}</p>
              </div>
            </Link>
          ))}
        </div>
        <p style={{ fontFamily: MONO, fontSize: 13, textTransform: 'uppercase', color: 'rgba(37,40,42,0.6)', marginTop: 28 }}>
          One senior strategist, start to finish. No handoffs.
        </p>
      </section>

      {/* ── Industries: index rows ── */}
      <section style={{ position: 'relative', zIndex: 2, padding: '0 24px clamp(88px, 11vw, 150px)', maxWidth: 1240, margin: '0 auto' }}>
        <SectionHead chip="Who It's For">Different industries. Same broken story.</SectionHead>
        <div style={{ borderTop: '1px solid rgba(37,40,42,0.14)' }}>
          {INDUSTRIES.map((ind, i) => (
            <Link
              key={ind.name}
              to={ind.to}
              className="hydt-row"
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(40px, 60px) 1.2fr 1.6fr auto',
                alignItems: 'center',
                gap: 20,
                padding: '26px 8px',
                borderBottom: '1px solid rgba(37,40,42,0.14)',
                textDecoration: 'none',
              }}
            >
              <span style={{ fontFamily: MONO, fontSize: 13, color: 'rgba(37,40,42,0.5)' }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{ fontFamily: FONT, fontSize: 'clamp(1.15rem, 2.2vw, 1.7rem)', fontWeight: 600, letterSpacing: '-0.01em', color: INK }}>{ind.name}</span>
              <span style={{ fontFamily: FONT, fontSize: 14.5, lineHeight: 1.5, color: 'rgba(37,40,42,0.75)' }}>{ind.note}</span>
              <span style={{ fontFamily: MONO, fontSize: 12, textTransform: 'uppercase', color: INK, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                Learn More <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Stats: split band — pattern panel + dark panel ── */}
      <section style={{ position: 'relative', zIndex: 2, padding: '0 14px clamp(88px, 11vw, 150px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', borderRadius: 18, overflow: 'hidden' }}>
          <div style={{ position: 'relative', background: AMBER_PALE, minHeight: 420, display: 'flex', alignItems: 'center', padding: 'clamp(40px, 6vw, 80px)' }}>
            <Rings stroke="rgba(251,176,59,0.5)" opacity={0.5} bold />
            <h2 style={{ position: 'relative', zIndex: 2, fontFamily: FONT, fontWeight: 600, fontSize: 'clamp(1.9rem, 3.6vw, 3rem)', lineHeight: 1.1, letterSpacing: '-0.02em', color: INK, margin: 0, display: 'flex', alignItems: 'center', gap: 16 }}>
              Documented across five verticals <ArrowRight size={36} />
            </h2>
          </div>
          <div style={{ background: INK, padding: 'clamp(40px, 6vw, 80px)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(36px, 5vw, 64px) 24px', alignContent: 'center' }}>
            {STATS.map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: FONT, fontWeight: 600, fontSize: 'clamp(2.6rem, 5.2vw, 4.6rem)', letterSpacing: '-0.02em', color: AMBER, margin: 0 }}>{s.num}</p>
                <p style={{ fontFamily: FONT, fontSize: 13.5, color: 'rgba(255,255,255,0.85)', margin: '8px 0 0' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Results: large graphical cards (Recent Projects pattern) ── */}
      <section style={{ position: 'relative', zIndex: 2, padding: '0 24px clamp(88px, 11vw, 150px)', maxWidth: 1240, margin: '0 auto' }}>
        <SectionHead chip="Results">Selling like a commodity. Despite exceptional work.</SectionHead>
        <p style={{ fontFamily: FONT, fontSize: 16, lineHeight: 1.6, color: 'rgba(37,40,42,0.7)', maxWidth: 640, margin: '-28px 0 44px' }}>
          Harth Builders, luxury residential design-build on Philadelphia's Main Line. A story that wasn't reaching the buyers it deserved.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
          {RESULT_CARDS.map((c, i) => (
            <Link key={c.name} to={c.to} style={{ position: 'relative', display: 'block', borderRadius: 16, overflow: 'hidden', background: i === 0 ? INK : i === 1 ? '#3A3E41' : '#1C1F21', minHeight: 380, textDecoration: 'none', padding: 24 }}>
              <CardLines opacity={0.12 + i * 0.04} />
              <span style={{ position: 'absolute', top: 20, right: 20, display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: FONT, fontSize: 14, fontWeight: 600, color: '#fff' }}>
                View Case Study
                <span style={{ display: 'inline-flex', width: 30, height: 30, borderRadius: 6, border: '1px solid rgba(255,255,255,0.4)', alignItems: 'center', justifyContent: 'center' }}>
                  <ArrowUpRight size={15} />
                </span>
              </span>
              <div style={{ position: 'absolute', left: 24, bottom: 22 }}>
                <p style={{ fontFamily: FONT, fontSize: 20, fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>{c.name}</p>
                <p style={{ fontFamily: MONO, fontSize: 12, textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', margin: 0 }}>{c.tag}</p>
              </div>
            </Link>
          ))}
        </div>
        <div style={{ marginTop: 28 }}>
          <HydraButton to="/results">View All Results</HydraButton>
        </div>
      </section>

      {/* ── The Spread: statement + node schematic (map-with-dots slot) ── */}
      <section style={{ position: 'relative', zIndex: 2, padding: '0 24px clamp(88px, 11vw, 150px)', maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'clamp(36px, 6vw, 80px)', alignItems: 'center' }}>
          <div>
            <Chip>The Spread</Chip>
            <h2 style={{ fontFamily: FONT, fontWeight: 600, fontSize: 'clamp(1.9rem, 3.6vw, 3rem)', lineHeight: 1.12, letterSpacing: '-0.02em', color: INK, margin: '26px 0 18px' }}>
              One story. Every channel. More qualified leads.
            </h2>
            <p style={{ fontFamily: FONT, fontSize: 16, lineHeight: 1.65, color: 'rgba(37,40,42,0.72)', margin: '0 0 12px', maxWidth: 520 }}>
              StoryCycle puts one unified story to work across every team and touchpoint — simultaneously. Not a campaign. An operating system.
            </p>
            <p style={{ fontFamily: FONT, fontSize: 16, lineHeight: 1.65, color: 'rgba(37,40,42,0.72)', margin: 0, maxWidth: 520 }}>
              When these three tell the same story, pipeline converts. When they don't, it leaks.
            </p>
          </div>
          <svg viewBox="0 0 520 400" style={{ width: '100%', height: 'auto' }} aria-label="One story feeding Sales, Marketing, and Leadership">
            {[
              [260, 90],
              [110, 300],
              [410, 300],
            ].map(([x, y], i) => (
              <line key={i} x1="260" y1="205" x2={x} y2={y} stroke="rgba(37,40,42,0.35)" strokeWidth="1.2" />
            ))}
            <circle cx="260" cy="205" r="46" fill={AMBER} />
            <text x="260" y="209" textAnchor="middle" fontFamily={MONO} fontSize="11" fill={INK} style={{ textTransform: 'uppercase' }}>
              One Story
            </text>
            {[
              ['Sales', 260, 90],
              ['Marketing', 110, 300],
              ['Leadership', 410, 300],
            ].map(([label, x, y]) => (
              <g key={label as string}>
                <circle cx={x as number} cy={y as number} r="8" fill={AMBER} />
                <circle cx={x as number} cy={y as number} r="16" fill="none" stroke="rgba(37,40,42,0.25)" strokeWidth="1" />
                <text x={x as number} y={(y as number) + 38} textAnchor="middle" fontFamily={MONO} fontSize="12" fill={INK}>
                  {(label as string).toUpperCase()}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </section>

      {/* ── Insights ── */}
      <section style={{ position: 'relative', zIndex: 2, padding: '0 24px clamp(88px, 11vw, 150px)', maxWidth: 1240, margin: '0 auto' }}>
        <SectionHead chip="Insights">Written for the operator. Not the agency.</SectionHead>
        <div style={{ borderTop: '1px solid rgba(37,40,42,0.14)', marginBottom: 32 }}>
          {['01', '02', '03'].map(n => (
            <Link
              key={n}
              to="/insights"
              className="hydt-row"
              style={{ display: 'grid', gridTemplateColumns: 'minmax(40px, 60px) 1fr auto', alignItems: 'center', gap: 20, padding: '22px 8px', borderBottom: '1px solid rgba(37,40,42,0.14)', textDecoration: 'none' }}
            >
              <span style={{ fontFamily: MONO, fontSize: 13, color: 'rgba(37,40,42,0.5)' }}>{n}</span>
              <span style={{ fontFamily: FONT, fontSize: 'clamp(1.05rem, 2vw, 1.4rem)', fontWeight: 600, color: INK }}>Article {n}</span>
              <span style={{ fontFamily: MONO, fontSize: 12, textTransform: 'uppercase', color: INK, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                Read on LinkedIn <ArrowUpRight size={14} />
              </span>
            </Link>
          ))}
        </div>
        <HydraButton to="/insights">See All 13 Articles</HydraButton>
      </section>

      {/* ── CTA band: full-bleed amber with + texture ── */}
      <section style={{ position: 'relative', zIndex: 2, background: AMBER, padding: 'clamp(96px, 13vw, 180px) 24px', overflow: 'hidden' }}>
        <PlusField color="rgba(37,40,42,0.14)" />
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 780, margin: '0 auto' }}>
          <Chip dark>The Fast Positioning Audit</Chip>
          <h2 style={{ fontFamily: FONT, fontWeight: 600, fontSize: 'clamp(2rem, 4.6vw, 3.6rem)', lineHeight: 1.08, letterSpacing: '-0.02em', color: INK, margin: '26px 0 18px' }}>
            Break the cycle of slow. Start with a five-day diagnosis.
          </h2>
          <p style={{ fontFamily: FONT, fontSize: 16, lineHeight: 1.6, color: 'rgba(37,40,42,0.8)', margin: '0 0 34px' }}>
            The Fast Positioning Audit is valuable whether or not you proceed. Most clients say so.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <HydraButton to="/fast-positioning-audit">Request Your Fast Positioning Audit</HydraButton>
          </div>
        </div>
      </section>

      {/* ── Footer: dark, ↳ columns, live clock ── */}
      <footer style={{ position: 'relative', zIndex: 2, background: INK, padding: '72px 24px 36px' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 48, marginBottom: 64 }}>
            <div>
              <p style={{ fontFamily: FONT, fontSize: 17, lineHeight: 1.6, color: 'rgba(255,255,255,0.85)', margin: '0 0 24px', maxWidth: 340 }}>
                Start with the five-day diagnosis. One senior strategist, start to finish.
              </p>
              <HydraButton to="/fast-positioning-audit" light>
                Request an Audit
              </HydraButton>
            </div>
            <div>
              <p style={{ fontFamily: MONO, fontSize: 12, textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', margin: '0 0 18px' }}>↳ Pages</p>
              {[
                ['Home', '/'],
                ['How It Works', '/how-it-works'],
                ["Who It's For", '/who-its-for'],
                ['Results', '/results'],
                ['Insights', '/insights'],
                ['About', '/about'],
              ].map(([label, to]) => (
                <Link key={to} to={to} style={{ display: 'table', fontFamily: FONT, fontSize: 15, color: '#fff', textDecoration: 'underline', textDecorationColor: 'rgba(255,255,255,0.35)', textUnderlineOffset: 4, marginBottom: 10 }}>
                  {label}
                </Link>
              ))}
            </div>
            <div>
              <p style={{ fontFamily: MONO, fontSize: 12, textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', margin: '0 0 18px' }}>↳ Social</p>
              <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" style={{ display: 'table', fontFamily: FONT, fontSize: 15, color: '#fff', textDecoration: 'underline', textDecorationColor: 'rgba(255,255,255,0.35)', textUnderlineOffset: 4, marginBottom: 10 }}>
                LinkedIn
              </a>
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: 24 }}>
            <span style={{ fontFamily: MONO, fontSize: 12, textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>
              Philadelphia, PA
            </span>
            <span style={{ fontFamily: MONO, fontSize: 12, textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>©2026 StoryCycle™ · Bowstring Studios</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
