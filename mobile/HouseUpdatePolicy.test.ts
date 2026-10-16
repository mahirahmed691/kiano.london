import assert from 'node:assert/strict'
import test from 'node:test'

import {
  houseUpdateCanRun,
  houseUpdateShouldFetch,
  houseUpdateShouldReload,
  type HouseUpdateContext,
} from './HouseUpdatePolicy.ts'

const live: HouseUpdateContext = {
  isDev: false,
  platform: 'ios',
  isEnabled: true,
  isUpdatePending: false,
  isStartupProcedureRunning: false,
  isChecking: false,
  isDownloading: false,
}

test('a production iOS binary can take an update', () => {
  assert.equal(houseUpdateCanRun(live), true)
})

test('dev, web, and a disabled module never take an update', () => {
  assert.equal(houseUpdateCanRun({ ...live, isDev: true }), false)
  assert.equal(houseUpdateCanRun({ ...live, platform: 'web' }), false)
  assert.equal(houseUpdateCanRun({ ...live, isEnabled: false }), false)
})

function oldApply(checkIsAvailable: boolean, fetchedIsNew: boolean) {
  if (!checkIsAvailable) return false
  return fetchedIsNew
}

test('a waiting download is ready to apply, and does not need another fetch first', () => {
  const pending = { ...live, isUpdatePending: true }
  assert.equal(houseUpdateShouldReload(pending), true)
  assert.equal(houseUpdateShouldReload(live), false)
  assert.equal(houseUpdateShouldFetch(pending), true)
})

test('the old isAvailable/isNew gate never reloads a pending ON_LOAD download', () => {
  assert.equal(oldApply(false, false), false)
  assert.equal(oldApply(true, false), false)
  assert.equal(houseUpdateShouldReload({ ...live, isUpdatePending: true }), true)
})

test('do not start a second fetch while native is still checking or downloading', () => {
  assert.equal(houseUpdateShouldFetch(live), true)
  assert.equal(houseUpdateShouldFetch({ ...live, isStartupProcedureRunning: true }), false)
  assert.equal(houseUpdateShouldFetch({ ...live, isChecking: true }), false)
  assert.equal(houseUpdateShouldFetch({ ...live, isDownloading: true }), false)
  assert.equal(houseUpdateShouldFetch({ ...live, isDev: true }), false)
})
