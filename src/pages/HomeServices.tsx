import { PageHero } from '../components/PageHero'
import { Section, Eyebrow, Headline, Body, TileGrid, Tile, CTA, CTASecondary, Stat, StatRow, Reveal, Quote } from '../components/primitives'
import { Meta } from '../components/Meta'

export function HomeServices() {
  return (
    <>
      <Meta
        title="Home Services & Trades - StoryCycle"
        description="StoryCycle helps home services companies with $25M–$250M in revenue fix the commercial story problem that drains ad spend and delivers low-quality leads."
      />
      <PageHero
        eyebrow="Home Services & Trades"
        headline={<>Your ad spend is up.<br />Your lead quality is down.</>}
        sub="$25M–$250M revenue. HVAC, contractors, home builders, luxury residential design-build."
      />

      <Section>
        <Reveal>
          <Eyebrow>The Pattern</Eyebrow>
          <Headline>The phones are ringing.<br />The wrong customers are calling.</Headline>
          <div style={{ marginTop: 'var(--space-element)', maxWidth: '760px' }}>
            <Body>Spending on TV, radio, paid digital. Lead volume up. Lead quality dropping. Price-shoppers replacing premium customers.</Body>
          </div>
          <div style={{ maxWidth: '760px' }}>
            <Quote>"You're known. You're just known for the wrong thing."</Quote>
          </div>
        </Reveal>
      </Section>

      <Section>
        <Reveal>
          <Eyebrow>Who We Work With</Eyebrow>
          <Headline className="mb-[var(--space-block)]">Three people feel it first.</Headline>
        </Reveal>
        <div style={{ marginTop: 'var(--space-block)' }}>
          <TileGrid cols={3}>
            <Tile eyebrow="(01)" title="Owner-Operator">Built it from the trucks up. Knows the brand drifted toward commodity.</Tile>
            <Tile eyebrow="(02)" title="GM / President">Inherited the marketing motion. Trying to step back from sales personally.</Tile>
            <Tile eyebrow="(03)" title="VP Marketing">Spending the budget. Watching close rates erode.</Tile>
          </TileGrid>
        </div>
      </Section>

      <Section>
        <Reveal>
          <Eyebrow>When the Pain is Acute</Eyebrow>
          <Headline className="mb-[var(--space-block)]">The moments it gets expensive.</Headline>
        </Reveal>
        <div style={{ marginTop: 'var(--space-block)', maxWidth: '820px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Body><strong>Owner stepping back from sales.</strong> Growth stalls when they try to step back.</Body>
          <Body><strong>New service tier launch.</strong> Adding premium. Market still thinks of you as commodity.</Body>
          <Body><strong>Competitive new entrant.</strong> A national chain entered. Your differentiator needs to be louder.</Body>
          <Body><strong>Service area expansion.</strong> New geography. Zero brand recognition.</Body>
        </div>
      </Section>

      <Section band>
        <Reveal>
          <Eyebrow onDark>Proof</Eyebrow>
          <Headline onDark>Premium positioning<br />out of a commodity market.</Headline>
          <div style={{ marginTop: 'var(--space-block)', marginBottom: 'var(--space-block)' }}>
            <StatRow cols={3}>
              <Stat onDark number="+40%" label="Lead volume" />
              <Stat onDark number="+25%" label="Close rate" />
              <Stat onDark number="+18%" label="Revenue per customer" />
            </StatRow>
          </div>
          <div style={{ maxWidth: '760px', marginBottom: 'var(--space-element)' }}>
            <Body onDark>Donnelly's HVAC. Plus Harth Builders.</Body>
          </div>
          <CTASecondary onDark label="See all case studies" to="/results" />
        </Reveal>
      </Section>

      <Section>
        <Reveal>
          <Eyebrow>Is This Right For Your Business?</Eyebrow>
          <div style={{ maxWidth: '760px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Body>StoryCycle is built for companies with an established revenue team that generates leads and manages a live sales pipeline. If you are pre-product-market fit, running a founder-led sales motion with no dedicated team, or have fewer than $25M in annual revenue, this is not the right fit at this stage.</Body>
            <Body>If you are getting close, bookmark this and come back when the pipeline is moving.</Body>
          </div>
        </Reveal>
      </Section>

      <Section>
        <div className="text-center flex flex-col items-center gap-8">
          <Reveal><Headline hero>Premium service. Premium positioning.</Headline></Reveal>
          <Reveal delay={0.3}><CTA /></Reveal>
        </div>
      </Section>
    </>
  )
}
