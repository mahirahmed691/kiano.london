import { StatusBar } from 'expo-status-bar'
import * as Linking from 'expo-linking'
import * as Notifications from 'expo-notifications'
import * as SystemUI from 'expo-system-ui'
import Constants from 'expo-constants'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Linking as RNLinking, StyleSheet, View } from 'react-native'
import { WebView, type WebViewMessageEvent, type WebViewNavigation } from 'react-native-webview'

import { HouseChrome, tabFromPath } from './HouseChrome'
import { HouseSplash } from './HouseSplash'
import { pathFromNotificationResponse, registerHousePush } from './HousePush'

const DEFAULT_ORIGIN = 'https://www.kiano.london'

function houseOrigin() {
  const fromEnv = process.env.EXPO_PUBLIC_HOUSE_URL?.trim()
  if (!fromEnv) return DEFAULT_ORIGIN
  return fromEnv.replace(/\/$/, '')
}

function isHouseHost(hostname: string | null | undefined) {
  if (!hostname) return false
  return (
    hostname === 'www.kiano.london' ||
    hostname === 'kiano.london' ||
    hostname === 'localhost' ||
    hostname === '127.0.0.1'
  )
}

function urlForHouse(incoming: string | null) {
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

function shouldOpenOutside(url: string) {
  return url.startsWith('tel:') || url.startsWith('mailto:') || url.startsWith('sms:')
}

function openHousePath(href: string) {
  if (!href.startsWith('/') || href.startsWith('//')) return ''
  return `${houseOrigin()}${href}`
}

function pathOf(url: string) {
  try {
    return new URL(url).pathname || '/'
  } catch {
    return '/'
  }
}

function nativeMark() {
  return `
    window.__KIANO_NATIVE = true;
    try { document.documentElement.classList.add('shell-app'); } catch (e) {}
    window.dispatchEvent(new Event('kiano-native'));
    true;
  `
}

function pushBridge(token: string) {
  const encoded = JSON.stringify(token)
  return `
    window.__KIANO_NATIVE = true;
    window.__KIANO_EXPO_PUSH = ${encoded};
    try { document.documentElement.classList.add('shell-app'); } catch (e) {}
    window.dispatchEvent(new Event('kiano-native'));
    window.dispatchEvent(new Event('kiano-expo-push'));
    true;
  `
}

function goScript(path: string) {
  const encoded = JSON.stringify(path)
  return `
    (function () {
      var path = ${encoded};
      window.__KIANO_NATIVE = true;
      if (window.location.pathname === path) return true;
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo(0, 0);
      true;
    })();
  `
}

function openEvent(name: 'kiano-open-bag' | 'kiano-open-word') {
  return `
    window.dispatchEvent(new Event(${JSON.stringify(name)}));
    true;
  `
}

void SystemUI.setBackgroundColorAsync('#F2EBDC')

export default function App() {
  const [uri, setUri] = useState(houseOrigin)
  const [path, setPath] = useState('/')
  const [houseReady, setHouseReady] = useState(false)
  const [pushToken, setPushToken] = useState('')
  const [bag, setBag] = useState(0)
  const [word, setWord] = useState(0)
  const firstLoad = useRef(true)
  const webView = useRef<WebView>(null)

  useEffect(() => {
    void Linking.getInitialURL().then((url) => {
      const next = urlForHouse(url)
      setUri(next)
      setPath(pathOf(next))
    })
    const subscription = Linking.addEventListener('url', ({ url }) => {
      const next = urlForHouse(url)
      setUri(next)
      setPath(pathOf(next))
    })
    return () => subscription.remove()
  }, [])

  useEffect(() => {
    const opened = pathFromNotificationResponse(Notifications.getLastNotificationResponse())
    if (opened) {
      setUri(openHousePath(opened))
      setPath(opened)
    }

    const listening = Notifications.addNotificationResponseReceivedListener((response) => {
      const href = pathFromNotificationResponse(response)
      if (href) {
        setUri(openHousePath(href))
        setPath(href)
      }
    })
    return () => listening.remove()
  }, [])

  const onNav = useCallback((request: WebViewNavigation) => {
    if (shouldOpenOutside(request.url)) {
      void RNLinking.openURL(request.url)
      return false
    }
    return true
  }, [])

  const onHousePainted = useCallback(() => {
    if (!firstLoad.current) return
    firstLoad.current = false
    setHouseReady(true)
  }, [])

  const onMessage = useCallback((event: WebViewMessageEvent) => {
    let payload: { type?: string; bag?: unknown; word?: unknown }
    try {
      payload = JSON.parse(event.nativeEvent.data) as { type?: string; bag?: unknown; word?: unknown }
    } catch {
      return
    }

    if (payload.type === 'kiano-chrome') {
      setBag(typeof payload.bag === 'number' ? payload.bag : 0)
      setWord(typeof payload.word === 'number' ? payload.word : 0)
      return
    }

    if (payload.type !== 'kiano-request-push') return

    void registerHousePush()
      .then((token) => {
        if (!token) return
        setPushToken(token)
        webView.current?.injectJavaScript(pushBridge(token))
      })
      .catch(() => undefined)
  }, [])

  const go = useCallback(
    (next: string) => {
      setPath(next)
      if (!houseReady) {
        setUri(`${houseOrigin()}${next}`)
        return
      }
      webView.current?.injectJavaScript(goScript(next))
    },
    [houseReady],
  )

  return (
    <View style={styles.shell}>
      <StatusBar style="dark" />
      <View style={styles.status} />
      <WebView
        ref={webView}
        source={{ uri }}
        style={styles.frame}
        originWhitelist={['https://*', 'http://*', 'about:*']}
        onShouldStartLoadWithRequest={onNav}
        onNavigationStateChange={(nav) => {
          if (!nav.url) return
          setPath(pathOf(nav.url))
        }}
        onLoadEnd={onHousePainted}
        onError={onHousePainted}
        onMessage={onMessage}
        injectedJavaScriptBeforeContentLoaded={nativeMark()}
        injectedJavaScript={pushToken ? pushBridge(pushToken) : nativeMark()}
        allowsBackForwardNavigationGestures
        automaticallyAdjustContentInsets={false}
        contentInsetAdjustmentBehavior="never"
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        setSupportMultipleWindows={false}
        decelerationRate="normal"
      />
      <HouseChrome
        path={path}
        tab={tabFromPath(path)}
        bag={bag}
        word={word}
        onHouse={() => go('/')}
        onLine={() => {
          if (tabFromPath(path) === 'line') return
          go('/shop')
        }}
        onShop={() => go('/shop')}
        onCollection={() => go('/collection')}
        onBag={() => webView.current?.injectJavaScript(openEvent('kiano-open-bag'))}
        onAccount={() => go('/account')}
        onWord={() => webView.current?.injectJavaScript(openEvent('kiano-open-word'))}
      />
      <HouseSplash houseReady={houseReady} />
    </View>
  )
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: '#F2EBDC',
  },
  status: {
    height: Constants.statusBarHeight,
    backgroundColor: '#F2EBDC',
  },
  frame: {
    flex: 1,
    backgroundColor: '#F2EBDC',
  },
})
