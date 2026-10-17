import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { houseLandedCopy, houseLandedHoldMs, houseUpdateRecheckMs } from './HouseLandedCopy.ts'

test('the landed line reads as the house, not as an engineering note', () => {
  assert.equal(houseLandedCopy.kicker, 'Kiano London')
  assert.equal(houseLandedCopy.display, 'A new line has landed.')
  assert.equal(houseLandedCopy.body, 'A short restart applies it.')
  assert.equal(houseLandedCopy.action, 'Restart')
  assert.equal(/OTA|expo|update/i.test(Object.values(houseLandedCopy).join(' ')), false)
})

test('the plate holds long enough to be read, then the house keeps upgrading', () => {
  assert.equal(houseLandedHoldMs, 4800)
  assert.ok(houseUpdateRecheckMs >= 10 * 60 * 1000)
})

test('the landed line is a house night plate, not an engineering note', () => {
  const source = readFileSync(new URL('./HouseLanded.tsx', import.meta.url), 'utf8')
  assert.match(source, /absoluteFillObject/)
  assert.match(source, /zIndex: 21/)
  assert.match(source, /color\.night/)
  assert.match(source, /HouseLockup/)
  assert.match(source, /fontSize: 48/)
  assert.equal(/OTA|expo-updates/i.test(source), false)
})
