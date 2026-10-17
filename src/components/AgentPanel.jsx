import VerdictBadge from './VerdictBadge'

export default function AgentPanel({ icon: Icon, title, verdict, detail }) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-200 bg-slate-100 p-4 dark:border-ink-700 dark:bg-ink-800">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-ink-300">
        <Icon className="size-4" aria-hidden="true" />
        {title}
      </div>
      <div className="mt-3">
        <VerdictBadge verdict={verdict} />
      </div>
      <p className="mt-3 text-sm text-slate-500 dark:text-ink-400">{detail}</p>
    </div>
  )
}
