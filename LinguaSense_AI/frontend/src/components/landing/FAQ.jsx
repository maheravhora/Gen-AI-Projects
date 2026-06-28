import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineChevronDown } from 'react-icons/hi2';

const faqItems = [
  {
    question: 'How many languages does LinguaSense AI support?',
    answer: 'LinguaSense AI supports over 100 languages and dialects, including major world languages like English, Spanish, Mandarin, Hindi, Arabic, and many more. We continuously expand our language support based on user demand and AI model improvements.',
  },
  {
    question: 'Is LinguaSense AI free to use?',
    answer: 'Yes! LinguaSense AI is 100% open source and free to use. You can self-host the entire application or contribute to the project on GitHub. We believe language translation should be accessible to everyone without barriers.',
  },
  {
    question: 'How accurate are the translations?',
    answer: 'Our AI-powered translations leverage state-of-the-art language models that understand context, tone, and domain-specific terminology. Accuracy varies by language pair, but our quality metrics typically show 90-98% accuracy for major language pairs, with continuous improvements through our AI pipeline.',
  },
  {
    question: 'Can I use LinguaSense AI for professional documents?',
    answer: 'Absolutely. LinguaSense AI includes specialized context modes for business, medical, legal, and technical translations. The grammar correction and tone preservation features make it ideal for professional documents. However, for critical legal or medical documents, we always recommend professional review.',
  },
  {
    question: 'How does the voice translation feature work?',
    answer: 'Voice translation uses the Web Speech API to capture your spoken words, which are then transcribed to text. The transcribed text is sent to our AI translation engine, and the translated result can be read aloud using text-to-speech synthesis. It supports real-time translation for natural conversations.',
  },
];

function FAQItem({ item, isOpen, onToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-white/8 bg-[#1E293B]/40 backdrop-blur-sm overflow-hidden"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-6 text-left bg-transparent border-none cursor-pointer group"
      >
        <span className="text-base sm:text-lg font-medium text-[#F8FAFC] group-hover:text-[#3B82F6] transition-colors">
          {item.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <HiOutlineChevronDown className="h-5 w-5 text-[#94A3B8]" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="px-6 pb-6">
              <p className="text-[#94A3B8] leading-relaxed">{item.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A] via-[#1E293B]/30 to-[#0F172A]" />

      <div className="relative z-10 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-[#06B6D4] mb-4">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#F8FAFC] mb-4">
            Frequently Asked{' '}
            <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-lg text-[#94A3B8]">
            Got questions? We have answers.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqItems.map((item, index) => (
            <FAQItem
              key={index}
              item={item}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
