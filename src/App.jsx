import { useCallback, useEffect, useRef, useState } from 'react'
import { PanelLeft, Sun, Moon } from 'lucide-react'
import { checkClaim } from './api/checkClaim'
import { loadChats, saveChats, loadTheme, saveTheme } from './lib/storage'
import Sidebar from './components/Sidebar'
import EmptyState from './components/EmptyState'
import ChatInput from './components/ChatInput'
import StepperLoader from './components/StepperLoader'
import ResultCard from './components/ResultCard'
import ErrorCard from './components/ErrorCard'
import HowItWorksModal from './components/HowItWorksModal'

export default function App() {
  const [chats, setChats] = useState(loadChats)
  const [activeId, setActiveId] = useState(null) // null = the "new check" screen
  const [theme, setTheme] = useState(loadTheme)
  const [sidebarOpen, setSidebarOpen] = useState(() => window.matchMedia('(min-width: 768px)').matches)
  const [showHow, setShowHow] = useState(false)
  const scrollRef = useRef(null)

  const active = chats.find((c) => c.id === activeId) ?? null
  const busy = chats.some((c) => c.status === 'pending')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    saveTheme(theme)
  }, [theme])

  useEffect(() => saveChats(chats), [chats])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
  }, [activeId])

  const patch = (id, changes) => setChats((cs) => cs.map((c) => (c.id === id ? { ...c, ...changes } : c)))

  const run = useCallback(async (id, claim) => {
    patch(id, { status: 'pending', result: null })
    try {
      const result = await checkClaim(claim)
      patch(id, { status: 'done', result })
    } catch {
      patch(id, { status: 'error' })
    }
  }, [])

  function submit(claim) {
    if (busy) return
    const id = crypto.randomUUID()
    setChats((cs) => [{ id, claim, createdAt: Date.now(), status: 'pending', result: null }, ...cs])
    setActiveId(id)
    run(id, claim)
  }

  const closeDrawerOnMobile = () => {
    if (!window.matchMedia('(min-width: 768px)').matches) setSidebarOpen(false)
  }

  function select(id) {
    setActiveId(id)
    closeDrawerOnMobile()
  }

  function newCheck() {
    setActiveId(null)
    closeDrawerOnMobile()
  }

  function remove(id) {
    setChats((cs) => cs.filter((c) => c.id !== id))
    if (id === activeId) setActiveId(null)
  }

  function clearAll() {
    if (!window.confirm('Delete all recent checks?')) return
    setChats([])
    setActiveId(null)
  }

  const iconButton =
    'flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 dark:border-ink-700 dark:bg-ink-900 dark:hover:bg-ink-800'

  return (
    <div className="flex h-dvh overflow-hidden bg-slate-100 font-sans text-slate-900 antialiased dark:bg-ink-950 dark:text-ink-100">
      <Sidebar
        open={sidebarOpen}
        chats={chats}
        activeId={activeId}
        onSelect={select}
        onDelete={remove}
        onNew={newCheck}
        onClearAll={clearAll}
        onHow={() => setShowHow(true)}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 px-4 dark:border-ink-700">
          <button
            type="button"
            className={iconButton}
            onClick={() => setSidebarOpen((o) => !o)}
            aria-label={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
          >
            <PanelLeft className="size-5" aria-hidden="true" />
          </button>
          <h2 className="min-w-0 flex-1 truncate text-base font-semibold">{active ? active.claim : 'New check'}</h2>
          <button
            type="button"
            className={iconButton}
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="size-5" aria-hidden="true" /> : <Moon className="size-5" aria-hidden="true" />}
          </button>
        </header>

        <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
          {active ? (
            <div className="mx-auto flex max-w-[760px] flex-col gap-5 px-4 py-7">
              <p className="ml-auto w-fit max-w-[85%] rounded-2xl bg-slate-900 px-4 py-3 text-white dark:bg-ink-100 dark:text-ink-900">
                {active.claim}
              </p>
              {active.status === 'pending' && <StepperLoader />}
              {active.status === 'error' && <ErrorCard onRetry={() => run(active.id, active.claim)} />}
              {active.status === 'done' && (
                <ResultCard claim={active.claim} result={active.result} onRecheck={() => run(active.id, active.claim)} />
              )}
            </div>
          ) : (
            <EmptyState onPick={submit} disabled={busy} />
          )}
        </div>

        <ChatInput onSubmit={submit} disabled={busy} />
      </main>

      {showHow && <HowItWorksModal onClose={() => setShowHow(false)} />}
    </div>
  )
}
