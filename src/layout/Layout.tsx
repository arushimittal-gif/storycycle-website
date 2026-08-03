import { useEffect } from 'react'
import { useLocation, Outlet } from 'react-router-dom'
import { Nav } from './Nav'
import { Footer } from './Footer'

// Reset scroll on every route change (router doesn't do this by default)
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

// Layout route — wraps all standard pages in Nav + Footer.
// No-nav pages (/intro, /ig) render outside this layout via sibling routes.
export function Layout() {
  return (
    <div className="relative w-full overflow-hidden" style={{ background: '#ECEAE3' }}>
      <ScrollToTop />
      <Nav />
      <main className="relative z-10"><Outlet /></main>
      <Footer />
    </div>
  )
}
