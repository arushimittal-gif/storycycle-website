import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { COLORS } from '../lib/brand'

// ─────────────────────────────────────────────────────────────
// Concept prototype: Hydra. Framer "Hydra" template structure
// (spare type-forward hero, product-in-frame beat, dark ground)
// rebuilt in StoryCycle brand terms: charcoal ground, amber as
// the single accent, flat drawn "document frame" instead of 3D
// device renders. Static-first — one fade-in per section,
// disabled under prefers-reduced-motion. All copy verbatim from
// GetStoryCycle_Wireframes_2.html. Standalone route, no nav/footer.
// FLAGGED OFF-BAR vs. Andy 7/16 (dark ground, tech posture) —
// see concepts/2026-07-18 concept brief — Hydra.md.
// ─────────────────────────────────────────────────────────────

const FONT = 'Montserrat, sans-serif'
const SERIF = 'Georgia, "Times New Roman", serif'

// Single ambient moment: one CSS fade-up on the hero at load. Everything
// else on the page is fully static. Disabled under prefers-reduced-motion.
const HERO_FADE_CSS = `
@keyframes hydraFadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
.hydra-fade { animation: hydraFadeUp 0.9s ease both; }
.hydra-fade-late { animation: hydraFadeUp 0.9s ease 0.15s both; }
@media (prefers-reduced-motion: reduce) { .hydra-fade, .hydra-fade-late { animation: none; } }
`

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: FONT, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, color: COLORS.amber, margin: '0 0 20px' }}>
      {children}
    </p>
  )
}

function SectionShell({ children, alt = false }: { children: React.ReactNode; alt?: boolean }) {
  return (
    <section style={{ background: alt ? '#1E2123' : COLORS.charcoal, padding: 'clamp(72px, 10vw, 140px) 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>{children}</div>
    </section>
  )
}

function AmberCTA({ children }: { children: React.ReactNode }) {
  return (
    <Link
      to="/fast-positioning-audit"
      style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: COLORS.amber, color: COLORS.charcoal, padding: '16px 26px', fontFamily: FONT, fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: 4 }}
    >
      {children} <ArrowRight size={16} />
    </Link>
  )
}

// Hydra's "product in a frame" beat, translated: a flat drawn document
// frame showing the deliverable (the written diagnosis). No 3D, no photo.
function DocumentFrame() {
  const line = (w: string, amber = false) => (
    <div style={{ height: 7, width: w, borderRadius: 2, background: amber ? COLORS.amber : 'rgba(255,255,255,0.16)', marginBottom: 10 }} />
  )
  return (
    <div aria-hidden style={{ border: '1px solid rgba(255,255,255,0.14)', borderRadius: 8, background: '#2B2F31', padding: 0, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.35)' }}>
      <div style={{ display: 'flex', gap: 6, padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        {[0, 1, 2].map(i => <span key={i} style={{ width: 8, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.18)' }} />)}
      </div>
      <div style={{ padding: '26px 28px' }}>
        <p style={{ fontFamily: FONT, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: COLORS.amber, fontWeight: 700, margin: '0 0 6px' }}>Fast Positioning Audit</p>
        <p style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: '#fff', margin: '0 0 18px' }}>Written diagnosis · 5 business days</p>
        {line('92%')}{line('78%')}{line('40%', true)}{line('85%')}{line('64%')}
        <div style={{ display: 'flex', gap: 14, marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {['Diagnose', 'Align', 'Activate', 'Optimize'].map((p, i) => (
            <span key={p} style={{ fontFamily: FONT, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: i === 0 ? COLORS.amber : 'rgba(255,255,255,0.45)', fontWeight: 600 }}>{`0${i + 1} ${p}`}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

const PHASES = [
  { n: '01', name: 'Diagnose', body: 'Fast Positioning Audit. 5 business days.' },
  { n: '02', name: 'Align', body: 'Narrative architecture, leadership alignment.' },
  { n: '03', name: 'Activate', body: 'Operationalize across every channel.' },
  { n: '04', name: 'Optimize', body: '60/90-day audits.' },
]

// Seven engagements — type-only proof wall, numbered-index treatment (ECD P1.3).
const ENGAGEMENTS = [
  { name: 'Harth Builders', tag: 'Luxury residential design-build' },
  { name: "Donnelly's HVAC", tag: 'Home services' },
  { name: 'Lindsey Wilson', tag: 'Higher education' },
  { name: 'Liaison International', tag: 'Professional services' },
  { name: 'Paul Downs Cabinetry', tag: 'Professional services' },
  { name: 'Lilly Fasteners', tag: 'Manufacturing' },
  { name: 'PE Portfolio', tag: 'Six PE-backed engagements' },
]

const INDUSTRIES = ['Professional Services', 'Home Services', 'Law Firms', 'PE Operating', 'Mission-Driven']

const STATS = [
  { num: '$2.8M+', label: 'PE Year 1 lift', cite: 'F' },
  { num: '+40%', label: "Donnelly's leads", cite: 'E' },
  { num: '+25%', label: "Donnelly's close", cite: 'E' },
  { num: '+35%', label: 'PE avg leads', cite: 'F' },
  { num: '+22%', label: 'PE cycle compression', cite: 'F' },
  { num: '+18%', label: "Donnelly's rev/customer", cite: 'E' },
]

export function ConceptHydra() {
  return (
    <div style={{ background: COLORS.charcoal, minHeight: '100vh', color: '#fff' }}>
      <style>{HERO_FADE_CSS}</style>
      {/* prototype tag */}
      <div style={{ position: 'fixed', left: 20, top: 18, zIndex: 20, fontFamily: FONT, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>
        Concept · Hydra <span style={{ color: 'rgba(255,255,255,0.25)' }}>prototype</span>
      </div>

      {/* Section 1 · Hero — Hydra's spare type-forward hero + document frame */}
      <section style={{ padding: 'clamp(110px, 14vw, 180px) 24px clamp(72px, 10vw, 140px)' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'clamp(40px, 6vw, 80px)', alignItems: 'center' }}>
          <div className="hydra-fade">
            <Eyebrow>StoryCycle™</Eyebrow>
            <h1 style={{ fontFamily: FONT, fontSize: 'clamp(2.4rem, 5vw, 4.2rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em', textTransform: 'uppercase', margin: '0 0 24px' }}>
              Your pipeline is full.<br />Your sales aren't converting.
            </h1>
            <p style={{ fontFamily: FONT, fontSize: 17, lineHeight: 1.6, color: 'rgba(255,255,255,0.7)', maxWidth: 480, margin: '0 0 32px' }}>
              StoryCycle™ fixes that at the system level. One unified commercial narrative, operationalized across every channel and team.
            </p>
            <AmberCTA>Request Your Fast Positioning Audit</AmberCTA>
          </div>
          <div className="hydra-fade-late">
            <DocumentFrame />
          </div>
        </div>
      </section>

      {/* Section 2 · The Mechanism */}
      <SectionShell alt>
        <div>
          <Eyebrow>The Mechanism</Eyebrow>
          <h2 style={{ fontFamily: FONT, fontSize: 'clamp(1.8rem, 3.4vw, 2.8rem)', fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.015em', margin: '0 0 28px', maxWidth: 720 }}>
            It's not your marketing. <em style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400, color: COLORS.amber, textTransform: 'none' }}>It's the story underneath it.</em>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32, maxWidth: 900 }}>
            <p style={{ fontFamily: FONT, fontSize: 16, lineHeight: 1.7, color: 'rgba(255,255,255,0.7)', margin: 0 }}>
              Marketing spend goes up. Pipeline volume goes up. Conversion stays flat. Buyers see five versions of you and pick the one easiest to commoditize.
            </p>
            <p style={{ fontFamily: FONT, fontSize: 16, lineHeight: 1.7, color: 'rgba(255,255,255,0.7)', margin: 0 }}>
              StoryCycle is the operating system that fixes this. Not a campaign, not a rebrand. A unified commercial narrative, operationalized across every channel and team, measured against pipeline conversion.
            </p>
          </div>
        </div>
      </SectionShell>

      {/* Section 3 · Four phases */}
      <SectionShell>
        <div>
          <Eyebrow>How It Works</Eyebrow>
          <h2 style={{ fontFamily: FONT, fontSize: 'clamp(1.8rem, 3.4vw, 2.8rem)', fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.015em', margin: '0 0 44px' }}>
            Four phases. One operating system.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18 }}>
            {PHASES.map(p => (
              <div key={p.n} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '26px 22px', background: 'rgba(255,255,255,0.03)' }}>
                <p style={{ fontFamily: FONT, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700, color: COLORS.amber, margin: '0 0 10px' }}>{p.n} · {p.name}</p>
                <p style={{ fontFamily: FONT, fontSize: 14, lineHeight: 1.6, color: 'rgba(255,255,255,0.7)', margin: 0 }}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionShell>

      {/* Section 4 · Who It's For — industries, never "channels" (ECD P1.1) */}
      <SectionShell alt>
        <div>
          <Eyebrow>Who It's For</Eyebrow>
          <h2 style={{ fontFamily: FONT, fontSize: 'clamp(1.8rem, 3.4vw, 2.8rem)', fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.015em', margin: '0 0 36px' }}>
            Different industries. Same broken story.
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {INDUSTRIES.map(ind => (
              <span key={ind} style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, letterSpacing: '0.04em', color: '#fff', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 999, padding: '12px 22px' }}>{ind}</span>
            ))}
          </div>
        </div>
      </SectionShell>

      {/* Section 5 · Proof wall — seven engagements, numbered index, type-only */}
      <SectionShell>
        <div>
          <Eyebrow>Results</Eyebrow>
          <h2 style={{ fontFamily: FONT, fontSize: 'clamp(1.8rem, 3.4vw, 2.8rem)', fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.015em', margin: '0 0 44px' }}>
            Documented across seven engagements.
          </h2>
          <div>
            {ENGAGEMENTS.map((e, i) => (
              <div key={e.name} style={{ display: 'flex', alignItems: 'baseline', gap: 24, padding: '20px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color: COLORS.amber, minWidth: 32 }}>{String(i + 1).padStart(2, '0')}</span>
                <span style={{ fontFamily: FONT, fontSize: 'clamp(1.1rem, 2.2vw, 1.6rem)', fontWeight: 700, color: '#fff', flex: 1 }}>{e.name}</span>
                <span style={{ fontFamily: FONT, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>{e.tag}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(24px, 4vw, 56px)', marginTop: 52 }}>
            {STATS.map(s => (
              <div key={s.label}>
                <p style={{ fontFamily: FONT, fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 800, color: COLORS.amber, margin: 0 }}>{s.num}</p>
                <p style={{ fontFamily: FONT, fontSize: 12, color: 'rgba(255,255,255,0.55)', margin: '4px 0 0' }}>
                  {s.label}<sup style={{ fontSize: 8, opacity: 0.7, marginLeft: 2 }}>{s.cite}</sup>
                </p>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: FONT, fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 24 }}>
            Citations resolve at <Link to="/sources" style={{ color: 'rgba(255,255,255,0.55)' }}>/sources</Link>.
          </p>
        </div>
      </SectionShell>

      {/* Section 6 · Final CTA */}
      <SectionShell alt>
        <div>
          <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto' }}>
            <h2 style={{ fontFamily: FONT, fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.02em', textTransform: 'uppercase', margin: '0 0 20px' }}>
              Break the cycle of slow.<br />Start with a five-day diagnosis.
            </h2>
            <p style={{ fontFamily: FONT, fontSize: 15, lineHeight: 1.6, color: 'rgba(255,255,255,0.65)', margin: '0 0 32px' }}>
              The Fast Positioning Audit is valuable whether or not you proceed. Most clients say so.
            </p>
            <AmberCTA>Request Your Fast Positioning Audit</AmberCTA>
          </div>
        </div>
      </SectionShell>

      <footer style={{ padding: '32px 24px', textAlign: 'center', fontFamily: FONT, fontSize: 11, color: 'rgba(255,255,255,0.35)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        © 2026 Bowstring Studios, operating as StoryCycle™.
      </footer>
    </div>
  )
}
