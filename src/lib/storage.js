import { buildMock } from '../api/mock'
import { normalizeResult } from '../api/checkClaim'

export const CHATS_KEY = 'fnc.chats'
export const THEME_KEY = 'fnc.theme'

const HOUR = 60 * 60 * 1000

// Example history so the sidebar is not empty on the first visit
function seedChats() {
  const now = Date.now()
  const make = (id, claim, kind, ago) => ({
    id,
    claim,
    createdAt: now - ago,
    status: 'done',
    result: normalizeResult(buildMock(kind)),
  })
  return [
    make('seed-1', 'Immigrants commit more crime than citizens in every state.', 'fake', 0.2 * HOUR),
    make('seed-2', 'The national unemployment rate stayed below 4% for three straight months.', 'real', 0.5 * HOUR),
    make('seed-3', 'Healthcare costs will fall 30% in every state by next year.', 'nee', 1 * HOUR),
    make('seed-4', 'The election results were certified in all 50 states.', 'real', 30 * HOUR),
    make('seed-5', 'A new tax will raise the price of groceries by 20%.', 'fake', 52 * HOUR),
  ]
}

export function loadChats() {
  try {
    const raw = localStorage.getItem(CHATS_KEY)
    if (raw === null) return seedChats()
    const list = JSON.parse(raw)
    return Array.isArray(list) ? list : []
  } catch {
    return seedChats()
  }
}

export function saveChats(chats) {
  try {
    // A check that is still running cannot be resumed after a reload, so it is not saved
    localStorage.setItem(CHATS_KEY, JSON.stringify(chats.filter((c) => c.status !== 'pending')))
  } catch {
    /* storage unavailable: the app still works, history just won't persist */
  }
}

export function loadTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    /* ignore */
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {
    /* ignore */
  }
}

export function isToday(ts) {
  return new Date(ts).toDateString() === new Date().toDateString()
}
