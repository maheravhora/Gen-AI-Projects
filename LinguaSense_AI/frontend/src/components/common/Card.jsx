import { motion } from 'framer-motion'
import { cardHover } from '../../animations/variants'

const PADDING = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export default function Card({
  children,
  header,
  footer,
  padding = 'md',
  hoverable = false,
  className = '',
  ...props
}) {
  const Wrapper = hoverable ? motion.div : 'div'
  const motionProps = hoverable
    ? {
        variants: cardHover,
        initial: 'rest',
        whileHover: 'hover',
      }
    : {}

  return (
    <Wrapper
      className={`rounded-2xl border border-white/8 bg-[#1E293B]/80 backdrop-blur-xl transition-shadow ${
        hoverable ? 'cursor-pointer hover:shadow-xl hover:shadow-primary/5' : ''
      } ${className}`}
      {...motionProps}
      {...props}
    >
      {header && (
        <div className="border-b border-white/8 px-6 py-4">
          {typeof header === 'string' ? (
            <h3 className="text-base font-semibold text-text-primary">{header}</h3>
          ) : (
            header
          )}
        </div>
      )}

      <div className={PADDING[padding]}>{children}</div>

      {footer && (
        <div className="border-t border-white/8 px-6 py-4">{footer}</div>
      )}
    </Wrapper>
  )
}
