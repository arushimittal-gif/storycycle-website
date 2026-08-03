import { PageHero } from '../components/PageHero'
import { Section, Eyebrow, Headline, Body, TileGrid, Tile, Stat, StatRow, CTA, CTASecondary, Reveal, Quote } from '../components/primitives'
import { Meta } from '../components/Meta'

export function PrivateEquity() {
  return (
    <>
      <Meta
        title="PE Operating Partners - StoryCycle"
        description="StoryCycle deploys one commercial story system across every company in your portfolio. Built for PE operating partners with a value creation mandate."
      />
      <PageHero
        eyebrow="PE Operating Partners"
        headline={<>The same problem.<br />Inside every company you own.</>}
        sub="Middle and lower middle market PE. $100M–$5B AUM. Portfolio value creation mandate."
      />

      <Section>
        <Reveal>
          <Eyebrow>The Pattern</Eyebrow>
          <Headline>Marketing spend that<br />doesn't compound.</Headline>
          <div style={{ marginTop: 'var(--space-element)', maxWidth: '760px' }}>
            <Body>Portfolio company spends on marketing. Lead volume flat. Sales cycles long. Revenue teams improvise. The company has real differentiation. Nobody outside the building can articulate it.</Body>
          </div>
          <div style={{ marginTop: 'var(--space-element)', maxWidth: '760px' }}>
            <Body><strong>The math you're already running:</strong> Most portfolio companies are leaving $100K–$500K per year on the table. Across six companies, $600K–$3M annually in recoverable revenue. Before EBITDA multiple. Before exit valuation lift.</Body>
          </div>
          <div style={{ maxWidth: '760px' }}>
            <Quote>"This is not a single-company engagement. This is portfolio-level value creation."</Quote>
          </div>
        </Reveal>
      </Section>

      <Section>
        <Reveal>
          <Eyebrow>Who We Work With</Eyebrow>
          <Headline className="mb-[var(--space-block)]">Three seats feel it.</Headline>
        </Reveal>
        <div style={{ marginTop: 'var(--space-block)' }}>
          <TileGrid cols={3}>
            <Tile eyebrow="(01)" title="Operating Partner">3–5 portfolio companies concurrent.</Tile>
            <Tile eyebrow="(02)" title="Portfolio COO">Activates the value creation thesis.</Tile>
            <Tile eyebrow="(03)" title="Portfolio Company CEO">Currently improvising the commercial narrative.</Tile>
          </TileGrid>
        </div>
      </Section>

      <Section>
        <Reveal>
          <Eyebrow>When the Pain is Acute</Eyebrow>
          <Headline className="mb-[var(--space-block)]">The moments it gets expensive.</Headline>
        </Reveal>
        <div style={{ marginTop: 'var(--space-block)', maxWidth: '820px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Body><strong>Post-acquisition integration.</strong> Two narratives merging into one.</Body>
          <Body><strong>100-day plan window.</strong> 100 days to set the value creation trajectory.</Body>
          <Body><strong>Exit window approaching.</strong> 12–18 months out.</Body>
          <Body><strong>Add-on acquisition integration.</strong> Platform and add-on don't yet speak as one.</Body>
        </div>
      </Section>

      <Section band>
        <Reveal>
          <Eyebrow onDark>Proof</Eyebrow>
          <Headline onDark>Six independent companies.<br />One repeatable system.</Headline>
          <div style={{ marginTop: 'var(--space-block)', marginBottom: 'var(--space-block)' }}>
            <StatRow cols={4}>
              <Stat onDark number="$2.8M+" label="Year 1 lift (aggregate)" />
              <Stat onDark number="+35%" label="Qualified leads (avg)" />
              <Stat onDark number="+22%" label="Sales cycle acceleration (avg)" />
              <Stat onDark number="82%" label="Employees can articulate the story" />
            </StatRow>
          </div>
          <div style={{ maxWidth: '760px', marginBottom: 'var(--space-element)' }}>
            <Body onDark>$38M–$92M revenue companies. Six independent companies across different funds and ownership structures, each deployed individually. Year 1 averaged +35% lead volume and +22% sales cycle acceleration, with 82% of employees able to articulate the core story. $2.8M+ aggregate Year 1 revenue lift.</Body>
          </div>
          <CTASecondary onDark label="Read the PE Portfolio case study" to="/results/pe-portfolio" />
        </Reveal>
      </Section>

      <Section>
        <Reveal>
          <Eyebrow>Is This Right For Your Fund?</Eyebrow>
          <div style={{ maxWidth: '760px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Body>StoryCycle is built for companies with an established revenue team that generates leads and manages a live sales pipeline. If you are pre-product-market fit, running a founder-led sales motion with no dedicated team, or have fewer than $25M in annual revenue, this is not the right fit at this stage.</Body>
            <Body>If you are getting close, bookmark this and come back when the pipeline is moving.</Body>
          </div>
        </Reveal>
      </Section>

      <Section>
        <div className="text-center flex flex-col items-center gap-8">
          <Reveal><Headline hero>Deploy across the portfolio.<br />Start with one company.</Headline></Reveal>
          <Reveal delay={0.3}><CTA /></Reveal>
        </div>
      </Section>
    </>
  )
}
