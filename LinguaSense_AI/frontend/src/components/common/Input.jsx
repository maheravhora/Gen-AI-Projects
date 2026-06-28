import { forwardRef } from 'react'

const VARIANT_STYLES = {
  default:
    'bg-white/5 border border-white/8 focus:border-primary/50 focus:ring-1 focus:ring-primary/30',
  filled:
    'bg-card/80 border border-transparent focus:border-primary/50 focus:ring-1 focus:ring-primary/30',
}

const Input = forwardRef(function Input(
  {
    label,
    error,
    icon,
    variant = 'default',
    className = '',
    id,
    ...props
  },
  ref
) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-text-secondary"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
            {icon}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          className={`w-full rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/50 outline-none transition-all duration-200 ${
            VARIANT_STYLES[variant]
          } ${icon ? 'pl-10' : ''} ${
            error ? 'border-danger/60 focus:border-danger focus:ring-danger/30' : ''
          } ${className}`}
          {...props}
        />
      </div>

      {error && (
        <p className="mt-1.5 text-xs font-medium text-danger">{error}</p>
      )}
    </div>
  )
})

export default Input
