import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineArrowRight, HiOutlinePlay } from 'react-icons/hi2';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-[#0F172A]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/20 via-transparent to-[#06B6D4]/20" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-[#2563EB]/10 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Floating blobs */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 rounded-full bg-[#2563EB]/15 blur-3xl animate-float"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-40 right-10 w-96 h-96 rounded-full bg-[#06B6D4]/10 blur-3xl animate-float-delayed"
        animate={{ x: [0, -25, 0], y: [0, 25, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-20 left-1/3 w-80 h-80 rounded-full bg-[#3B82F6]/10 blur-3xl animate-float-slow"
        animate={{ x: [0, 20, 0], y: [0, -30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-5 py-2 mb-8"
        >
          <div className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-sm text-[#94A3B8]">AI-Powered Translation Engine</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-tight mb-6"
        >
          <span className="text-[#F8FAFC]">Translate</span>{' '}
          <span className="gradient-text">Beyond</span>
          <br />
          <span className="text-[#F8FAFC]">Words.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg sm:text-xl text-[#94A3B8] max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          AI-powered multilingual communication assistant that understands context,
          emotions, and culture. Break language barriers with intelligence.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/dashboard"
            className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[#2563EB]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[#2563EB]/30 hover:scale-105 no-underline"
          >
            Get Started
            <HiOutlineArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to="/translate"
            className="group flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm px-8 py-4 text-base font-semibold text-[#F8FAFC] transition-all duration-300 hover:bg-white/10 hover:scale-105 no-underline"
          >
            <HiOutlinePlay className="h-5 w-5" />
            Try Demo
          </Link>
        </motion.div>

        {/* Language pills floating */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-3"
        >
          {['English', 'Spanish', 'French', 'German', 'Japanese', 'Korean', 'Hindi', 'Arabic', 'Chinese'].map(
            (lang, i) => (
              <motion.span
                key={lang}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + i * 0.08 }}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-[#94A3B8] backdrop-blur-sm"
              >
                {lang}
              </motion.span>
            )
          )}
        </motion.div>
      </div>
    </section>
  );
}
