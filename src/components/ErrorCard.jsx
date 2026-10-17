import { TriangleAlert, RefreshCw } from 'lucide-react'

export default function ErrorCard({ onRetry }) {
  return (
    <div
      role="alert"
      className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-ink-700 dark:bg-ink-900/70 sm:flex-row sm:items-center sm:justify-between md:p-7"
    >
      <div className="flex items-start gap-3">
        <TriangleAlert className="mt-0.5 size-5 shrink-0 text-red-600 dark:text-red-400" aria-hidden="true" />
        <div>
          <p className="font-semibold">Couldn't reach the checker.</p>
          <p className="text-sm text-slate-500 dark:text-ink-400">Something went wrong while checking this claim. Try again.</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex w-fit items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:bg-ink-100 dark:text-ink-900 dark:hover:bg-white"
      >
        <RefreshCw className="size-4" aria-hidden="true" />
        Retry
      </button>
    </div>
  )
}
