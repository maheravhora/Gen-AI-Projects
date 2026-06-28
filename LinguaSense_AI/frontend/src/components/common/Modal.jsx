import { motion, AnimatePresence } from 'framer-motion'
import { HiXMark } from 'react-icons/hi2'
import { modalOverlay, modalContent } from '../../animations/variants'

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className = '',
}) {
  const SIZE_CLASSES = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[90vw]',
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            variants={modalOverlay}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Content */}
          <motion.div
            variants={modalContent}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`relative w-full ${SIZE_CLASSES[size]} rounded-2xl border border-white/10 bg-card/95 backdrop-blur-2xl shadow-2xl shadow-black/40 ${className}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between border-b border-white/8 px-6 py-4">
                <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-text-secondary hover:bg-white/10 hover:text-text-primary transition-colors"
                  aria-label="Close modal"
                >
                  <HiXMark className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Body */}
            <div className="px-6 py-5">{children}</div>

            {/* Close button when no title */}
            {!title && (
              <button
                onClick={onClose}
                className="absolute right-3 top-3 rounded-lg p-1.5 text-text-secondary hover:bg-white/10 hover:text-text-primary transition-colors"
                aria-label="Close modal"
              >
                <HiXMark className="h-5 w-5" />
              </button>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
