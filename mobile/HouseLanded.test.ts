import assert from 'node:assert/strict'
import test from 'node:test'

import { houseLandedCopy } from './HouseLandedCopy.ts'

test('the landed line reads as the house, not as an engineering note', () => {
  assert.equal(houseLandedCopy.kicker, 'Kiano London')
  assert.equal(houseLandedCopy.display, 'A new line has landed.')
  assert.equal(houseLandedCopy.body, 'A short restart applies it.')
  assert.equal(houseLandedCopy.action, 'Restart')
  assert.equal(/OTA|expo|update/i.test(Object.values(houseLandedCopy).join(' ')), false)
})
