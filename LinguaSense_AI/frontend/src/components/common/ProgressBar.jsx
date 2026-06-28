import { motion } from 'framer-motion'

function getColor(value) {
  if (value >= 75) return { bar: 'bg-success', stroke: '#10B981' }
  if (value >= 40) return { bar: 'bg-warning', stroke: '#F59E0B' }
  return { bar: 'bg-danger', stroke: '#EF4444' }
}

// ── Linear Bar ─────────────────────────────────────────

function LinearBar({ value = 0, label, showValue = true, height = 'h-2', className = '' }) {
  const { bar } = getColor(value)
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div className={`w-full ${className}`}>
      {(label || showValue) && (
        <div className="mb-1.5 flex items-center justify-between text-xs">
          {label && <span className="font-medium text-text-secondary">{label}</span>}
          {showValue && <span className="font-semibold text-text-primary">{clamped}%</span>}
        </div>
      )}
      <div className={`w-full ${height} overflow-hidden rounded-full bg-white/10`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={`h-full rounded-full ${bar}`}
        />
      </div>
    </div>
  )
}

// ── Circular SVG ───────────────────────────────────────

function CircularBar({
  value = 0,
  size = 80,
  strokeWidth = 6,
  label,
  showValue = true,
  className = '',
}) {
  const { stroke } = getColor(value)
  const clamped = Math.min(100, Math.max(0, value))
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (clamped / 100) * circumference

  return (
    <div className={`inline-flex flex-col items-center gap-1 ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={strokeWidth}
          />
          {/* Animated fill */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        </svg>

        {showValue && (
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-text-primary">
            {clamped}%
          </span>
        )}
      </div>

      {label && (
        <span className="text-xs font-medium text-text-secondary">{label}</span>
      )}
    </div>
  )
}

// ── Export ──────────────────────────────────────────────

export default function ProgressBar({ variant = 'linear', ...props }) {
  if (variant === 'circular') return <CircularBar {...props} />
  return <LinearBar {...props} />
}

ProgressBar.Linear = LinearBar
ProgressBar.Circular = CircularBar
