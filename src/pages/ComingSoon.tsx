import { useLocation } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { Section, Body, CTA, Reveal } from '../components/primitives'

// Lightweight placeholder for routes not yet built in this representative pass.
export function ComingSoon() {
  const { pathname } = useLocation()
  const label = pathname.split('/').filter(Boolean).map((s) => s.replace(/-/g, ' ')).join(' · ') || 'Page'
  return (
    <>
      <PageHero
        eyebrow="In production"
        headline={<>This page is<br />being built.</>}
        sub={`${label} — part of the full 19-page build. The template system is live; this route replicates from an existing page type next.`}
      />
      <Section>
        <div className="text-center flex flex-col items-center gap-8">
          <Reveal><Body>In the meantime, the fastest way to see the system in action:</Body></Reveal>
          <Reveal delay={0.2}><CTA /></Reveal>
        </div>
      </Section>
    </>
  )
}
