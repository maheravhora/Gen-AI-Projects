import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { HiLanguage, HiMicrophone, HiCamera, HiDocumentText, HiSparkles, HiBolt, HiGlobeAlt } from 'react-icons/hi2'
import { fadeInUp, staggerContainer, staggerItem } from '../animations/variants'
import Button from '../components/common/Button'

const FEATURES = [
  {
    icon: <HiLanguage className="h-6 w-6" />,
    title: 'Smart Translation',
    description: 'Translate between 60+ languages with tone and context awareness powered by advanced AI models.',
    color: 'text-primary bg-primary/15',
  },
  {
    icon: <HiMicrophone className="h-6 w-6" />,
    title: 'Voice Recognition',
    description: 'Real-time speech-to-text and text-to-speech with natural-sounding multilingual voices.',
    color: 'text-accent bg-accent/15',
  },
  {
    icon: <HiCamera className="h-6 w-6" />,
    title: 'OCR Scanner',
    description: 'Extract text from images instantly — signs, menus, documents, handwriting, and more.',
    color: 'text-success bg-success/15',
  },
  {
    icon: <HiDocumentText className="h-6 w-6" />,
    title: 'PDF Processing',
    description: 'Upload PDFs and extract, translate, or summarize their content in seconds.',
    color: 'text-warning bg-warning/15',
  },
  {
    icon: <HiSparkles className="h-6 w-6" />,
    title: 'Emotion Detection',
    description: 'Understand the sentiment and emotional tone of any text across languages.',
    color: 'text-danger bg-danger/15',
  },
  {
    icon: <HiBolt className="h-6 w-6" />,
    title: 'Grammar Check',
    description: 'Get AI-powered grammar corrections and style improvements for polished writing.',
    color: 'text-secondary bg-secondary/15',
  },
]

export default function LandingPage() {
  return (
    <div className="relative">
      {/* ── Hero Section ────────────────────────────────── */}
      <section className="relative flex min-h-[85vh] items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div variants={staggerItem} className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
            <HiGlobeAlt className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-primary">Powered by Advanced AI</span>
          </motion.div>

          <motion.h1 variants={staggerItem} className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-7xl">
            <span className="text-text-primary">Break Language</span>
            <br />
            <span className="gradient-text">Barriers with AI</span>
          </motion.h1>

          <motion.p variants={staggerItem} className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg">
            Translate text, recognize speech, extract from images and PDFs — all with intelligent tone and context
            awareness. One platform, every language.
          </motion.p>

          <motion.div variants={staggerItem} className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to="/translate">
              <Button variant="primary" size="lg" leftIcon={<HiLanguage className="h-5 w-5" />}>
                Start Translating
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="secondary" size="lg">
                View Dashboard
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div variants={staggerItem} className="mt-16 grid grid-cols-3 gap-8 sm:gap-12">
            {[
              { value: '60+', label: 'Languages' },
              { value: '99%', label: 'Accuracy' },
              { value: '<1s', label: 'Response' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-extrabold text-text-primary sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-xs font-medium text-text-secondary sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Features Section ────────────────────────────── */}
      <section id="features" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center"
          >
            <h2 className="text-3xl font-extrabold text-text-primary sm:text-4xl">
              Everything You Need
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-text-secondary">
              A comprehensive AI-powered language toolkit designed for seamless multilingual communication.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {FEATURES.map((feature) => (
              <motion.div
                key={feature.title}
                variants={staggerItem}
                className="group rounded-2xl border border-white/8 bg-card/60 p-6 backdrop-blur-xl hover:border-white/15 hover:bg-card/80 transition-all duration-300"
              >
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-text-primary">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-text-secondary">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── About / CTA Section ─────────────────────────── */}
      <section id="about" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-primary/10 via-card/60 to-accent/10 p-8 text-center backdrop-blur-xl sm:p-12 lg:p-16"
          >
            <h2 className="text-3xl font-extrabold text-text-primary sm:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-text-secondary">
              Experience the future of multilingual communication. No sign-up required — start translating instantly.
            </p>
            <div className="mt-8">
              <Link to="/dashboard">
                <Button variant="primary" size="lg">
                  Launch Dashboard
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
