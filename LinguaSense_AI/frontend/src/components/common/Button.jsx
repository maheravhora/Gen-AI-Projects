import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { buttonTap } from '../../animations/variants'

const VARIANT_CLASSES = {
  primary:
    'bg-primary text-white hover:bg-primary/90 glow-primary',
  secondary:
    'bg-secondary/15 text-secondary border border-secondary/30 hover:bg-secondary/25',
  ghost:
    'bg-transparent text-text-secondary hover:bg-white/5 hover:text-text-primary',
  danger:
    'bg-danger/15 text-danger border border-danger/30 hover:bg-danger/25',
  accent:
    'bg-accent/15 text-accent border border-accent/30 hover:bg-accent/25',
}

const SIZE_CLASSES = {
  sm: 'min-h-[44px] px-4 py-2 text-sm gap-1.5 rounded-xl',
  md: 'min-h-[44px] px-6 py-2.5 text-[15px] gap-2 rounded-xl',
  lg: 'min-h-[48px] px-8 py-3 text-base gap-2.5 rounded-xl',
}

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled = false,
    leftIcon,
    rightIcon,
    className = '',
    type = 'button',
    ...props
  },
  ref
) {
  const isDisabled = disabled || isLoading

  return (
    <motion.button
      ref={ref}
      type={type}
      variants={buttonTap}
      initial="rest"
      whileHover={isDisabled ? undefined : 'hover'}
      whileTap={isDisabled ? undefined : 'tap'}
      disabled={isDisabled}
      className={`inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus-ring disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...props}
    >
      {isLoading && (
        <svg
          className="h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </motion.button>
  )
})

export default Button
