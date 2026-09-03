import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Layout } from './layout/Layout'
import { Home } from './pages/Home'
import { HowItWorks } from './pages/HowItWorks'
import { About } from './pages/About'
import { FastAudit } from './pages/FastAudit'
import { WhoItsFor } from './pages/WhoItsFor'
import { ProfessionalServices } from './pages/ProfessionalServices'
import { HomeServices } from './pages/HomeServices'
import { PrivateEquity } from './pages/PrivateEquity'
import { MissionDriven } from './pages/MissionDriven'
import { Results } from './pages/Results'
import { Donnellys } from './pages/Donnellys'
import { LindseyWilson } from './pages/LindseyWilson'
import { Liaison } from './pages/Liaison'
import { PaulDowns } from './pages/PaulDowns'
import { LillyFasteners } from './pages/LillyFasteners'
import { PEPortfolio } from './pages/PEPortfolio'
import { Insights } from './pages/Insights'
import { InsightArticle } from './pages/InsightArticle'
import { Sources } from './pages/Sources'
import { Intro } from './pages/Intro'
import { IgHub } from './pages/IgHub'
import { ConceptWater } from './pages/ConceptWater'
import { ConceptHydra } from './pages/ConceptHydra'
import { ConceptHydraTemplate } from './pages/ConceptHydraTemplate'
import { ConceptCreateTemplate } from './pages/ConceptCreateTemplate'
import { ConceptGrid } from './pages/ConceptGrid'
import { ConceptStrativ } from './pages/ConceptStrativ'
import {
  ConceptPulldownHome,
  ConceptPulldownHowItWorks,
  ConceptPulldownResults,
  ConceptPulldownAbout,
  ConceptPulldownFastAudit,
} from './pages/ConceptPulldown'
import { ComingSoon } from './pages/ComingSoon'

// WebGL concept prototypes — lazy so `three` never loads on the marketing site
const ConceptOrbital = lazy(() => import('./pages/ConceptOrbital').then(m => ({ default: m.ConceptOrbital })))
const ConceptWeave = lazy(() => import('./pages/ConceptWeave').then(m => ({ default: m.ConceptWeave })))
const ConceptPacific = lazy(() => import('./pages/ConceptPacific').then(m => ({ default: m.ConceptPacific })))

function WebGLFallback() {
  return <div style={{ position: 'fixed', inset: 0, background: '#0a0c0e' }} aria-hidden />
}

export default function App() {
  return (
    <Routes>
      {/* Standard pages — wrapped in Nav + Footer */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/about" element={<About />} />
        <Route path="/fast-positioning-audit" element={<FastAudit />} />

        <Route path="/who-its-for" element={<WhoItsFor />} />
        <Route path="/who-its-for/professional-services" element={<ProfessionalServices />} />
        <Route path="/who-its-for/home-services-trades" element={<HomeServices />} />
        <Route path="/who-its-for/home-services" element={<HomeServices />} />
        <Route path="/who-its-for/private-equity" element={<PrivateEquity />} />
        <Route path="/who-its-for/mission-driven" element={<MissionDriven />} />

        <Route path="/results" element={<Results />} />
        <Route path="/results/donnellys-hvac" element={<Donnellys />} />
        <Route path="/results/lindsey-wilson" element={<LindseyWilson />} />
        <Route path="/results/liaison" element={<Liaison />} />
        <Route path="/results/paul-downs" element={<PaulDowns />} />
        <Route path="/results/lilly-fasteners" element={<LillyFasteners />} />
        <Route path="/results/pe-portfolio" element={<PEPortfolio />} />

        <Route path="/insights" element={<Insights />} />
        <Route path="/insights/:slug" element={<InsightArticle />} />
        <Route path="/sources" element={<Sources />} />

        <Route path="*" element={<ComingSoon />} />
      </Route>

      {/* No-nav utility pages — render outside the Layout (no Nav/Footer) */}
      <Route path="/intro" element={<Intro />} />
      <Route path="/ig" element={<IgHub />} />
      <Route path="/concept/water" element={<ConceptWater />} />
      <Route path="/concept/hydra" element={<ConceptHydra />} />
      <Route path="/concept/hydra-template" element={<ConceptHydraTemplate />} />
      <Route path="/concept/create-template" element={<ConceptCreateTemplate />} />
      <Route path="/concept/pulldown" element={<ConceptPulldownHome />} />
      <Route path="/concept/pulldown/how-it-works" element={<ConceptPulldownHowItWorks />} />
      <Route path="/concept/pulldown/results" element={<ConceptPulldownResults />} />
      <Route path="/concept/pulldown/about" element={<ConceptPulldownAbout />} />
      <Route path="/concept/pulldown/fast-positioning-audit" element={<ConceptPulldownFastAudit />} />
      <Route path="/concept/grid" element={<ConceptGrid />} />
      <Route path="/concept/strativ" element={<ConceptStrativ />} />
      <Route path="/concept/orbital" element={<Suspense fallback={<WebGLFallback />}><ConceptOrbital /></Suspense>} />
      <Route path="/concept/weave" element={<Suspense fallback={<WebGLFallback />}><ConceptWeave /></Suspense>} />
      <Route path="/concept/pacific" element={<Suspense fallback={<WebGLFallback />}><ConceptPacific /></Suspense>} />
    </Routes>
  )
}
