import { PageHero } from '../components/PageHero'
import { Section, Eyebrow, Headline, Body, CTA, CTASecondary, Reveal, Accordion } from '../components/primitives'
import { Meta } from '../components/Meta'

const PHASES = [
  {
    title: '5 Days',
    meta: 'Phase 01 · Diagnose',
    body: 'Fast Positioning Audit. Written diagnosis with named differentiators and three priority interventions.',
  },
  {
    title: '4–6 Weeks',
    meta: 'Phase 02 · Align',
    body: 'Your unified story. Leadership aligned around one narrative across every channel.',
  },
  {
    title: '8–12 Weeks',
    meta: 'Phase 03 · Activate',
    body: 'Activate across every channel and team. This is a recurring sprint cycle, not a one-time delivery. After each cycle we reoptimize based on what the data shows.',
  },
  {
    title: '60/90 Days',
    meta: 'Phase 04 · Optimize',
    body: 'In-market optimization post-activation. Tune what got into the wild. Every 60 to 90 days, we run a full diagnostic and reset priorities for the next sprint cycle.',
  },
]

export function HowItWorks() {
  return (
    <>
      <Meta
        title="How It Works — The StoryCycle Operating System"
        description="Four phases, one operating system. Diagnose, align, activate, optimize — a recurring sprint cycle that compounds."
      />
      <PageHero
        eyebrow="How It Works"
        headline={<>Stop improvising.<br />Start operating.</>}
        sub="Four months. One operating system."
      />

      <Section>
        <Reveal>
          <Eyebrow>The Problem</Eyebrow>
          <Headline>The spend is real.<br />The returns aren't.</Headline>
          <div style={{ marginTop: 'var(--space-element)', maxWidth: '720px' }}>
            <Body>Marketing, sales enablement, content, paid acquisition. The numbers look like growth on the way out. They don't compound on the way back.</Body>
          </div>
        </Reveal>
      </Section>

      <Section band>
        <Reveal>
          <Eyebrow onDark>The Entry Point</Eyebrow>
          <Headline onDark>Every engagement<br />starts here.</Headline>
          <div style={{ marginTop: 'var(--space-element)', marginBottom: 'var(--space-block)', maxWidth: '680px' }}>
            <Body onDark>Five business days. A senior strategist runs structured discovery, audits your commercial story, delivers a written diagnosis with named differentiators and three priority interventions.</Body>
          </div>
          <CTA />
        </Reveal>
      </Section>

      <Section>
        <Reveal>
          <Eyebrow>The Four Phases</Eyebrow>
          <Headline>Four phases.<br />One operating system.</Headline>
        </Reveal>
        <div style={{ marginTop: 'var(--space-block)' }}>
          <Accordion items={PHASES} />
        </div>
        <Reveal>
          <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '12px', color: 'rgba(37,40,42,0.55)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, textAlign: 'center', marginTop: 'var(--space-block)' }}>
            ↻ Activate → Optimize → repeat. A recurring sprint cycle, not a 12-week finish line.
          </p>
        </Reveal>
      </Section>

      <Section>
        <Reveal>
          <Eyebrow>What Happens After Activation</Eyebrow>
          <Headline>60 and 90 days after activation,<br />we review.</Headline>
          <div style={{ marginTop: 'var(--space-element)', maxWidth: '720px' }}>
            <Body>The market moves. The competitive frame shifts. We review what got into the wild and tune it.</Body>
          </div>
        </Reveal>
      </Section>

      {/* ── Scope clarity — canonical statement, verbatim, as a clarifying note ── */}
      <Section>
        <Reveal>
          <div className="fab-card" style={{ maxWidth: '760px', padding: 'var(--space-element) clamp(16px,2vw,28px)', borderLeft: '3px solid #FBB03B' }}>
            <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '13px', lineHeight: 1.65, color: 'rgba(37,40,42,0.72)', margin: 0 }}>
              StoryCycle builds the system and the assets. We diagnose the misalignment, surface the unified story, and deliver everything needed to execute it, including messaging architecture, assets, and channel copy, to the right teams and platforms. Activation and internal adoption are the client's responsibility.
            </p>
          </div>
        </Reveal>
      </Section>

      <Section band>
        <Reveal>
          <Eyebrow onDark>Results in Practice</Eyebrow>
          <Headline onDark>The same system.<br />Five verticals. Real results.</Headline>
        </Reveal>
        <div style={{ marginTop: 'var(--space-block)' }}>
          <Reveal>
            <CTASecondary onDark label="See the case studies" to="/results" />
          </Reveal>
        </div>
      </Section>

      <Section>
        <Reveal>
          <Eyebrow>Is This Right For You?</Eyebrow>
          <Headline>When StoryCycle isn't the fit.</Headline>
          <div style={{ marginTop: 'var(--space-element)', maxWidth: '720px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Body>Below $25M revenue. Marketing spend below $200K annually. Founder still owns sales personally. Leadership won't participate.</Body>
            <Body><strong>When it is.</strong> $25M–$250M. Marketing spend that isn't compounding. Real growth ambition.</Body>
          </div>
        </Reveal>
      </Section>

    </>
  )
}
