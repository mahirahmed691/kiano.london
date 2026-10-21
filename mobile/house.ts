import * as Linking from 'expo-linking'

const DEFAULT_ORIGIN = 'https://www.kiano.london'

export function houseOrigin() {
  const fromEnv = process.env.EXPO_PUBLIC_HOUSE_URL?.trim()
  if (!fromEnv) return DEFAULT_ORIGIN
  return fromEnv.replace(/\/$/, '')
}

export function isHouseHost(hostname: string | null | undefined) {
  if (!hostname) return false
  return (
    hostname === 'www.kiano.london' ||
    hostname === 'kiano.london' ||
    hostname === 'localhost' ||
    hostname === '127.0.0.1'
  )
}

export function pathOf(url: string) {
  try {
    const parsed = new URL(url)
    return `${parsed.pathname || '/'}${parsed.search}`
  } catch {
    return '/'
  }
}

export function hashOf(url: string) {
  try {
    return new URL(url).hash.replace(/^#/, '')
  } catch {
    return ''
  }
}

export function mediaUrl(src: string) {
  if (src.startsWith('http://') || src.startsWith('https://')) return src
  return `${houseOrigin()}${src}`
}

export function urlForHouse(incoming: string | null) {
  const origin = houseOrigin()
  if (!incoming) return origin

  const parsed = Linking.parse(incoming)
  if (parsed.scheme === 'kiano') {
    const host = parsed.hostname?.replace(/^\/+/, '') ?? ''
    const path = (parsed.path ?? '').replace(/^\/+/, '')
    const route = [host, path].filter(Boolean).join('/')
    if (!route) return origin
    return `${origin}/${route}`
  }

  if (isHouseHost(parsed.hostname)) {
    return incoming
  }

  return origin
}

export function openHousePath(href: string) {
  if (!href.startsWith('/') || href.startsWith('//')) return ''
  return `${houseOrigin()}${href}`
}

export function shouldOpenOutside(url: string) {
  return url.startsWith('tel:') || url.startsWith('mailto:') || url.startsWith('sms:')
}

export function isStripeUrl(url: string) {
  try {
    return new URL(url).hostname.includes('stripe.com')
  } catch {
    return false
  }
}

export function isTillPath(pathname: string) {
  const path = pathname.split('?')[0] || '/'
  return (
    path.startsWith('/checkout') ||
    path.startsWith('/order') ||
    path.startsWith('/sign-in') ||
    path.startsWith('/sign-up') ||
    path.startsWith('/returns') ||
    path.startsWith('/reservation') ||
    path.startsWith('/letters')
  )
}

export {
  addToBagScript,
  holdBagLine,
  holdBagScript,
  houseTillPad,
  isCheckoutHref,
  isRoomEscapePath,
  isTillSurface,
  nativeMark,
  openTillScript,
  pieceIdFromHref,
  pushBridge,
  shouldLeaveTill,
  type BagLine,
} from './till'

export function goScript(path: string) {
  const encoded = JSON.stringify(path)
  return `
    (function () {
      var path = ${encoded};
      window.__KIANO_NATIVE = true;
      if (window.location.pathname + window.location.search === path || window.location.pathname === path) {
        window.scrollTo(0, 0);
        return true;
      }
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo(0, 0);
      true;
    })();
  `
}

export function openEvent(name: 'kiano-open-bag' | 'kiano-open-word' | 'kiano-close-bag' | 'kiano-close-word') {
  return `
    window.dispatchEvent(new Event(${JSON.stringify(name)}));
    true;
  `
}
