import { ArrowUpRight } from 'lucide-react'

const EXAMPLES = [
  'Unemployment hit a 50-year low last quarter.',
  'The election results were certified in all 50 states.',
  'Healthcare costs will fall 30% in every state by next year.',
  'Immigrants commit more crime than citizens in every state.',
]

export default function EmptyState({ onPick, disabled }) {
  return (
    <div className="mx-auto flex min-h-full max-w-[760px] flex-col justify-center px-4 py-10 text-center">
      <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl">
        Check a claim
        <br />
        before you share it.
      </h1>
      <p className="mx-auto mt-5 max-w-lg text-lg text-slate-500 dark:text-ink-400">
        Paste a news or political claim. You get a verdict, the reasoning behind it, and related fact-checks to read for
        yourself.
      </p>
      <div className="mt-9 grid gap-3 text-left sm:grid-cols-2">
        {EXAMPLES.map((text) => (
          <button
            key={text}
            type="button"
            disabled={disabled}
            onClick={() => onPick(text)}
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 hover:border-slate-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 disabled:opacity-50 dark:border-ink-700 dark:bg-ink-900 dark:hover:border-ink-500"
          >
            <span>{text}</span>
            <ArrowUpRight className="size-4 shrink-0 text-slate-500 dark:text-ink-400" aria-hidden="true" />
          </button>
        ))}
      </div>
      <p className="mt-8 text-sm text-slate-500 dark:text-ink-400">Results come from a classifier plus an evidence check.</p>
    </div>
  )
}
