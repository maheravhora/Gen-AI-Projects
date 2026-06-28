import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineGlobeAlt,
  HiOutlineHome,
  HiOutlineLanguage,
  HiOutlineMicrophone,
  HiOutlineCamera,
  HiOutlineDocumentText,
  HiOutlineClock,
  HiOutlineHeart,
  HiOutlineCog6Tooth,
  HiOutlineUser,
  HiOutlineBars3,
  HiOutlineXMark,
} from 'react-icons/hi2';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: HiOutlineHome },
  { path: '/translate', label: 'Translate', icon: HiOutlineLanguage },
  { path: '/voice', label: 'Voice', icon: HiOutlineMicrophone },
  { path: '/ocr', label: 'OCR', icon: HiOutlineCamera },
  { path: '/pdf', label: 'PDF', icon: HiOutlineDocumentText },
  { path: '/history', label: 'History', icon: HiOutlineClock },
  { path: '/favorites', label: 'Favorites', icon: HiOutlineHeart },
  { path: '/settings', label: 'Settings', icon: HiOutlineCog6Tooth },
  { path: '/profile', label: 'Profile', icon: HiOutlineUser },
];

export default function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-[#0F172A]">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#1E293B]/90 backdrop-blur-xl border-r border-white/8 lg:static lg:translate-x-0 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-6 border-b border-white/8">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563EB] to-[#06B6D4]">
            <HiOutlineGlobeAlt className="h-5 w-5 text-white" />
          </div>
          <Link to="/" className="text-lg font-bold text-[#F8FAFC] no-underline">
            LinguaSense
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden text-[#94A3B8] hover:text-[#F8FAFC] transition-colors bg-transparent border-none cursor-pointer"
          >
            <HiOutlineXMark className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin">
          <ul className="space-y-1 list-none p-0 m-0">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 no-underline ${
                      isActive
                        ? 'bg-gradient-to-r from-[#2563EB]/20 to-[#06B6D4]/10 text-[#3B82F6] shadow-lg shadow-[#2563EB]/10'
                        : 'text-[#94A3B8] hover:bg-white/5 hover:text-[#F8FAFC]'
                    }`}
                  >
                    <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-[#3B82F6]' : ''}`} />
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="ml-auto h-1.5 w-1.5 rounded-full bg-[#3B82F6]"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-white/8 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#06B6D4] text-xs font-bold text-white">
              LS
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#F8FAFC] truncate">LinguaSense User</p>
              <p className="text-xs text-[#94A3B8]">Free Plan</p>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 items-center gap-4 border-b border-white/8 bg-[#0F172A]/80 backdrop-blur-xl px-4 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-[#94A3B8] hover:text-[#F8FAFC] transition-colors bg-transparent border-none cursor-pointer"
          >
            <HiOutlineBars3 className="h-6 w-6" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-sm text-[#94A3B8]">
              <div className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
              AI Connected
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 scrollbar-thin">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
