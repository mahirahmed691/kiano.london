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

test('reload when a download is already waiting, even if the server has nothing new', () => {
  const pending = { ...live, isUpdatePending: true }
  assert.equal(houseUpdateShouldReload(pending), true)
  assert.equal(houseUpdateShouldReload(live), false)
})

test('do not start a second fetch while native is still checking or downloading', () => {
  assert.equal(houseUpdateShouldFetch(live), true)
  assert.equal(houseUpdateShouldFetch({ ...live, isStartupProcedureRunning: true }), false)
  assert.equal(houseUpdateShouldFetch({ ...live, isChecking: true }), false)
  assert.equal(houseUpdateShouldFetch({ ...live, isDownloading: true }), false)
  assert.equal(houseUpdateShouldFetch({ ...live, isDev: true }), false)
})
