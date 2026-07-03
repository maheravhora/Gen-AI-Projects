import { Outlet, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiLanguage } from 'react-icons/hi2'
import { fadeInDown } from '../animations/variants'
import Footer from '../components/landing/Footer'

export default function LandingLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-bg-dark">
      {/* Gradient blobs */}
      <div className="blob blob-primary w-[500px] h-[500px] -top-48 -left-48" />
      <div className="blob blob-accent w-[400px] h-[400px] top-1/3 -right-32" />
      <div className="blob blob-secondary w-[350px] h-[350px] bottom-0 left-1/4" />

      {/* ── Navbar ──────────────────────────────────────── */}
      <motion.header
        variants={fadeInDown}
        initial="initial"
        animate="animate"
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/8 glass"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
              <HiLanguage className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl font-bold text-text-primary">
              Lingua<span className="text-primary">Sense</span>
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden sm:flex items-center gap-1">
            <a
              href="#features"
              className="inline-flex items-center min-h-[44px] rounded-xl px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
            >
              Features
            </a>
            <a
              href="#about"
              className="inline-flex items-center min-h-[44px] rounded-xl px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
            >
              About
            </a>
            <Link
              to="/dashboard"
              className="ml-2 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-primary px-6 text-[15px] font-semibold text-white hover:bg-primary/90 transition-colors glow-primary"
            >
              Get Started
            </Link>
          </nav>

          {/* Mobile CTA */}
          <Link
            to="/dashboard"
            className="sm:hidden inline-flex min-h-[44px] items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </motion.header>

      {/* ── Content ─────────────────────────────────────── */}
      <main className="relative z-10 pt-16">
        <Outlet />
      </main>

      {/* ── Footer ──────────────────────────────────────── */}
      <Footer />
    </div>
  )
}
