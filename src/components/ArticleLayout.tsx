import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Reveal, CTA, CTASecondary } from './primitives'
import patternCircles from '../assets/pattern-circles.svg'

// ─────────────────────────────────────────────────────────
// ARTICLE LAYOUT — Insights article-detail pages.
// Adapted from the "Narrative-Led Marketing Article" design
// (Claude Design project 3ff1be91…) into the site's existing
// Fabrica primitives/tokens — same palette, same Layout/Nav/
// Footer as every other page, no separate Bowstring header.
// ─────────────────────────────────────────────────────────

const INK = '#25282A'
const AMBER = '#FBB03B'
const COOL = '#53565A'
const CREAM_CARD = '#F5F1EA'

function initials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

// Splits `text` around the last occurrence of `underline` (case-insensitive),
// preserving the original casing of the matched span.
function splitUnderline(text: string, underline: string) {
  const idx = text.toLowerCase().lastIndexOf(underline.toLowerCase())
  if (idx === -1) return { before: text, matched: underline, after: '' }
  return {
    before: text.slice(0, idx),
    matched: text.slice(idx, idx + underline.length),
    after: text.slice(idx + underline.length),
  }
}

function ImageBox({ src, alt }: { src?: string; alt?: string }) {
  return src ? (
    <img
      src={src}
      alt={alt ?? ''}
      style={{ display: 'block', width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: 'var(--radius-card)' }}
    />
  ) : (
    <div
      className="relative"
      style={{ aspectRatio: '1/1', borderRadius: 'var(--radius-card)', background: `linear-gradient(160deg, ${INK} 0%, #34383a 100%)`, overflow: 'hidden' }}
    >
      <img src={patternCircles} alt="" style={{ position: 'absolute', right: '-80px', top: '-80px', width: '380px', opacity: 0.5 }} />
    </div>
  )
}

// ArticleMain wraps the hero text + full body in ONE grid row alongside the
// image column. Row height follows the (long) text+body column, not the
// image, so the article text starts right after the byline instead of
// waiting for a tall image to clear — the original bug.
export function ArticleMain({
  heroImage,
  heroAlt,
  children,
}: {
  heroImage?: string
  heroAlt?: string
  children: React.ReactNode
}) {
  return (
    <section className="sc-section">
      <div className="sc-container grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-start">
        <div style={{ maxWidth: '720px' }}>{children}</div>
        <div className="hidden lg:block">
          <Reveal delay={0.1}>
            <ImageBox src={heroImage} alt={heroAlt} />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export function ArticleHero({
  category,
  title,
  underline,
  sub,
  author = 'Andy Hayman',
  date,
  readTime,
  heroImage,
  heroAlt,
}: {
  category: string
  title: string
  underline: string
  sub: string
  author?: string
  date: string
  readTime: string
  heroImage?: string
  heroAlt?: string
}) {
  const { before, matched, after } = splitUnderline(title, underline)

  return (
    <Reveal>
      <div className="flex items-center gap-3 mb-7">
        <span
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: INK,
            background: AMBER,
            padding: '6px 12px',
            borderRadius: '999px',
          }}
        >
          Insights
        </span>
        <span
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '11px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'rgba(37,40,42,0.45)',
          }}
        >
          {category}
        </span>
      </div>
      <h1
        className="fab-display"
        style={{ fontSize: 'clamp(2.2rem,4.4vw,3.4rem)', color: INK, margin: '0 0 24px', textWrap: 'balance' as React.CSSProperties['textWrap'] }}
      >
        {before}
        <span style={{ display: 'inline-block', position: 'relative', paddingBottom: '6px' }}>
          {matched}
          <span style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '8px', background: AMBER, borderRadius: '1px' }} />
        </span>
        {after}
      </h1>
      <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '18px', lineHeight: 1.6, color: 'rgba(37,40,42,0.7)', margin: '0 0 32px', maxWidth: '34em' }}>
        {sub}
      </p>
      <div className="flex items-center gap-4 pt-6" style={{ borderTop: '1px solid rgba(37,40,42,0.14)' }}>
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '999px',
            background: AMBER,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 800,
            fontSize: '14px',
            color: INK,
          }}
        >
          {initials(author)}
        </div>
        <div className="flex flex-col gap-0.5">
          <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '14px', fontWeight: 700, color: INK }}>{author}</span>
          <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '13px', color: 'rgba(37,40,42,0.45)' }}>{date} · {readTime}</span>
        </div>
      </div>
      {/* Mobile-only inline image — the sticky column beside it is desktop-only (lg:hidden there, visible here) */}
      <div className="lg:hidden" style={{ marginTop: 'var(--space-element)' }}>
        <ImageBox src={heroImage} alt={heroAlt} />
      </div>
    </Reveal>
  )
}

export function ArticleProse({ children }: { children: React.ReactNode }) {
  return (
    <article style={{ marginTop: 'var(--space-element)', fontFamily: 'Roboto, sans-serif', fontSize: '17px', lineHeight: 1.75, color: COOL }}>
      {children}
    </article>
  )
}

export function ArticleP({ children }: { children: React.ReactNode }) {
  return <p style={{ margin: '0 0 24px' }}>{children}</p>
}

export function ArticleH2({ children, num }: { children: React.ReactNode; num?: string }) {
  return (
    <>
      <h2
        className="fab-display"
        style={{ fontSize: 'clamp(1.3rem,2.2vw,1.6rem)', color: INK, margin: '56px 0 8px', display: 'flex', alignItems: 'baseline', gap: '14px' }}
      >
        {num && <span style={{ color: AMBER, fontSize: '15px', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{num.padStart(2, '0')}</span>}
        {children}
      </h2>
      <div style={{ width: '48px', height: '4px', background: AMBER, margin: '0 0 26px' }} />
    </>
  )
}

export function ArticleList({ items }: { items: string[] }) {
  return (
    <ul style={{ listStyle: 'none', margin: '0 0 28px', padding: 0, display: 'grid', gap: '12px' }}>
      {items.map((item, i) => (
        <li key={i} className="flex gap-3.5 items-baseline">
          <span style={{ width: '7px', height: '7px', background: AMBER, flexShrink: 0, transform: 'translateY(-2px)' }} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function ArticlePullQuote({ children }: { children: React.ReactNode }) {
  return (
    <figure style={{ margin: '44px 0', padding: '32px 0', borderTop: '1px solid rgba(83,86,90,0.3)', borderBottom: '1px solid rgba(83,86,90,0.3)' }}>
      <p className="fab-display" style={{ fontSize: 'clamp(1.3rem,2.4vw,1.7rem)', color: INK, margin: 0, lineHeight: 1.25 }}>
        {children}
      </p>
    </figure>
  )
}

export function ArticleGrid({ items }: { items: string[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-px mb-7" style={{ background: 'rgba(83,86,90,0.14)', border: '1px solid rgba(83,86,90,0.14)', borderRadius: 'var(--radius-tile)', overflow: 'hidden' }}>
      {items.map((item, i) => (
        <div key={i} style={{ background: '#FFFFFF', padding: '22px 24px' }}>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', color: AMBER, marginBottom: '8px' }}>
            {String(i + 1).padStart(2, '0')}
          </div>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '16px', fontWeight: 700, color: INK, lineHeight: 1.3 }}>{item}</div>
        </div>
      ))}
    </div>
  )
}

export function ArticleHighlight({ label, items }: { label: string; items: string[] }) {
  return (
    <div style={{ background: CREAM_CARD, borderRadius: 'var(--radius-card)', padding: 'clamp(24px,3vw,34px)', margin: '0 0 28px' }}>
      <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#89441E', marginBottom: '18px' }}>
        {label}
      </div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: '14px' }}>
        {items.map((item, i) => (
          <li key={i} className="flex gap-3.5 items-baseline" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '17px', fontWeight: 600, color: INK }}>
            <span style={{ width: '7px', height: '7px', background: AMBER, flexShrink: 0, transform: 'translateY(-2px)' }} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ArticleCTABand({
  eyebrow = 'Story first, solution-focused',
  heading,
  underline,
  body,
}: {
  eyebrow?: string
  heading: string
  underline: string
  body: string
}) {
  const { before, matched, after } = splitUnderline(heading, underline)
  return (
    <section className="relative overflow-hidden" style={{ background: INK }}>
      <img src={patternCircles} alt="" className="absolute pointer-events-none" style={{ right: '-120px', top: '-140px', width: '620px', opacity: 0.22 }} />
      <div className="sc-container relative grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center" style={{ paddingTop: 'clamp(64px,9vh,88px)', paddingBottom: 'clamp(64px,9vh,88px)' }}>
        <Reveal>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: AMBER, marginBottom: '18px' }}>
            {eyebrow}
          </div>
          <h2 className="fab-display" style={{ fontSize: 'clamp(1.8rem,3.6vw,2.6rem)', color: '#FFFFFF', margin: '0 0 18px' }}>
            {before}
            <span style={{ display: 'inline-block', position: 'relative', paddingBottom: '6px' }}>
              {matched}
              <span style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '7px', background: AMBER, borderRadius: '1px' }} />
            </span>
            {after}
          </h2>
          <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '17px', lineHeight: 1.65, color: '#D0D1D2', margin: 0, maxWidth: '36em' }}>{body}</p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="flex flex-col gap-4 items-start">
            <CTA />
            <CTASecondary label="See how StoryCycle™ works" to="/how-it-works" onDark />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function ArticleFooterNav({ to, label }: { to: string; label: string }) {
  return (
    <div className="sc-container" style={{ paddingTop: 'var(--space-block)', paddingBottom: 'var(--space-block)' }}>
      <Link
        to={to}
        className="inline-flex items-center gap-2"
        style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', fontWeight: 700, color: INK, textDecoration: 'none', borderBottom: `1px solid ${AMBER}`, paddingBottom: '3px' }}
      >
        ← {label}
      </Link>
    </div>
  )
}

export function ArticleNext({
  slug,
  category,
  title,
  date,
  readTime,
}: {
  slug: string
  category: string
  title: string
  date: string
  readTime: string
}) {
  return (
    <section className="sc-section" style={{ paddingTop: 0 }}>
      <div className="sc-container" style={{ maxWidth: '720px' }}>
        <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(37,40,42,0.45)', marginBottom: '18px' }}>
          Read Next
        </div>
        <Link to={`/insights/${slug}`} className="fab-card block group" style={{ textDecoration: 'none', padding: 'clamp(24px,3vw,36px)' }}>
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="fab-counter" style={{ marginBottom: '10px' }}>{category}</p>
              <h3 className="fab-display" style={{ fontSize: 'clamp(1.2rem,2.4vw,1.6rem)', color: INK, margin: '0 0 8px' }}>{title}</h3>
              <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '13px', color: 'rgba(37,40,42,0.5)' }}>{date} · {readTime}</span>
            </div>
            <ArrowRight className="flex-shrink-0 transition-transform group-hover:translate-x-1" style={{ width: '22px', height: '22px', color: AMBER }} />
          </div>
        </Link>
      </div>
    </section>
  )
}
