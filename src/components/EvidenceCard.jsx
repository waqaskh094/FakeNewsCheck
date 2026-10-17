import { Check, X, CircleAlert, Info } from 'lucide-react'
import { ratingStyle, prettyRating } from '../lib/verdicts'

const RATING_ICON = { real: Check, fake: X, mixed: CircleAlert }

export default function EvidenceCard({ source }) {
  const rating = source.rating ? ratingStyle(source.rating) : null
  const RatingIcon = rating ? RATING_ICON[rating.kind] : null
  const Body = source.url ? 'a' : 'div'
  const linkProps = source.url ? { href: source.url, target: '_blank', rel: 'noreferrer' } : {}

  return (
    <Body
      {...linkProps}
      className="flex min-w-0 flex-col rounded-xl border border-slate-200 bg-white p-3.5 dark:border-ink-700 dark:bg-ink-800/60"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="truncate font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-ink-400">
          {source.source}
        </span>
        {rating && (
          <span className={`inline-flex shrink-0 items-center gap-1 rounded-md border px-1.5 py-0.5 text-xs font-semibold ${rating.tone}`}>
            <RatingIcon className="size-3" aria-hidden="true" />
            {prettyRating(source.rating)}
          </span>
        )}
      </div>
      <p className="mt-2.5 line-clamp-2 text-sm font-medium leading-snug">{source.statement}</p>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 dark:text-ink-400">
        <Info className="size-3.5" aria-hidden="true" />
        Related, not an exact match
      </p>
    </Body>
  )
}
