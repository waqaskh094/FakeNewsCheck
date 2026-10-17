import { mockCheck } from './mock'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'
const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000').replace(/\/$/, '')

// Expected backend response: the dict returned by check_claim() in the notebook
// {
//   verdict, confidence, classifier_pred, classifier_confidence, rag_pred,
//   reasoning, sources: [{ title, url }]
// }
async function realCheck(claim) {
  const res = await fetch(`${API_URL}/check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ claim }),
    signal: AbortSignal.timeout(180_000),   // first request after the server wakes up can be slow
  })
  if (!res.ok) throw new Error(`Request failed (${res.status})`)
  return res.json()
}

const toKey = (v) => (String(v).toLowerCase().includes('not enough') ? 'nee' : String(v).toLowerCase())

// Backend sources look like: 'PolitiFact fact-check 5216.json (LIAR-PLUS) -- fact-check: "statement..."'
function normalizeSource(s) {
  if (s.statement) {
    return { source: s.source ?? 'PolitiFact', statement: s.statement, rating: s.rating ?? '', url: s.url ?? '' }
  }
  const m = /^(.*?)\s+fact-check.*?--\s*fact-check:\s*"?(.*?)"?$/s.exec(s.title ?? '')
  return {
    source: m ? m[1] : (s.source ?? 'Source'),
    statement: m ? m[2] : (s.title ?? ''),
    rating: s.rating ?? '',
    url: s.url ?? '',
  }
}

// Turns the backend shape into the shape the UI uses
export function normalizeResult(raw) {
  return {
    verdict: toKey(raw.verdict),
    confidence: raw.confidence,
    classifier: { pred: toKey(raw.classifier_pred), confidence: raw.classifier_confidence },
    rag: { pred: toKey(raw.rag_pred) },
    reasoning: raw.reasoning,
    sources: (raw.sources ?? []).map(normalizeSource),
  }
}

export async function checkClaim(claim) {
  const raw = USE_MOCK ? await mockCheck(claim) : await realCheck(claim)
  return normalizeResult(raw)
}
