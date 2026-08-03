import { useEffect } from 'react'
import { PageHero } from '../components/PageHero'
import { Section, Eyebrow, Headline, Body, Reveal, Accordion } from '../components/primitives'
import { Meta } from '../components/Meta'

// HubSpot "Storycycle Website Page Form" — portal 6878183, form ef2be067-c2b8-4161-aa1f-f64a319f1d94.
// Field labels/options and the success message are owned in HubSpot now, not here; see index.css
// (.hs-audit-embed) for the CSS restyling the injected markup to match the fab-card form system.
const HS_SCRIPT_SRC = 'https://js.hsforms.net/forms/embed/developer/6878183.js'

function AuditForm() {
  useEffect(() => {
    if (document.querySelector(`script[src="${HS_SCRIPT_SRC}"]`)) return
    const script = document.createElement('script')
    script.src = HS_SCRIPT_SRC
    script.defer = true
    document.body.appendChild(script)
  }, [])

  return (
    <div className="fab-card hs-audit-embed" style={{ padding: 'clamp(24px,3vw,40px)', maxWidth: '620px' }}>
      <div
        className="hs-form-html"
        data-region="na1"
        data-form-id="ef2be067-c2b8-4161-aa1f-f64a319f1d94"
        data-portal-id="6878183"
      />
    </div>
  )
}

export function FastAudit() {
  const faqs = [
    ['How much does the audit cost?', 'The Fast Positioning Audit is a flat $10,000.'],
    ['Who runs the audit?', 'A senior StoryCycle strategist. Same strategist who runs Phase 02 if you proceed.'],
    ["What if we don't proceed?", 'The written diagnosis is yours.'],
    ['How do we prepare?', 'No prep required. We bring the structure.'],
    ['How quickly can we start?', 'Audits typically begin within 2–3 weeks of confirmation.'],
  ]
  return (
    <>
      <Meta
        title="Fast Positioning Audit — StoryCycle"
        description="Five business days. A senior strategist names your real differentiator and three priority interventions. Valuable whether or not you proceed."
      />
      <PageHero
        headline={<>Five business days.<br />Your real differentiator. Named.</>}
        sub="Break the cycle of slow. Start with a five-day diagnosis."
      />

      <Section>
        <Reveal>
          <Eyebrow>What the Audit Delivers</Eyebrow>
          <div style={{ maxWidth: '760px', display: 'flex', flexDirection: 'column', gap: '14px', marginTop: 'var(--space-element)' }}>
            <Body><strong>Day 1–2:</strong> Structured discovery with leadership. 2 hours recorded conversation.</Body>
            <Body><strong>Day 2–3:</strong> Commercial narrative audit across website, sales materials, deck, live messaging.</Body>
            <Body><strong>Day 4:</strong> Synthesis. Where the story is unified. Where it fragments.</Body>
            <Body><strong>Day 5:</strong> Written diagnosis delivered. Named differentiators. Three priority interventions.</Body>
          </div>
        </Reveal>
      </Section>

      <Section band>
        <Reveal>
          <Eyebrow onDark>Standalone Value</Eyebrow>
          <Headline onDark>The audit is valuable<br />whether or not you proceed.</Headline>
          <div style={{ marginTop: 'var(--space-element)', maxWidth: '720px' }}>
            <Body onDark>Most clients say so. The structured discovery surfaces things leadership already knew but had not named together.</Body>
          </div>
        </Reveal>
      </Section>

      <Section>
        <Reveal>
          <Eyebrow>Cost of Waiting</Eyebrow>
          <Headline>Every month without a unified story<br />is a month of marketing spend<br />that does not compound.</Headline>
        </Reveal>
      </Section>

      <Section>
        <Reveal>
          <Eyebrow>Request the Audit</Eyebrow>
          <Headline className="mb-[var(--space-block)]">Start the five-day diagnosis.</Headline>
        </Reveal>
        <div style={{ marginTop: 'var(--space-block)' }}>
          <Reveal><AuditForm /></Reveal>
        </div>
      </Section>

      <Section>
        <Reveal>
          <Eyebrow>Frequently Asked</Eyebrow>
        </Reveal>
        <div style={{ marginTop: 'var(--space-block)', maxWidth: '900px' }}>
          <Accordion
            defaultOpen={0}
            items={faqs.map(([q, a], i) => ({ num: `00${i + 1}`, title: q, body: a }))}
          />
        </div>
      </Section>
    </>
  )
}
