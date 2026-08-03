import { PageHero, SeeAlso } from '../components/PageHero'
import { Section, Eyebrow, Headline, Body, TileGrid, Tile, CTA, CTASecondary, Reveal, Quote } from '../components/primitives'
import { Meta } from '../components/Meta'

export function ProfessionalServices() {
  return (
    <>
      <Meta
        title="Professional Services - StoryCycle"
        description="StoryCycle helps professional services firms align their commercial story across every partner, practice group, and business development channel."
      />
      <PageHero
        eyebrow="Professional Services"
        headline={<>Your expertise is real.<br />Every partner tells it differently.</>}
        sub="$25M–$250M revenue. Accounting, engineering, consulting, financial advisory, and law firms."
      />

      <Section>
        <Reveal>
          <Eyebrow>The Pattern</Eyebrow>
          <Headline>The work is excellent.<br />The story isn't unified.</Headline>
          <div style={{ marginTop: 'var(--space-element)', maxWidth: '760px' }}>
            <Body>Pitch materials get assembled, not architected. Every partner describes the firm differently. RFPs contradict each other. Referral sources can't explain what makes you different.</Body>
          </div>
          <div style={{ maxWidth: '760px' }}>
            <Quote>"Your expertise is real. Your firm sounds like five firms."</Quote>
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
            <Tile eyebrow="(01)" title="Managing Partner">Knows the firm has a positioning problem. No CMO.</Tile>
            <Tile eyebrow="(02)" title="Director of BD">Translates every partner's version into pitch materials.</Tile>
            <Tile eyebrow="(03)" title="Practice Group Leader">Running their own commercial narrative.</Tile>
          </TileGrid>
        </div>
      </Section>

      <Section>
        <Reveal>
          <Eyebrow>When the Pain is Acute</Eyebrow>
          <Headline className="mb-[var(--space-block)]">The moments it gets expensive.</Headline>
        </Reveal>
        <div style={{ marginTop: 'var(--space-block)', maxWidth: '820px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Body><strong>Partner retirement / succession.</strong> The retiring partner's book is held together by their personal story.</Body>
          <Body><strong>Lateral partner recruitment.</strong> Recruiting laterals is easier when the firm has an articulable position.</Body>
          <Body><strong>RFP responses underperforming.</strong> The firm makes the shortlist, then loses.</Body>
          <Body><strong>Cross-sell underperformance.</strong> Practice groups operate as silos.</Body>
        </div>
      </Section>

      <Section band>
        <Reveal>
          <Eyebrow onDark>Proof</Eyebrow>
          <Headline onDark>Documented across<br />professional services firms.</Headline>
          <div style={{ marginTop: 'var(--space-element)', maxWidth: '760px', marginBottom: 'var(--space-block)' }}>
            <Body onDark>Documented engagements across accounting, engineering, consulting, financial advisory, staffing, and law firms.</Body>
          </div>
        </Reveal>
        <div style={{ marginBottom: 'var(--space-block)' }}>
          <SeeAlso items={[
            { title: 'Paul Downs Cabinetry', note: 'Designers stopped asking for quotes. They started asking for help.', to: '/results/paul-downs' },
            { title: 'Liaison International', note: 'Two firms merged. One story had to be written.', to: '/results/liaison' },
          ]} />
        </div>
        <Reveal>
          <CTASecondary onDark label="See all case studies" to="/results" />
        </Reveal>
      </Section>

      <Section>
        <Reveal>
          <Eyebrow>Is This Right For Your Firm?</Eyebrow>
          <div style={{ maxWidth: '760px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Body>StoryCycle is built for companies with an established revenue team that generates leads and manages a live sales pipeline. If you are pre-product-market fit, running a founder-led sales motion with no dedicated team, or have fewer than $25M in annual revenue, this is not the right fit at this stage.</Body>
            <Body>If you are getting close, bookmark this and come back when the pipeline is moving.</Body>
          </div>
        </Reveal>
      </Section>

      <Section>
        <div className="text-center flex flex-col items-center gap-8">
          <Reveal><Headline hero>One story. Every partner.</Headline></Reveal>
          <Reveal delay={0.3}><CTA /></Reveal>
        </div>
      </Section>
    </>
  )
}
