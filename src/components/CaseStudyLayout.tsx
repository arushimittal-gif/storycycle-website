import { Reveal } from './primitives'

// ─────────────────────────────────────────────────────────
// Light editorial tier — case-study / proof pages.
// Ground: cream #ECEAE3  Ink: charcoal #25282A
// Amber: metrics + one rule line only.
// Headlines: sentence-case, weight 600 → reads as report, not poster.
// This tier contrasts directly with the dark cinematic pitch pages.
// ─────────────────────────────────────────────────────────

export function EditorialSection({ children }: { children: React.ReactNode }) {
  return (
    <section style={{ backgroundColor: '#ECEAE3', color: '#25282A' }}>
      <div
        className="sc-container"
        style={{ paddingTop: 'var(--space-block)', paddingBottom: 'var(--space-block)' }}
      >
        {children}
      </div>
    </section>
  )
}

// Two-column grid: left narrative prose, right rail (context / secondary)
export function EditorialGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-[var(--space-block)] items-start">
      {children}
    </div>
  )
}

export function EditorialLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: 'Roboto, sans-serif',
        fontSize: '11px',
        color: 'rgba(37,40,42,0.55)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        fontWeight: 600,
        marginBottom: 'var(--space-tight)',
        margin: '0 0 var(--space-tight)',
      }}
    >
      {children}
    </p>
  )
}

export function EditorialHeadline({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: 'Montserrat, sans-serif',
        fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
        fontWeight: 700,
        lineHeight: 1.05,
        letterSpacing: '-0.025em',
        color: '#25282A',
        margin: '0 0 var(--space-element)',
        textTransform: 'none',
      }}
    >
      {children}
    </h2>
  )
}

export function EditorialBody({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: 'Roboto, sans-serif',
        fontSize: '16px',
        lineHeight: 1.7,
        color: 'rgba(37,40,42,0.78)',
        margin: '0 0 var(--space-element)',
      }}
    >
      {children}
    </p>
  )
}

export function EditorialQuote({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        paddingLeft: '20px',
        borderLeft: '2px solid #FBB03B',
        margin: 'var(--space-element) 0 0',
      }}
    >
      <p
        style={{
          fontFamily: 'Roboto, sans-serif',
          fontStyle: 'italic',
          fontSize: '18px',
          lineHeight: 1.55,
          color: '#25282A',
          margin: 0,
        }}
      >
        {children}
      </p>
    </div>
  )
}

// EditorialStat — amber number + plain-language definition + optional context annotation.
// No Sparkline. No fake data. Each metric stands on its own sourced credibility.
export function EditorialStat({
  number,
  definition,
  annotation,
}: {
  number: string
  definition: string
  annotation?: string
}) {
  return (
    <Reveal className="flex flex-col gap-1">
      <span
        style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: 'clamp(2.25rem, 4vw, 3.25rem)',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: '#FBB03B',
          lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
          display: 'block',
        }}
      >
        {number}
      </span>
      <span
        style={{
          fontFamily: 'Roboto, sans-serif',
          fontSize: '14px',
          color: '#25282A',
          fontWeight: 500,
          lineHeight: 1.4,
        }}
      >
        {definition}
      </span>
      {annotation && (
        <span
          style={{
            fontFamily: 'Roboto, sans-serif',
            fontSize: '10px',
            color: 'rgba(37,40,42,0.45)',
            letterSpacing: '0.04em',
            lineHeight: 1.4,
          }}
        >
          {annotation}
        </span>
      )}
    </Reveal>
  )
}

// EditorialStatBand — full-width cream band, amber rule across top, numbers at scale.
export function EditorialStatBand({ children, cols = 3 }: { children: React.ReactNode; cols?: 2 | 3 | 4 }) {
  const colClass = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3', 4: 'grid-cols-2 lg:grid-cols-4' }[cols]
  return (
    <section
      style={{
        backgroundColor: '#ECEAE3',
        borderTop: '2px solid #FBB03B',
        borderBottom: '1px solid rgba(37,40,42,0.1)',
      }}
    >
      <div
        className="sc-container"
        style={{ paddingTop: 'var(--space-block)', paddingBottom: 'var(--space-block)' }}
      >
        <div className={`grid grid-cols-1 ${colClass} gap-10`}>{children}</div>
      </div>
    </section>
  )
}

// AtAGlance — right-rail context panel in the two-col editorial layout.
// Sector, client size, timeline, challenge — the "at a glance" magazine convention.
export function AtAGlance({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div
      className="fab-card"
      style={{
        padding: 'var(--space-element)',
      }}
    >
      <p
        style={{
          fontFamily: 'Roboto, sans-serif',
          fontSize: '11px',
          color: 'rgba(37,40,42,0.55)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fontWeight: 600,
          margin: '0 0 var(--space-element)',
        }}
      >
        At a glance
      </p>
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div key={item.label}>
            <p
              style={{
                fontFamily: 'Roboto, sans-serif',
                fontSize: '10px',
                color: 'rgba(37,40,42,0.45)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                margin: '0 0 2px',
              }}
            >
              {item.label}
            </p>
            <p
              style={{
                fontFamily: 'Roboto, sans-serif',
                fontSize: '14px',
                color: '#25282A',
                fontWeight: 500,
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
