import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { PageHero } from '../components/PageHero'
import { Section, Eyebrow, Headline, Body, Reveal, ListRow } from '../components/primitives'
import { Meta } from '../components/Meta'
import { ARTICLES_ORDERED } from '../data/articles'

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

// First 3 posts in reading order lead as "Featured"; the rest sit under "Recent Thinking".
const FEATURED = ARTICLES_ORDERED.slice(0, 3)
const RECENT = ARTICLES_ORDERED.slice(3)

function FeaturedCard({ article, wide = false }: { article: (typeof ARTICLES_ORDERED)[number]; wide?: boolean }) {
  return (
    <Link
      to={`/insights/${article.slug}`}
      className="fab-card block group"
      style={{ textDecoration: 'none', padding: wide ? 'clamp(32px,5vw,72px)' : 'clamp(24px,3vw,40px)' }}
    >
      <p className="fab-counter" style={{ marginBottom: '14px' }}>{article.category}</p>
      <h3
        className="fab-display"
        style={{ fontSize: wide ? 'clamp(1.75rem, 3.5vw, 3rem)' : 'clamp(1.25rem, 2.2vw, 1.75rem)', color: '#25282A', margin: 0 }}
      >
        {article.title}
      </h3>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginTop: '18px', fontFamily: 'Roboto, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(37,40,42,0.6)' }}>
        {article.date} · {article.readTime} <ArrowUpRight size={13} strokeWidth={2.5} style={{ color: '#FBB03B' }} />
      </span>
    </Link>
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
          {/* Newest post — full-width dominant hero */}
          <FeaturedCard article={FEATURED[0]} wide />
          {/* Next two — standard-width pair */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FeaturedCard article={FEATURED[1]} />
            <FeaturedCard article={FEATURED[2]} />
          </div>
        </div>
      </Section>

      <Section>
        <Reveal>
          <Eyebrow>Recent Thinking</Eyebrow>
        </Reveal>
        <div style={{ marginTop: 'var(--space-block)' }}>
          {RECENT.map((article) => (
            <ListRow
              key={article.slug}
              title={article.title}
              meta={`${article.date} · ${article.readTime}`}
              to={`/insights/${article.slug}`}
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
