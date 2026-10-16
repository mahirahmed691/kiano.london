import assert from 'node:assert/strict'
import test from 'node:test'
import { runInNewContext } from 'node:vm'

import {
  holdBagLine,
  isCheckoutHref,
  nativeMark,
  pieceIdFromHref,
} from './till.ts'

test('holdBagLine adds a new cut and then raises quantity', () => {
  const first = holdBagLine([], 'jubbah-black', 54)
  assert.deepEqual(first, [{ productId: 'jubbah-black', size: 54, quantity: 1 }])
  const second = holdBagLine(first, 'jubbah-black', 54)
  assert.equal(second[0]?.quantity, 2)
})

test('checkout hrefs are the till, not a piece', () => {
  assert.equal(isCheckoutHref('/checkout'), true)
  assert.equal(isCheckoutHref('https://www.kiano.london/checkout'), true)
  assert.equal(isCheckoutHref('/shop/jubbah-black'), false)
  assert.equal(pieceIdFromHref('/shop/jubbah-black?size=54&add=1'), 'jubbah-black')
})

function tillSandbox(overrides: Record<string, unknown> = {}) {
  const store: Record<string, string> = {}
  const localStorage = {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
  }
  const document = {
    documentElement: { classList: { add() {} }, style: { setProperty() {} } },
    addEventListener() {},
  }
  const window = {
    __KIANO_NATIVE: false,
    __KIANO_TILL_CLICK: false,
    location: { pathname: '/', search: '', origin: 'https://www.kiano.london' },
    localStorage,
    document,
    dispatchEvent() {},
    URL,
    URLSearchParams,
    ReactNativeWebView: undefined as { postMessage: (message: string) => void } | undefined,
    ...overrides,
  }
  if (!('document' in overrides)) window.document = document
  if (!('localStorage' in overrides)) window.localStorage = localStorage
  const sandbox = {
    window,
    document: window.document,
    localStorage: window.localStorage,
    URL,
    URLSearchParams,
    JSON,
    Math,
    Number,
    Array,
    Object,
    Event,
  }
  return { store, window, sandbox }
}

test('till boot writes the bag from ?add=1 before React mounts', () => {
  const { store, window, sandbox } = tillSandbox({
    location: { pathname: '/shop/jubbah-black', search: '?size=54&add=1', origin: 'https://www.kiano.london' },
  })
  runInNewContext(`${nativeMark()};`, sandbox)
  assert.equal(window.__KIANO_NATIVE, true)
  assert.deepEqual(JSON.parse(store['kiano.bag'] ?? '[]'), [
    { productId: 'jubbah-black', size: 54, quantity: 1 },
  ])
})

test('till boot posts kiano-checkout when Checkout is tapped in the live bag', () => {
  const messages: string[] = []
  let click: ((event: { target: unknown; preventDefault: () => void; stopPropagation: () => void }) => void) | undefined
  const { window, sandbox } = tillSandbox({
    ReactNativeWebView: { postMessage: (message: string) => messages.push(message) },
  })
  sandbox.document = {
    ...window.document,
    addEventListener(_name: string, handler: typeof click) {
      click = handler
    },
  }
  window.document = sandbox.document
  runInNewContext(`${nativeMark()};`, sandbox)
  const prevent = { called: false }
  click?.({
    target: { tagName: 'A', getAttribute: () => '/checkout', parentNode: window.document },
    preventDefault: () => {
      prevent.called = true
    },
    stopPropagation() {},
  })
  assert.equal(prevent.called, true)
  assert.deepEqual(JSON.parse(messages[0] ?? '{}'), { type: 'kiano-checkout' })
})
