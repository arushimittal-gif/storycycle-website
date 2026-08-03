import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { CTA_COPY } from '../lib/brand'

// ─────────────────────────────────────────────────────────
// FABRICA SYSTEM PRIMITIVES
// Light editorial ground (cream #ECEAE3, ink #25282A), giant
// sentence-case display type, numbered counters, rounded
// surfaces, pill CTAs, hover list rows, numbered accordion.
// Amber #FBB03B is the single accent.
// ─────────────────────────────────────────────────────────

const INK = '#25282A'
const AMBER = '#FBB03B'
const CREAM = '#ECEAE3'

// ─────────────────────────────────────────────────────────
// Reveal — CSS-based fade-up. No JS-animation dependency, so
// content is always guaranteed to end visible.
// ─────────────────────────────────────────────────────────
export function Reveal({
  children,
  delay = 0,
  className = '',
  style,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div className={`sc-reveal ${className}`} style={{ animationDelay: `${delay}s`, ...style }}>
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Section — cream by default; `band` flips to the dark ground
// ─────────────────────────────────────────────────────────
export function Section({
  children,
  band = false,
  id,
}: {
  children: React.ReactNode
  band?: boolean
  id?: string
}) {
  return (
    <section id={id} className={`sc-section relative w-full ${band ? 'fab-band' : ''}`}>
      <div className="sc-container relative">{children}</div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────
// DisplayHeader — the Fabrica page/section opener: counter in
// the left margin, giant display head, optional right-column
// intro paragraph.
// ─────────────────────────────────────────────────────────
export function DisplayHeader({
  counter,
  title,
  intro,
  onDark = false,
  size = 'page',
}: {
  counter?: string
  title: React.ReactNode
  intro?: React.ReactNode
  onDark?: boolean
  size?: 'page' | 'section'
}) {
  const color = onDark ? CREAM : INK
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-6 lg:gap-x-8 items-end">
      <div className="lg:col-span-1">
        {counter && <span className="fab-counter">{counter}</span>}
      </div>
      <div className={intro ? 'lg:col-span-7' : 'lg:col-span-11'}>
        <h1
          className="fab-display"
          style={{
            fontSize: size === 'page' ? 'clamp(2.75rem, 8vw, 7rem)' : 'clamp(2rem, 4.5vw, 3.5rem)',
            color,
          }}
        >
          {title}
        </h1>
      </div>
      {intro && (
        <div className="lg:col-span-4 lg:pb-2">
          <div
            style={{
              fontFamily: 'Roboto, sans-serif',
              fontSize: '16px',
              lineHeight: 1.6,
              color: onDark ? 'rgba(236,234,227,0.72)' : 'rgba(37,40,42,0.72)',
            }}
          >
            {intro}
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Eyebrow — small label above headlines; optional counter
// ─────────────────────────────────────────────────────────
export function Eyebrow({ children, onDark = false }: { children: React.ReactNode; onDark?: boolean }) {
  return (
    <p
      style={{
        fontFamily: 'Roboto, sans-serif',
        fontSize: '12px',
        color: onDark ? 'rgba(236,234,227,0.6)' : 'rgba(37,40,42,0.55)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        fontWeight: 600,
        marginBottom: 'var(--space-tight)',
      }}
    >
      {children}
    </p>
  )
}

// ─────────────────────────────────────────────────────────
// Headlines — sentence case, Montserrat 700
// ─────────────────────────────────────────────────────────
export function Headline({
  children,
  hero = false,
  onDark = false,
  className = '',
}: {
  children: React.ReactNode
  hero?: boolean
  onDark?: boolean
  className?: string
}) {
  return (
    <h2
      className={`fab-display ${className}`}
      style={{
        fontSize: hero ? 'clamp(2.5rem, 6vw, 5rem)' : 'clamp(1.75rem, 4vw, 3rem)',
        color: onDark ? CREAM : INK,
      }}
    >
      {children}
    </h2>
  )
}

export function Body({ children, onDark = false, className = '' }: { children: React.ReactNode; onDark?: boolean; className?: string }) {
  return (
    <p
      className={className}
      style={{
        fontFamily: 'Roboto, sans-serif',
        fontSize: '15px',
        lineHeight: 1.65,
        color: onDark ? 'rgba(236,234,227,0.72)' : 'rgba(37,40,42,0.75)',
        margin: 0,
      }}
    >
      {children}
    </p>
  )
}

export function Sub({ children, onDark = false }: { children: React.ReactNode; onDark?: boolean }) {
  return (
    <p
      style={{
        fontFamily: 'Roboto, sans-serif',
        fontSize: 'clamp(1rem, 1.6vw, 1.25rem)',
        lineHeight: 1.5,
        color: onDark ? 'rgba(236,234,227,0.7)' : 'rgba(37,40,42,0.7)',
        margin: 0,
        maxWidth: '620px',
      }}
    >
      {children}
    </p>
  )
}

// ─────────────────────────────────────────────────────────
// CTA — amber pill with the arrow micro-animation
// ─────────────────────────────────────────────────────────
export function CTA({ label = CTA_COPY.auditPill, to = '/fast-positioning-audit' }: { label?: string; to?: string }) {
  const [arrowCycle, setArrowCycle] = useState(0)
  return (
    <Link
      to={to}
      className="fab-pill"
      onMouseEnter={() => setArrowCycle((p) => p + 1)}
      onMouseLeave={() => setArrowCycle((p) => p + 1)}
    >
      <span>{label}</span>
      <span className="relative overflow-hidden inline-flex" style={{ width: '18px', height: '18px' }}>
        {arrowCycle === 0 ? (
          <ArrowRight className="w-[18px] h-[18px]" />
        ) : (
          <>
            <ArrowRight key={`out-${arrowCycle}`} className="animate-fly-out absolute w-[18px] h-[18px]" />
            <ArrowRight key={`in-${arrowCycle}`} className="animate-fly-in w-[18px] h-[18px]" />
          </>
        )}
      </span>
    </Link>
  )
}

export function CTASecondary({ label, to = '#', onDark = false }: { label: string; to?: string; onDark?: boolean }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 cursor-pointer hover:gap-3 transition-all"
      style={{
        color: onDark ? CREAM : INK,
        fontFamily: 'Montserrat, sans-serif',
        fontSize: '13px',
        fontWeight: 700,
        letterSpacing: '0.01em',
        textDecoration: 'none',
        borderBottom: `1px solid ${AMBER}`,
        paddingBottom: '3px',
      }}
    >
      {label} <ArrowRight className="w-4 h-4" style={{ color: AMBER }} />
    </Link>
  )
}

// ─────────────────────────────────────────────────────────
// Stat — amber number + label, with count-up-on-scroll.
// Parses "$2.8M+", "+40%", "-35%", "82%" → animates the numeric
// core while preserving prefix/suffix. Respects reduced-motion.
// ─────────────────────────────────────────────────────────
function parseStat(value: string) {
  const m = value.match(/^([^\d-]*)(-?\d+(?:\.\d+)?)(.*)$/)
  if (!m) return { prefix: '', target: NaN, suffix: '', decimals: 0 }
  const [, prefix, num, suffix] = m
  const decimals = num.includes('.') ? num.split('.')[1].length : 0
  return { prefix, target: parseFloat(num), suffix, decimals }
}

export function Stat({ number, label, onDark = false }: { number: string; label: string; onDark?: boolean }) {
  const { prefix, target, suffix, decimals } = parseStat(number)
  // Final, correct value. Display ALWAYS initializes here so a counter can never
  // be stuck at 0 if the observer/RAF never runs.
  const final = Number.isNaN(target) ? number : prefix + target.toFixed(decimals) + suffix
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(final)

  useEffect(() => {
    if (Number.isNaN(target)) return
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setDisplay(final) // already final; explicit for clarity
      return
    }
    let raf = 0
    let start = 0
    let started = false
    let fallback = 0
    const DURATION = 1200
    const run = (t: number) => {
      if (!start) start = t
      const p = Math.min((t - start) / DURATION, 1)
      const eased = 1 - Math.pow(1 - p, 3) // ease-out cubic
      setDisplay(prefix + (target * eased).toFixed(decimals) + suffix)
      if (p < 1) raf = requestAnimationFrame(run)
    }
    const begin = () => {
      if (started) return
      started = true
      window.clearTimeout(fallback)
      setDisplay(prefix + (0).toFixed(decimals) + suffix) // reset to 0, then count up to final
      raf = requestAnimationFrame(run)
    }
    // Start immediately if the stat is already within the viewport on mount.
    const rect = el.getBoundingClientRect()
    const vh = window.innerHeight || document.documentElement.clientHeight
    if (rect.top < vh && rect.bottom > 0) begin()
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          begin()
          obs.disconnect()
        }
      },
      { threshold: 0, rootMargin: '0px 0px 0px 0px' },
    )
    obs.observe(el)
    // Insurance: if nothing ever triggers the count-up, guarantee the final value.
    fallback = window.setTimeout(() => {
      if (!started) setDisplay(final)
    }, 600)
    return () => {
      obs.disconnect()
      cancelAnimationFrame(raf)
      window.clearTimeout(fallback)
    }
  }, [target, prefix, suffix, decimals, final])

  return (
    <Reveal className="flex flex-col gap-2">
      <span
        ref={ref}
        className="fab-display"
        style={{ fontSize: 'clamp(2.5rem, 5vw, 4.25rem)', color: AMBER, fontVariantNumeric: 'tabular-nums', display: 'block' }}
      >
        {display}
      </span>
      <span
        style={{
          fontSize: '13px',
          color: onDark ? 'rgba(236,234,227,0.6)' : 'rgba(37,40,42,0.6)',
          lineHeight: 1.4,
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 500,
        }}
      >
        {label}
      </span>
    </Reveal>
  )
}

// StatRow — responsive grid wrapper for multi-stat blocks
export function StatRow({ children, cols = 3 }: { children: React.ReactNode; cols?: 2 | 3 | 4 }) {
  const colClass = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3', 4: 'grid-cols-2 lg:grid-cols-4' }[cols]
  return <div className={`grid grid-cols-1 ${colClass} gap-8`}>{children}</div>
}

// ─────────────────────────────────────────────────────────
// Tile / TileGrid — white cards on the cream ground
// ─────────────────────────────────────────────────────────
export function TileGrid({ cols = 3, children }: { cols?: 2 | 3 | 4 | 5; children: React.ReactNode }) {
  const colClass = { 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-2 lg:grid-cols-4', 5: 'sm:grid-cols-2 lg:grid-cols-5' }[cols]
  return <div className={`grid grid-cols-1 ${colClass} gap-4`}>{children}</div>
}

export function Tile({ title, eyebrow, children, span }: { title?: string; eyebrow?: string; children?: React.ReactNode; span?: number }) {
  return (
    <Reveal className="fab-card p-8 flex flex-col gap-3" style={span ? { gridColumn: `span ${span}` } : undefined}>
      <div>
        {eyebrow && (
          <p className="fab-counter" style={{ marginBottom: '10px' }}>{eyebrow}</p>
        )}
        {title && (
          <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '16px', fontWeight: 700, color: INK, letterSpacing: '-0.01em', margin: '0 0 8px' }}>{title}</h3>
        )}
        {children && (
          <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '13.5px', color: 'rgba(37,40,42,0.68)', lineHeight: 1.6, margin: 0 }}>{children}</p>
        )}
      </div>
    </Reveal>
  )
}

// OutcomeCard — "What changed" cards on case studies
export function OutcomeCard({ children }: { children: React.ReactNode }) {
  return (
    <Reveal className="fab-card p-6" style={{ borderLeft: `3px solid ${AMBER}` }}>
      <div>
        <p style={{ fontSize: '10px', color: 'rgba(37,40,42,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '8px', fontFamily: 'Roboto, sans-serif' }}>What changed</p>
        <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '14px', color: INK, lineHeight: 1.5, margin: 0, fontWeight: 500 }}>{children}</p>
      </div>
    </Reveal>
  )
}

// Quote — pull quote with amber rule
export function Quote({ children, onDark = false }: { children: React.ReactNode; onDark?: boolean }) {
  return (
    <p
      style={{
        fontStyle: 'italic',
        paddingLeft: '20px',
        borderLeft: `2px solid ${AMBER}`,
        margin: 'var(--space-element) 0 0',
        fontSize: '18px',
        lineHeight: 1.5,
        color: onDark ? 'rgba(236,234,227,0.85)' : 'rgba(37,40,42,0.85)',
        fontFamily: 'Roboto, sans-serif',
      }}
    >
      {children}
    </p>
  )
}

// ─────────────────────────────────────────────────────────
// ListRow — Fabrica hover row (case studies, insights, sources)
// ─────────────────────────────────────────────────────────
export function ListRow({
  index,
  title,
  meta,
  note,
  to,
  external = false,
  onDark = false,
}: {
  index?: string
  title: string
  meta?: string
  note?: string
  to: string
  external?: boolean
  onDark?: boolean
}) {
  const color = onDark ? CREAM : INK
  const inner = (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-6 items-baseline">
      <div className="md:col-span-1">
        {index && <span className="fab-counter">{index}</span>}
      </div>
      <div className="md:col-span-6">
        <span
          className="fab-row-title fab-display inline-block"
          style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', color }}
        >
          {title}
        </span>
      </div>
      <div className="md:col-span-4">
        {meta && (
          <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '13px', color: onDark ? 'rgba(236,234,227,0.55)' : 'rgba(37,40,42,0.55)' }}>
            {meta}
          </span>
        )}
        {note && (
          <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '13px', color: onDark ? 'rgba(236,234,227,0.55)' : 'rgba(37,40,42,0.55)', margin: meta ? '4px 0 0' : 0, lineHeight: 1.5 }}>
            {note}
          </p>
        )}
      </div>
      <div className="md:col-span-1 flex md:justify-end">
        {external ? (
          <ArrowUpRight className="fab-row-arrow w-5 h-5" style={{ color: AMBER }} />
        ) : (
          <ArrowRight className="fab-row-arrow w-5 h-5" style={{ color: AMBER }} />
        )}
      </div>
    </div>
  )
  if (external) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" className="fab-row">
        {inner}
      </a>
    )
  }
  return (
    <Link to={to} className="fab-row">
      {inner}
    </Link>
  )
}

// ─────────────────────────────────────────────────────────
// Accordion — numbered (001) expanding rows, one open at a time
// ─────────────────────────────────────────────────────────
export function Accordion({
  items,
  defaultOpen = 0,
}: {
  items: { num?: string; title: string; meta?: string; body: React.ReactNode }[]
  defaultOpen?: number
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen)
  return (
    <div>
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.title} className="fab-acc-item">
            <button className="fab-acc-trigger" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen}>
              {item.num && <span className="fab-counter" style={{ minWidth: '48px' }}>({item.num})</span>}
              <span
                className="fab-display flex-1"
                style={{ fontSize: 'clamp(1.35rem, 2.6vw, 2.1rem)', color: isOpen ? INK : 'rgba(37,40,42,0.75)' }}
              >
                {item.title}
              </span>
              {item.meta && (
                <span className="hidden md:inline" style={{ fontFamily: 'Roboto, sans-serif', fontSize: '13px', color: 'rgba(37,40,42,0.5)' }}>
                  {item.meta}
                </span>
              )}
              <span
                className="fab-counter"
                style={{
                  color: isOpen ? AMBER : 'rgba(37,40,42,0.4)',
                  fontSize: '20px',
                  fontWeight: 300,
                  transform: isOpen ? 'rotate(45deg)' : 'none',
                  transition: 'transform 0.3s ease',
                  display: 'inline-block',
                }}
              >
                +
              </span>
            </button>
            <div className={`fab-acc-body ${isOpen ? 'open' : ''}`}>
              <div>
                <div style={{ padding: '0 0 28px', maxWidth: '720px', marginLeft: 'clamp(0px, 6vw, 88px)' }}>
                  {typeof item.body === 'string' ? <Body>{item.body}</Body> : item.body}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// FrameCard — inset rounded charcoal frame (hero / case heads)
// ─────────────────────────────────────────────────────────
export function FrameCard({
  children,
  className = '',
  style,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div className={`fab-frame ${className}`} style={{ background: '#1D1F21', color: CREAM, ...style }}>
      {children}
    </div>
  )
}

// PlusMarks — a row of crop-mark "+" glyphs (Fabrica motif)
export function PlusMarks({ count = 4, onDark = false }: { count?: number; onDark?: boolean }) {
  return (
    <div className="flex justify-between w-full" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="fab-plus" style={{ color: onDark ? CREAM : INK }}>
          +
        </span>
      ))}
    </div>
  )
}
