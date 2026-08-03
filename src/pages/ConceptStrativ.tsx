import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Plus } from 'lucide-react'
import { Meta } from '../components/Meta'
import { FOOTER_PAGES, FOOTER_INDUSTRIES, FOOTER_CONNECT } from '../lib/brand'

// ─────────────────────────────────────────────────────────────────────────────
// /concept/strativ — Strativ-template reskin prototype (post-pivot bar:
// static-first, graphical, no photography, USP-first). All copy verbatim from
// the live site (Home / HowItWorks / FastAudit / Harth / Donnellys / Footer).
// Light ground + charcoal ink + amber accent; Montserrat/Roboto stay.
// ─────────────────────────────────────────────────────────────────────────────

const INK = '#25282A'
const AMBER = '#FBB03B'
const HAIRLINE = 'rgba(37,40,42,0.12)'
const MUTED = 'rgba(37,40,42,0.64)'
const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace'

const display = (size: string, weight = 700): React.CSSProperties => ({
  fontFamily: 'Montserrat, sans-serif',
  fontSize: size,
  fontWeight: weight,
  letterSpacing: '-0.025em',
  lineHeight: 1.08,
  color: INK,
  margin: 0,
})
const body = (size = '16px', color = MUTED): React.CSSProperties => ({
  fontFamily: 'Roboto, sans-serif',
  fontSize: size,
  lineHeight: 1.6,
  color,
  margin: 0,
})

function MonoLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p style={{ fontFamily: MONO, fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: light ? 'rgba(255,255,255,0.55)' : MUTED, margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ width: '8px', height: '8px', background: AMBER, display: 'inline-block' }} />
      {children}
    </p>
  )
}

// Per-word staggered reveal (the Strativ signature). Honors reduced motion.
function WordReveal({ text, style, as: Tag = 'h2' }: { text: string; style?: React.CSSProperties; as?: 'h1' | 'h2' | 'h3' }) {
  const ref = useRef<HTMLHeadingElement>(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setOn(true); return }
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) { setOn(true); return }
    const obs = new IntersectionObserver((e) => { if (e[0]?.isIntersecting) { setOn(true); obs.disconnect() } }, { threshold: 0.2 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  const words = text.split(' ')
  return (
    <Tag ref={ref} style={style} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }} aria-hidden>
          <span
            style={{
              display: 'inline-block',
              transform: on ? 'translateY(0)' : 'translateY(110%)',
              opacity: on ? 1 : 0,
              transition: `transform 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 45}ms, opacity 0.5s ease ${i * 45}ms`,
            }}
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        </span>
      ))}
    </Tag>
  )
}

// Count-up stat — same hardened pattern as primitives.tsx Stat (initializes to
// final value so a counter can never be stuck at 0; observer + 600ms fallback).
function parseStat(raw: string) {
  const m = raw.match(/^([^0-9]*)([\d.]+)(.*)$/)
  if (!m) return { prefix: '', target: NaN, suffix: '', decimals: 0 }
  const decimals = m[2].includes('.') ? m[2].split('.')[1].length : 0
  return { prefix: m[1], target: parseFloat(m[2]), suffix: m[3], decimals }
}
function CountStat({ number, label }: { number: string; label: string }) {
  const { prefix, target, suffix, decimals } = parseStat(number)
  const final = Number.isNaN(target) ? number : prefix + target.toFixed(decimals) + suffix
  const ref = useRef<HTMLSpanElement>(null)
  const [displayVal, setDisplayVal] = useState(final)
  useEffect(() => {
    if (Number.isNaN(target)) return
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    let start = 0
    let started = false
    let fallback = 0
    const run = (t: number) => {
      if (!start) start = t
      const p = Math.min((t - start) / 1200, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplayVal(prefix + (target * eased).toFixed(decimals) + suffix)
      if (p < 1) raf = requestAnimationFrame(run)
    }
    const begin = () => {
      if (started) return
      started = true
      window.clearTimeout(fallback)
      setDisplayVal(prefix + (0).toFixed(decimals) + suffix)
      raf = requestAnimationFrame(run)
    }
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) begin()
    const obs = new IntersectionObserver((e) => { if (e[0]?.isIntersecting) { begin(); obs.disconnect() } }, { threshold: 0 })
    obs.observe(el)
    fallback = window.setTimeout(() => { if (!started) setDisplayVal(final) }, 600)
    return () => { obs.disconnect(); cancelAnimationFrame(raf); window.clearTimeout(fallback) }
  }, [target, prefix, suffix, decimals, final])
  return (
    <div>
      <span ref={ref} style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(2.2rem, 3.5vw, 3.2rem)', fontWeight: 800, letterSpacing: '-0.02em', color: 'white', display: 'block' }}>
        {displayVal}
      </span>
      <span style={{ fontFamily: MONO, fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', display: 'block', marginTop: '10px', lineHeight: 1.5 }}>
        {label}
      </span>
    </div>
  )
}

// Auto-rotating testimonial card (Strativ hero pattern). Quotes verbatim from
// the Donnelly's + Harth case-study pages.
const QUOTES = [
  { q: "You don't hire Donnelly's for the lowest price. You hire us because we solve the actual problem.", who: "Donnelly's HVAC", role: 'Case Study · Home Services' },
  { q: 'Craft is a standard, not a trade. Every decision made on the job site is a reflection of that.', who: 'Harth Builders', role: 'Case Study · Luxury Design-Build' },
] as const
function QuoteRotator() {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = window.setInterval(() => setI((p) => (p + 1) % QUOTES.length), 6000)
    return () => window.clearInterval(t)
  }, [])
  const q = QUOTES[i]
  return (
    <div style={{ background: 'white', border: `1px solid ${HAIRLINE}`, padding: '28px 30px', maxWidth: '440px', position: 'relative' }}>
      <span style={{ position: 'absolute', top: 0, left: 0, width: '32px', height: '3px', background: AMBER }} />
      <p key={i} className="cs-fade" style={{ ...body('15px', INK), fontStyle: 'normal', minHeight: '72px' }}>
        &ldquo;{q.q}&rdquo;
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '18px' }}>
        <div>
          <p style={{ ...body('13px', INK), fontWeight: 700 }}>{q.who}</p>
          <p style={{ fontFamily: MONO, fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED, margin: '4px 0 0' }}>{q.role}</p>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {QUOTES.map((_, d) => (
            <button key={d} onClick={() => setI(d)} aria-label={`Quote ${d + 1}`} style={{ width: '7px', height: '7px', borderRadius: '50%', border: 'none', padding: 0, cursor: 'pointer', background: d === i ? AMBER : HAIRLINE }} />
          ))}
        </div>
      </div>
    </div>
  )
}

// Numbered FAQ accordion (Strativ pattern). Copy verbatim from FastAudit faqs +
// the HowItWorks qualifier block.
const FAQS: [string, string][] = [
  ['How much does the audit cost?', 'The Fast Positioning Audit is a flat $10,000.'],
  ['Who runs the audit?', 'A senior StoryCycle strategist. Same strategist who runs Phase 02 if you proceed.'],
  ["What if we don't proceed?", 'The written diagnosis is yours.'],
  ['How do we prepare?', 'No prep required. We bring the structure.'],
  ['How quickly can we start?', 'Audits typically begin within 2–3 weeks of confirmation.'],
  ["When StoryCycle isn't the fit.", 'Below $25M revenue. Marketing spend below $200K annually. Founder still owns sales personally. Leadership won\'t participate. When it is: $25M–$250M. Marketing spend that isn\'t compounding. Real growth ambition.'],
]
function Accordion() {
  const [open, setOpen] = useState(0)
  return (
    <div style={{ borderTop: `1px solid ${HAIRLINE}` }}>
      {FAQS.map(([q, a], i) => {
        const isOpen = open === i
        return (
          <div key={q} style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '20px', padding: '22px 4px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
            >
              <span style={{ fontFamily: MONO, fontSize: '12px', color: isOpen ? AMBER : MUTED, minWidth: '28px' }}>{String(i + 1).padStart(2, '0')}.</span>
              <span style={{ ...display('clamp(15px, 1.6vw, 19px)', 600), flex: 1, letterSpacing: '-0.01em' }}>{q}</span>
              <Plus size={18} color={INK} style={{ transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'transform 0.25s ease', flexShrink: 0 }} />
            </button>
            <div style={{ display: 'grid', gridTemplateRows: isOpen ? '1fr' : '0fr', transition: 'grid-template-rows 0.3s ease' }}>
              <div style={{ overflow: 'hidden' }}>
                <p style={{ ...body('15px'), padding: '0 4px 24px 48px', maxWidth: '640px' }}>{a}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Fast Positioning Audit form — fields, labels, chips, and success copy
// verbatim from FastAudit.tsx AuditForm; restyled to the concept's light system.
function Chip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontFamily: 'Roboto, sans-serif', cursor: 'pointer', border: selected ? `1px solid ${INK}` : `1px solid ${HAIRLINE}`, background: selected ? INK : 'white', color: selected ? 'white' : INK, transition: 'all 0.15s' }}
    >
      {label}
    </button>
  )
}
async function submitAudit(payload: { name: string; company: string; email: string; revenue: string; challenge: string }) {
  await new Promise((r) => setTimeout(r, 600))
  return { ok: true, payload }
}
function AuditForm() {
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [revenue, setRevenue] = useState('$50M-$100M')
  const [challenge, setChallenge] = useState('Lead quality')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const label: React.CSSProperties = { display: 'block', fontSize: '11px', fontWeight: 600, color: INK, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Montserrat, sans-serif' }
  const fieldBase: React.CSSProperties = { width: '100%', boxSizing: 'border-box', background: '#FAFAFA', padding: '12px 14px', borderRadius: '3px', fontSize: '14px', color: INK, fontFamily: 'Roboto, sans-serif', outline: 'none' }
  const border = (err?: string) => `1px solid ${err ? '#C0392B' : HAIRLINE}`
  const errStyle: React.CSSProperties = { color: '#C0392B', fontSize: '11px', fontFamily: 'Roboto, sans-serif', margin: '6px 0 0' }

  const validate = () => {
    const next: Record<string, string> = {}
    if (!name.trim()) next.name = 'Name is required.'
    if (!company.trim()) next.company = 'Company is required.'
    if (!email.trim()) next.email = 'Work email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = 'Enter a valid email address.'
    setErrors(next)
    return Object.keys(next).length === 0
  }
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setStatus('submitting')
    try {
      await submitAudit({ name: name.trim(), company: company.trim(), email: email.trim(), revenue, challenge })
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div style={{ background: 'white', border: `1px solid ${HAIRLINE}`, padding: 'clamp(24px,3vw,40px)' }}>
        <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '20px', fontWeight: 800, color: INK, margin: '0 0 10px', letterSpacing: '-0.01em' }}>Request received.</p>
        <p style={body('14px')}>Thanks, {name.trim().split(' ')[0] || 'there'}. Arushi will confirm your Fast Positioning Audit within one business day.</p>
      </div>
    )
  }
  return (
    <form onSubmit={onSubmit} noValidate style={{ background: 'white', border: `1px solid ${HAIRLINE}`, padding: 'clamp(24px,3vw,40px)' }}>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="cs-audit-name" style={label}>Name *</label>
        <input id="cs-audit-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" style={{ ...fieldBase, border: border(errors.name) }} />
        {errors.name && <p style={errStyle}>{errors.name}</p>}
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="cs-audit-company" style={label}>Company *</label>
        <input id="cs-audit-company" type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company name" style={{ ...fieldBase, border: border(errors.company) }} />
        {errors.company && <p style={errStyle}>{errors.company}</p>}
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="cs-audit-email" style={label}>Work email *</label>
        <input id="cs-audit-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" style={{ ...fieldBase, border: border(errors.email) }} />
        {errors.email && <p style={errStyle}>{errors.email}</p>}
      </div>
      <div style={{ marginBottom: '20px' }}>
        <p style={label}>Revenue range *</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {['$25M-$50M', '$50M-$100M', '$100M-$250M', '$250M+'].map((r) => (
            <Chip key={r} label={r} selected={revenue === r} onClick={() => setRevenue(r)} />
          ))}
        </div>
      </div>
      <div style={{ marginBottom: '28px' }}>
        <p style={label}>Primary challenge *</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {['Lead quality', 'Conversion', 'Differentiation', 'Other'].map((c) => (
            <Chip key={c} label={c} selected={challenge === c} onClick={() => setChallenge(c)} />
          ))}
        </div>
      </div>
      {status === 'error' && <p style={{ ...errStyle, marginBottom: '14px' }}>Something went wrong. Please try again.</p>}
      <button
        type="submit"
        disabled={status === 'submitting'}
        style={{ background: AMBER, color: INK, padding: '14px 28px', borderRadius: '3px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Montserrat, sans-serif', cursor: status === 'submitting' ? 'wait' : 'pointer', border: 'none', opacity: status === 'submitting' ? 0.7 : 1 }}
      >
        {status === 'submitting' ? 'Sending…' : 'Request Your Audit →'}
      </button>
    </form>
  )
}

// Static schematic — The Spread's 3 nodes (Sales / Marketing / Leadership) fed
// by one story. Flat line-work per the pivot bar; no motion.
function SpreadSchematic() {
  const node: React.CSSProperties = { fontFamily: MONO, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', fill: INK }
  return (
    <svg viewBox="0 0 720 260" role="img" aria-label="One story feeding Sales, Marketing, and Leadership" style={{ width: '100%', maxWidth: '720px', height: 'auto', display: 'block' }}>
      <rect x="40" y="106" width="150" height="48" fill={AMBER} />
      <text x="115" y="134" textAnchor="middle" style={{ ...node, fontWeight: 700 }}>One Story</text>
      <line x1="190" y1="130" x2="300" y2="130" stroke={INK} strokeWidth="1.5" />
      <line x1="300" y1="130" x2="300" y2="40" stroke={INK} strokeWidth="1.5" />
      <line x1="300" y1="130" x2="300" y2="220" stroke={INK} strokeWidth="1.5" />
      <line x1="300" y1="40" x2="420" y2="40" stroke={INK} strokeWidth="1.5" />
      <line x1="300" y1="130" x2="420" y2="130" stroke={INK} strokeWidth="1.5" />
      <line x1="300" y1="220" x2="420" y2="220" stroke={INK} strokeWidth="1.5" />
      {[
        { y: 16, label: 'Sales' },
        { y: 106, label: 'Marketing' },
        { y: 196, label: 'Leadership' },
      ].map(({ y, label }) => (
        <g key={label}>
          <rect x="420" y={y} width="160" height="48" fill="white" stroke={INK} strokeWidth="1.5" />
          <text x="500" y={y + 28} textAnchor="middle" style={node}>{label}</text>
          <circle cx="600" cy={y + 24} r="4" fill={AMBER} />
        </g>
      ))}
    </svg>
  )
}

const CLIENTS = ['Harth Builders', "Donnelly's HVAC", 'Lindsey Wilson', 'Liaison', 'Paul Downs', 'Lilly Fasteners', 'PE Portfolio']

const PHASES = [
  { n: '01', tag: 'Diagnose', title: 'Fast Positioning Audit', chip: '5 business days', copy: '5 business days. A senior strategist runs structured discovery, audits your commercial story, delivers a written diagnosis with named differentiators and three priority interventions.' },
  { n: '02', tag: 'Align', title: 'Your Unified Story', chip: '4–6 weeks', copy: '4–6 weeks. Leadership alignment. One unified story built from the audit — across every channel and team.' },
  { n: '03', tag: 'Activate', title: 'Activate Across Every Channel', chip: '8–12 weeks', copy: '8–12 weeks. Every channel, every team, aligned. Website, sales enablement, content, paid acquisition — synchronized.' },
  { n: '04', tag: 'Optimize', title: '60/90-Day Audits', chip: '60/90 days', copy: 'The market moves. The competitive frame shifts. We audit what got into the wild and tune it.' },
]

const INDUSTRIES = [
  { n: '01', title: 'Professional Services', copy: '$25M–$250M. Accounting, consulting, financial advisory, staffing.' },
  { n: '02', title: 'Home Services & Trades', copy: '$25M–$250M. HVAC, contractors, luxury residential.' },
  { n: '03', title: 'Law Firms', copy: '$25M–$250M+. Misaligned messaging is a tax on the firm.' },
  { n: '04', title: 'PE Operating Partners', copy: '$100M–$5B AUM. Portfolio value creation.' },
  { n: '05', title: 'Mission-Driven', copy: 'Universities, colleges, nonprofits, foundations.' },
]

const STATS = [
  { number: '$2.8M+', label: 'PE Portfolio · Year-1 revenue lift' },
  { number: '+40%', label: 'Home Services · Qualified leads' },
  { number: '+25%', label: 'Home Services · Close rate' },
  { number: '+35%', label: 'PE Portfolio · Avg qualified leads' },
  { number: '+22%', label: 'PE Portfolio · Sales cycle compression' },
  { number: '+18%', label: 'Home Services · Revenue per customer' },
]

const container: React.CSSProperties = { maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(20px, 4vw, 48px)' }
const sectionPad: React.CSSProperties = { padding: 'clamp(72px, 9vw, 130px) 0' }

export function ConceptStrativ() {
  return (
    <div style={{ background: '#FAFAFA', minHeight: '100vh' }}>
      <Meta
        title="StoryCycle™ · One Story. Every Channel. More Qualified Leads."
        description="StoryCycle fixes pipeline conversion at the system level. One unified commercial narrative, activated across every channel and team."
      />
      <style>{`
        @keyframes cs-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .cs-marquee-track { display: flex; width: max-content; animation: cs-marquee 32s linear infinite; }
        .cs-fade { animation: cs-fade-in 0.5s ease; }
        @keyframes cs-fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        .cs-card { transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease; }
        .cs-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(37,40,42,0.08); border-color: rgba(37,40,42,0.28); }
        @media (prefers-reduced-motion: reduce) {
          .cs-marquee-track { animation: none; }
          .cs-fade { animation: none; }
          .cs-card, .cs-card:hover { transition: none; transform: none; }
        }
      `}</style>

      {/* ── NAV ── sticky, hairline, light */}
      <header style={{ position: 'sticky', top: 0, zIndex: 40, background: 'rgba(250,250,250,0.92)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${HAIRLINE}` }}>
        <div style={{ ...container, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px' }}>
          <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: '15px', letterSpacing: '0.06em', color: INK }}>
            STORYCYCLE<span style={{ color: AMBER }}>™</span>
          </span>
          <nav style={{ gap: '28px', alignItems: 'center' }} className="hidden md:flex">
            {[
              ['How It Works', '#phases'],
              ["Who It's For", '#industries'],
              ['Results', '#results'],
              ['Insights', '#insights'],
            ].map(([label, href]) => (
              <a key={href} href={href} style={{ ...body('13px', INK), textDecoration: 'none', fontWeight: 500 }}>{label}</a>
            ))}
          </nav>
          <a href="#audit" style={{ background: INK, color: 'white', padding: '10px 20px', fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', textDecoration: 'none' }}>
            Request an Audit
          </a>
        </div>
      </header>

      {/* ── HERO ── chip + H1 + sub + CTA + rotating quote card */}
      <section style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
        <div style={{ ...container, padding: 'clamp(80px, 10vw, 150px) clamp(20px, 4vw, 48px) clamp(64px, 8vw, 110px)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', border: `1px solid ${HAIRLINE}`, background: 'white', padding: '7px 14px', borderRadius: '999px', marginBottom: '32px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: AMBER }} />
            <span style={{ fontFamily: MONO, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: INK }}>The story underneath your pipeline</span>
          </div>
          <WordReveal as="h1" text="Your pipeline is full. Your sales aren't converting." style={{ ...display('clamp(2.6rem, 6vw, 4.8rem)', 800), maxWidth: '900px' }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '48px', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '40px' }}>
            <div style={{ maxWidth: '520px' }}>
              <p style={body('clamp(16px, 1.6vw, 19px)')}>
                StoryCycle fixes it at the system level. <strong style={{ color: INK }}>One commercial narrative, activated across every channel and team.</strong>
              </p>
              <Link to="/fast-positioning-audit" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: AMBER, color: INK, padding: '16px 28px', fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', textDecoration: 'none', marginTop: '28px' }}>
                Request Your Fast Positioning Audit <ArrowRight size={16} />
              </Link>
            </div>
            <QuoteRotator />
          </div>
        </div>
      </section>

      {/* ── MECHANISM ── two-column statement */}
      <section style={{ background: 'white', borderBottom: `1px solid ${HAIRLINE}` }}>
        <div style={{ ...container, ...sectionPad }}>
          <MonoLabel>The Mechanism</MonoLabel>
          <WordReveal text="It's not your marketing. It's the story underneath it." style={{ ...display('clamp(1.9rem, 3.6vw, 3rem)'), maxWidth: '760px' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(28px, 4vw, 64px)', marginTop: '48px' }}>
            <p style={body()}>Marketing spend goes up. Pipeline volume goes up. Conversion stays flat. Buyers see five versions of you and pick the one easiest to commoditize.</p>
            <p style={body()}>StoryCycle is the operating system that fixes this. Not a campaign, not a rebrand. A unified commercial narrative, activated across every channel and team, measured against pipeline conversion.</p>
          </div>
        </div>
      </section>

      {/* ── PHASES ── numbered feature panels 01–04 */}
      <section id="phases" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
        <div style={{ ...container, ...sectionPad }}>
          <MonoLabel>Four phases. One operating system.</MonoLabel>
          <WordReveal text="Stop improvising. Start operating." style={{ ...display('clamp(1.9rem, 3.6vw, 3rem)'), maxWidth: '640px' }} />
          <div style={{ marginTop: '56px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {PHASES.map((p) => (
              <div key={p.n} className="cs-card" style={{ background: 'white', border: `1px solid ${HAIRLINE}`, padding: 'clamp(24px, 3vw, 40px)', display: 'grid', gridTemplateColumns: 'minmax(60px, 90px) 1fr', gap: 'clamp(16px, 3vw, 40px)', alignItems: 'start' }}>
                <span style={{ fontFamily: MONO, fontSize: 'clamp(1.4rem, 2.4vw, 2rem)', color: AMBER, fontWeight: 400 }}>{p.n}</span>
                <div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontFamily: MONO, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: MUTED }}>Phase {p.n} · {p.tag}</span>
                    <span style={{ fontFamily: MONO, fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: INK, border: `1px solid ${HAIRLINE}`, borderRadius: '999px', padding: '4px 12px' }}>{p.chip}</span>
                  </div>
                  <h3 style={{ ...display('clamp(1.3rem, 2.2vw, 1.8rem)'), marginBottom: '12px' }}>{p.title}</h3>
                  <p style={{ ...body('15px'), maxWidth: '640px' }}>{p.copy}</p>
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: MONO, fontSize: '11px', color: AMBER, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600, textAlign: 'center', margin: '40px 0 0' }}>
            One senior strategist, start to finish. No handoffs.
          </p>
        </div>
      </section>

      {/* ── CLIENT MARQUEE ── */}
      <section style={{ background: 'white', borderBottom: `1px solid ${HAIRLINE}`, padding: '28px 0', overflow: 'hidden' }} aria-label="Client engagements">
        <div className="cs-marquee-track">
          {[0, 1].map((half) => (
            <div key={half} aria-hidden={half === 1} style={{ display: 'flex' }}>
              {CLIENTS.map((c) => (
                <span key={`${half}-${c}`} style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '15px', letterSpacing: '0.08em', textTransform: 'uppercase', color: MUTED, padding: '0 36px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '36px' }}>
                  {c} <span style={{ color: AMBER }}>·</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── RESULTS ── dark stat band with count-ups */}
      <section id="results" style={{ background: INK }}>
        <div style={{ ...container, ...sectionPad }}>
          <MonoLabel light>Results</MonoLabel>
          <WordReveal text="Documented across five verticals." style={{ ...display('clamp(1.9rem, 3.6vw, 3rem)'), color: 'white', maxWidth: '640px' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 'clamp(32px, 4vw, 56px)', marginTop: '64px' }}>
            {STATS.map((s) => <CountStat key={s.label} number={s.number} label={s.label} />)}
          </div>

          {/* Featured case study — Harth */}
          <div style={{ marginTop: 'clamp(56px, 7vw, 90px)', background: 'white', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            <div style={{ padding: 'clamp(28px, 4vw, 56px)' }}>
              <p style={{ fontFamily: MONO, fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: MUTED, margin: '0 0 18px' }}>Case Study · Harth Builders</p>
              <h3 style={{ ...display('clamp(1.5rem, 2.6vw, 2.2rem)') }}>Selling like a commodity. Despite exceptional work.</h3>
              <p style={{ ...body('15px'), margin: '18px 0 28px', maxWidth: '480px' }}>
                Harth Builders, luxury residential design-build on Philadelphia's Main Line. A story that wasn't reaching the buyers it deserved.
              </p>
              <Link to="/results/harth-builders" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: INK, textDecoration: 'none', borderBottom: `2px solid ${AMBER}`, paddingBottom: '4px' }}>
                Read the Harth case study <ArrowRight size={15} />
              </Link>
            </div>
            <div style={{ padding: 'clamp(28px, 4vw, 56px)', background: '#FAFAFA', borderLeft: `1px solid ${HAIRLINE}`, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ width: '32px', height: '3px', background: AMBER, display: 'block', marginBottom: '20px' }} />
              <p style={{ ...display('clamp(1.1rem, 1.8vw, 1.4rem)', 600), lineHeight: 1.35 }}>
                &ldquo;Craft is a standard, not a trade. Every decision made on the job site is a reflection of that.&rdquo;
              </p>
              <p style={{ fontFamily: MONO, fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED, margin: '18px 0 0' }}>Harth Builders · Luxury Design-Build</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHO IT'S FOR ── numbered cards */}
      <section id="industries" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
        <div style={{ ...container, ...sectionPad }}>
          <MonoLabel>Who It's For</MonoLabel>
          <WordReveal text="Different industries. Same broken story." style={{ ...display('clamp(1.9rem, 3.6vw, 3rem)'), maxWidth: '680px' }} />
          <p style={{ ...body(), marginTop: '20px' }}>Different categories. Same root cause.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginTop: '56px' }}>
            {INDUSTRIES.map((t) => (
              <div key={t.n} className="cs-card" style={{ background: 'white', border: `1px solid ${HAIRLINE}`, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '14px', minHeight: '190px' }}>
                <span style={{ fontFamily: MONO, fontSize: '12px', color: AMBER }}>{t.n}</span>
                <h3 style={{ ...display('17px'), letterSpacing: '-0.01em' }}>{t.title}</h3>
                <p style={{ ...body('13.5px'), marginTop: 'auto' }}>{t.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE SPREAD ── static schematic */}
      <section style={{ background: 'white', borderBottom: `1px solid ${HAIRLINE}` }}>
        <div style={{ ...container, ...sectionPad }}>
          <MonoLabel>The Spread</MonoLabel>
          <WordReveal text="One story. Every channel. More qualified leads." style={{ ...display('clamp(1.9rem, 3.6vw, 3rem)'), maxWidth: '760px' }} />
          <p style={{ ...body(), maxWidth: '640px', marginTop: '20px' }}>
            StoryCycle puts one unified story to work across every team and touchpoint — simultaneously. Not a campaign. An operating system.
          </p>
          <div style={{ marginTop: '56px' }}>
            <SpreadSchematic />
          </div>
          <p style={{ ...body('15px', INK), maxWidth: '560px', marginTop: '32px' }}>
            When these three tell the same story, pipeline converts. When they don't, it leaks.
          </p>
        </div>
      </section>

      {/* ── MID CTA BANNER ── amber */}
      <section style={{ background: AMBER }}>
        <div style={{ ...container, padding: 'clamp(56px, 7vw, 96px) clamp(20px, 4vw, 48px)', display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ maxWidth: '640px' }}>
            <WordReveal text="Break the cycle of slow. Start with a five-day diagnosis." style={{ ...display('clamp(1.8rem, 3.4vw, 2.8rem)', 800) }} />
            <p style={{ ...body('15px', 'rgba(37,40,42,0.75)'), marginTop: '16px' }}>The Fast Positioning Audit is valuable whether or not you proceed. Most clients say so.</p>
          </div>
          <a href="#audit" style={{ background: INK, color: 'white', padding: '18px 32px', fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            Request an Audit <ArrowRight size={16} />
          </a>
        </div>
      </section>

      {/* ── INSIGHTS ── 3-up, flat graphic thumbnails (no photography) */}
      <section id="insights" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
        <div style={{ ...container, ...sectionPad }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <MonoLabel>Insights</MonoLabel>
              <WordReveal text="Written for the operator. Not the agency." style={{ ...display('clamp(1.9rem, 3.6vw, 3rem)'), maxWidth: '680px' }} />
            </div>
            <Link to="/insights" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: INK, textDecoration: 'none', borderBottom: `2px solid ${AMBER}`, paddingBottom: '4px' }}>
              See all 13 articles <ArrowRight size={15} />
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginTop: '56px' }}>
            {[1, 2, 3].map((n) => (
              <a key={n} href="#" className="cs-card" style={{ display: 'block', background: 'white', border: `1px solid ${HAIRLINE}`, textDecoration: 'none' }}>
                <div style={{ aspectRatio: '4 / 3', background: INK, position: 'relative', overflow: 'hidden' }}>
                  <span style={{ position: 'absolute', bottom: '16px', left: '20px', fontFamily: MONO, fontSize: '52px', color: AMBER, opacity: 0.9, lineHeight: 1 }}>{String(n).padStart(2, '0')}</span>
                  <span style={{ position: 'absolute', top: '16px', right: '16px', width: '10px', height: '10px', background: AMBER }} />
                </div>
                <div style={{ padding: '20px' }}>
                  <span style={{ fontFamily: MONO, fontSize: '10px', color: AMBER, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>Article {String(n).padStart(2, '0')}</span>
                  <h3 style={{ ...display('16px'), margin: '8px 0 0' }}>Featured Article {String(n).padStart(2, '0')}</h3>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginTop: '14px', fontFamily: MONO, fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: MUTED }}>
                    Read on LinkedIn <ArrowUpRight size={13} strokeWidth={2.5} />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── numbered accordion */}
      <section style={{ background: 'white', borderBottom: `1px solid ${HAIRLINE}` }}>
        <div style={{ ...container, ...sectionPad, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'clamp(40px, 6vw, 96px)' }}>
          <div>
            <MonoLabel>Frequently Asked</MonoLabel>
            <WordReveal text="Is this right for you?" style={{ ...display('clamp(1.7rem, 3vw, 2.5rem)') }} />
            <div style={{ marginTop: '32px', background: '#FAFAFA', border: `1px solid ${HAIRLINE}`, padding: '24px' }}>
              <p style={{ ...body('14px', INK), fontWeight: 700, marginBottom: '8px' }}>Standalone value</p>
              <p style={body('14px')}>The Fast Positioning Audit is valuable whether or not you proceed. Most clients say so.</p>
              <a href="#audit" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '16px', fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: INK, textDecoration: 'none', borderBottom: `2px solid ${AMBER}`, paddingBottom: '3px' }}>
                Request an Audit <ArrowRight size={14} />
              </a>
            </div>
          </div>
          <Accordion />
        </div>
      </section>

      {/* ── AUDIT FORM ── split: delivery timeline + form */}
      <section id="audit">
        <div style={{ ...container, ...sectionPad, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'clamp(40px, 6vw, 96px)', alignItems: 'start' }}>
          <div>
            <MonoLabel>Request the Audit</MonoLabel>
            <WordReveal text="Start the five-day diagnosis." style={{ ...display('clamp(1.9rem, 3.6vw, 3rem)') }} />
            <p style={{ ...body(), marginTop: '20px', maxWidth: '480px' }}>
              Five business days. A senior strategist runs structured discovery, audits your commercial story, delivers a written diagnosis with named differentiators and three priority interventions.
            </p>
            <div style={{ marginTop: '36px', display: 'flex', flexDirection: 'column' }}>
              {[
                ['Day 1–2', 'Structured discovery with leadership. 2 hours recorded conversation.'],
                ['Day 2–3', 'Commercial narrative audit across website, sales materials, deck, live messaging.'],
                ['Day 4', 'Synthesis. Where the story is unified. Where it fragments.'],
                ['Day 5', 'Written diagnosis delivered. Named differentiators. Three priority interventions.'],
              ].map(([d, c]) => (
                <div key={d} style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: '20px', padding: '16px 0', borderTop: `1px solid ${HAIRLINE}` }}>
                  <span style={{ fontFamily: MONO, fontSize: '12px', color: AMBER, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{d}</span>
                  <p style={body('14px')}>{c}</p>
                </div>
              ))}
            </div>
          </div>
          <AuditForm />
        </div>
      </section>

      {/* ── FOOTER ── charcoal, columns + copyright (copy verbatim from Footer.tsx) */}
      <footer style={{ background: INK }}>
        <div style={{ ...container, padding: 'clamp(56px, 7vw, 90px) clamp(20px, 4vw, 48px) 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'clamp(32px, 3vw, 48px)', paddingBottom: 'clamp(40px, 5vw, 64px)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div>
              <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: '15px', letterSpacing: '0.06em', color: 'white' }}>
                STORYCYCLE<span style={{ color: AMBER }}>™</span>
              </span>
              <p style={{ ...body('13px', 'rgba(255,255,255,0.45)'), maxWidth: '240px', marginTop: '16px' }}>
                The operating system for growth-stage companies whose marketing investment isn't producing the pipeline conversion their work deserves.
              </p>
            </div>
            <div>
              <p style={{ fontFamily: MONO, fontSize: '10px', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', margin: '0 0 16px' }}>Pages</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {FOOTER_PAGES.map((l) => (
                  <Link key={l.to} to={l.to} style={{ ...body('14px', 'rgba(255,255,255,0.6)'), textDecoration: 'none' }}>{l.label}</Link>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontFamily: MONO, fontSize: '10px', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', margin: '0 0 16px' }}>Industries</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {FOOTER_INDUSTRIES.map((l) => (
                  <Link key={l.to} to={l.to} style={{ ...body('14px', 'rgba(255,255,255,0.6)'), textDecoration: 'none' }}>{l.label}</Link>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontFamily: MONO, fontSize: '10px', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', margin: '0 0 16px' }}>Connect</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {FOOTER_CONNECT.map((l) => (
                  <span key={l} style={{ ...body('14px', 'rgba(255,255,255,0.6)') }}>{l}</span>
                ))}
              </div>
            </div>
          </div>
          <div style={{ marginTop: '32px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '16px 24px' }}>
            <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em', margin: 0 }}>
              © 2026 BOWSTRING STUDIOS, OPERATING AS STORYCYCLE™. STORYCYCLE™ AND BOWSTRING® ARE TRADEMARKS OF AURORA IMAGING CO.
            </p>
            <div style={{ display: 'flex', gap: '24px' }}>
              {['PRIVACY', 'TERMS'].map((l) => (
                <span key={l} style={{ fontFamily: 'Roboto, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em' }}>{l}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
