import { motion } from 'framer-motion';
import { HiStar } from 'react-icons/hi2';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Product Manager at TechFlow',
    avatar: 'SC',
    quote: 'LinguaSense AI has transformed how our global team communicates. The context-aware translations catch nuances that other tools completely miss. Our cross-border meetings are now 10x more productive.',
    rating: 5,
    color: 'from-[#2563EB] to-[#06B6D4]',
  },
  {
    name: 'Dr. Marco Rossi',
    role: 'Medical Researcher, Milan',
    avatar: 'MR',
    quote: 'The medical context translation is exceptional. I can translate complex research papers with domain-specific terminology accurately. The grammar correction has saved me countless hours of editing.',
    rating: 5,
    color: 'from-[#10B981] to-[#06B6D4]',
  },
  {
    name: 'Yuki Tanaka',
    role: 'Freelance Translator, Tokyo',
    avatar: 'YT',
    quote: 'As a professional translator, I was skeptical. But the tone preservation and emotion detection features are genuinely impressive. It captures the subtlety of Japanese that most AI tools butcher.',
    rating: 5,
    color: 'from-[#F59E0B] to-[#EF4444]',
  },
];

export default function Testimonials() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#0F172A]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-[#06B6D4] mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#F8FAFC] mb-4">
            Loved by <span className="gradient-text">Users</span>
          </h2>
          <p className="text-lg text-[#94A3B8] max-w-xl mx-auto">
            See what professionals around the world say about LinguaSense AI.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="relative rounded-2xl border border-white/8 bg-[#1E293B]/60 backdrop-blur-sm p-8 flex flex-col shadow-lg shadow-black/20 overflow-hidden"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <HiStar key={i} className="h-5 w-5 text-[#F59E0B]" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-[#94A3B8] leading-relaxed flex-1 mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/8">
                <div className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br ${t.color} text-sm font-bold text-white flex-shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#F8FAFC]">{t.name}</p>
                  <p className="text-xs text-[#94A3B8]">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
