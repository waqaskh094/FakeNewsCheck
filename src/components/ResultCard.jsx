import { useState } from 'react'
import { SlidersHorizontal, Search, Check, Shuffle, ChevronUp, Copy, RefreshCw, Info } from 'lucide-react'
import { VERDICT } from '../lib/verdicts'
import VerdictBadge from './VerdictBadge'
import ConfidenceMeter from './ConfidenceMeter'
import AgentPanel from './AgentPanel'
import EvidenceCard from './EvidenceCard'

const pct = (n) => `${Math.round(n * 100)}%`

function confidenceNote(result, agree) {
  if (result.verdict === 'nee') return 'Below the threshold for a verdict'
  if (agree) return 'Both checks are confident'
  return result.verdict === result.classifier.pred
    ? 'Weighted toward the classifier'
    : 'Weighted toward the evidence check'
}

export default function ResultCard({ claim, result, onRecheck }) {
  const [evidenceOpen, setEvidenceOpen] = useState(true)
  const [copied, setCopied] = useState(false)
  const agree = result.classifier.pred === result.rag.pred && result.rag.pred !== 'nee'
  const noEvidence = result.sources.length === 0
  const n = result.sources.length

  async function copy() {
    const text = `Claim: ${claim}\nVerdict: ${VERDICT[result.verdict].label} (${pct(result.confidence)})\n${result.reasoning}`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard blocked: nothing to do */
    }
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-ink-700 dark:bg-ink-900/70 md:p-7">
      {/* Verdict + confidence */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-10">
        <div>
          <p className="mb-1.5 text-sm font-semibold text-slate-500 dark:text-ink-400">Final verdict</p>
          <VerdictBadge verdict={result.verdict} size="lg" />
        </div>
        <div className="flex w-full sm:max-w-80 sm:pt-1">
          <ConfidenceMeter value={result.confidence} verdict={result.verdict} note={confidenceNote(result, agree)} />
        </div>
      </div>

      {result.verdict === 'nee' && (
        <p className="mt-5 rounded-lg border border-amber-200 bg-amber-100 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
          No verdict was given. The checker abstains on purpose when its signals are weak or conflict. This is a result,
          not an error.
        </p>
      )}

      {/* Agents */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <AgentPanel
          icon={SlidersHorizontal}
          title="Classifier"
          verdict={result.classifier.pred}
          detail={`${pct(result.classifier.confidence)} confident`}
        />
        <AgentPanel
          icon={Search}
          title="Evidence check"
          verdict={result.rag.pred}
          detail={noEvidence ? 'No closely related fact-checks found' : `Evidence model · ${n} related fact-check${n === 1 ? '' : 's'}`}
        />
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        {noEvidence ? (
          <span className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-bold dark:border-ink-600 dark:bg-ink-800">
            <Info className="size-4" aria-hidden="true" />
            Little evidence
          </span>
        ) : agree ? (
          <span className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-bold dark:border-ink-600 dark:bg-ink-800">
            <Check className="size-4" aria-hidden="true" />
            Both agree
          </span>
        ) : (
          <span className="inline-flex w-fit items-center gap-2 rounded-lg border border-dashed border-amber-400 bg-amber-100 px-3 py-1.5 text-sm font-bold text-amber-900 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
            <Shuffle className="size-4" aria-hidden="true" />
            They disagree
          </span>
        )}
        <span className="text-sm text-slate-500 dark:text-ink-400">
          {noEvidence
            ? 'No closely related past fact-checks were found, so the classifier carries most of the weight.'
            : agree
              ? 'The classifier and the evidence check reached the same verdict.'
              : "The final verdict weighs the classifier against the evidence check."}
        </span>
      </div>

      {/* Reasoning */}
      <section className="mt-7">
        <h3 className="text-sm font-semibold text-slate-500 dark:text-ink-400">Why this verdict</h3>
        <p className="mt-2 text-lg leading-relaxed">{result.reasoning}</p>
      </section>

      {/* Evidence */}
      {result.sources.length > 0 && (
        <section className="mt-7 border-t border-slate-200 pt-5 dark:border-ink-700">
          <button
            type="button"
            onClick={() => setEvidenceOpen((o) => !o)}
            aria-expanded={evidenceOpen}
            className="flex w-full items-center justify-between rounded-md text-left text-sm font-semibold text-slate-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 dark:text-ink-400"
          >
            <span>
              Evidence <span className="font-normal">· {n} related fact-check{n === 1 ? '' : 's'}</span>
            </span>
            <ChevronUp
              className={`size-5 transition-transform ${evidenceOpen ? '' : 'rotate-180'}`}
              aria-hidden="true"
            />
          </button>
          {evidenceOpen && (
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {result.sources.map((s, i) => (
                <EvidenceCard key={i} source={s} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Actions */}
      <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-200 pt-4 dark:border-ink-700">
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 dark:border-ink-600 dark:hover:bg-ink-800"
        >
          {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
          {copied ? 'Copied' : 'Copy result'}
        </button>
        <button
          type="button"
          onClick={onRecheck}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 dark:border-ink-600 dark:hover:bg-ink-800"
        >
          <RefreshCw className="size-4" aria-hidden="true" />
          Re-check
        </button>
      </div>
    </article>
  )
}
