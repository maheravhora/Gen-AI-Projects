import { motion } from 'framer-motion'
import { fadeInUp } from '../../animations/variants'
import Button from './Button'

export default function EmptyState({
  icon,
  title = 'Nothing here yet',
  description = '',
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className={`flex flex-col items-center justify-center py-16 text-center ${className}`}
    >
      {icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-text-secondary">
          {typeof icon === 'string' ? (
            <span className="text-3xl">{icon}</span>
          ) : (
            <span className="h-8 w-8">{icon}</span>
          )}
        </div>
      )}

      <h3 className="mb-1 text-lg font-semibold text-text-primary">{title}</h3>

      {description && (
        <p className="mb-6 max-w-sm text-sm text-text-secondary leading-relaxed">
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </motion.div>
  )
}
