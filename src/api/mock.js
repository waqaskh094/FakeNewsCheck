// Dummy data. Each result has the same shape as the backend's check_claim() output,
// plus optional extras (rating / statement / source) that make the evidence cards richer.

const RESULTS = {
  real: {
    verdict: 'real',
    confidence: 0.93,
    classifier_pred: 'real',
    classifier_confidence: 0.91,
    rag_pred: 'real',
    reasoning:
      'The claim is specific, checkable and worded like statements that were later confirmed. Retrieved fact-checks on recent labor statistics were rated True or Mostly True, and the judge found them consistent with this claim. Both checks reached the same verdict.',
    sources: [
      { source: 'PolitiFact', statement: 'Says the unemployment rate has been under 4 percent for the last year.', rating: 'true', url: '' },
      { source: 'PolitiFact', statement: 'Says the economy added jobs every month this year.', rating: 'mostly-true', url: '' },
      { source: 'PolitiFact', statement: 'Says unemployment is at its lowest level in more than a generation.', rating: 'half-true', url: '' },
    ],
  },
  fake: {
    verdict: 'fake',
    confidence: 0.78,
    classifier_pred: 'fake',
    classifier_confidence: 0.84,
    rag_pred: 'not enough evidence',
    reasoning:
      'The classifier reads the wording as a pattern common in false claims: an absolute statement about every state. The retrieved fact-checks cover similar claims and rate them False or Half True, but none addresses this exact statement, so the judge could not confirm it. The arbiter went with the stronger classifier signal and the consistent ratings of related claims.',
    sources: [
      { source: 'PolitiFact', statement: 'Says immigrants in the country illegally are more likely to commit crimes than citizens.', rating: 'false', url: '' },
      { source: 'PolitiFact', statement: 'Says crime rates rose in cities after they limited cooperation with federal agents.', rating: 'half-true', url: '' },
      { source: 'PolitiFact', statement: 'Says most violent crime in the state is committed by people from out of state.', rating: 'mostly-false', url: '' },
    ],
  },
  nee: {
    verdict: 'not enough evidence',
    confidence: 0.41,
    classifier_pred: 'fake',
    classifier_confidence: 0.58,
    rag_pred: 'not enough evidence',
    reasoning:
      'The classifier leans toward Fake, but only slightly, and the claim is a forecast that cannot be checked against past records. The retrieved fact-checks concern health costs in general and none covers a drop of this size. With weak signals on both sides, the arbiter chose not to give a verdict.',
    sources: [
      { source: 'PolitiFact', statement: 'Says health care costs will fall if the new plan passes.', rating: 'half-true', url: '' },
      { source: 'PolitiFact', statement: 'Says premiums have fallen by more than 20 percent in our state.', rating: 'false', url: '' },
      { source: 'PolitiFact', statement: 'Says prescription drug prices will drop sharply next year.', rating: 'half-true', url: '' },
    ],
  },
}

export function buildMock(kind) {
  return structuredClone(RESULTS[kind])
}

function pickKind(claim) {
  const c = claim.toLowerCase()
  if (/unemploy|certified|election results|jobs/.test(c)) return 'real'
  if (/immigra|crime|tax will|raise the price/.test(c)) return 'fake'
  if (/health|forecast|will fall|next year|will /.test(c)) return 'nee'
  // otherwise pick one at random but stable for the same text
  let h = 0
  for (const ch of c) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return ['real', 'fake', 'nee'][h % 3]
}

// Simulates the pipeline: waits a few seconds, then returns a result.
// Type a claim containing the word "error" to see the error state.
export async function mockCheck(claim) {
  await new Promise((r) => setTimeout(r, 3300))
  if (/error/i.test(claim)) throw new Error('Mock failure')
  return buildMock(pickKind(claim))
}
