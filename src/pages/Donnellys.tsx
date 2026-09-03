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

export function Donnellys() {
  return (
    <>
      <Meta
        title="Donnelly's HVAC - StoryCycle Results"
        description="How Donnelly's HVAC rebuilt their commercial story and converted more of the leads they were already generating."
      />
      <PageHero
        eyebrow="Case Study · Donnelly's HVAC"
        headline={<>The work was premium.<br />The pricing was commodity.</>}
        sub="Regional HVAC service · Home Services & Trades"
      />


      <EditorialSection>
        <EditorialGrid>
          <div>
            <EditorialLabel>The Problem</EditorialLabel>
            <EditorialHeadline>Forty years of excellence. Priced like a commodity.</EditorialHeadline>
            <EditorialBody>
              Donnelly's HVAC built a 40-year reputation for solving the problem nobody else could. Diagnostic excellence. Honest pricing. Technicians who could find the fault others missed.
            </EditorialBody>
            <EditorialBody>
              The market saw them as a commodity. Price-shoppers called for the lowest quote. The phone team fielded calls from buyers who couldn't tell Donnelly's from any other truck in the driveway. The story underneath the service wasn't reaching the buyer before the quote did.
            </EditorialBody>
            <EditorialQuote>
              You don't hire Donnelly's for the lowest price. You hire us because we solve the actual problem.
            </EditorialQuote>
          </div>
          <AtAGlance items={[
            { label: 'Sector', value: 'Residential HVAC Service' },
            { label: 'Market', value: 'Regional — Home Services' },
            { label: 'Founded', value: '40+ years in business' },
            { label: 'Challenge', value: 'Premium service priced as commodity' },
            { label: 'Approach', value: 'Single-company StoryCycle deployment' },
          ]} />
        </EditorialGrid>
      </EditorialSection>

      <EditorialStatBand cols={4}>
        <EditorialStat
          number="+40%"
          definition="Qualified lead volume"
          annotation="12-month post-deployment"
        />
        <EditorialStat
          number="+25%"
          definition="Close rate"
          annotation="vs. prior 12-month baseline"
        />
        <EditorialStat
          number="+18%"
          definition="Revenue per customer"
          annotation="Service plan + upsell attachment"
        />
        <EditorialStat
          number="-35%"
          definition="Technical-team turnover"
          annotation="Field technicians · 12-month post-deployment"
        />
      </EditorialStatBand>

      <EditorialSection>
        <div style={{ maxWidth: '720px' }}>
          <EditorialLabel>What Shifted</EditorialLabel>
          <EditorialHeadline>Same trucks. Different story. Buyers could finally tell the difference.</EditorialHeadline>
          <EditorialBody>
            The phone team stopped fielding the wrong calls. When the story changed upstream — what Donnelly's stood for, who they were built for, what "solving the actual problem" meant in practice — the buyer qualification happened before the first conversation.
          </EditorialBody>
          <EditorialBody>
            TV advertising stopped competing on price and started competing on trust. Service plans started compounding because customers understood what they were buying. The owner stopped explaining. The story explained itself.
          </EditorialBody>
          <EditorialBody>
            Technical-team turnover dropped 35 percent — a signal that field crews were no longer navigating between competing versions of what the company stood for.
          </EditorialBody>
        </div>
      </EditorialSection>

      <Section band>
        <Reveal>
          <div style={{ marginBottom: 'var(--space-block)' }}>
            <SeeAlso items={[
              { title: 'Paul Downs', note: 'Commodity vendor into designer\'s partner.', to: '/results/paul-downs' },
              { title: 'PE Portfolio', note: 'Same system. Six companies.', to: '/results/pe-portfolio' },
            ]} />
          </div>
        </Reveal>
      </Section>

      <Section band>
        <div className="text-center flex flex-col items-center gap-8">
          <Reveal><Headline hero onDark>Same trucks. Different story.</Headline></Reveal>
          <Reveal delay={0.3}><CTA /></Reveal>
        </div>
      </Section>
    </>
  )
}
