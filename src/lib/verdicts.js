import { CircleCheck, CircleX, CircleHelp, CircleAlert } from 'lucide-react'

// Final / agent verdict styles. Class names are written out in full so Tailwind can find them.
export const VERDICT = {
  real: {
    label: 'REAL',
    Icon: CircleCheck,
    badge:
      'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800',
    bar: 'bg-emerald-500 dark:bg-emerald-400',
    icon: 'text-emerald-600 dark:text-emerald-400',
  },
  fake: {
    label: 'FAKE',
    Icon: CircleX,
    badge:
      'bg-red-100 text-red-800 border-red-300 dark:bg-red-950/70 dark:text-red-300 dark:border-red-900',
    bar: 'bg-red-600 dark:bg-red-400',
    icon: 'text-red-600 dark:text-red-400',
  },
  nee: {
    label: 'NOT ENOUGH EVIDENCE',
    Icon: CircleHelp,
    badge:
      'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
    bar: 'bg-amber-600 dark:bg-amber-400',
    icon: 'text-amber-600 dark:text-amber-400',
  },
}

export const ERROR_STYLE = { Icon: CircleAlert, icon: 'text-slate-400 dark:text-ink-400' }

// Rating tags on retrieved fact-checks (PolitiFact scale)
const RATING_TONE = {
  real: VERDICT.real.badge,
  fake: VERDICT.fake.badge,
  mixed: VERDICT.nee.badge,
}

export function ratingStyle(rating = '') {
  const r = rating.toLowerCase().replace(/[-_]/g, ' ').trim()
  if (r === 'true' || r === 'mostly true') return { tone: RATING_TONE.real, kind: 'real' }
  if (r === 'half true' || r === 'half-true') return { tone: RATING_TONE.mixed, kind: 'mixed' }
  return { tone: RATING_TONE.fake, kind: 'fake' }
}

export function prettyRating(rating = '') {
  return rating
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase())
    .replace('Pants Fire', 'Pants on Fire')
}
