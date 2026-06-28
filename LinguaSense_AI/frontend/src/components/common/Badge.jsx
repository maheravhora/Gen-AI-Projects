const VARIANT_CLASSES = {
  default:
    'bg-white/10 text-text-secondary border border-white/8',
  success:
    'bg-success/15 text-success border border-success/30',
  warning:
    'bg-warning/15 text-warning border border-warning/30',
  danger:
    'bg-danger/15 text-danger border border-danger/30',
  info:
    'bg-primary/15 text-primary border border-primary/30',
  accent:
    'bg-accent/15 text-accent border border-accent/30',
}

export default function Badge({
  children,
  variant = 'default',
  dot = false,
  className = '',
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {dot && (
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
      )}
      {children}
    </span>
  )
}
