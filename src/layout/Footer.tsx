import { Link } from 'react-router-dom'
import { Logo } from './Nav'
import { FOOTER_PAGES, FOOTER_INDUSTRIES, FOOTER_CONNECT, CTA_COPY } from '../lib/brand'

const colHead: React.CSSProperties = {
  fontSize: '11px',
  letterSpacing: '0.08em',
  color: 'rgba(37,40,42,0.45)',
  textTransform: 'uppercase',
  marginBottom: '16px',
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 600,
}
const linkStyle: React.CSSProperties = {
  fontSize: '14px',
  color: 'rgba(37,40,42,0.65)',
  fontFamily: 'Roboto, sans-serif',
  cursor: 'pointer',
  textDecoration: 'none',
}

export function Footer() {
  return (
    <footer style={{ background: '#ECEAE3', borderTop: '1px solid rgba(37,40,42,0.14)' }}>
      <div className="sc-container" style={{ paddingTop: 'var(--space-section)', paddingBottom: '48px' }}>
        {/* Footer CTA — Fabrica "Let's talk." pattern, locked copy */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '40px',
            borderBottom: '1px solid rgba(37,40,42,0.14)',
            paddingBottom: 'clamp(48px, 5vw, 88px)',
          }}
        >
          <h2 className="fab-display" style={{ fontSize: 'clamp(2.25rem, 5.5vw, 4.5rem)', color: '#25282A', maxWidth: '820px' }}>
            Break the cycle of slow.<br />Start with a five-day diagnosis.
          </h2>
          <Link to="/fast-positioning-audit" className="fab-pill">
            {CTA_COPY.footerAudit}
          </Link>
        </div>

        {/* Link columns */}
        <div
          style={{
            paddingTop: 'clamp(48px, 4vw, 64px)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 'clamp(32px, 3vw, 48px)',
          }}
        >
          <div>
            <Logo />
            <p style={{ fontSize: '13px', color: 'rgba(37,40,42,0.55)', maxWidth: '240px', lineHeight: 1.6, marginTop: '16px', fontFamily: 'Roboto, sans-serif' }}>
              The operating system for growth-stage companies whose marketing investment isn't producing the pipeline conversion their work deserves.
            </p>
          </div>

          <div>
            <p style={colHead}>Pages</p>
            <div className="flex flex-col gap-2">
              {FOOTER_PAGES.map((l) => (
                <Link key={l.to} to={l.to} style={linkStyle} className="hover:opacity-60 transition-opacity">{l.label}</Link>
              ))}
            </div>
          </div>

          <div>
            <p style={colHead}>Industries</p>
            <div className="flex flex-col gap-2">
              {FOOTER_INDUSTRIES.map((l) => (
                <Link key={l.to} to={l.to} style={linkStyle} className="hover:opacity-60 transition-opacity">{l.label}</Link>
              ))}
            </div>
          </div>

          <div>
            <p style={colHead}>Connect</p>
            <div className="flex flex-col gap-2">
              {FOOTER_CONNECT.map((l) => (
                <a key={l} style={linkStyle} className="hover:opacity-60 transition-opacity">{l}</a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div
          style={{
            marginTop: '56px',
            paddingTop: '32px',
            borderTop: '1px solid rgba(37,40,42,0.14)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: '16px 24px',
          }}
        >
          <p style={{ fontSize: '11px', color: 'rgba(37,40,42,0.45)', letterSpacing: '0.04em', fontFamily: 'Roboto, sans-serif' }}>
            © 2026 BOWSTRING STUDIOS, OPERATING AS STORYCYCLE™. STORYCYCLE™ AND BOWSTRING® ARE TRADEMARKS OF AURORA IMAGING CO.
          </p>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['Privacy', 'Terms'].map((l) => (
              <a key={l} style={{ fontSize: '11px', color: 'rgba(37,40,42,0.45)', letterSpacing: '0.04em', fontFamily: 'Roboto, sans-serif', cursor: 'pointer' }} className="hover:opacity-60 transition-opacity">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
