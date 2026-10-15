import { AppState, Platform, type AppStateStatus } from 'react-native'
import * as Updates from 'expo-updates'

let applying = false

export async function applyHouseUpdate() {
  if (__DEV__ || Platform.OS === 'web') return
  if (!Updates.isEnabled || applying) return

  applying = true
  try {
    const check = await Updates.checkForUpdateAsync()
    if (!check.isAvailable) return
    const fetched = await Updates.fetchUpdateAsync()
    if (fetched.isNew) await Updates.reloadAsync()
  } catch {
    // Stay on the bundle we have.
  } finally {
    applying = false
  }
}

export function listenHouseUpdate() {
  const onChange = (state: AppStateStatus) => {
    if (state === 'active') void applyHouseUpdate()
  }
  const sub = AppState.addEventListener('change', onChange)
  void applyHouseUpdate()
  return () => sub.remove()
}
