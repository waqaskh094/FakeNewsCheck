import { useEffect, useState } from 'react'
import { Check, LoaderCircle } from 'lucide-react'

const STEPS = ['Classifying claim', 'Retrieving evidence', 'Judging']

// Purely visual: moves through the steps while the request is running.
export default function StepperLoader() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 1100)
    return () => clearInterval(id)
  }, [])

  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-ink-700 dark:bg-ink-900/70 md:p-7"
    >
      <ol className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
        {STEPS.map((label, i) => {
          const done = i < step
          const active = i === step
          return (
            <li key={label} className="flex items-center gap-3 md:flex-1 md:last:flex-none">
              <span
                className={`flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                  done
                    ? 'border-slate-900 bg-slate-900 text-white dark:border-ink-100 dark:bg-ink-100 dark:text-ink-900'
                    : active
                      ? 'border-slate-900 text-slate-900 dark:border-ink-100 dark:text-ink-100'
                      : 'border-slate-300 text-slate-400 dark:border-ink-600 dark:text-ink-400'
                }`}
              >
                {done ? (
                  <Check className="size-4" aria-hidden="true" />
                ) : active ? (
                  <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  i + 1
                )}
              </span>
              <span className={`text-sm font-semibold ${i > step ? 'text-slate-400 dark:text-ink-400' : ''}`}>
                {label}
                {active && <span className="ml-2 text-xs font-normal text-slate-500 dark:text-ink-400">in progress</span>}
              </span>
              {i < STEPS.length - 1 && (
                <span
                  className={`hidden h-px flex-1 md:block ${
                    done ? 'bg-slate-900 dark:bg-ink-100' : 'bg-slate-300 dark:bg-ink-600'
                  }`}
                />
              )}
            </li>
          )
        })}
      </ol>

      {/* skeleton of the result card */}
      <div className="mt-6 animate-pulse" aria-hidden="true">
        <div className="flex justify-between gap-6">
          <div className="h-14 w-48 rounded-xl bg-slate-200 dark:bg-ink-800" />
          <div className="h-14 w-full max-w-72 rounded-xl bg-slate-200 dark:bg-ink-800" />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="h-24 rounded-xl bg-slate-200 dark:bg-ink-800" />
          <div className="h-24 rounded-xl bg-slate-200 dark:bg-ink-800" />
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-3 rounded-full bg-slate-200 dark:bg-ink-800" />
          <div className="h-3 w-5/6 rounded-full bg-slate-200 dark:bg-ink-800" />
          <div className="h-3 w-2/3 rounded-full bg-slate-200 dark:bg-ink-800" />
        </div>
      </div>
    </div>
  )
}
