import { PageHero, SeeAlso } from '../components/PageHero'
import { Section, Headline, CTA, Reveal } from '../components/primitives'
import {
  EditorialSection,
  EditorialGrid,
  EditorialLabel,
  EditorialHeadline,
  EditorialBody,
  EditorialQuote,
  AtAGlance,
} from '../components/CaseStudyLayout'
import { Meta } from '../components/Meta'

export function LillyFasteners() {
  return (
    <>
      <Meta
        title="Lilly Fasteners - StoryCycle Results"
        description="How Lilly Fasteners turned a commodity product into a brand engineers specify by name, compressing sales cycles and unlocking pricing power."
      />
      <PageHero
        eyebrow="Case Study · Lilly Fasteners"
        headline={<>Engineers don't specify fasteners by brand.<br />Lilly's customers do.</>}
        sub="Industrial fastener manufacturer · Manufacturing & Industrial"
      />


      <EditorialSection>
        <EditorialGrid>
          <div>
            <EditorialLabel>The Problem</EditorialLabel>
            <EditorialHeadline>Industrial fasteners are spec'd by performance criteria, not by name. Until now.</EditorialHeadline>
            <EditorialBody>
              Industrial fasteners are engineered to meet performance specifications — tensile strength, thread class, material grade. Engineers write specs, not brands, onto their drawings. Lilly competed on price every time.
            </EditorialBody>
            <EditorialBody>
              Engineering customers compared Lilly's quotes to three other suppliers and chose by line-item math. The expertise, the application-engineering capability, the supply continuity that separated Lilly from every regional competitor — none of it was part of the buying conversation.
            </EditorialBody>
            <EditorialBody>
              The industries that keep the world running can't afford to wait. Neither can Lilly.
            </EditorialBody>
          </div>
          <AtAGlance items={[
            { label: 'Sector', value: 'Industrial Fastener Manufacturing' },
            { label: 'Channel', value: 'Engineering and procurement teams' },
            { label: 'Challenge', value: 'Commodity pricing on differentiated expertise' },
            { label: 'Approach', value: 'Single-company StoryCycle deployment' },
            { label: 'Outcome', value: 'Specified by name on engineering drawings' },
          ]} />
        </EditorialGrid>
      </EditorialSection>

      <EditorialSection>
        <div style={{ maxWidth: '720px' }}>
          <EditorialLabel>What Shifted</EditorialLabel>
          <EditorialHeadline>Engineers stopped specifying by criteria. They started specifying by name.</EditorialHeadline>
          <EditorialBody>
            When the story changed — when Lilly's application engineering capability became the lead commercial narrative rather than a footnote — the buying conversation started upstream of the quote. Engineers who understood what Lilly actually did started writing Lilly into specs.
          </EditorialBody>
          <EditorialBody>
            Quote-shopping ended at the application stage. Supply continuity became the pitch. Application engineering became the lead conversation. When you're already on the drawing, you're not being compared to three other suppliers.
          </EditorialBody>
          <EditorialQuote>
            When the specification names you, the procurement process confirms you — it doesn't evaluate you.
          </EditorialQuote>
        </div>
      </EditorialSection>

      <Section band>
        <Reveal>
          <div style={{ marginBottom: 'var(--space-block)' }}>
            <SeeAlso items={[
              { title: "Donnelly's HVAC", note: 'Commodity to specified.', to: '/results/donnellys-hvac' },
              { title: 'Paul Downs', note: 'Bid to partner.', to: '/results/paul-downs' },
              { title: 'PE Portfolio', note: 'Portfolio scale.', to: '/results/pe-portfolio' },
            ]} />
          </div>
        </Reveal>
      </Section>

      <Section band>
        <div className="text-center flex flex-col items-center gap-8">
          <Reveal><Headline hero onDark>Be specified. Not shopped.</Headline></Reveal>
          <Reveal delay={0.3}><CTA /></Reveal>
        </div>
      </Section>
    </>
  )
}
