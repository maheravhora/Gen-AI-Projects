import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { HiOutlineGlobeAlt, HiOutlineCodeBracket, HiOutlineBolt, HiOutlineSparkles } from 'react-icons/hi2';

const stats = [
  { value: 100, suffix: '+', label: 'Languages', icon: HiOutlineGlobeAlt, color: 'from-[#2563EB] to-[#3B82F6]' },
  { value: 100, suffix: '%', label: 'Open Source', icon: HiOutlineCodeBracket, color: 'from-[#10B981] to-[#34D399]' },
  { value: 1, suffix: '', label: 'AI Powered', icon: HiOutlineSparkles, color: 'from-[#F59E0B] to-[#FBBF24]', displayValue: 'AI' },
  { value: 500, suffix: 'ms', label: 'Avg. Translation', icon: HiOutlineBolt, color: 'from-[#06B6D4] to-[#22D3EE]', prefix: '<' },
];

function AnimatedCounter({ value, suffix = '', prefix = '', displayValue, duration = 2 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView || displayValue) return;
    let start = 0;
    const increment = value / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, value, duration, displayValue]);

  return (
    <span ref={ref} className="text-4xl sm:text-5xl font-extrabold text-[#F8FAFC]">
      {displayValue ? displayValue : `${prefix}${count}${suffix}`}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A] via-[#1E293B]/50 to-[#0F172A]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#F8FAFC] mb-4">
            Trusted by Developers{' '}
            <span className="gradient-text">Worldwide</span>
          </h2>
          <p className="text-lg text-[#94A3B8]">
            Numbers that speak for themselves
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="relative group rounded-2xl border border-white/8 bg-[#1E293B]/40 backdrop-blur-sm p-8 text-center"
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} mb-4 mx-auto`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="mb-2">
                    <AnimatedCounter
                      value={stat.value}
                      suffix={stat.suffix}
                      prefix={stat.prefix}
                      displayValue={stat.displayValue}
                    />
                  </div>
                  <p className="text-sm text-[#94A3B8] font-medium">{stat.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
