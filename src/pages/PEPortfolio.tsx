import { PageHero, SeeAlso } from '../components/PageHero'
import { Section, Headline, TileGrid, Tile, CTA, Reveal } from '../components/primitives'
import {
  EditorialSection,
  EditorialGrid,
  EditorialLabel,
  EditorialHeadline,
  EditorialBody,
  EditorialStat,
  EditorialStatBand,
  AtAGlance,
} from '../components/CaseStudyLayout'
import { Meta } from '../components/Meta'

export function PEPortfolio() {
  return (
    <>
      <Meta
        title="Portfolio Deployment - Six Independent Wins - StoryCycle"
        description="Six independent companies. Different industries. The same system fixed the same broken commercial story every time. Built for PE operating partners who need a repeatable tool across their portfolio."
      />
      <PageHero
        eyebrow="Case Study · Portfolio Deployment"
        headline={<>One system. Deployable<br />across your entire portfolio.</>}
        sub="Six independent companies. Different industries. The same broken commercial story. The same system fixed it every time."
      />


      {/* Six independent companies — dark cinematic, dashboard-style proof the system repeats */}
      <Section band>
        <Reveal>
          <div style={{ marginBottom: 'var(--space-block)' }}>
            <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '11px', color: '#FBB03B', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, margin: '0 0 var(--space-tight)' }}>Six Independent Companies · One Repeatable System</p>
            <h2 className="fab-display" style={{ fontSize: 'clamp(1.75rem, 4vw, 3.25rem)', color: '#ECEAE3', margin: '0 0 var(--space-block)' }}>Different industries. Same fix.</h2>
          </div>
        </Reveal>
        <TileGrid cols={3}>
          <Tile title="HVAC Services / $48M">Founder-led, recurring service contracts. The story wasn't reaching premium buyers. +40% leads, +25% close, +18% rev/customer.</Tile>
          <Tile title="Professional Services / $75M">Project-based. Pitch varied by rep, conversion lagged spend. +32% leads, +18% cycle, +22% close.</Tile>
          <Tile title="Manufacturing / $92M">B2B distribution. No clear commercial narrative for a new category. New market entered in 6 months vs 18-month estimate.</Tile>
          <Tile title="Professional Services / $55M">Retainer model. Story fragmented across teams. +24% deal velocity, +19% contract wins, 88% alignment.</Tile>
          <Tile title="Home Services / $62M">Founder-led, multi-location. Inconsistent story site to site. +18% rev/customer, +20% cycle, -35% turnover.</Tile>
          <Tile title="Professional Services / $38M">Scaling 15 to 28 people. Story outgrew the founder's head. +16% deal size, +28% close rates.</Tile>
        </TileGrid>
      </Section>

      <EditorialSection>
        <EditorialGrid>
          <div>
            <EditorialLabel>The Pattern</EditorialLabel>
            <EditorialHeadline>Six independent companies. The same broken story. The same fix — every time.</EditorialHeadline>
            <EditorialBody>
              These are not six companies from the same portfolio. They are six independent businesses across different industries and different ownership structures. Each one had the same problem: a commercial story that was not working. StoryCycle fixed it. The same system. The same process. Repeatable across every company you own.
            </EditorialBody>
          </div>
          <AtAGlance items={[
            { label: 'Companies', value: 'Six independent businesses' },
            { label: 'Revenue range', value: '$38M–$92M each' },
            { label: 'Industries', value: 'HVAC · professional services · manufacturing · home services' },
            { label: 'Deployment', value: 'Company by company' },
            { label: 'System goal', value: 'Repeatable across any portfolio' },
          ]} />
        </EditorialGrid>
      </EditorialSection>

      <EditorialStatBand cols={4}>
        <EditorialStat
          number="$2.8M+"
          definition="Year 1 lift (aggregate)"
          annotation="Aggregate across the six companies · Year 1"
        />
        <EditorialStat
          number="+35%"
          definition="Qualified leads (avg)"
          annotation="Average across the six · 12-month post-deployment"
        />
        <EditorialStat
          number="+22%"
          definition="Sales cycle acceleration (avg)"
          annotation="Average across the six · vs. prior 12-month baseline"
        />
        <EditorialStat
          number="82%"
          definition="Employees can articulate the story"
          annotation="All six companies · post-deployment survey"
        />
      </EditorialStatBand>

      <EditorialSection>
        <div style={{ maxWidth: '720px' }}>
          <EditorialLabel>What Shifted</EditorialLabel>
          <EditorialHeadline>Six commercial narratives. One repeatable playbook. Sales stopped improvising.</EditorialHeadline>
          <EditorialBody>
            The insight that repeated across all six: what looked like a unique problem in each company was the same broken commercial story every time. The fix wasn't six custom solutions — it was one repeatable system applied company by company.
          </EditorialBody>
          <EditorialBody>
            When 82 percent of employees across six companies can articulate the same core story, the sales team isn't the only distribution channel for the narrative. Every person in every company becomes a carrier. The marketing investment starts to compound because it's reinforced by every conversation, not just the ones sales has.
          </EditorialBody>
          <EditorialBody>
            $2.8M aggregate Year 1 revenue lift across six companies with $38M–$92M revenue. Deploying the system company by company made it one of the highest-leverage decisions available to an operator running multiple businesses.
          </EditorialBody>
        </div>
      </EditorialSection>

      <EditorialSection>
        <div style={{ maxWidth: '720px' }}>
          <EditorialLabel>For Operating Partners</EditorialLabel>
          <EditorialBody>
            If you are an operating partner evaluating tools for your portfolio, this is what repeatable looks like. One system, deployed company by company, producing documented results across every vertical we have worked in.
          </EditorialBody>
        </div>
      </EditorialSection>

      <Section band>
        <Reveal>
          <div style={{ marginBottom: 'var(--space-block)' }}>
            <SeeAlso items={[
              { title: "Donnelly's HVAC", note: 'Single-company version.', to: '/results/donnellys-hvac' },
              { title: 'Liaison Intl', note: 'Merger integration.', to: '/results/liaison' },
            ]} />
          </div>
        </Reveal>
      </Section>

      <Section band>
        <div className="text-center flex flex-col items-center gap-8">
          <Reveal><Headline hero onDark>Deploy across the portfolio.</Headline></Reveal>
          <Reveal delay={0.3}><CTA /></Reveal>
        </div>
      </Section>
    </>
  )
}
