import { PageHero } from '../components/PageHero'
import { Section, Eyebrow, Headline, Body, TileGrid, Tile, CTA, CTASecondary, Reveal, Quote } from '../components/primitives'
import { Meta } from '../components/Meta'

export function MissionDriven() {
  return (
    <>
      <Meta
        title="Mission-Driven Organizations - StoryCycle"
        description="StoryCycle helps universities, colleges, nonprofits, and foundations make extraordinary internal culture visible externally."
      />
      <PageHero
        eyebrow="Mission-Driven Organizations"
        headline={<>Inside the institution: extraordinary.<br />Outside: invisible.</>}
        sub="Universities, colleges, nonprofits, foundations. Strong internal culture, weak external visibility."
      />

      <Section>
        <Reveal>
          <Eyebrow>The Pattern</Eyebrow>
          <Headline>The culture is real.<br />The market doesn't see it.</Headline>
          <div style={{ marginTop: 'var(--space-element)', maxWidth: '760px' }}>
            <Body>The people inside your organization feel it deeply. Faculty know what makes this institution transformational. The culture is real. The market doesn't see it.</Body>
          </div>
          <div style={{ maxWidth: '760px' }}>
            <Quote>"StoryCycle doesn't create the story. It reveals what's already true and builds the system that carries it outward."</Quote>
          </div>
        </Reveal>
      </Section>

      <Section>
        <Reveal>
          <Eyebrow>Where the Cost Shows Up</Eyebrow>
          <Headline className="mb-[var(--space-block)]">Six places it leaks.</Headline>
        </Reveal>
        <div style={{ marginTop: 'var(--space-block)' }}>
          <TileGrid cols={3}>
            <Tile eyebrow="(01)" title="Enrollment inquiry quality">Lower than capability supports.</Tile>
            <Tile eyebrow="(02)" title="Application yield">Below peer institutions with weaker programs.</Tile>
            <Tile eyebrow="(03)" title="Donor engagement">Plateaus despite a compelling mission.</Tile>
            <Tile eyebrow="(04)" title="Major gift conversion">Stalls in the late stages.</Tile>
            <Tile eyebrow="(05)" title="Ranking visibility">Lags peer institutions.</Tile>
            <Tile eyebrow="(06)" title="Alumni participation">Drifts downward year over year.</Tile>
          </TileGrid>
        </div>
      </Section>

      <Section>
        <Reveal>
          <Eyebrow>Who We Work With</Eyebrow>
          <Headline className="mb-[var(--space-block)]">Three people carry it.</Headline>
        </Reveal>
        <div style={{ marginTop: 'var(--space-block)' }}>
          <TileGrid cols={3}>
            <Tile eyebrow="(01)" title="President / Provost">Knows the institution is undersold.</Tile>
            <Tile eyebrow="(02)" title="VP Advancement / CMO">Owns external visibility.</Tile>
            <Tile eyebrow="(03)" title="Director of Admissions / Development">Translates institutional vision.</Tile>
          </TileGrid>
        </div>
      </Section>

      <Section>
        <Reveal>
          <Eyebrow>When the Pain is Acute</Eyebrow>
          <Headline className="mb-[var(--space-block)]">The moments it gets expensive.</Headline>
        </Reveal>
        <div style={{ marginTop: 'var(--space-block)', maxWidth: '820px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Body><strong>New president taking office.</strong> The first 100 days set the institutional narrative.</Body>
          <Body><strong>Capital campaign launch.</strong> Donor stories require unified institutional language.</Body>
          <Body><strong>Enrollment cliff.</strong> Demographic shifts mean recruitment can't run on autopilot.</Body>
          <Body><strong>Major program launch.</strong> A new degree, center, or initiative needs a story that carries.</Body>
        </div>
      </Section>

      <Section band>
        <Reveal>
          <Eyebrow onDark>Proof</Eyebrow>
          <Headline onDark>The best-kept secret in Kentucky.<br />Not anymore.</Headline>
          <div style={{ marginTop: 'var(--space-element)', maxWidth: '760px', marginBottom: 'var(--space-element)' }}>
            <Body onDark>Lindsey Wilson University. Regional institution. Transformational outcomes. Zero brand recognition outside Kentucky.</Body>
          </div>
          <CTASecondary onDark label="Read the Lindsey Wilson case study" to="/results/lindsey-wilson" />
        </Reveal>
      </Section>

      <Section>
        <Reveal>
          <Eyebrow>Is This The Right Fit?</Eyebrow>
          <div style={{ maxWidth: '760px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Body>StoryCycle is built for companies with an established revenue team that generates leads and manages a live sales pipeline. If you are pre-product-market fit, running a founder-led sales motion with no dedicated team, or have fewer than $25M in annual revenue, this is not the right fit at this stage.</Body>
            <Body>If you are getting close, bookmark this and come back when the pipeline is moving.</Body>
          </div>
        </Reveal>
      </Section>

      <Section>
        <div className="text-center flex flex-col items-center gap-8">
          <Reveal><Headline hero>Carry the mission outward.</Headline></Reveal>
          <Reveal delay={0.3}><CTA /></Reveal>
        </div>
      </Section>
    </>
  )
}
