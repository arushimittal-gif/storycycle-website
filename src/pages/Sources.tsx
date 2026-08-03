import { PageHero } from '../components/PageHero'
import { Section, Eyebrow, Headline, Reveal } from '../components/primitives'

const INTERNAL = [
  { id: 'A', title: 'AscendX One-Sheet', note: 'Primary positioning source. 3HAG Statement, Brand Promise, 5 Key Differentiators, ICP, pain points, decision-makers.' },
  { id: 'B', title: 'Bowstring StoryCycle Whitepaper 2026', note: 'Research-backed problem framing with 15 third-party citations.' },
  { id: 'C', title: 'StoryCycle SDR-to-SME Playbook', note: 'Sales process, revenue model, qualification logic.' },
  { id: 'D', title: 'SDR Workflow and HubSpot Access Defined', note: 'Operational source for the SDR notification and confirmation workflow.' },
  { id: 'E', title: "Donnelly's HVAC Case Study", note: 'Source for +40% qualified leads, +25% close rate, +18% revenue per customer, -35% team turnover.' },
  { id: 'F', title: 'PE Portfolio Case Study', note: 'Source for +35% qualified lead volume, +22% sales cycle compression, +14% pricing power, $2.8M+ Year 1 revenue lift, 82% internal alignment. Six portfolio companies.' },
  { id: 'G', title: 'Lindsey Wilson University Case Study', note: 'Source for 27 media pickups at launch and +91% internal brand alignment.' },
  { id: 'H', title: 'Liaison International Case Study', note: 'Source for the merger integration narrative.' },
  { id: 'I', title: 'Paul Downs Cabinetry Case Study', note: 'Source for the vendor-to-partner repositioning narrative.' },
  { id: 'J', title: 'Lilly Fasteners Case Study', note: 'Source for the regional-to-national brand architecture transformation.' },
  { id: 'K', title: 'Harth Builders Case Study (Projected)', note: 'Projected results only, not displayed publicly.' },
  { id: 'L', title: 'Law Firms Strategy + Outbound Plan', note: 'Six commercial consequences, six timing triggers, voice rules.' },
]

const CITATIONS = [
  { n: 1, src: 'ZoomInfo / LinkedIn', note: '61% of B2B marketers send all leads to sales, but only 27% are qualified.' },
  { n: 2, src: 'Spekit', note: 'Sales professionals spend less than 30% of their week actually selling.' },
  { n: 3, src: 'Content Marketing Institute', note: '60-70% of B2B content created is never used.' },
  { n: 4, src: 'Aberdeen', note: 'Misalignment costs organizations 10%+ of revenue per year.' },
  { n: 5, src: 'People.ai / 2023 RevOps Survey', note: '49% saw increased sales cycle length in 2023.' },
  { n: 6, src: 'ZoomInfo', note: 'Nurtured leads close 23% faster.' },
  { n: 7, src: 'Ehrenberg-Bass Institute', note: '95% of potential customers not in market at any given time.' },
  { n: 8, src: 'Gartner', note: 'Aligned sales and marketing achieve 38% higher win rates, 36% higher retention.' },
  { n: 9, src: 'ZoomInfo', note: 'Aligned departments generate 209% more revenue from marketing.' },
  { n: 10, src: 'HubSpot', note: 'Aligned organizations achieve 27% faster three-year profit growth.' },
  { n: 11, src: 'Sales Enablement Pro', note: 'Effective enablement: 49% win rates vs 42.5%.' },
  { n: 12, src: 'Qwilr', note: '84% of sales reps hit quota with effective training.' },
  { n: 13, src: 'Gartner', note: '58% report budget restrictions, 54% struggle with executive alignment, 57% cite skill gaps.' },
  { n: 14, src: 'ZoomInfo', note: 'Only 10% of agencies/consultants reported healthy 2024.' },
  { n: 15, src: 'Insider Intelligence', note: 'Only 42% say content measurement is "very effective."' },
]

export function Sources() {
  return (
    <>
      <PageHero
        eyebrow="Reference"
        headline={<>Sources & References</>}
        sub="Every statistical claim on this site links here. Internal source documents (letters A–L) and third-party research citations (numbers 1–15) from the StoryCycle Whitepaper 2026."
      />

      <Section>
        <Reveal>
          <Eyebrow>Internal Source Documents</Eyebrow>
          <Headline className="mb-[var(--space-block)]">A–L.</Headline>
        </Reveal>
        <div style={{ marginTop: 'var(--space-block)', maxWidth: '880px', display: 'flex', flexDirection: 'column' }}>
          {INTERNAL.map((d) => (
            <div key={d.id} style={{ display: 'flex', gap: '20px', padding: '18px 0', borderTop: '1px solid rgba(37,40,42,0.14)' }}>
              <span className="fab-counter" style={{ fontSize: '16px', minWidth: '28px' }}>{d.id}</span>
              <div>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '14px', fontWeight: 700, color: '#25282A', letterSpacing: '-0.01em', margin: '0 0 4px' }}>{d.title}</h3>
                <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '14px', color: 'rgba(37,40,42,0.7)', lineHeight: 1.5, margin: 0 }}>{d.note}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section band>
        <Reveal>
          <Eyebrow onDark>Third-Party Research</Eyebrow>
          <Headline onDark className="mb-[var(--space-block)]">1–15.</Headline>
        </Reveal>
        <div style={{ marginTop: 'var(--space-block)', maxWidth: '880px', display: 'flex', flexDirection: 'column' }}>
          {CITATIONS.map((c) => (
            <div key={c.n} style={{ display: 'flex', gap: '20px', padding: '16px 0', borderTop: '1px solid rgba(236,234,227,0.16)' }}>
              <span className="fab-counter" style={{ fontSize: '14px', minWidth: '28px' }}>{c.n}</span>
              <div>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', fontWeight: 700, color: '#ECEAE3', letterSpacing: '0.01em', margin: '0 0 4px' }}>{c.src}</h3>
                <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '14px', color: 'rgba(236,234,227,0.65)', lineHeight: 1.5, margin: 0 }}>{c.note}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  )
}
