import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { PageHero } from '../components/PageHero'
import { Section, Eyebrow, Headline, Body, Reveal, ListRow } from '../components/primitives'
import { Meta } from '../components/Meta'

// HubSpot whitepaper "Notify Me" form — portal 6878183, form 080dea10-22d2-4456-ba7d-7c5dd70efd30.
// The iframe embed HubSpot gives for this form can't be restyled from our CSS (cross-origin), so
// instead of embedding it we own the markup ourselves and POST straight to HubSpot's public Forms
// Submissions API — same destination, full control over the design.
const HS_PORTAL_ID = '6878183'
const HS_WHITEPAPER_FORM_ID = '080dea10-22d2-4456-ba7d-7c5dd70efd30'

async function submitWhitepaperEmail(email: string) {
  const res = await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${HS_PORTAL_ID}/${HS_WHITEPAPER_FORM_ID}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fields: [{ name: 'email', value: email }],
      context: { pageUri: window.location.href, pageName: document.title },
    }),
  })
  if (!res.ok) throw new Error('Submission failed')
}

function WhitepaperForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Enter a valid email address.')
      return
    }
    setError('')
    setStatus('submitting')
    try {
      await submitWhitepaperEmail(email.trim())
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return <Body onDark>Thanks — we'll email you the moment the whitepaper is ready.</Body>
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="flex flex-col sm:flex-row gap-3" style={{ maxWidth: '520px' }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your-email@company.com"
          style={{ flex: 1, padding: '14px 20px', border: 'none', background: '#FFFFFF', fontFamily: 'Roboto, sans-serif', fontSize: '14px', color: '#25282A', borderRadius: '999px', outline: 'none' }}
        />
        <button type="submit" disabled={status === 'submitting'} className="fab-pill" style={{ opacity: status === 'submitting' ? 0.7 : 1, cursor: status === 'submitting' ? 'wait' : 'pointer' }}>
          {status === 'submitting' ? 'Sending…' : 'Notify Me →'}
        </button>
      </div>
      {error && <p style={{ color: '#E8927C', fontSize: '11px', fontFamily: 'Roboto, sans-serif', margin: '8px 0 0' }}>{error}</p>}
      {status === 'error' && <p style={{ color: '#E8927C', fontSize: '11px', fontFamily: 'Roboto, sans-serif', margin: '8px 0 0' }}>Something went wrong. Please try again.</p>}
    </form>
  )
}

// Article titles + LinkedIn URLs TBC pending confirmation from Enrique.
// Wireframe lists them as "Article NN"; all 13 cards link out to LinkedIn in a new tab.
// TODO: populate with the real { title, url } per article once supplied.
const ARTICLE_LINKS: Record<number, string> = {}
const FEATURED = [1, 2, 3]
const RECENT = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13]

function FeaturedCard({ n, wide = false }: { n: number; wide?: boolean }) {
  const href = ARTICLE_LINKS[n] ?? '#'
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fab-card block group"
      style={{ textDecoration: 'none', padding: wide ? 'clamp(32px,5vw,72px)' : 'clamp(24px,3vw,40px)' }}
    >
      <h3
        className="fab-display"
        style={{ fontSize: wide ? 'clamp(1.75rem, 3.5vw, 3rem)' : 'clamp(1.25rem, 2.2vw, 1.75rem)', color: '#25282A', margin: 0 }}
      >
        {`Featured Article ${String(n).padStart(2, '0')}`}
      </h3>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginTop: '18px', fontFamily: 'Roboto, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(37,40,42,0.6)' }}>
        Read on LinkedIn <ArrowUpRight size={13} strokeWidth={2.5} style={{ color: '#FBB03B' }} />
      </span>
    </a>
  )
}

export function Insights() {
  return (
    <>
      <Meta
        title="Insights — StoryCycle"
        description="Written for the operator, not the agency. Thinking on commercial narrative, positioning, and pipeline conversion."
      />
      <PageHero
        eyebrow="Insights"
        headline={<>Written for the operator.<br />Not the agency.</>}
      />

      <Section>
        <Reveal>
          <Eyebrow>Featured</Eyebrow>
          <Headline className="mb-[var(--space-block)]">Start here.</Headline>
        </Reveal>
        <div className="flex flex-col gap-4" style={{ marginTop: 'var(--space-block)' }}>
          {/* Article 01 — full-width dominant hero */}
          <FeaturedCard n={FEATURED[0]} wide />
          {/* Articles 02 + 03 — standard-width pair */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FeaturedCard n={FEATURED[1]} />
            <FeaturedCard n={FEATURED[2]} />
          </div>
        </div>
      </Section>

      <Section>
        <Reveal>
          <Eyebrow>Recent Thinking</Eyebrow>
        </Reveal>
        <div style={{ marginTop: 'var(--space-block)' }}>
          {RECENT.map((n) => (
            <ListRow
              key={n}
              title={`Article ${String(n).padStart(2, '0')}`}
              meta="Read on LinkedIn"
              to={ARTICLE_LINKS[n] ?? '#'}
              external
            />
          ))}
        </div>
      </Section>

      <Section band>
        <Reveal>
          <Eyebrow onDark>Whitepaper</Eyebrow>
          <Headline onDark>The StoryCycle whitepaper is coming.</Headline>
          <div style={{ marginTop: 'var(--space-element)', marginBottom: 'var(--space-block)' }}>
            <Body onDark>Get notified when it is ready.</Body>
          </div>
          <WhitepaperForm />
        </Reveal>
      </Section>
    </>
  )
}
