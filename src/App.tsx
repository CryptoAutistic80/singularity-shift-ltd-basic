import { lazy, Suspense, useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'

import { useRouteMeta } from './hooks/useRouteMeta'
import { Footer } from './components/Footer'
import { SEOJsonLd } from './components/SEOJsonLd'
import { SiteHeader } from './components/SiteHeader'
import { StickyCTABar } from './components/StickyCTABar'
import { ContactPage } from './pages/ContactPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { AboutPage } from './pages/AboutPage'
import { ServicePage } from './pages/ServicePage'
import { ServicesPage } from './pages/ServicesPage'
import { WorkPage } from './pages/WorkPage'

const BackgroundFX = lazy(() => import('./components/BackgroundFX'))

function useDesktopFx() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const wideScreen = window.matchMedia('(min-width: 1024px)')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    const evaluate = () => {
      const hasCores = navigator.hardwareConcurrency === undefined || navigator.hardwareConcurrency > 2
      setEnabled(wideScreen.matches && !reduceMotion.matches && hasCores)
    }

    evaluate()
    wideScreen.addEventListener('change', evaluate)
    reduceMotion.addEventListener('change', evaluate)

    return () => {
      wideScreen.removeEventListener('change', evaluate)
      reduceMotion.removeEventListener('change', evaluate)
    }
  }, [])

  return enabled
}

export default function App() {
  const location = useLocation()
  const navigate = useNavigate()
  useRouteMeta()
  const enableBackgroundFX = useDesktopFx()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [location.pathname])

  useEffect(() => {
    const redirect = sessionStorage.getItem('spa_redirect')
    if (!redirect) {
      return
    }

    sessionStorage.removeItem('spa_redirect')
    if (redirect === location.pathname) {
      return
    }

    if (redirect.startsWith('/')) {
      navigate(redirect, { replace: true })
    }
  }, [location.pathname, navigate])

  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <SEOJsonLd />
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:slug" element={<ServicePage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <StickyCTABar />
      {enableBackgroundFX ? (
        <Suspense fallback={null}>
          <BackgroundFX />
        </Suspense>
      ) : null}
    </div>
  )
}
