import {
  Section,
  Eyebrow,
  Headline,
  Body,
  CTA,
  CTASecondary,
  Reveal,
  Accordion,
  ListRow,
  FrameCard,
} from '../components/primitives'
import { Meta } from '../components/Meta'

// The four phases — copy verbatim from the locked wireframe
const PHASES = [
  {
    title: 'Fast Positioning Audit',
    meta: 'Phase 01 · Diagnose',
    body: '5 business days. A senior strategist runs structured discovery, audits your commercial story, delivers a written diagnosis with named differentiators and three priority interventions.',
  },
  {
    title: 'Your Unified Story',
    meta: 'Phase 02 · Align',
    body: '4–6 weeks. Leadership alignment. One unified story built from the audit — across every channel and team.',
  },
  {
    title: 'Activate Across Every Channel',
    meta: 'Phase 03 · Activate',
    body: '8–12 weeks. Every channel, every team, aligned. Website, sales enablement, content, paid acquisition — synchronized.',
  },
  {
    title: '60/90-Day Optimization',
    meta: 'Phase 04 · Optimize',
    body: 'The market moves. The competitive frame shifts. We review what got into the wild and tune it.',
  },
]

const INDUSTRIES = [
  { title: 'Professional Services', note: '$25M–$250M. Accounting, consulting, financial advisory, staffing and law firms.', to: '/who-its-for/professional-services' },
  { title: 'Home Services & Trades', note: '$25M–$250M. HVAC, contractors, luxury residential.', to: '/who-its-for/home-services-trades' },
  { title: 'PE Operating Partners', note: '$100M–$5B AUM. Portfolio value creation.', to: '/who-its-for/private-equity' },
  { title: 'Mission-Driven', note: 'Universities, colleges, nonprofits, foundations.', to: '/who-its-for/mission-driven' },
]

// Static schematic line-work for the hero — the StoryCycle loop, drawn.
// Graphical, no photography, no motion (Andy bar).
function HeroLoop() {
  return (
    <svg
      viewBox="0 0 640 640"
      className="absolute pointer-events-none hidden md:block"
      style={{ right: '-6%', top: '50%', transform: 'translateY(-50%)', width: 'min(52vw, 640px)', opacity: 0.5 }}
      aria-hidden
    >
      {/* the cycle */}
      <circle cx="320" cy="320" r="238" fill="none" stroke="rgba(236,234,227,0.14)" strokeWidth="1.5" />
      <circle cx="320" cy="320" r="164" fill="none" stroke="rgba(236,234,227,0.08)" strokeWidth="1" strokeDasharray="2 7" />
      {/* four phase nodes on the loop */}
      <circle cx="320" cy="82" r="5" fill="#FBB03B" />
      <circle cx="558" cy="320" r="4" fill="none" stroke="rgba(236,234,227,0.5)" strokeWidth="1.5" />
      <circle cx="320" cy="558" r="4" fill="none" stroke="rgba(236,234,227,0.5)" strokeWidth="1.5" />
      <circle cx="82" cy="320" r="4" fill="none" stroke="rgba(236,234,227,0.5)" strokeWidth="1.5" />
      {/* directional ticks */}
      <path d="M 442 116 l 14 -4 l -6 13" fill="none" stroke="rgba(236,234,227,0.45)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 198 524 l -14 4 l 6 -13" fill="none" stroke="rgba(236,234,227,0.45)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function Home() {
  return (
    <div className="relative w-full">
      <Meta
        title="StoryCycle™ · One Story. Every Channel. More Qualified Leads."
        description="StoryCycle fixes pipeline conversion at the system level. Your business story, unified and activated across every channel and team."
      />

      {/* ── HERO · inset charcoal frame, USP-first, graphical loop ── */}
      <section style={{ paddingTop: '84px' }}>
        <div style={{ width: '97.5%', margin: '0 auto' }}>
          <FrameCard>
            <div
              className="relative flex flex-col justify-between"
              style={{ minHeight: 'calc(100vh - 108px)', padding: 'clamp(24px, 4vw, 56px)' }}
            >
              <HeroLoop />

              {/* top row: eyebrow left · phase index right */}
              <div className="relative flex flex-wrap justify-between gap-6" style={{ zIndex: 1 }}>
                <Reveal>
                  <p
                    style={{
                      fontFamily: 'Roboto, sans-serif',
                      fontSize: '12px',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      color: 'rgba(236,234,227,0.6)',
                      margin: 0,
                    }}
                  >
                    The story underneath your pipeline
                  </p>
                </Reveal>
              </div>

              {/* headline */}
              <div className="relative" style={{ zIndex: 1, padding: 'clamp(32px, 6vh, 64px) 0' }}>
                <Reveal delay={0.15}>
                  <h1 className="fab-display" style={{ fontSize: 'clamp(2.75rem, 7.5vw, 7rem)', color: '#ECEAE3', maxWidth: '13em' }}>
                    Your pipeline is full.<br />Your sales aren't converting.
                  </h1>
                </Reveal>
              </div>

              {/* bottom row: sub-line left · audit card right */}
              <div className="relative grid grid-cols-1 md:grid-cols-12 gap-8 items-end" style={{ zIndex: 1 }}>
                <div className="md:col-span-7">
                  <Reveal delay={0.25}>
                    <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: 'clamp(1rem, 1.5vw, 1.2rem)', color: 'rgba(236,234,227,0.75)', lineHeight: 1.55, maxWidth: '540px', margin: 0 }}>
                      StoryCycle fixes it at the system level.{' '}
                      <span style={{ fontWeight: 700, color: '#ECEAE3' }}>Your business story, activated across every channel and team.</span>
                    </p>
                  </Reveal>
                </div>
                <div className="md:col-span-5 flex md:justify-end">
                  <Reveal delay={0.35}>
                    <div className="fab-card p-6" style={{ maxWidth: '320px', borderRadius: 'var(--radius-card)' }}>
                      <p className="fab-counter" style={{ marginBottom: '8px' }}>Diagnose</p>
                      <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '17px', fontWeight: 700, color: '#25282A', margin: '0 0 4px', letterSpacing: '-0.01em' }}>
                        Fast Positioning Audit
                      </p>
                      <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '13px', color: 'rgba(37,40,42,0.65)', margin: '0 0 16px' }}>
                        Five business days. Start here.
                      </p>
                      <CTA />
                    </div>
                  </Reveal>
                </div>
              </div>
            </div>
          </FrameCard>
        </div>
      </section>

      {/* ── WHO IT'S FOR · industry index rows ── */}
      <Section>
        <Reveal>
          <Headline>Different industries.<br />Same broken story.</Headline>
          <div style={{ marginTop: 'var(--space-element)', marginBottom: 'var(--space-block)' }}>
            <Body>Different categories. Same root cause.</Body>
          </div>
        </Reveal>
        <div>
          {INDUSTRIES.map((ind) => (
            <ListRow key={ind.to} title={ind.title} note={ind.note} to={ind.to} />
          ))}
        </div>
      </Section>

      {/* ── THE MECHANISM · manifesto statement ── */}
      <Section>
        <div style={{ maxWidth: '1080px' }}>
          <Reveal>
            <h2 className="fab-display" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.75rem)', color: '#25282A' }}>
              It's not your marketing. It's the story underneath it.
            </h2>
          </Reveal>
        </div>
        <div className="flex flex-col gap-6" style={{ marginTop: 'var(--space-block)', maxWidth: '760px' }}>
          <Reveal delay={0.1}>
            <Body>Marketing spend goes up. Pipeline volume goes up. Conversion stays flat. Buyers see five versions of you and pick the one easiest to commoditize.</Body>
          </Reveal>
          <Reveal delay={0.2}>
            <Body>StoryCycle is the operating system that fixes this. Not a campaign, not a rebrand. One unified business story, activated across every channel and team, measured against pipeline conversion.</Body>
          </Reveal>
        </div>
      </Section>

      {/* ── HOW IT WORKS · numbered phase accordion ── */}
      <Section>
        <Reveal>
          <Eyebrow>Four phases. One operating system.</Eyebrow>
          <Headline>Stop improvising.<br />Start operating.</Headline>
        </Reveal>
        <div style={{ marginTop: 'var(--space-block)' }}>
          <Accordion items={PHASES} />
        </div>
        <div style={{ marginTop: 'var(--space-block)' }}>
          <Reveal>
            <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '12px', color: 'rgba(37,40,42,0.55)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, margin: 0 }}>
              One senior strategist, start to finish. No handoffs.
            </p>
          </Reveal>
        </div>
      </Section>

      {/* ── RESULTS · stat band ── */}
      <Section band>
        <Reveal>
          <Headline onDark className="mb-[var(--space-block)]">Documented across<br />four verticals.</Headline>
        </Reveal>
        <Reveal>
          <CTASecondary onDark label="See the case studies" to="/results" />
        </Reveal>
      </Section>

      {/* ── THE SPREAD · network diagram ── */}
      <Section>
        <Reveal>
          <Eyebrow>The Spread</Eyebrow>
          <Headline>One story. Every channel.<br />More qualified leads.</Headline>
          <div style={{ marginTop: 'var(--space-element)', maxWidth: '640px' }}>
            <Body>StoryCycle puts one unified story to work across every team and touchpoint — simultaneously. Not a campaign. An operating system.</Body>
          </div>
        </Reveal>
        <Reveal>
          <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '15px', lineHeight: 1.6, color: 'rgba(37,40,42,0.75)', maxWidth: '560px', marginTop: 'var(--space-element)' }}>
            When these three tell the same story, pipeline converts. When they don't, it leaks.
          </p>
        </Reveal>
      </Section>

      {/* ── INSIGHTS · preview ── */}
      <Section>
        <Reveal>
          <Eyebrow>Insights</Eyebrow>
          <Headline>Written for the operator.<br />Not the agency.</Headline>
        </Reveal>
        <div style={{ marginTop: 'var(--space-block)' }}>
          <CTASecondary label="See all articles" to="/insights" />
        </div>
      </Section>

    </div>
  )
}
