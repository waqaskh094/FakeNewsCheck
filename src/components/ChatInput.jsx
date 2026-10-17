import { useState } from 'react'
import { Send } from 'lucide-react'

const MAX = 500

export default function ChatInput({ onSubmit, disabled }) {
  const [text, setText] = useState('')
  const canSend = text.trim().length > 0 && !disabled

  function send() {
    if (!canSend) return
    onSubmit(text.trim())
    setText('')
  }

  return (
    <div className="border-t border-slate-200 bg-slate-100 px-4 pt-4 pb-3 dark:border-ink-700 dark:bg-ink-950">
      <div className="mx-auto max-w-[760px]">
        <div className="flex items-end gap-2 rounded-3xl border border-slate-300 bg-white py-2 pr-2 pl-5 focus-within:border-slate-500 dark:border-ink-600 dark:bg-ink-900 dark:focus-within:border-ink-400">
          <textarea
            value={text}
            maxLength={MAX}
            rows={1}
            aria-label="News claim"
            placeholder="Paste a news claim to check..."
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send()
              }
            }}
            className="field-sizing-content max-h-40 min-h-8 flex-1 resize-none bg-transparent py-1.5 text-base outline-none placeholder:text-slate-400 dark:placeholder:text-ink-500"
          />
          <button
            type="button"
            onClick={send}
            disabled={!canSend}
            aria-label="Check claim"
            className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-ink-100 dark:text-ink-900 dark:hover:bg-white"
          >
            <Send className="size-5" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-2 flex items-start justify-between gap-4 text-xs text-slate-500 dark:text-ink-400">
          <span>Results are AI-generated and may be wrong. Verify important claims.</span>
          <span className="shrink-0 font-mono">
            {text.length} / {MAX}
          </span>
        </div>
      </div>
    </div>
  )
}
