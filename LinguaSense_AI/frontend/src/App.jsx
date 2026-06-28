import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { lazy, Suspense } from 'react'
import AppLayout from './layouts/AppLayout'
import LandingLayout from './layouts/LandingLayout'
import LoadingDots from './components/common/LoadingDots'

// ── Lazy-loaded pages ──────────────────────────────────
const LandingPage = lazy(() => import('./pages/LandingPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const TranslatePage = lazy(() => import('./pages/TranslatePage'))
const VoicePage = lazy(() => import('./pages/VoicePage'))
const OcrPage = lazy(() => import('./pages/OcrPage'))
const PdfPage = lazy(() => import('./pages/PdfPage'))
const HistoryPage = lazy(() => import('./pages/HistoryPage'))
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <LoadingDots />
        <p className="text-sm text-text-secondary">Loading…</p>
      </div>
    </div>
  )
}

export default function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />}>
        <Routes location={location} key={location.pathname}>
          {/* Landing */}
          <Route element={<LandingLayout />}>
            <Route index element={<LandingPage />} />
          </Route>

          {/* App pages */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/translate" element={<TranslatePage />} />
            <Route path="/voice" element={<VoicePage />} />
            <Route path="/ocr" element={<OcrPage />} />
            <Route path="/pdf" element={<PdfPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </Suspense>
    </AnimatePresence>
  )
}
