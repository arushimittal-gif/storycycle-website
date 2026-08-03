import { Link } from 'react-router-dom'

// /intro — lead-gen landing for warm introductions. No nav, no footer (routed outside Layout).
export function Intro() {
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden" style={{ background: '#ECEAE3', padding: '12px' }}>
      <div className="fab-frame w-full min-h-[calc(100vh-24px)] flex items-center justify-center" style={{ background: '#1D1F21' }}>
        <div className="relative sc-container text-center flex flex-col items-center gap-8" style={{ maxWidth: '780px', padding: 'clamp(48px, 8vh, 96px) 0' }}>
          <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '15px', letterSpacing: '-0.01em', color: '#ECEAE3', fontWeight: 700 }}>
            storycycle<sup style={{ fontSize: '8px' }}>™</sup>
          </span>
          <h1 className="fab-display" style={{ fontSize: 'clamp(2.25rem, 5.5vw, 4rem)', color: '#ECEAE3' }}>
            You were sent here for a reason.
          </h1>
          <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: 'clamp(1rem, 1.5vw, 1.25rem)', color: 'rgba(236,234,227,0.8)', lineHeight: 1.5, margin: 0, maxWidth: '560px' }}>
            Someone you trust thinks you should talk to us. We won't waste the introduction.
          </p>
          <Link to="/fast-positioning-audit" className="fab-pill">
            Request Your Fast Positioning Audit →
          </Link>
        </div>
      </div>
    </div>
  )
}
