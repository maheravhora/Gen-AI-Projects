const VARIANTS = {
  text: (w, h) => `${w || 'w-full'} ${h || 'h-4'} rounded-md`,
  circle: (w, h) => `${w || 'w-12'} ${h || 'h-12'} rounded-full`,
  card: (w, h) => `${w || 'w-full'} ${h || 'h-36'} rounded-2xl`,
  rectangular: (w, h) => `${w || 'w-full'} ${h || 'h-24'} rounded-xl`,
}

export default function Skeleton({
  variant = 'text',
  width,
  height,
  count = 1,
  className = '',
}) {
  const classes = VARIANTS[variant](width, height)

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`skeleton ${classes} ${className}`}
          aria-hidden="true"
        />
      ))}
    </>
  )
}

// ── Preset Compositions ────────────────────────────────

Skeleton.TextBlock = function TextBlock({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2.5 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`skeleton h-4 rounded-md ${i === lines - 1 ? 'w-3/5' : 'w-full'}`}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

Skeleton.Card = function SkeletonCard({ className = '' }) {
  return (
    <div
      className={`rounded-2xl border border-white/8 bg-card/40 p-6 space-y-4 ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="skeleton h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-32 rounded-md" />
          <div className="skeleton h-3 w-20 rounded-md" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="skeleton h-3 w-full rounded-md" />
        <div className="skeleton h-3 w-full rounded-md" />
        <div className="skeleton h-3 w-4/5 rounded-md" />
      </div>
    </div>
  )
}
