const CONSENT_KEY = 'kiano.consent'
const SUBSCRIBE_DISMISS_KEY = 'kiano.letters.dismissed'
const SUBSCRIBED_KEY = 'kiano.letters.joined'
const PATH_COUNT_KEY = 'kiano.letters.paths'

export const consentVersion = 1

export type ConsentChoice = 'all' | 'necessary'

export type StoredConsent = {
  choice: ConsentChoice
  version: number
  at: number
}

export function readConsent(): StoredConsent | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY)
    if (!raw) return null
    const stored = JSON.parse(raw) as StoredConsent
    if (stored.version !== consentVersion) return null
    if (stored.choice !== 'all' && stored.choice !== 'necessary') return null
    return stored
  } catch {
    return null
  }
}

export function writeConsent(choice: ConsentChoice) {
  const stored: StoredConsent = { choice, version: consentVersion, at: Date.now() }
  window.localStorage.setItem(CONSENT_KEY, JSON.stringify(stored))
  window.dispatchEvent(new Event('kiano-consent'))
}

export function clearConsent() {
  window.localStorage.removeItem(CONSENT_KEY)
  window.dispatchEvent(new Event('kiano-consent'))
}

export function lettersDismissed() {
  return window.localStorage.getItem(SUBSCRIBE_DISMISS_KEY) === '1'
}

export function dismissLetters() {
  window.localStorage.setItem(SUBSCRIBE_DISMISS_KEY, '1')
}

export function lettersJoined() {
  return window.localStorage.getItem(SUBSCRIBED_KEY) === '1'
}

export function markLettersJoined() {
  window.localStorage.setItem(SUBSCRIBED_KEY, '1')
  window.localStorage.setItem(SUBSCRIBE_DISMISS_KEY, '1')
}

export function countLetterPath(pathname: string) {
  try {
    const raw = window.sessionStorage.getItem(PATH_COUNT_KEY)
    const paths = raw ? (JSON.parse(raw) as string[]) : []
    if (!paths.includes(pathname)) {
      paths.push(pathname)
      window.sessionStorage.setItem(PATH_COUNT_KEY, JSON.stringify(paths))
    }
    return paths.length
  } catch {
    return 1
  }
}

export const quietLetterPaths = [
  '/checkout',
  '/order/confirmed',
  '/sign-in',
  '/sign-up',
  '/account',
  '/cookies',
  '/privacy',
  '/returns',
  '/letters/confirmed',
]
