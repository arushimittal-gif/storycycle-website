import { PageHero, SeeAlso } from '../components/PageHero'
import { Section, Headline, CTA, Reveal } from '../components/primitives'
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

export function Liaison() {
  return (
    <>
      <Meta
        title="Liaison International - StoryCycle Results"
        description="How Liaison International wrote one unified commercial story after a merger that left two narratives competing for the same buyers."
      />
      <PageHero
        eyebrow="Case Study · Liaison International"
        headline={<>Two firms merged.<br />One story had to be written.</>}
        sub="Higher education technology · Professional Services"
      />


      <EditorialSection>
        <EditorialGrid>
          <div>
            <EditorialLabel>The Problem</EditorialLabel>
            <EditorialHeadline>Two organizations. Two commercial narratives. One merged company with a split voice.</EditorialHeadline>
            <EditorialBody>
              Two organizations merged into Liaison International. Each came with its own product positioning, its own sales motion, its own commercial narrative. Sales reps improvised. Marketing materials contradicted each other. Prospects encountered two companies at once.
            </EditorialBody>
            <EditorialBody>
              Post-merger integration had been executed at the operational layer. It hadn't been executed at the commercial layer — the story the combined company told the market was still two stories running in parallel.
            </EditorialBody>
          </div>
          <AtAGlance items={[
            { label: 'Sector', value: 'Higher Education Technology' },
            { label: 'Context', value: 'Post-merger commercial integration' },
            { label: 'Challenge', value: 'Two organizations, two commercial narratives' },
            { label: 'Timeline', value: '90-day StoryCycle deployment' },
            { label: 'Approach', value: 'Single-entity narrative integration' },
          ]} />
        </EditorialGrid>
      </EditorialSection>

      <EditorialStatBand cols={3}>
        <EditorialStat
          number="-25%"
          definition="Sales cycle compression"
          annotation="90 days post-deployment · full sales team"
        />
        <EditorialStat
          number="+91%"
          definition="Internal alignment"
          annotation="Leadership and sales teams · post-deployment survey"
        />
        <EditorialStat
          number="+18%"
          definition="Year-1 contract value"
          annotation="Average new contract · post-integration"
        />
      </EditorialStatBand>

      <EditorialSection>
        <div style={{ maxWidth: '720px' }}>
          <EditorialLabel>What Shifted</EditorialLabel>
          <EditorialHeadline>Two organizations merged. One commercial voice shipped to the market.</EditorialHeadline>
          <EditorialBody>
            The merged company went to market as a single voice within 90 days of StoryCycle deployment. Sales stopped improvising. Materials stopped contradicting. Prospects encountered one organization, not two.
          </EditorialBody>
          <EditorialBody>
            Sales cycle dropped 25 percent — which tracks directly against a cleaner, more unified first conversation. Internal alignment hit 91 percent, which meant everyone from leadership to individual reps was carrying the same story. Year-1 contract value rose 18 percent as the positioning became more precise.
          </EditorialBody>
          <EditorialBody>
            Post-merger integration done at the commercial layer is what makes the operational integration visible to the market.
          </EditorialBody>
        </div>
      </EditorialSection>

      <Section band>
        <Reveal>
          <div style={{ marginBottom: 'var(--space-block)' }}>
            <SeeAlso items={[
              { title: 'Paul Downs', note: 'Same channel. Professional services.', to: '/results/paul-downs' },
              { title: 'PE Portfolio', note: 'Portfolio-scale integration.', to: '/results/pe-portfolio' },
              { title: 'Lindsey Wilson', note: 'Higher ed adjacent.', to: '/results/lindsey-wilson' },
            ]} />
          </div>
        </Reveal>
      </Section>

      <Section band>
        <div className="text-center flex flex-col items-center gap-8">
          <Reveal><Headline hero onDark>Merger integration done right.</Headline></Reveal>
          <Reveal delay={0.3}><CTA /></Reveal>
        </div>
      </Section>
    </>
  )
}
