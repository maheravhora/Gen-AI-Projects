// ── Fade Variants ──────────────────────────────────────

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.3, ease: 'easeIn' } },
}

export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } },
}

export const fadeInDown = {
  initial: { opacity: 0, y: -30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.3, ease: 'easeIn' } },
}

export const fadeInLeft = {
  initial: { opacity: 0, x: -40 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, x: 40, transition: { duration: 0.3, ease: 'easeIn' } },
}

export const fadeInRight = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, x: -40, transition: { duration: 0.3, ease: 'easeIn' } },
}

// ── Scale Variants ─────────────────────────────────────

export const scaleIn = {
  initial: { opacity: 0, scale: 0.85 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, scale: 0.85, transition: { duration: 0.25, ease: 'easeIn' } },
}

// ── Slide Variants ─────────────────────────────────────

export const slideUp = {
  initial: { y: '100%' },
  animate: { y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { y: '100%', transition: { duration: 0.3, ease: 'easeIn' } },
}

export const slideDown = {
  initial: { y: '-100%' },
  animate: { y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { y: '-100%', transition: { duration: 0.3, ease: 'easeIn' } },
}

export const slideLeft = {
  initial: { x: '100%' },
  animate: { x: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { x: '100%', transition: { duration: 0.3, ease: 'easeIn' } },
}

export const slideRight = {
  initial: { x: '-100%' },
  animate: { x: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { x: '-100%', transition: { duration: 0.3, ease: 'easeIn' } },
}

// ── Stagger Variants ───────────────────────────────────

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

// ── Page Transition ────────────────────────────────────

export const pageTransition = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0,
    y: -16,
    transition: { duration: 0.25, ease: 'easeIn' },
  },
}

// ── Interactive Variants ───────────────────────────────

export const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -4,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
}

export const buttonTap = {
  rest: { scale: 1 },
  hover: { scale: 1.03, transition: { duration: 0.2 } },
  tap: { scale: 0.97, transition: { duration: 0.1 } },
}

// ── Progress Bar Fill ──────────────────────────────────

export const progressBarFill = (targetWidth) => ({
  initial: { width: 0 },
  animate: {
    width: targetWidth,
    transition: { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] },
  },
})

// ── Floating Animation ────────────────────────────────

export const floatingAnimation = {
  animate: {
    y: [0, -12, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

// ── Typewriter ─────────────────────────────────────────

export const typewriter = (charCount) => ({
  initial: { width: 0 },
  animate: {
    width: `${charCount}ch`,
    transition: {
      duration: charCount * 0.06,
      ease: 'steps(${charCount})',
    },
  },
})

// ── Modal Variants ─────────────────────────────────────

export const modalOverlay = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}

export const modalContent = {
  initial: { opacity: 0, scale: 0.92, y: 20 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: 20,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
}

// ── Notification / Toast ───────────────────────────────

export const toastSlide = {
  initial: { opacity: 0, x: 80, scale: 0.95 },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0,
    x: 80,
    scale: 0.95,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
}
