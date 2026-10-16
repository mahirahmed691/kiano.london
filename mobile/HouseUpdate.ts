import { AppState, Platform, type AppStateStatus } from 'react-native'
import * as Updates from 'expo-updates'

import {
  houseUpdateShouldFetch,
  houseUpdateShouldReload,
  type HouseUpdateContext,
} from './HouseUpdatePolicy'

let reloading = false

function context(native = Updates.latestContext): HouseUpdateContext {
  return {
    isDev: __DEV__,
    platform: Platform.OS,
    isEnabled: Updates.isEnabled,
    isUpdatePending: Boolean(native?.isUpdatePending),
    isStartupProcedureRunning: Boolean(native?.isStartupProcedureRunning),
    isChecking: Boolean(native?.isChecking),
    isDownloading: Boolean(native?.isDownloading),
  }
}

export async function restartHouseUpdate() {
  if (reloading || !houseUpdateShouldReload(context())) return
  reloading = true
  try {
    await Updates.reloadAsync()
  } catch {
    reloading = false
  }
}

export async function applyHouseUpdate(onLanded?: () => void) {
  const now = context()
  if (houseUpdateShouldReload(now)) {
    onLanded?.()
    return
  }
  if (!houseUpdateShouldFetch(now)) return

  try {
    const check = await Updates.checkForUpdateAsync()
    if (check.isAvailable || check.isRollBackToEmbedded) {
      await Updates.fetchUpdateAsync()
    }
    if (houseUpdateShouldReload(context())) onLanded?.()
  } catch {
    if (houseUpdateShouldReload(context())) onLanded?.()
  }
}

export function listenHouseUpdate(onLanded?: () => void) {
  const onChange = (state: AppStateStatus) => {
    if (state === 'active') void applyHouseUpdate(onLanded)
  }
  const app = AppState.addEventListener('change', onChange)
  const updates = Updates.addUpdatesStateChangeListener((event) => {
    if (event.context.isUpdatePending) onLanded?.()
  })
  void applyHouseUpdate(onLanded)
  return () => {
    app.remove()
    updates.remove()
  }
}
