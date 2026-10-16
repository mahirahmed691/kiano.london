import assert from 'node:assert/strict'
import test from 'node:test'
import { runInNewContext } from 'node:vm'

import {
  holdBagLine,
  holdBagScript,
  houseTillPad,
  isCheckoutHref,
  isRoomEscapePath,
  isTillSurface,
  nativeMark,
  openTillScript,
  pieceIdFromHref,
  shouldLeaveTill,
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

test('till surfaces include account, and room escapes skip the visit form', () => {
  assert.equal(isTillSurface('/checkout'), true)
  assert.equal(isTillSurface('/account'), true)
  assert.equal(isTillSurface('/shop/jubbah-black'), false)
  assert.equal(isRoomEscapePath('/shop'), true)
  assert.equal(isRoomEscapePath('/collection/jubbah-black'), true)
  assert.equal(isRoomEscapePath('/visit'), false)
  assert.equal(isRoomEscapePath('/returns'), false)
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
    __KIANO_TILL_HISTORY: false,
    location: { pathname: '/', search: '', origin: 'https://www.kiano.london' },
    localStorage,
    sessionStorage: {
      getItem: () => null,
      setItem() {},
    },
    history: {
      pushState() {},
      replaceState() {},
    },
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
    Date,
    Array,
    Object,
    Event,
  }
  return { store, window, sandbox }
}

test('till boot gives reading pages air under the mark, and keeps the bag full-bleed', () => {
  const mark = nativeMark()
  assert.equal(houseTillPad, '3.5rem')
  assert.match(mark, /--header-offset', '3\.5rem'/)
  assert.match(mark, /shell-sheet\{top:0/)
  assert.match(mark, /\[class\*="pt-32"\]/)
})

test('till boot writes necessary consent so the cookie strip cannot sit on the till', () => {
  const { store, window, sandbox } = tillSandbox()
  runInNewContext(`${nativeMark()};`, sandbox)
  assert.equal(window.__KIANO_NATIVE, true)
  const consent = JSON.parse(store['kiano.consent'] ?? '{}')
  assert.equal(consent.choice, 'necessary')
  assert.equal(consent.version, 1)
  assert.equal(store['kiano.letters.dismissed'], '1')
})

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

function tillClick(
  pathname: string,
  href: string,
): { messages: string[]; prevented: boolean } {
  const messages: string[] = []
  let click: ((event: { target: unknown; preventDefault: () => void; stopPropagation: () => void }) => void) | undefined
  const { window, sandbox } = tillSandbox({
    location: { pathname, search: '', origin: 'https://www.kiano.london' },
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
    target: { tagName: 'A', getAttribute: () => href, parentNode: window.document },
    preventDefault: () => {
      prevent.called = true
    },
    stopPropagation() {},
  })
  return { messages, prevented: prevent.called }
}

test('Continue looking from checkout returns to the native shop', () => {
  const { messages, prevented } = tillClick('/checkout', '/shop')
  assert.equal(prevented, true)
  assert.deepEqual(JSON.parse(messages[0] ?? '{}'), { type: 'kiano-open', path: '/shop' })
})

test('the visit form on the order sheet is left in the till', () => {
  const { messages, prevented } = tillClick('/order/confirmed', '/visit')
  assert.equal(prevented, false)
  assert.equal(messages.length, 0)
})

test('The Shop from the bag on a piece does not steal the native room', () => {
  const { messages, prevented } = tillClick('/shop/jubbah-black', '/shop')
  assert.equal(prevented, false)
  assert.equal(messages.length, 0)
})

test('a shop URL while the till is still opening does not pull the sheet down', () => {
  assert.equal(
    shouldLeaveTill('/shop/jubbah-black?size=54&add=1', { tillReady: false, webKind: 'sheet' }),
    false,
  )
})

test('Continue looking after checkout has landed returns to the shop', () => {
  assert.equal(shouldLeaveTill('/shop', { tillReady: true, webKind: 'sheet' }), true)
})

test('the bag and the word keep the webview even after the till has landed', () => {
  assert.equal(shouldLeaveTill('/shop', { tillReady: true, webKind: 'bag' }), false)
  assert.equal(shouldLeaveTill('/shop', { tillReady: true, webKind: 'word' }), false)
})

test('checkout and the order sheet stay in the till', () => {
  assert.equal(shouldLeaveTill('/checkout', { tillReady: true, webKind: 'sheet' }), false)
  assert.equal(
    shouldLeaveTill('/order/confirmed?session_id=cs_test', { tillReady: true, webKind: 'sheet' }),
    false,
  )
})

test('the visit form is not stolen from the order sheet', () => {
  assert.equal(shouldLeaveTill('/visit', { tillReady: true, webKind: 'sheet' }), false)
})

test('opening the till assigns checkout instead of a silent history push', () => {
  const script = openTillScript('/checkout')
  assert.match(script, /"\/checkout"/)
  assert.match(script, /location\.assign\(path\)/)
  assert.match(script, /kiano-close-bag/)
})

test('holding a cut writes the bag then replaces so the live till can read it', () => {
  const script = holdBagScript('jubbah-black', 54, 'https://www.kiano.london/shop/jubbah-black?size=54')
  assert.match(script, /kiano\.bag/)
  assert.match(script, /jubbah-black/)
  assert.match(script, /location\.replace\("https:\/\/www\.kiano\.london\/shop\/jubbah-black\?size=54"\)/)
})

test('a live history push to checkout posts kiano-checkout', () => {
  const messages: string[] = []
  const calls: unknown[][] = []
  const { window, sandbox } = tillSandbox({
    ReactNativeWebView: { postMessage: (message: string) => messages.push(message) },
  })
  const history = {
    pushState(...args: unknown[]) {
      calls.push(args)
    },
    replaceState() {},
  }
  window.history = history
  sandbox.window.history = history
  runInNewContext(`${nativeMark()};`, sandbox)
  window.history.pushState({}, '', '/checkout')
  assert.equal(calls.length, 1)
  assert.deepEqual(JSON.parse(messages[0] ?? '{}'), { type: 'kiano-checkout' })
})
