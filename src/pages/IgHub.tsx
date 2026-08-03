import { Link } from 'react-router-dom'

// /ig — Instagram bio-link hub. Mobile-first, no nav, no footer (routed outside Layout).
const LINKS = [
  { label: 'Request Your Fast Positioning Audit →', to: '/fast-positioning-audit' },
  { label: 'Read the latest article →', to: '/insights' },
  { label: 'Get notified about the whitepaper →', to: '/insights' },
  { label: 'See our results →', to: '/results' },
]

export function IgHub() {
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden" style={{ background: '#ECEAE3' }}>
      <div className="relative w-full flex flex-col items-center gap-8 px-6 py-16" style={{ maxWidth: '420px' }}>
        <div className="text-center flex flex-col items-center gap-2">
          <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '22px', letterSpacing: '-0.02em', color: '#25282A', fontWeight: 700 }}>
            storycycle<sup style={{ fontSize: '10px' }}>™</sup>
          </span>
          <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '12px', color: 'rgba(37,40,42,0.55)', letterSpacing: '0.05em' }}>
            From Instagram
          </span>
        </div>

        <div className="w-full flex flex-col gap-3">
          {LINKS.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className="fab-card w-full text-center py-4 px-6"
              style={{ textDecoration: 'none' }}
            >
              <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', fontWeight: 700, letterSpacing: '0.01em', color: '#25282A' }}>
                {l.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
