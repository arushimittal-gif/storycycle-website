import { PageHero, SeeAlso } from '../components/PageHero'
import { Section, Headline, CTA, Reveal } from '../components/primitives'
import {
  EditorialSection,
  EditorialGrid,
  EditorialLabel,
  EditorialHeadline,
  EditorialBody,
  EditorialQuote,
  EditorialStat,
  EditorialStatBand,
  AtAGlance,
} from '../components/CaseStudyLayout'
import { Meta } from '../components/Meta'

export function PaulDowns() {
  return (
    <>
      <Meta
        title="Paul Downs Cabinetry - StoryCycle Results"
        description="How Paul Downs Cabinetry repositioned from quote-on-demand to category leader — designers stopped asking for quotes and started asking for help."
      />
      <PageHero
        eyebrow="Case Study · Paul Downs Cabinetry"
        headline={<>Designers stopped asking for quotes.<br />They started asking for help.</>}
        sub="Custom cabinetry · Professional Services"
      />


      <EditorialSection>
        <EditorialGrid>
          <div>
            <EditorialLabel>The Problem</EditorialLabel>
            <EditorialHeadline>One of the country's best cabinetry operations. Treated like a vendor.</EditorialHeadline>
            <EditorialBody>
              Paul Downs built one of the country's most sophisticated custom cabinetry operations. The work was technically demanding, aesthetically exceptional, and took years to master. None of that was reaching the buyer.
            </EditorialBody>
            <EditorialBody>
              Designers and architects sent RFQ emails treating Paul Downs as one of three vendors. The work was being commoditized at the inquiry stage — before a single conversation had happened. The story that justified the investment wasn't in the market.
            </EditorialBody>
          </div>
          <AtAGlance items={[
            { label: 'Sector', value: 'Custom Cabinetry / Professional Services' },
            { label: 'Channel', value: 'Architects and interior designers' },
            { label: 'Challenge', value: 'Treated as commodity vendor at inquiry stage' },
            { label: 'Timeline', value: '4-month initial deployment' },
            { label: 'Approach', value: 'Single-company StoryCycle deployment' },
          ]} />
        </EditorialGrid>
      </EditorialSection>

      <EditorialStatBand cols={2}>
        <EditorialStat
          number="+35%"
          definition="Annual revenue from new design-market segment"
          annotation="12 months post-deployment"
        />
        <EditorialStat
          number="+28%"
          definition="Close rate on design-phase inquiries"
          annotation="First 4 months · architect and designer channel"
        />
      </EditorialStatBand>

      <EditorialSection>
        <div style={{ maxWidth: '720px' }}>
          <EditorialLabel>What Shifted</EditorialLabel>
          <EditorialHeadline>Designers stopped bidding the work. They started designing with Paul Downs.</EditorialHeadline>
          <EditorialBody>
            Designers stopped sending RFQs and started looping Paul Downs in at the design phase. The inquiry quality changed before the conversion rate did — which is the leading indicator. When the story positioned Paul Downs as a design collaborator rather than a fabricator, the type of conversation changed first.
          </EditorialBody>
          <EditorialBody>
            Project complexity climbed as designers brought Paul Downs in earlier. Margin returned to the work when the work was no longer priced competitively at the quote stage. Within 12 months, revenue from the new design-market segment was up 35 percent.
          </EditorialBody>
          <EditorialQuote>
            Move from default choice to preferred partner.
          </EditorialQuote>
        </div>
      </EditorialSection>

      <Section band>
        <Reveal>
          <div style={{ marginBottom: 'var(--space-block)' }}>
            <SeeAlso items={[
              { title: 'Liaison Intl', note: 'Same channel. Professional services.', to: '/results/liaison' },
              { title: "Donnelly's HVAC", note: 'Same logic. Different industry.', to: '/results/donnellys-hvac' },
            ]} />
          </div>
        </Reveal>
      </Section>

      <Section band>
        <div className="text-center flex flex-col items-center gap-8">
          <Reveal><Headline hero onDark>Be the partner, not the quote.</Headline></Reveal>
          <Reveal delay={0.3}><CTA /></Reveal>
        </div>
      </Section>
    </>
  )
}
