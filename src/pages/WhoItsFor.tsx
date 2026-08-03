import { PageHero } from '../components/PageHero'
import { Section, Eyebrow, Headline, Body, Reveal, ListRow } from '../components/primitives'
import { Meta } from '../components/Meta'

const INDUSTRIES = [
  { label: 'Professional Services', to: '/who-its-for/professional-services', note: '$25M–$250M. Accounting, engineering, consulting, financial advisory, HR, insurance, staffing, CRE, and law firms.' },
  { label: 'Home Services & Trades', to: '/who-its-for/home-services-trades', note: '$25M–$250M. HVAC, contractors, home builders, luxury residential.' },
  { label: 'PE Operating Partners', to: '/who-its-for/private-equity', note: '$100M–$5B AUM. Portfolio value creation.' },
  { label: 'Mission-Driven / Higher Ed', to: '/who-its-for/mission-driven', note: 'Universities, colleges, nonprofits, foundations.' },
]

export function WhoItsFor() {
  return (
    <>
      <Meta
        title="Who It's For — StoryCycle"
        description="Built for $25M–$250M companies with an established revenue team and a live sales pipeline. Four verticals, one system."
      />
      <PageHero
        eyebrow="Who It's For"
        headline={<>Different industries.<br />Same broken story.</>}
        sub="StoryCycle™ fixes that. Regardless of what you do or who you sell to."
      />

      <Section>
        <Reveal>
          <Eyebrow>Choose Your Industry</Eyebrow>
          <Headline className="mb-[var(--space-block)]">Four industries. One fix.</Headline>
        </Reveal>
        <div style={{ marginTop: 'var(--space-block)' }}>
          {INDUSTRIES.map((ind) => (
            <ListRow key={ind.to} title={ind.label} note={ind.note} to={ind.to} />
          ))}
        </div>
      </Section>

      <Section>
        <Reveal>
          <Eyebrow>The Common Thread</Eyebrow>
          <Headline>Why the same system<br />works across four industries.</Headline>
          <div style={{ marginTop: 'var(--space-element)', maxWidth: '760px' }}>
            <Body>Different industries, customers, pricing models, sales cycles. Same pattern underneath: marketing investment that doesn't compound because the commercial narrative isn't unified. The fix is the same. The vocabulary changes.</Body>
          </div>
        </Reveal>
      </Section>
    </>
  )
}
