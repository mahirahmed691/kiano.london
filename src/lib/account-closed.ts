const CLOSED_KEY = 'kiano.account-closed'

export function accountJustClosed() {
  try {
    return window.sessionStorage.getItem(CLOSED_KEY) === '1'
  } catch {
    return false
  }
}

export function markAccountClosed() {
  try {
    window.sessionStorage.setItem(CLOSED_KEY, '1')
  } catch {
    /* private mode */
  }
}

export function clearClosedMark() {
  try {
    window.sessionStorage.removeItem(CLOSED_KEY)
  } catch {
    /* private mode */
  }
}
