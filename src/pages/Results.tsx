import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Clock, Calendar, Route, Table, Grid2x2, Users, GitMerge, type LucideIcon } from 'lucide-react'
import { Reveal } from '../components/primitives'
import { Meta } from '../components/Meta'

// ─────────────────────────────────────────────────────────
// RESULTS — "problem-first" redesign (Claude Design project
// 6166bdb4…, "Results 2.dc.html"). Replaces the old named-case-
// study listing (Donnelly's, Lindsey Wilson, etc. — those pages
// still exist at their old URLs, just no longer linked from here)
// with anonymized, symptom-organized case cards, matching the
// client-confidentiality framing: "You won't find your name here."
// ─────────────────────────────────────────────────────────

const INK = '#25282A'
const AMBER = '#FBB03B'
const CREAM = '#F5F1EA'

type Card = {
  id: string
  icon: LucideIcon
  symptom: string
  vertical: string
  profile: string
  headline: string
  deck: string
  quietProblem: string
  variant?: 'short'
  shortText?: string
  found?: string
  changed?: string
  outcome?: string
  voices?: string[]
  trueDetail: string
  cta: string
  industry: string
}

const SYMPTOMS = [
  'All problems',
  'Pipeline full, sales not converting',
  'Premium work, commodity price',
  'Sales channel aging out',
  'New market, no way to reach a specific buyer',
  'Right plan, no capacity to execute',
  'Buying traffic and dropping it',
  'Portfolio company outside the owner’s lane',
]
const VERTICALS = ['All verticals', 'Home Services & Trades', 'Professional Services', 'Mission-Driven', 'Private Equity']
const FORM_SYMPTOMS = [...SYMPTOMS.slice(1), 'None of these yet']

const CARDS: Card[] = [
  {
    id: 'design-build',
    icon: MapPin,
    symptom: 'New market, no way to reach a specific buyer',
    vertical: 'Home Services & Trades',
    profile: 'Design-build firm · $10M+ · East Coast · founder-led',
    headline: 'Invisible to the exact houses you’re best at',
    deck: 'The firm’s best work happened in one kind of house. The marketing bought demographics and hoped the right houses were inside them. We found the houses instead.',
    quietProblem: 'Your best buyer is a specific house, not a demographic. The whole industry markets to demographics.',
    found: 'The highest-margin projects shared an address type, not an audience profile. A second property leaves a second paper trail. Public records could surface the exact houses the firm was built to renovate.',
    changed: 'We cross-referenced public records into a list of specific addresses. We wrote the mailers, produced a printed lookbook, and placed it where that income already sits. Then we set the cadence and handed the system to the firm’s team.',
    outcome: 'Documented over the first year of the engagement. Designers started calling first and quote requests stopped arriving cold. The firm owns the list, the system that refreshes it, and the choice of which houses to pursue.',
    voices: [
      'Our pipeline is full and the wrong jobs keep winning.',
      'We do our best work on one kind of house and I can’t find more of them.',
      'Everyone in this market runs the same ads to the same zip codes.',
    ],
    trueDetail: 'Before the first mailer went out, we pulled room dimensions off listing photos so the piece could speak to the actual house it landed in.',
    cta: 'Get the working page: Design-Build',
    industry: 'Design-Build',
  },
  {
    id: 'hvac',
    icon: Clock,
    symptom: 'Premium work, commodity price',
    vertical: 'Home Services & Trades',
    profile: 'Regional HVAC company · Mid-Atlantic · preparing for an ownership transition',
    headline: 'The replacement window is the marketing calendar',
    deck: 'Every unit installed today carries a replacement date. The marketing ran on the weather instead. We rebuilt the calendar around the equipment.',
    quietProblem: 'Marketing runs on the season’s calendar. The equipment in the basement runs on a different clock, and that one is the profitable one.',
    found: 'The profitable work was replacement, and replacement conversations only started the day something died. The company already knew where the aging units were. Nobody had ever treated that knowledge as a marketing asset.',
    changed: 'One technician kept his own equipment log, built only so dispatch could route him. We turned that log into the outreach calendar, wrote the touchpoints for each stage of a unit’s life, and trained the office to run it. Contact now lands when the unit is due, not when the weather turns.',
    outcome: 'Documented over the first year of the engagement. Replacement conversations start before the breakdown call. The company owns the calendar and the pipeline it feeds, and the revenue stopped depending on the season. That is what an ownership transition needs.',
    voices: [
      'Busy season buries us and the shoulder months go silent.',
      'We sell a replacement the day something dies. Never before.',
      'I’m getting ready to hand this company off and the revenue chart looks like a sine wave.',
    ],
    trueDetail: 'The system started as one technician’s handwritten equipment log, kept for years so dispatch would send him to the units he knew.',
    cta: 'Get the working page: HVAC',
    industry: 'HVAC',
  },
  {
    id: 'college-date',
    icon: Calendar,
    variant: 'short',
    symptom: 'Right plan, no capacity to execute',
    vertical: 'Mission-Driven',
    profile: 'Small private college · the South · fixed campaign date',
    headline: 'The right plan and no capacity to ship it',
    deck: 'The strategy was already right. The launch date would not move. The work was capacity, not correction.',
    quietProblem: 'Small institutions usually have the right plan. What’s missing is capacity: a launch bigger than the team, and a date that won’t move.',
    shortText: 'We reviewed the plan and told them there was nothing to fix. The engagement was pure capacity. We produced the story assets, built the channel kits, and ran the calendar beside their team to hit a date that would not move. The plan they wrote is the plan that ran, and they own everything we built. Documented over the first year of the engagement, the campaign shipped on the date.',
    voices: [
      'The plan is sitting in a deck and nobody has time to run it.',
      'Our date won’t move and we need hands, not another plan.',
      'We have one marketing person and a launch bigger than the department.',
    ],
    trueDetail: 'The first thing we told them was that there was nothing to fix.',
    cta: 'Get the working page: Colleges',
    industry: 'Colleges',
  },
  {
    id: 'furniture',
    icon: Route,
    symptom: 'Sales channel aging out',
    vertical: 'Professional Services',
    profile: 'Custom furniture maker · founder-led · Northeast',
    headline: 'The channel died. The craft never slipped.',
    deck: 'One relationship generation carried the pipeline for decades. That generation retired. The product never stopped working.',
    quietProblem: 'Craft businesses get built on one channel and one relationship generation. When that generation retires, the product is as strong as ever and the pipeline is gone.',
    found: 'The pipeline had run for decades on one generation of relationships. Those buyers were retiring, and nothing existed to reach whoever replaced them. The work itself had no problem to fix.',
    changed: 'We mapped where the next generation of specifiers already looks. Then we rebuilt the story with the work leading and built the channel plan to carry it: the portfolio pieces, the placements, the outreach rhythm. The team runs it on their own calendar now.',
    outcome: 'Documented over the first year of the engagement. Inquiries now arrive from buyers with no tie to the old channel, and the conversation starts with the work instead of the price. The maker owns a route to the buyer that doesn’t retire.',
    voices: [
      'Our best referrers are retiring and nothing is replacing them.',
      'The work is as good as it has ever been and the phone is quieter every year.',
      'We never needed marketing. The channel was the marketing.',
    ],
    trueDetail: 'The decision was over before the quote. The buyers who mattered had already chosen from the story.',
    cta: 'Get the working page: Custom Manufacturing',
    industry: 'Custom Manufacturing',
  },
  {
    id: 'fasteners',
    icon: Table,
    symptom: 'Pipeline full, sales not converting',
    vertical: 'Professional Services',
    profile: 'Industrial fastener distributor · Mid-Atlantic',
    headline: 'Engineers don’t specify by brand. Their customers do.',
    deck: 'The buyer that mattered never saw the brand. The component got written into drawings as performance criteria.',
    quietProblem: 'Components get written into drawings as performance criteria, not names. The spec sheet is the real sales channel.',
    found: 'Sales called on purchasing, but the decision lived upstream in the engineering drawing. Once a component is specified, the order is a formality. The brand was invisible at the only moment that counted.',
    changed: 'We wrote the story for the people who write the spec, in the language of the drawing: performance criteria, tolerances, use cases. Then we built the reference material engineers reach for and put it where they look things up. Sales got a reason to call engineering.',
    outcome: 'Documented over the first year of the engagement. The company now shows up while the spec is being written, not after. Conversations start with engineering instead of purchasing, and the team owns the reference material that keeps it that way.',
    voices: [
      'We win on service and lose on price.',
      'By the time we hear about a job, the components are already specified.',
      'Purchasing loves us. Engineering has never heard of us.',
    ],
    trueDetail: 'The spreadsheet stayed. The tracking system the team trusted was never replaced, just fed better.',
    cta: 'Get the working page: Industrial Distribution',
    industry: 'Industrial Distribution',
  },
  {
    id: 'pe',
    icon: Grid2x2,
    symptom: 'Portfolio company outside the owner’s lane',
    vertical: 'Private Equity',
    profile: 'Six operating companies · one fund',
    headline: 'Six companies. One repeatable system.',
    deck: 'The fund was buying the same problem six times and solving it six ways. We built the system once.',
    quietProblem: 'An operator wins in a lane they know, then buys into a lane they don’t. Every company gets a bespoke fix and none of it transfers.',
    found: 'Each operating company had its own bespoke marketing fix, its own partners, and its own vocabulary. None of it transferred. Diligence was repeatable and go-to-market was not.',
    changed: 'We built the story system once and ran it across the portfolio. Same process, same document structure, different story each time. What one company learned, the next one inherited.',
    outcome: 'Documented across the portfolio engagement. New acquisitions onboard onto a known system instead of a fresh diagnosis. The fund owns the process, not a vendor relationship.',
    voices: [
      'Every portco runs its own playbook and nothing transfers.',
      'We know how to operate. Marketing is the lane we didn’t buy expertise in.',
      'Diligence is repeatable. Why isn’t go-to-market?',
    ],
    trueDetail: 'Onboarding for the sixth company was one document and one working session.',
    cta: 'Get the working page: PE Portfolios',
    industry: 'PE Portfolios',
  },
  {
    id: 'college-visit',
    icon: Users,
    symptom: 'Buying traffic and dropping it',
    vertical: 'Mission-Driven',
    profile: 'Small liberal arts college · Midwest · enrollment pressure',
    headline: 'The visit is the whole job',
    deck: 'One campus moment does the convincing. The budget was spent everywhere else. We moved the story to the moment.',
    quietProblem: 'In admissions, one moment does the convincing. Most budgets are spent everywhere else.',
    found: 'The one campus moment where families arrive in multiple generations was carrying enrollment. It got the least production attention of anything on the marketing calendar.',
    changed: 'We rebuilt the story around the visit: what a family sees, hears, and takes home. We produced the assets for the day itself, then rebuilt everything upstream to get a family to that moment instead of substituting for it.',
    outcome: 'Documented over the first year of the engagement. The visit runs as the center of the funnel, the team plans backward from it, and the school owns the playbook for the day.',
    voices: [
      'Families who visit enroll. Families who don’t, don’t.',
      'We’re buying inquiries and losing them before campus.',
      'Our best recruiting tool is a day, and we treat it like an event, not a channel.',
    ],
    trueDetail: 'The video person was underused, not overworked.',
    cta: 'Get the working page: Enrollment',
    industry: 'Enrollment',
  },
  {
    id: 'merger',
    icon: GitMerge,
    variant: 'short',
    symptom: 'Pipeline full, sales not converting',
    vertical: 'Professional Services',
    profile: 'Professional services merger · international',
    headline: 'Two firms merged. One story had to be written.',
    deck: 'The operations merged on schedule. The market kept meeting two companies.',
    quietProblem: 'Mergers get integrated on the ops side because ops has a checklist. Nobody owns the commercial story, so the market keeps meeting two companies.',
    shortText: 'Ops integrated on a checklist. The commercial story had no checklist and no owner, so every seller answered the same question differently. We wrote the one story both firms could sell and put it in the room where the selling happens.',
    trueDetail: 'The reps were not off-message. They were choosing between two true messages.',
    cta: 'Get the working page: Professional Services',
    industry: 'Professional Services',
  },
]

function Chip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 18px',
        borderRadius: '999px',
        fontSize: '12.5px',
        fontFamily: 'Roboto, sans-serif',
        cursor: 'pointer',
        color: INK,
        border: selected ? `1px solid ${AMBER}` : '1px solid rgba(37,40,42,0.2)',
        background: selected ? AMBER : 'transparent',
        fontWeight: selected ? 700 : 400,
      }}
    >
      {label}
    </button>
  )
}

export function Results() {
  const [symptom, setSymptom] = useState('All problems')
  const [vertical, setVertical] = useState('All verticals')
  const [open, setOpen] = useState<Record<string, boolean>>({})
  const [formIndustry, setFormIndustry] = useState('Design-Build')
  const [picked, setPicked] = useState<Record<string, boolean>>({})
  const [submitted, setSubmitted] = useState(false)

  return (
    <>
      <Meta
        title="Results — StoryCycle"
        description="You won't find your name here. But maybe you'll find your challenge. Anonymized go-to-market case studies for professional services, home services, colleges, and PE portfolio companies."
      />

      {/* ── HERO ── */}
      <section style={{ padding: 'clamp(120px,14vh,180px) 0 clamp(48px,6vh,88px)' }}>
        <div className="sc-container">
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8 items-end">
              <div>
                <p style={{ fontSize: '12px', color: 'rgba(37,40,42,0.55)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, margin: '0 0 12px', fontFamily: 'Roboto, sans-serif' }}>Results</p>
                <h1 className="fab-display" style={{ fontSize: 'clamp(2.5rem,6.5vw,5.5rem)', color: INK, margin: 0 }}>
                  You won&rsquo;t find your name here.<br />But maybe you&rsquo;ll find your{' '}
                  <span style={{ background: `linear-gradient(transparent 78%, ${AMBER} 78%)` }}>challenge</span>.
                </h1>
              </div>
              <div style={{ margin: '0 0 12px' }}>
                <p style={{ fontSize: '16px', lineHeight: 1.6, color: 'rgba(37,40,42,0.7)', margin: '0 0 16px', fontFamily: 'Roboto, sans-serif' }}>
                  Client stories belong to the clients. We share the mechanism openly and the full case, with the name and the numbers, on request.
                </p>
                <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'rgba(37,40,42,0.5)', margin: 0, fontFamily: 'Roboto, sans-serif' }}>
                  Go-to-market case studies for professional services, home services, colleges, and PE portfolio companies.
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center flex-wrap gap-2" style={{ marginTop: 'clamp(40px,6vh,72px)' }}>
              <p style={{ fontSize: '12px', color: 'rgba(37,40,42,0.5)', margin: 0, fontFamily: 'Roboto, sans-serif' }}>
                Documented by <Link to="/about" style={{ color: 'rgba(37,40,42,0.7)' }}>Enrique Mendoza, founder, Bowstring</Link>
              </p>
              <p style={{ fontSize: '12px', color: 'rgba(37,40,42,0.5)', margin: 0, fontFamily: 'Roboto, sans-serif' }}>Last reviewed: September 2026</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── HOW THESE CASES ARE WRITTEN ── */}
      <section style={{ padding: '0 0 48px' }}>
        <div className="sc-container" style={{ borderTop: '1px solid rgba(37,40,42,0.14)', paddingTop: '40px' }}>
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] gap-8">
              <h2 className="fab-display" style={{ fontSize: '18px', color: INK, margin: 0 }}>How these cases are written</h2>
              <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'rgba(37,40,42,0.7)', margin: 0, maxWidth: '720px', fontFamily: 'Roboto, sans-serif' }}>
                Every case on this page is an engagement we ran. Each one is written from the internal brief and the client-reviewed deliverables. Names and figures are withheld at the client&rsquo;s discretion and provided on request.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FILTERS + CARDS ── */}
      <section style={{ padding: '24px 0 120px' }}>
        <div className="sc-container">
          <Reveal>
            <p style={{ fontSize: '12px', color: 'rgba(37,40,42,0.55)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, margin: '0 0 12px', fontFamily: 'Roboto, sans-serif' }}>Find your problem</p>
            <div className="flex flex-wrap gap-2" style={{ marginBottom: '16px' }}>
              {SYMPTOMS.map((s) => (
                <Chip key={s} label={s} selected={symptom === s} onClick={() => setSymptom(s)} />
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2" style={{ marginBottom: '64px' }}>
              <span style={{ fontSize: '11px', color: 'rgba(37,40,42,0.45)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600, fontFamily: 'Roboto, sans-serif' }}>Vertical</span>
              {VERTICALS.map((v) => (
                <button
                  key={v}
                  onClick={() => setVertical(v)}
                  style={{
                    padding: '4px 2px',
                    border: 'none',
                    borderBottom: vertical === v ? `2px solid ${AMBER}` : '2px solid transparent',
                    background: 'transparent',
                    fontSize: '12.5px',
                    fontFamily: 'Roboto, sans-serif',
                    cursor: 'pointer',
                    color: vertical === v ? INK : 'rgba(37,40,42,0.55)',
                    fontWeight: vertical === v ? 700 : 400,
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
          </Reveal>

          {CARDS.map((c) => {
            const matches = (symptom === 'All problems' || c.symptom === symptom) && (vertical === 'All verticals' || c.vertical === vertical)
            const isOpen = !!open[c.id]
            const Icon = c.icon
            return (
              <article
                key={c.id}
                style={{ borderTop: '1px solid rgba(37,40,42,0.14)', padding: '40px 0', opacity: matches ? 1 : 0.25, transition: 'opacity 200ms cubic-bezier(0.2,0.6,0.2,1)' }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-[60px_1fr_auto] gap-6 items-start">
                  <div style={{ color: AMBER, paddingTop: '6px' }}>
                    <Icon size={32} strokeWidth={1.75} />
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: 'rgba(37,40,42,0.55)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, margin: '0 0 10px', fontFamily: 'Roboto, sans-serif' }}>{c.profile}</p>
                    <h2
                      className="fab-display"
                      style={{ fontSize: 'clamp(1.6rem,3.2vw,2.6rem)', color: INK, margin: '0 0 14px', cursor: 'pointer' }}
                      onClick={() => setOpen((s) => ({ ...s, [c.id]: !s[c.id] }))}
                    >
                      {c.headline}
                    </h2>
                    <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'rgba(37,40,42,0.7)', margin: 0, maxWidth: '640px', fontFamily: 'Roboto, sans-serif' }}>{c.deck}</p>
                  </div>
                  <button
                    onClick={() => setOpen((s) => ({ ...s, [c.id]: !s[c.id] }))}
                    style={{ justifySelf: 'end', padding: '10px 20px', borderRadius: '999px', border: '1px solid rgba(37,40,42,0.25)', background: 'transparent', fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: 700, color: INK, cursor: 'pointer', whiteSpace: 'nowrap' }}
                  >
                    {isOpen ? 'Close' : 'Read the case'}
                  </button>
                </div>

                {isOpen && (
                  <div style={{ marginTop: '40px' }}>
                    <div className="grid grid-cols-1 sm:grid-cols-[60px_1fr] gap-6">
                      <span />
                      <div style={{ maxWidth: '880px' }}>
                        <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: '17px', lineHeight: 1.45, color: INK, margin: '0 0 36px' }}>{c.quietProblem}</p>

                        {c.variant === 'short' ? (
                          <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'rgba(37,40,42,0.75)', margin: '0 0 36px', maxWidth: '720px', fontFamily: 'Roboto, sans-serif' }}>{c.shortText}</p>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8" style={{ marginBottom: '36px' }}>
                            <div>
                              <h3 style={{ fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700, color: INK, margin: '0 0 10px', fontFamily: 'Montserrat, sans-serif' }}>What we found</h3>
                              <p style={{ fontSize: '14.5px', lineHeight: 1.65, color: 'rgba(37,40,42,0.75)', margin: 0, fontFamily: 'Roboto, sans-serif' }}>{c.found}</p>
                            </div>
                            <div>
                              <h3 style={{ fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700, color: INK, margin: '0 0 10px', fontFamily: 'Montserrat, sans-serif' }}>What changed</h3>
                              <p style={{ fontSize: '14.5px', lineHeight: 1.65, color: 'rgba(37,40,42,0.75)', margin: 0, fontFamily: 'Roboto, sans-serif' }}>{c.changed}</p>
                            </div>
                            <div>
                              <h3 style={{ fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700, color: INK, margin: '0 0 10px', fontFamily: 'Montserrat, sans-serif' }}>Outcome</h3>
                              <p style={{ fontSize: '14.5px', lineHeight: 1.65, color: 'rgba(37,40,42,0.75)', margin: 0, fontFamily: 'Roboto, sans-serif' }}>{c.outcome}</p>
                            </div>
                          </div>
                        )}

                        {c.voices && (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8" style={{ borderTop: '1px solid rgba(37,40,42,0.14)', paddingTop: '24px', marginBottom: '32px' }}>
                            {c.voices.map((q, i) => (
                              <p key={i} style={{ fontSize: '14px', lineHeight: 1.55, color: 'rgba(37,40,42,0.6)', fontStyle: 'italic', margin: 0, fontFamily: 'Roboto, sans-serif' }}>&ldquo;{q}&rdquo;</p>
                            ))}
                          </div>
                        )}

                        <p style={{ fontSize: '14px', lineHeight: 1.6, color: INK, margin: '0 0 36px', fontFamily: 'Roboto, sans-serif' }}>
                          <span style={{ background: 'linear-gradient(transparent 62%, rgba(251,176,59,0.5) 62%)' }}>{c.trueDetail}</span>
                        </p>

                        <a
                          href="#request"
                          onClick={() => { setFormIndustry(c.industry); setSubmitted(false) }}
                          className="fab-pill"
                          style={{ textDecoration: 'none' }}
                        >
                          {c.cta} <span aria-hidden="true">&rarr;</span>
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            )
          })}
          <div style={{ borderTop: '1px solid rgba(37,40,42,0.14)' }} />
        </div>
      </section>

      {/* ── REQUEST THE WORKING PAGE ── */}
      {/* TODO (HubSpot wiring): this form is currently local-state only, matching
          the imported design's own behavior — no submission wired to HubSpot or
          any backend yet. Needs a real form ID from Enrique before this collects
          leads for real, same as the Fast Positioning Audit / whitepaper forms. */}
      <section id="request" style={{ background: CREAM, padding: '88px 0' }}>
        <div className="sc-container" style={{ maxWidth: '880px' }}>
          {!submitted ? (
            <Reveal>
              <p style={{ fontSize: '12px', color: 'rgba(37,40,42,0.55)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, margin: '0 0 12px', fontFamily: 'Roboto, sans-serif' }}>Request</p>
              <h2 className="fab-display" style={{ fontSize: 'clamp(1.8rem,3.4vw,2.6rem)', color: INK, margin: '0 0 8px' }}>The Working Page: {formIndustry}</h2>
              <p style={{ fontSize: '14px', color: 'rgba(37,40,42,0.6)', margin: '0 0 36px', fontFamily: 'Roboto, sans-serif' }}>Sent from a person, not a sequence. Within a business day.</p>
              <form
                onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }}
                noValidate
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" style={{ marginBottom: '24px' }}>
                  <input placeholder="Name" style={{ padding: '14px 16px', border: '1px solid rgba(37,40,42,0.25)', borderRadius: '4px', background: '#FAF7F2', fontFamily: 'Roboto, sans-serif', fontSize: '14px', color: INK }} />
                  <input placeholder="Work email" type="email" style={{ padding: '14px 16px', border: '1px solid rgba(37,40,42,0.25)', borderRadius: '4px', background: '#FAF7F2', fontFamily: 'Roboto, sans-serif', fontSize: '14px', color: INK }} />
                  <input placeholder="Company" style={{ padding: '14px 16px', border: '1px solid rgba(37,40,42,0.25)', borderRadius: '4px', background: '#FAF7F2', fontFamily: 'Roboto, sans-serif', fontSize: '14px', color: INK }} />
                </div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: INK, margin: '0 0 10px', fontFamily: 'Roboto, sans-serif' }}>Which of these sound like you?</p>
                <div className="flex flex-wrap gap-2" style={{ marginBottom: '32px' }}>
                  {FORM_SYMPTOMS.map((label) => (
                    <Chip
                      key={label}
                      label={label}
                      selected={!!picked[label]}
                      onClick={() => setPicked((s) => ({ ...s, [label]: !s[label] }))}
                    />
                  ))}
                </div>
                <button type="submit" className="fab-pill">Send it</button>
                <p style={{ fontSize: '12px', color: 'rgba(37,40,42,0.5)', margin: '14px 0 0', fontFamily: 'Roboto, sans-serif' }}>Three short emails follow, then we stop unless you reply.</p>
              </form>
            </Reveal>
          ) : (
            <Reveal>
              <h2 className="fab-display" style={{ fontSize: 'clamp(1.8rem,3.4vw,2.6rem)', color: INK, margin: '0 0 12px' }}>On its way.</h2>
              <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'rgba(37,40,42,0.7)', margin: '0 0 24px', maxWidth: '560px', fontFamily: 'Roboto, sans-serif' }}>
                The working page for {formIndustry} arrives within a business day, from a person. If you want a read on your own situation sooner, the audit is faster.
              </p>
              <Link
                to="/fast-positioning-audit"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', borderRadius: '999px', border: '1px solid rgba(37,40,42,0.3)', color: INK, fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: 700, padding: '12px 22px', textDecoration: 'none' }}
              >
                Book the Fast Positioning Audit <span aria-hidden="true">&rarr;</span>
              </Link>
            </Reveal>
          )}
        </div>
      </section>

      {/* ── DON'T SEE YOUR CHALLENGE? ── */}
      <section style={{ padding: '100px 0 120px' }}>
        <div className="sc-container text-center">
          <Reveal>
            <h2 className="fab-display" style={{ fontSize: 'clamp(1.8rem,3.6vw,3rem)', color: INK, margin: '0 0 12px' }}>Don&rsquo;t see your challenge?</h2>
            <p style={{ fontSize: '15px', color: 'rgba(37,40,42,0.7)', margin: '0 0 28px', fontFamily: 'Roboto, sans-serif' }}>Describe the symptom. We&rsquo;ll tell you if we&rsquo;ve seen it.</p>
            <Link to="/fast-positioning-audit" className="fab-pill" style={{ textDecoration: 'none' }}>
              Book the Fast Positioning Audit <span aria-hidden="true">&rarr;</span>
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
