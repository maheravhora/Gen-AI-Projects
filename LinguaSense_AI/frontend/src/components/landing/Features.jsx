import { motion } from 'framer-motion';
import {
  HiOutlineGlobeAlt,
  HiOutlineMicrophone,
  HiOutlineCamera,
  HiOutlineLightBulb,
  HiOutlineCheckBadge,
  HiOutlineFaceSmile,
} from 'react-icons/hi2';

const features = [
  {
    icon: HiOutlineGlobeAlt,
    title: 'Context Translation',
    description: 'AI understands the context of your text, delivering translations that capture the true meaning, not just literal word-for-word conversions.',
    color: 'from-[#2563EB] to-[#3B82F6]',
    shadowColor: 'shadow-[#2563EB]/20',
  },
  {
    icon: HiOutlineMicrophone,
    title: 'Voice Translation',
    description: 'Speak naturally and get instant translations. Our voice AI processes speech in real-time with support for accents and dialects.',
    color: 'from-[#06B6D4] to-[#22D3EE]',
    shadowColor: 'shadow-[#06B6D4]/20',
  },
  {
    icon: HiOutlineCamera,
    title: 'OCR Translation',
    description: 'Snap a photo of text in any language. Our OCR engine extracts and translates text from images, signs, menus, and documents.',
    color: 'from-[#10B981] to-[#34D399]',
    shadowColor: 'shadow-[#10B981]/20',
  },
  {
    icon: HiOutlineLightBulb,
    title: 'AI Explanation',
    description: 'Get detailed explanations of why translations are made a certain way. Understand grammar rules, idioms, and cultural nuances.',
    color: 'from-[#F59E0B] to-[#FBBF24]',
    shadowColor: 'shadow-[#F59E0B]/20',
  },
  {
    icon: HiOutlineCheckBadge,
    title: 'Grammar Correction',
    description: 'Automatic grammar checking and correction in both source and target languages. Improve your writing while translating.',
    color: 'from-[#8B5CF6] to-[#A78BFA]',
    shadowColor: 'shadow-[#8B5CF6]/20',
  },
  {
    icon: HiOutlineFaceSmile,
    title: 'Emotion Detection',
    description: 'Detect and preserve emotional tone across translations. Ensure your message carries the same sentiment in any language.',
    color: 'from-[#EF4444] to-[#F87171]',
    shadowColor: 'shadow-[#EF4444]/20',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Features() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#0F172A]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-[#06B6D4] mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F8FAFC] mb-4">
            Everything You Need to{' '}
            <span className="gradient-text">Communicate</span>
          </h2>
          <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto">
            Powered by advanced AI, LinguaSense goes beyond simple translation
            to deliver truly meaningful cross-language communication.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`group relative rounded-2xl border border-white/8 bg-[#1E293B]/60 backdrop-blur-sm p-8 shadow-lg shadow-black/20 overflow-hidden transition-all duration-300 hover:border-white/15 hover:${feature.shadowColor} hover:shadow-xl cursor-default`}
              >
                {/* Gradient glow on hover */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 shadow-lg ${feature.shadowColor}`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#F8FAFC] mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-[#94A3B8] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
