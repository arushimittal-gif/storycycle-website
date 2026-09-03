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

export function LindseyWilson() {
  return (
    <>
      <Meta
        title="Lindsey Wilson University - StoryCycle Results"
        description="How Lindsey Wilson University stopped being the best-kept secret in Kentucky and made its story visible externally."
      />
      <PageHero
        eyebrow="Case Study · Lindsey Wilson University"
        headline={<>The best-kept secret in Kentucky.<br />Not anymore.</>}
        sub="Regional liberal arts university · Mission-Driven Organizations"
      />


      {/* Problem — left narrative + right context panel */}
      <EditorialSection>
        <EditorialGrid>
          <div>
            <EditorialLabel>The Problem</EditorialLabel>
            <EditorialHeadline>Transformational outcomes. Invisible institution.</EditorialHeadline>
            <EditorialBody>
              Lindsey Wilson had been quietly transforming first-generation students for decades. Faculty deeply invested. Programs nationally competitive. Graduates outperforming expectations at rates that surprised rankings systems.
            </EditorialBody>
            <EditorialBody>
              The institution's story was told entirely from the inside. External audiences couldn't locate it. Major-gift donors didn't know how to participate. Prospective students from outside Kentucky had no reference point to search for.
            </EditorialBody>
            <EditorialBody>
              The institution had excellent answers. Nobody was asking the question yet.
            </EditorialBody>
          </div>
          <AtAGlance items={[
            { label: 'Sector', value: 'Regional Liberal Arts / Higher Ed' },
            { label: 'Focus', value: 'First-generation student outcomes' },
            { label: 'Location', value: 'Columbia, Kentucky' },
            { label: 'Challenge', value: 'National invisibility despite strong outcomes' },
            { label: 'Approach', value: 'Fund-level StoryCycle deployment' },
          ]} />
        </EditorialGrid>
      </EditorialSection>

      {/* Numbers — amber-rule stat band, each metric with definition + context annotation */}
      <EditorialStatBand cols={3}>
        <EditorialStat
          number="27"
          definition="Media pickups at launch"
          annotation="National and regional outlets · launch quarter"
        />
        <EditorialStat
          number="+91%"
          definition="Internal brand alignment"
          annotation="Faculty and staff · post-deployment survey"
        />
        <EditorialStat
          number="Record"
          definition="Content performance"
          annotation="Highest institutional engagement on record · launch quarter"
        />
      </EditorialStatBand>

      {/* What shifted — running narrative prose */}
      <EditorialSection>
        <div style={{ maxWidth: '720px' }}>
          <EditorialLabel>What Shifted</EditorialLabel>
          <EditorialHeadline>The school people on the outside finally started looking for.</EditorialHeadline>
          <EditorialBody>
            The narrative stopped defending itself. Instead of explaining what Lindsey Wilson was, the institution started standing for something specific enough that the right audiences could find it — without being told to look.
          </EditorialBody>
          <EditorialBody>
            Application inquiries began arriving from outside Kentucky. Major-gift donor conversations moved from "help me understand it" to "how do I participate in this." Faculty stopped translating the institution into other people's frames.
          </EditorialBody>
          <EditorialBody>
            Twenty-seven media outlets covered the launch. Internal alignment hit 91 percent — which meant the story was finally something every person in the institution could carry outward, not just explain internally.
          </EditorialBody>
          <EditorialQuote>
            You don't need people to understand everything about your institution. You need them to understand one thing clearly enough to act.
          </EditorialQuote>
        </div>
      </EditorialSection>

      <Section band>
        <Reveal>
          <div style={{ marginBottom: 'var(--space-block)' }}>
            <SeeAlso items={[
              { title: 'Liaison Intl', note: 'Higher ed tech — mission-driven adjacent.', to: '/results/liaison' },
              { title: 'PE Portfolio', note: 'Portfolio-scale system deployment.', to: '/results/pe-portfolio' },
            ]} />
          </div>
        </Reveal>
      </Section>

      <Section band>
        <div className="text-center flex flex-col items-center gap-8">
          <Reveal><Headline hero onDark>Carry the mission outward.</Headline></Reveal>
          <Reveal delay={0.3}><CTA /></Reveal>
        </div>
      </Section>
    </>
  )
}
