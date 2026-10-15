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

export function nativeMark() {
  return `
    window.__KIANO_NATIVE = true;
    try {
      var root = document.documentElement;
      root.classList.add('shell-app');
      root.style.setProperty('--header-offset', '0px');
      root.style.setProperty('--app-tab', '0px');
    } catch (e) {}
    window.dispatchEvent(new Event('kiano-native'));
    true;
  `
}

export function pushBridge(token: string) {
  const encoded = JSON.stringify(token)
  return `
    window.__KIANO_NATIVE = true;
    window.__KIANO_EXPO_PUSH = ${encoded};
    try {
      var root = document.documentElement;
      root.classList.add('shell-app');
      root.style.setProperty('--header-offset', '0px');
      root.style.setProperty('--app-tab', '0px');
    } catch (e) {}
    window.dispatchEvent(new Event('kiano-native'));
    window.dispatchEvent(new Event('kiano-expo-push'));
    true;
  `
}

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

export const scrollTopScript = 'window.scrollTo(0, 0); true;'
