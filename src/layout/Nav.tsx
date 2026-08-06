import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { NAV_LINKS, CTA_COPY, MEETING_URL } from '../lib/brand'
import logoColor from '../assets/logo/storycycle-color.svg'
import logoReverse from '../assets/logo/storycycle-reverse.svg'

function NavItem({ text, to }: { text: string; to: string }) {
  const { pathname } = useLocation()
  const isActive = pathname === to || pathname.startsWith(to + '/')
  return (
    <Link
      to={to}
      className="relative py-1 cursor-pointer transition-colors duration-200"
      style={{
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 600,
        fontSize: '13px',
        letterSpacing: '0.01em',
        textDecoration: 'none',
        color: isActive ? '#FBB03B' : 'rgba(37,40,42,0.7)',
      }}
      onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = '#25282A' }}
      onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = 'rgba(37,40,42,0.7)' }}
    >
      {text}
    </Link>
  )
}

export function Logo({ onDark = false }: { onDark?: boolean }) {
  return (
    <Link to="/" style={{ display: 'inline-flex', lineHeight: 0 }}>
      <img src={onDark ? logoReverse : logoColor} alt="StoryCycle" style={{ height: '34px', width: 'auto', display: 'block' }} />
    </Link>
  )
}

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  // Close the mobile menu on navigation + lock body scroll while open
  useEffect(() => setMenuOpen(false), [pathname])
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-40"
        style={{ background: 'rgba(236,234,227,0.85)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
      >
        <div className="sc-container flex items-center justify-between py-4 lg:py-5">
          <Logo />
          <nav className="hidden lg:flex items-center gap-9">
            {NAV_LINKS.map((l) => (
              <NavItem key={l.to} text={l.label} to={l.to} />
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <a href={MEETING_URL} target="_blank" rel="noopener noreferrer" className="fab-pill max-lg:hidden!" style={{ padding: '12px 22px', fontSize: '12px' }}>
              {CTA_COPY.navMeeting}
            </a>
            {/* Mobile menu toggle */}
            <button
              className="lg:hidden flex flex-col justify-center gap-[5px] w-9 h-9 cursor-pointer"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              style={{ background: 'none', border: 'none', padding: 0 }}
            >
              <span
                style={{
                  height: '2px', width: '26px', background: '#25282A', display: 'block',
                  transition: 'transform 0.25s ease',
                  transform: menuOpen ? 'translateY(3.5px) rotate(45deg)' : 'none',
                }}
              />
              <span
                style={{
                  height: '2px', width: '26px', background: '#25282A', display: 'block',
                  transition: 'transform 0.25s ease',
                  transform: menuOpen ? 'translateY(-3.5px) rotate(-45deg)' : 'none',
                }}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu — full-screen cream overlay, stacked display links */}
      {menuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden flex flex-col" style={{ background: '#ECEAE3', paddingTop: '84px' }}>
          <nav className="sc-container flex flex-col gap-2 pt-8">
            {NAV_LINKS.map((l, i) => {
              const isActive = pathname === l.to || pathname.startsWith(l.to + '/')
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className="fab-display sc-reveal"
                  style={{
                    fontSize: 'clamp(2rem, 9vw, 3rem)',
                    color: isActive ? '#FBB03B' : '#25282A',
                    textDecoration: 'none',
                    animationDelay: `${i * 0.05}s`,
                    padding: '6px 0',
                  }}
                >
                  {l.label}
                </Link>
              )
            })}
            <div className="pt-8">
              <a href={MEETING_URL} target="_blank" rel="noopener noreferrer" className="fab-pill">
                {CTA_COPY.navMeeting}
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
