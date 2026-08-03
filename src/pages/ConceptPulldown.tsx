import { PulldownHero } from '../concepts/pulldown/PulldownHero'

// Concept: Pulldown — reposit-style pull-down hero device over the locked site copy.
// Copy below is verbatim from the live v3 pages — do not edit here.

export function ConceptPulldownHome() {
  return (
    <PulldownHero
      activePage="home"
      eyebrow="The story underneath your pipeline"
      headline={
        <>
          Your pipeline is full.
          <br />
          <span className="pd-title-accent">Your sales aren't converting.</span>
        </>
      }
      sub="StoryCycle fixes it at the system level. One commercial narrative, activated across every channel and team."
      cta={{ label: 'Request Your Fast Positioning Audit', to: '/concept/pulldown/fast-positioning-audit' }}
    />
  )
}

export function ConceptPulldownHowItWorks() {
  return (
    <PulldownHero
      activePage="how-it-works"
      eyebrow="How It Works"
      headline={
        <>
          Stop improvising.
          <br />
          <span className="pd-title-accent">Start operating.</span>
        </>
      }
      sub="Four months. One operating system."
    />
  )
}

export function ConceptPulldownResults() {
  return (
    <PulldownHero
      activePage="results"
      eyebrow="Results"
      headline={
        <>
          Same system.
          <br />
          Different industries.
          <br />
          <span className="pd-title-accent">Documented.</span>
        </>
      }
      sub="Documented across five verticals. 20+ years of work behind them."
    />
  )
}

export function ConceptPulldownAbout() {
  return (
    <PulldownHero
      activePage="about"
      headline={
        <>
          We break
          <br />
          <span className="pd-title-accent">the cycle of slow.</span>
        </>
      }
      sub="StoryCycle™ is the operating system for growth-stage companies whose marketing investment isn't producing the pipeline conversion their work deserves."
    />
  )
}

export function ConceptPulldownFastAudit() {
  return (
    <PulldownHero
      activePage="fast-positioning-audit"
      headline={
        <>
          Five business days.
          <br />
          <span className="pd-title-accent">Your real differentiator. Named.</span>
        </>
      }
      sub="Break the cycle of slow. Start with a five-day diagnosis."
    />
  )
}
