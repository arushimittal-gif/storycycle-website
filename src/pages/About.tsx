import { PageHero } from '../components/PageHero'
import { Section, Eyebrow, Headline, Body, CTA, Reveal, TileGrid, Tile } from '../components/primitives'
import { Meta } from '../components/Meta'

export function About() {
  return (
    <>
      <Meta
        title="About — StoryCycle"
        description="StoryCycle™ is the operating system for go-to-market alignment. Twenty-five years of storytelling, strategy, and production — powered by Bowstring."
      />
      <PageHero
        headline={<>We break<br />the cycle of slow.</>}
        sub="StoryCycle™ is the operating system for growth-stage companies whose marketing investment isn't producing the pipeline conversion their work deserves."
      />

      <Section>
        <Reveal>
          <Eyebrow>What StoryCycle Is</Eyebrow>
          <div style={{ maxWidth: '760px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Body>StoryCycle is a proprietary framework for go-to-market alignment. The system we've spent 25 years building, through hundreds of engagements.</Body>
            <Body>Not a campaign. Not a rebrand. An operating system that unifies your business story across every channel, every team.</Body>
          </div>
        </Reveal>
      </Section>

      <Section band>
        <Reveal>
          <Eyebrow onDark>How We Think</Eyebrow>
          <Headline onDark>Story comes first. Always.</Headline>
          <div style={{ marginTop: 'var(--space-element)', maxWidth: '720px' }}>
            <Body onDark>The firms that grow are the firms with a unified story. Not the firms with the best campaigns. Not the firms with the biggest budgets. The firms whose story holds together across every channel.</Body>
          </div>
        </Reveal>
      </Section>

      <Section>
        <Reveal>
          <Eyebrow>Why This Works</Eyebrow>
          <Headline className="mb-[var(--space-block)]">Five reasons it compounds.</Headline>
        </Reveal>
        <div style={{ marginTop: 'var(--space-block)' }}>
          <TileGrid cols={2}>
            <Tile title="Speed Without Sacrifice">Campaign-ready output in weeks, not quarters.</Tile>
            <Tile title="Headcount-Free Scaling">Instant go-to-market engine.</Tile>
            <Tile title="Revenue-Stage Expertise">Specialists in $25M–$250M growth stage.</Tile>
            <Tile title="Data-First Storytelling">Every message built on performance data.</Tile>
            <Tile title="Multi-Channel Orchestration" span={2}>Unified messaging across all channels simultaneously.</Tile>
          </TileGrid>
        </div>
      </Section>

      <Section band>
        <Reveal>
          <Eyebrow onDark>Results in Context</Eyebrow>
          <Headline onDark>Documented across five verticals.</Headline>
          <div style={{ marginTop: 'var(--space-block)' }}>
            <CTA label="See the case studies" to="/results" />
          </div>
        </Reveal>
      </Section>

      <Section>
        <Reveal>
          <Eyebrow>How We Work</Eyebrow>
          <Headline>A senior strategist runs every audit.</Headline>
          <div style={{ marginTop: 'var(--space-element)', maxWidth: '720px' }}>
            <Body>No handoffs. The strategist who runs your Fast Positioning Audit is the strategist who will lead your Phase 02 engagement if you proceed.</Body>
          </div>
        </Reveal>
      </Section>

      <Section>
        <Reveal>
          <Eyebrow>Powered by Bowstring</Eyebrow>
          <div style={{ maxWidth: '760px' }}>
            <Body>The creative, production, and execution behind every StoryCycle engagement is powered by Bowstring's twenty-five years of storytelling, strategy, and production.</Body>
          </div>
        </Reveal>
      </Section>
    </>
  )
}
