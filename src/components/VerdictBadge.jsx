import { VERDICT } from '../lib/verdicts'

const SIZES = {
  lg: 'gap-2.5 rounded-xl px-4 py-2.5 text-2xl font-bold tracking-wide [&_svg]:size-7',
  md: 'gap-2 rounded-lg px-2.5 py-1 text-xs font-bold tracking-wide [&_svg]:size-4',
}

export default function VerdictBadge({ verdict, size = 'md' }) {
  const v = VERDICT[verdict]
  return (
    <span className={`inline-flex items-center border ${v.badge} ${SIZES[size]}`}>
      <v.Icon aria-hidden="true" />
      {v.label}
    </span>
  )
}
