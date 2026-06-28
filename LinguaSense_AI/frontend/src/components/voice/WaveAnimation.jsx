import { motion } from 'framer-motion';

export default function WaveAnimation({ isActive = false }) {
  const bars = 24;

  return (
    <div className="flex items-center justify-center gap-1 h-16 px-4">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className={`w-1 rounded-full ${isActive ? 'bg-gradient-to-t from-[#2563EB] to-[#06B6D4]' : 'bg-white/10'}`}
          animate={
            isActive
              ? {
                  height: [8, 24 + Math.random() * 32, 8],
                }
              : { height: 8 }
          }
          transition={
            isActive
              ? {
                  duration: 0.6 + Math.random() * 0.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.04,
                }
              : { duration: 0.3 }
          }
        />
      ))}
    </div>
  );
}
