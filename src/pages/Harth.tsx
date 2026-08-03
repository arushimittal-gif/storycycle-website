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

export function Harth() {
  return (
    <>
      <Meta
        title="Harth Builders - StoryCycle Results"
        description="How Harth Builders moved from commodity bids to premium positioning with a unified commercial story across sales, marketing, and leadership."
      />
      <PageHero
        eyebrow="Case Study · Harth Builders"
        headline={<>Selling like a commodity.<br />Despite exceptional work.</>}
        sub="Luxury residential design-build · Main Line, Philadelphia · Home Services & Trades"
      />


      <EditorialSection>
        <EditorialGrid>
          <div>
            <EditorialLabel>The Problem</EditorialLabel>
            <EditorialHeadline>Twenty years of exceptional work. The market still didn't know the difference.</EditorialHeadline>
            <EditorialBody>
              Harth had spent two decades building one of the Main Line's most sophisticated design-build operations. Custom kitchens. Full renovations. Additions designed to the site. The work was extraordinary. The market couldn't see it.
            </EditorialBody>
            <EditorialBody>
              Prospects compared Harth's $400K kitchen to a $150K vendor's. Interior designers sent business elsewhere — not because Harth wasn't the better choice, but because the story that justified the difference wasn't reaching them before the first meeting.
            </EditorialBody>
          </div>
          <AtAGlance items={[
            { label: 'Sector', value: 'Luxury Residential Design-Build' },
            { label: 'Market', value: 'Main Line, Philadelphia' },
            { label: 'Founded', value: '20+ years in business' },
            { label: 'Challenge', value: 'Exceptional work priced against commodity competitors' },
            { label: 'Approach', value: 'Single-company StoryCycle deployment' },
          ]} />
        </EditorialGrid>
      </EditorialSection>

      <EditorialSection>
        <div style={{ maxWidth: '720px' }}>
          <EditorialLabel>What Shifted</EditorialLabel>
          <EditorialHeadline>Designers stopped asking for quotes. They started asking for help.</EditorialHeadline>
          <EditorialBody>
            Designers who once treated Harth as a contractor to be bid against started bringing them into the design phase. The change happened upstream — in what the story said the relationship was supposed to be, and who it was supposed to serve.
          </EditorialBody>
          <EditorialBody>
            Project mix shifted toward design-led work. Qualifying conversations moved up-market. Field crews stopped navigating between competing versions of what the company stood for. The owner stopped explaining.
          </EditorialBody>
          <EditorialBody>
            Within months of deployment, designers began asking for Harth during the concept phase — not after construction documents were out for bid.
          </EditorialBody>
          <EditorialQuote>
            Craft is a standard, not a trade. Every decision made on the job site is a reflection of that.
          </EditorialQuote>
        </div>
      </EditorialSection>

      <Section band>
        <Reveal>
          <div style={{ marginBottom: 'var(--space-block)' }}>
            <SeeAlso items={[
              { title: "Donnelly's HVAC", note: 'Same channel. Premium repositioning.', to: '/results/donnellys-hvac' },
              { title: 'Paul Downs Cabinetry', note: 'Adjacent. Designer trust.', to: '/results/paul-downs' },
              { title: 'Lindsey Wilson', note: 'Different industry. Same fix.', to: '/results/lindsey-wilson' },
            ]} />
          </div>
        </Reveal>
      </Section>

      <Section band>
        <div className="text-center flex flex-col items-center gap-8">
          <Reveal><Headline hero onDark>Premium service. Premium positioning.</Headline></Reveal>
          <Reveal delay={0.3}><CTA /></Reveal>
        </div>
      </Section>
    </>
  )
}
