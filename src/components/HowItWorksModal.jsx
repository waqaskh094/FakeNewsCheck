import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function HowItWorksModal({ onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="how-title"
        onClick={(e) => e.stopPropagation()}
        className="max-h-full w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-ink-700 dark:bg-ink-900"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="how-title" className="text-xl font-bold">
            How it works
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-slate-500 dark:text-ink-400 dark:hover:bg-ink-800"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        <video
          src={`${import.meta.env.BASE_URL}how-it-works.mp4`}
          className="mt-5 aspect-video w-full rounded-xl border border-slate-200 bg-black dark:border-ink-700"
          autoPlay
          controls
          playsInline
        />
        <p className="mt-5 text-sm text-slate-500 dark:text-ink-400">
          Built on the LIAR dataset of PolitiFact claims. Results are a guide, not a final ruling.
        </p>
      </div>
    </div>
  )
}