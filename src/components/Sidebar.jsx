import { Plus, Info, Trash2, ScanSearch, LoaderCircle, CircleAlert } from 'lucide-react'
import { VERDICT } from '../lib/verdicts'
import { isToday } from '../lib/storage'

function ChatIcon({ chat }) {
  if (chat.status === 'pending') return <LoaderCircle className="size-4 shrink-0 animate-spin text-slate-400" aria-hidden="true" />
  if (chat.status === 'error') return <CircleAlert className="size-4 shrink-0 text-slate-400 dark:text-ink-400" aria-hidden="true" />
  const v = VERDICT[chat.result.verdict]
  return <v.Icon className={`size-4 shrink-0 ${v.icon}`} aria-hidden="true" />
}

function SidebarItem({ chat, active, onSelect, onDelete }) {
  return (
    <li
      className={`group flex items-center rounded-xl ${
        active ? 'bg-slate-100 dark:bg-ink-800' : 'hover:bg-slate-50 dark:hover:bg-ink-800/60'
      }`}
    >
      <button
        type="button"
        onClick={() => onSelect(chat.id)}
        aria-current={active ? 'true' : undefined}
        className={`flex min-w-0 flex-1 items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm focus-visible:outline-2 focus-visible:outline-slate-500 ${
          active ? 'font-semibold' : ''
        }`}
      >
        <ChatIcon chat={chat} />
        <span className="truncate">{chat.claim}</span>
      </button>
      <button
        type="button"
        onClick={() => onDelete(chat.id)}
        aria-label={`Delete check: ${chat.claim}`}
        className="mr-2 rounded-md p-1.5 text-slate-500 hover:bg-slate-200 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-slate-500 md:opacity-0 md:group-hover:opacity-100 dark:text-ink-400 dark:hover:bg-ink-700"
      >
        <Trash2 className="size-4" aria-hidden="true" />
      </button>
    </li>
  )
}

function Group({ title, chats, activeId, onSelect, onDelete }) {
  if (chats.length === 0) return null
  return (
    <section className="mt-5">
      <h2 className="px-3 pb-2 text-xs font-semibold text-slate-500 dark:text-ink-400">{title}</h2>
      <ul className="space-y-0.5">
        {chats.map((c) => (
          <SidebarItem key={c.id} chat={c} active={c.id === activeId} onSelect={onSelect} onDelete={onDelete} />
        ))}
      </ul>
    </section>
  )
}

export default function Sidebar({ open, chats, activeId, onSelect, onDelete, onNew, onClearAll, onHow, onClose }) {
  const today = chats.filter((c) => isToday(c.createdAt))
  const earlier = chats.filter((c) => !isToday(c.createdAt))

  return (
    <>
      {/* backdrop for the mobile drawer */}
      {open && <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={onClose} aria-hidden="true" />}

      <aside
        className={`fixed inset-y-0 left-0 z-40 shrink-0 overflow-hidden border-r border-slate-200 bg-white transition-all duration-200 dark:border-ink-700 dark:bg-ink-900 md:relative ${
          open ? 'w-72 translate-x-0 md:w-70' : '-translate-x-full md:w-0 md:translate-x-0 md:border-r-0'
        }`}
        aria-label="Recent checks"
        inert={!open}
      >
        <div className="flex h-full w-72 flex-col p-4 md:w-70">
          <div className="flex items-center gap-3 px-1 py-1">
            <span className="flex size-9 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-ink-100 dark:text-ink-900">
              <ScanSearch className="size-5" aria-hidden="true" />
            </span>
            <span className="text-lg font-bold">Fake News Checker</span>
          </div>

          <button
            type="button"
            onClick={onNew}
            className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:bg-ink-100 dark:text-ink-900 dark:hover:bg-white"
          >
            <Plus className="size-4" aria-hidden="true" />
            New check
          </button>

          <nav className="mt-2 min-h-0 flex-1 overflow-y-auto">
            {chats.length === 0 ? (
              <p className="mt-8 px-3 text-center text-sm text-slate-500 dark:text-ink-400">
                No checks yet. Your recent checks will show up here.
              </p>
            ) : (
              <>
                <Group title="Today" chats={today} activeId={activeId} onSelect={onSelect} onDelete={onDelete} />
                <Group title="Earlier" chats={earlier} activeId={activeId} onSelect={onSelect} onDelete={onDelete} />
              </>
            )}
          </nav>

          <div className="space-y-3 border-t border-slate-200 pt-3 dark:border-ink-700">
            <button
              type="button"
              onClick={onHow}
              className="flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-slate-500 dark:hover:bg-ink-800"
            >
              <Info className="size-4" aria-hidden="true" />
              How it works
            </button>
            <button
              type="button"
              onClick={onClearAll}
              disabled={chats.length === 0}
              className="px-3 text-sm text-slate-500 underline underline-offset-2 hover:text-slate-900 disabled:no-underline disabled:opacity-40 dark:text-ink-400 dark:hover:text-ink-100"
            >
              Clear all
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
