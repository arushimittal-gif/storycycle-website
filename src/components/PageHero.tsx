import { Link } from 'react-router-dom'
import { Reveal, Eyebrow, PlusMarks } from './primitives'

// Fabrica-system page opener — giant display head on the cream ground.
// No imagery: the type IS the hero. Eyebrow above, intro paragraph in a
// right-hand column, crop-mark "+" row underneath as the section seam.
export function PageHero({
  eyebrow,
  headline,
  sub,
  counter,
}: {
  eyebrow?: string
  headline: React.ReactNode
  sub?: React.ReactNode
  counter?: string
}) {
  return (
    <section className="relative w-full" style={{ paddingTop: 'clamp(140px, 18vh, 220px)', paddingBottom: 'clamp(48px, 6vh, 88px)' }}>
      <div className="sc-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 lg:gap-x-8 items-end">
          <div className="lg:col-span-8">
            {counter && (
              <Reveal>
                <span className="fab-counter" style={{ display: 'block', marginBottom: 'var(--space-tight)' }}>{counter}</span>
              </Reveal>
            )}
            {eyebrow && (
              <Reveal>
                <Eyebrow>{eyebrow}</Eyebrow>
              </Reveal>
            )}
            <Reveal delay={0.1}>
              <h1 className="fab-display" style={{ fontSize: 'clamp(2.75rem, 7.5vw, 6.5rem)', color: '#25282A' }}>
                {headline}
              </h1>
            </Reveal>
          </div>
          {sub && (
            <div className="lg:col-span-4 lg:pb-3">
              <Reveal delay={0.2}>
                <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '16px', lineHeight: 1.6, color: 'rgba(37,40,42,0.7)', margin: 0 }}>
                  {sub}
                </p>
              </Reveal>
            </div>
          )}
        </div>
        <div style={{ marginTop: 'clamp(40px, 6vh, 72px)' }}>
          <PlusMarks />
        </div>
      </div>
    </section>
  )
}

// SeeAlso — 3-up related cards for case studies (white cards, cream ground)
export function SeeAlso({ items }: { items: { title: string; note: string; to?: string }[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((it) => (
        <Link key={it.title} to={it.to ?? '#'} className="fab-card block p-8 group" style={{ textDecoration: 'none' }}>
          <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '15px', fontWeight: 700, color: '#25282A', letterSpacing: '-0.01em', margin: '0 0 6px' }}>{it.title}</h3>
          <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '12.5px', color: 'rgba(37,40,42,0.6)', lineHeight: 1.5, margin: 0 }}>{it.note}</p>
        </Link>
      ))}
    </div>
  )
}
