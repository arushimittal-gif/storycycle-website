import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import './pulldown.css'

type PdState = 'dark' | 'light'
export type PdPage = 'home' | 'how-it-works' | 'results' | 'about' | 'fast-positioning-audit'

const NAV_LINKS: { label: string; to: string | null; key: PdPage | null }[] = [
  { label: 'How It Works', to: '/concept/pulldown/how-it-works', key: 'how-it-works' },
  { label: "Who It's For", to: null, key: null },
  { label: 'Results', to: '/concept/pulldown/results', key: 'results' },
  { label: 'Insights', to: null, key: null },
  { label: 'About', to: '/concept/pulldown/about', key: 'about' },
]

/* Improvising — scattered, disjointed strokes: five versions of the story, none connected */
function DarkScene() {
  return (
    <div className="pd-scene pd-scene--dark" aria-hidden>
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none">
        <g stroke="#A7A8A9" strokeWidth="1.5" opacity="0.32">
          <path d="M 120 640 C 220 600, 300 660, 380 610" />
          <path d="M 460 730 C 540 700, 590 760, 690 720" strokeDasharray="10 14" />
          <path d="M 940 660 C 1030 620, 1090 690, 1180 650" />
          <path d="M 1080 780 C 1150 750, 1230 800, 1330 760" strokeDasharray="4 10" />
          <path d="M 620 820 C 700 790, 760 840, 850 810" />
        </g>
        <g stroke="#53565A" strokeWidth="1" opacity="0.5">
          <path d="M 200 160 L 320 220" strokeDasharray="2 8" />
          <path d="M 1240 140 L 1120 210" strokeDasharray="2 8" />
          <path d="M 80 400 L 190 380" />
          <path d="M 1360 420 L 1250 450" />
        </g>
        <g fill="#A7A8A9" opacity="0.45">
          <circle cx="120" cy="640" r="3" />
          <circle cx="690" cy="720" r="3" />
          <circle cx="1180" cy="650" r="3" />
          <circle cx="460" cy="730" r="3" />
          <circle cx="850" cy="810" r="3" />
        </g>
      </svg>
    </div>
  )
}

/* Operating — one continuous amber loop; the hairlines feed into it */
function LightScene() {
  return (
    <div className="pd-scene pd-scene--light" aria-hidden>
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none">
        <g stroke="#25282A" strokeWidth="1" opacity="0.25">
          <path d="M 60 300 C 220 320, 340 400, 430 470" />
          <path d="M 1380 280 C 1230 310, 1120 390, 1020 460" />
          <path d="M 160 860 C 300 800, 400 740, 480 660" />
          <path d="M 1300 860 C 1170 810, 1070 750, 980 670" />
        </g>
        <path
          d="M 720 380 C 960 380, 1060 470, 1060 570 C 1060 670, 940 740, 720 740 C 500 740, 380 670, 380 570 C 380 470, 480 380, 720 380 Z"
          stroke="#FBB03B"
          strokeWidth="2.5"
          opacity="0.9"
        />
        <g fill="#FBB03B">
          <circle cx="720" cy="380" r="5" />
          <circle cx="1060" cy="570" r="5" />
          <circle cx="720" cy="740" r="5" />
          <circle cx="380" cy="570" r="5" />
        </g>
      </svg>
    </div>
  )
}

function Backdrop({ state }: { state: PdState }) {
  return state === 'dark' ? <DarkScene /> : <LightScene />
}

interface PulldownHeroProps {
  activePage: PdPage
  eyebrow?: string
  headline: ReactNode
  sub: string
  cta?: { label: string; to: string }
}

export function PulldownHero({ activePage, eyebrow, headline, sub, cta }: PulldownHeroProps) {
  const [isDark, setIsDark] = useState(true)
  const [frontState, setFrontState] = useState<PdState>('dark')
  const [backState, setBackState] = useState<PdState>('dark')
  const [menuOpen, setMenuOpen] = useState(false)
  const bgFrontRef = useRef<HTMLDivElement>(null)
  const animatingRef = useRef(false)
  const timeoutsRef = useRef<number[]>([])

  useEffect(() => {
    const timeouts = timeoutsRef.current
    return () => timeouts.forEach(clearTimeout)
  }, [])

  const toggleTheme = (toDark: boolean) => {
    if (toDark === isDark || animatingRef.current) return
    animatingRef.current = true
    const target: PdState = toDark ? 'dark' : 'light'
    setBackState(target)
    bgFrontRef.current?.classList.add('pd-pull-down')
    timeoutsRef.current.push(
      window.setTimeout(() => {
        setIsDark(toDark)
        setFrontState(target)
        timeoutsRef.current.push(
          window.setTimeout(() => {
            bgFrontRef.current?.classList.remove('pd-pull-down')
            animatingRef.current = false
          }, 30)
        )
      }, 300)
    )
  }

  return (
    <div className={`pd${isDark ? '' : ' pd--light'}`}>
      <div className="pd-blur-overlay pd-blur-overlay--top" />
      <div className="pd-blur-overlay pd-blur-overlay--bottom" />

      <div className="pd-bg-wrapper">
        <div className="pd-bg pd-bg--back" data-state={backState}>
          <Backdrop state={backState} />
        </div>
        <div ref={bgFrontRef} className="pd-bg pd-bg--front" data-state={frontState}>
          <Backdrop state={frontState} />
        </div>
      </div>

      <nav className="pd-navbar">
        <div className="pd-logo-container">
          <Link to="/concept/pulldown" className="pd-brand-name">STORYCYCLE™</Link>
        </div>
        <div className={`pd-nav-links${menuOpen ? ' pd-active' : ''}`}>
          {NAV_LINKS.map(link =>
            link.to ? (
              <Link
                key={link.label}
                to={link.to}
                className={link.key === activePage ? 'pd-nav-active' : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ) : (
              <a key={link.label} href="#" onClick={e => e.preventDefault()}>
                {link.label}
              </a>
            )
          )}
          <Link
            to="/concept/pulldown/fast-positioning-audit"
            className="pd-cta-button pd-drawer-cta"
            onClick={() => setMenuOpen(false)}
          >
            REQUEST AN AUDIT →
          </Link>
        </div>
        <Link to="/concept/pulldown/fast-positioning-audit" className="pd-cta-button pd-nav-cta">
          REQUEST AN AUDIT →
        </Link>
        <button
          type="button"
          aria-label="Menu"
          className={`pd-hamburger${menuOpen ? ' pd-active' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <div className="pd-hero-content">
        {eyebrow && <div className="pd-eyebrow">{eyebrow}</div>}
        <h1 className="pd-hero-title">{headline}</h1>
        {cta && (
          <div className="pd-hero-cta">
            <Link to={cta.to} className="pd-cta-button">{cta.label}</Link>
          </div>
        )}
        <div className="pd-theme-toggle">
          <div
            className="pd-toggle-indicator"
            style={{ transform: isDark ? 'translateX(0)' : 'translateX(calc(100% + 4px))' }}
          />
          <button
            type="button"
            className={`pd-toggle-btn${isDark ? ' pd-active' : ''}`}
            onClick={() => toggleTheme(true)}
          >
            <span className="pd-label">Improvising</span>
            <span className="pd-subtext">Conversion stays flat</span>
          </button>
          <button
            type="button"
            className={`pd-toggle-btn${!isDark ? ' pd-active' : ''}`}
            onClick={() => toggleTheme(false)}
          >
            <span className="pd-label">Operating</span>
            <span className="pd-subtext">One story, every channel</span>
          </button>
        </div>
        <p className="pd-hero-footer">{sub}</p>
      </div>
    </div>
  )
}
