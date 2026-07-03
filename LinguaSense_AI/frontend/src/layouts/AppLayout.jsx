import { useState, useMemo } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiSquares2X2,
  HiLanguage,
  HiMicrophone,
  HiCamera,
  HiDocumentText,
  HiClock,
  HiStar,
  HiCog6Tooth,
  HiUserCircle,
  HiChevronLeft,
  HiChevronRight,
  HiMagnifyingGlass,
  HiBars3,
  HiXMark,
} from 'react-icons/hi2'
import { pageTransition } from '../animations/variants'

const ICON_MAP = {
  HiSquares2X2,
  HiLanguage,
  HiMicrophone,
  HiCamera,
  HiDocumentText,
  HiClock,
  HiStar,
  HiCog6Tooth,
  HiUserCircle,
}

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: 'HiSquares2X2' },
  { name: 'Translate', path: '/translate', icon: 'HiLanguage' },
  { name: 'Voice', path: '/voice', icon: 'HiMicrophone' },
  { name: 'OCR', path: '/ocr', icon: 'HiCamera' },
  { name: 'PDF', path: '/pdf', icon: 'HiDocumentText' },
  { name: 'History', path: '/history', icon: 'HiClock' },
  { name: 'Favorites', path: '/favorites', icon: 'HiStar' },
  { name: 'Settings', path: '/settings', icon: 'HiCog6Tooth' },
  { name: 'Profile', path: '/profile', icon: 'HiUserCircle' },
]

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/translate': 'Translate',
  '/voice': 'Voice Studio',
  '/ocr': 'OCR Scanner',
  '/pdf': 'PDF Extractor',
  '/history': 'History',
  '/favorites': 'Favorites',
  '/settings': 'Settings',
  '/profile': 'Profile',
}

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const pageTitle = useMemo(
    () => PAGE_TITLES[location.pathname] || 'LinguaSense AI',
    [location.pathname]
  )

  return (
    <div className="flex h-screen overflow-hidden bg-bg-dark">
      {/* ── Desktop Sidebar ─────────────────────────────── */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="hidden lg:flex flex-col border-r border-white/8 glass-strong relative z-30 shrink-0"
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-4 border-b border-white/8">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/20">
            <HiLanguage className="h-5 w-5 text-primary" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="text-lg font-bold text-text-primary whitespace-nowrap overflow-hidden"
              >
                LinguaSense
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 no-scrollbar">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = ICON_MAP[item.icon]
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-primary/15 text-primary glow-primary'
                          : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                      }`
                    }
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="whitespace-nowrap overflow-hidden"
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex min-h-[48px] items-center justify-center border-t border-white/8 text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors cursor-pointer"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <HiChevronRight className="h-5 w-5" />
          ) : (
            <HiChevronLeft className="h-5 w-5" />
          )}
        </button>
      </motion.aside>

      {/* ── Mobile Sidebar Overlay ──────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] flex flex-col glass-strong lg:hidden"
            >
              {/* Mobile logo + close */}
              <div className="flex h-16 items-center justify-between px-4 border-b border-white/8">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20">
                    <HiLanguage className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-lg font-bold text-text-primary">LinguaSense</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-text-secondary hover:bg-white/10 hover:text-text-primary transition-colors cursor-pointer"
                >
                  <HiXMark className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile nav */}
              <nav className="flex-1 overflow-y-auto py-4 px-3 no-scrollbar">
                <ul className="space-y-1">
                  {NAV_ITEMS.map((item) => {
                    const Icon = ICON_MAP[item.icon]
                    return (
                      <li key={item.path}>
                        <NavLink
                          to={item.path}
                          onClick={() => setMobileOpen(false)}
                          className={({ isActive }) =>
                            `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                              isActive
                                ? 'bg-primary/15 text-primary'
                                : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                            }`
                          }
                        >
                          <Icon className="h-5 w-5 shrink-0" />
                          <span>{item.name}</span>
                        </NavLink>
                      </li>
                    )
                  })}
                </ul>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Content Area ───────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Sticky header */}
        <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-white/8 glass px-4 sm:px-6 z-20">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-text-secondary hover:bg-white/10 hover:text-text-primary transition-colors cursor-pointer lg:hidden"
            aria-label="Open menu"
          >
            <HiBars3 className="h-5 w-5" />
          </button>

          <h1 className="text-lg font-semibold text-text-primary hidden sm:block">{pageTitle}</h1>
          <h1 className="text-base font-semibold text-text-primary sm:hidden">{pageTitle}</h1>

          {/* Search (decorative) */}
          <div className="relative hidden sm:block">
            <HiMagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              placeholder="Search anything…"
              className="h-10 w-56 rounded-xl border border-white/8 bg-white/5 pl-9 pr-4 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
            />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={location.pathname}
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            className="mx-auto w-full max-w-7xl px-4 pt-6 pb-24 sm:px-6 lg:px-8 lg:py-8"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* ── Mobile Bottom Navigation ───────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t border-white/8 glass-strong px-2 py-1.5 sm:py-2 lg:hidden">
        {NAV_ITEMS.slice(0, 5).map((item) => {
          const Icon = ICON_MAP[item.icon]
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-[10px] font-medium transition-colors ${
                  isActive ? 'text-primary' : 'text-text-secondary'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </NavLink>
          )
        })}
      </nav>
    </div>
  )
}
