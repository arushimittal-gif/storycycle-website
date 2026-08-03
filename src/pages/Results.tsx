import { useState } from 'react'
import { PageHero } from '../components/PageHero'
import { Section, Reveal, ListRow } from '../components/primitives'
import { Meta } from '../components/Meta'

const CASES = [
  { title: 'Harth Builders', note: 'Selling like a commodity. Despite exceptional work.', channel: 'Home Services', to: '/results/harth-builders' },
  { title: "Donnelly's HVAC", note: 'The work was premium. The pricing was commodity.', channel: 'Home Services', to: '/results/donnellys-hvac' },
  { title: 'Lindsey Wilson', note: 'The best-kept secret in Kentucky. Not anymore.', channel: 'Higher Ed', to: '/results/lindsey-wilson' },
  { title: 'Liaison International', note: 'Two firms merged. One story had to be written.', channel: 'Professional Services', to: '/results/liaison' },
  { title: 'Paul Downs Cabinetry', note: 'Designers stopped asking for quotes.', channel: 'Professional Services', to: '/results/paul-downs' },
  { title: 'Lilly Fasteners', note: "Engineers don't specify by brand. Lilly's customers do.", channel: 'Professional Services', to: '/results/lilly-fasteners' },
  { title: 'PE Portfolio', note: 'Six independent companies. One repeatable system.', channel: 'PE', to: '/results/pe-portfolio' },
]
const FILTERS = ['All channels', 'Professional Services', 'Home Services', 'PE', 'Higher Ed']

export function Results() {
  const [filter, setFilter] = useState('All channels')
  const shown = CASES.filter((c) => filter === 'All channels' || c.channel === filter)
  return (
    <>
      <Meta
        title="Results — Documented Across Five Verticals — StoryCycle"
        description="Documented engagements across five verticals. 20+ years of work behind them."
      />
      <PageHero
        eyebrow="Results"
        headline={<>Same system.<br />Different industries.<br />Documented.</>}
        sub="Documented across five verticals. 20+ years of work behind them."
      />

      <Section>
        {/* Filter bar */}
        <Reveal>
          <div className="flex flex-wrap gap-2 mb-[var(--space-block)]">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '8px 18px', borderRadius: '999px', fontSize: '12.5px', fontFamily: 'Roboto, sans-serif', cursor: 'pointer',
                  border: filter === f ? '1px solid #FBB03B' : '1px solid rgba(37,40,42,0.2)',
                  background: filter === f ? '#FBB03B' : 'transparent',
                  color: '#25282A',
                  fontWeight: filter === f ? 700 : 400,
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </Reveal>

        <div>
          {shown.map((c) => (
            <ListRow key={c.title} title={c.title} meta={c.channel} note={c.note} to={c.to} />
          ))}
        </div>
      </Section>
    </>
  )
}
