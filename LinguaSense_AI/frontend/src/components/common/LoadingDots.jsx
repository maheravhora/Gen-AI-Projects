import { motion } from 'framer-motion'

const dotVariants = {
  initial: { y: 0 },
  animate: (i) => ({
    y: [0, -8, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      delay: i * 0.15,
      ease: 'easeInOut',
    },
  }),
}

export default function LoadingDots({ size = 'md', color = 'bg-primary', className = '' }) {
  const dotSize = {
    sm: 'h-1.5 w-1.5',
    md: 'h-2.5 w-2.5',
    lg: 'h-3.5 w-3.5',
  }

  return (
    <div className={`flex items-center gap-1.5 ${className}`} role="status" aria-label="Loading">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          custom={i}
          variants={dotVariants}
          initial="initial"
          animate="animate"
          className={`rounded-full ${color} ${dotSize[size]}`}
        />
      ))}
    </div>
  )
}
