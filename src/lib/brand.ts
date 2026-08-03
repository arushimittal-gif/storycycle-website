// StoryCycle brand system — canonical Bowstring + confirmed extension

export const COLORS = {
  amber: '#FBB03B',
  charcoal: '#25282A',
  cream: '#ECEAE3',
  brown: '#89441E',
  gray: '#A7A8A9',
  coolgray: '#53565A',
} as const

// Imagery removed 2026-07-18 (Fabrica conversion): the botanical ASSETS/MARQUEE
// library is gone from the live site. Hero film masters remain in public/ and
// projects/StoryCycle/assets as archives only.

export const NAV_LINKS = [
  { label: 'How It Works', to: '/how-it-works' },
  { label: "Who It's For", to: '/who-its-for' },
  { label: 'Results', to: '/results' },
  { label: 'Insights', to: '/insights' },
  { label: 'About', to: '/about' },
] as const

export const FOOTER_PAGES = [
  { label: 'How It Works', to: '/how-it-works' },
  { label: "Who It's For", to: '/who-its-for' },
  { label: 'Results', to: '/results' },
  { label: 'About', to: '/about' },
  { label: 'Fast Positioning Audit', to: '/fast-positioning-audit' },
] as const

export const FOOTER_INDUSTRIES = [
  { label: 'Professional Services', to: '/who-its-for/professional-services' },
  { label: 'Home Services', to: '/who-its-for/home-services-trades' },
  { label: 'PE Operating', to: '/who-its-for/private-equity' },
  { label: 'Mission-Driven', to: '/who-its-for/mission-driven' },
] as const

export const FOOTER_CONNECT = ['LinkedIn', 'Insights', 'Newsletter', 'newbiz@getstorycycle.com'] as const

// CTA copy — ownable lines (Enrique, 2026-07-23). Tune or A/B from this one
// place; every nav/footer/pill CTA label reads from here.
export const CTA_COPY = {
  navMeeting: 'Book a Meeting',
  footerAudit: 'Request a Fast Positioning Audit →',
  auditPill: 'Request Your Fast Positioning Audit',
} as const

// Arushi's live HubSpot meeting link (Decisions Needed, 2026-07-27 #2).
// UTM params below ride along on the click — HubSpot's meeting scheduler reads
// them off the URL and writes them to the resulting contact's traffic-source
// properties, so a booking through this link shows "website" as the source.
const MEETING_BASE_URL = 'https://meetings.hubspot.com/enrique1?uuid=4dd1d09c-9db5-46a4-b8c2-29ac317efcee'
export const MEETING_URL = `${MEETING_BASE_URL}&utm_source=website&utm_medium=cta&utm_campaign=book_a_meeting`
