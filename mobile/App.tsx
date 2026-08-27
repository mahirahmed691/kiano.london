import { StatusBar } from 'expo-status-bar'
import * as Haptics from 'expo-haptics'
import * as Linking from 'expo-linking'
import * as Notifications from 'expo-notifications'
import * as SystemUI from 'expo-system-ui'
import { useCallback, useEffect, useRef, useState } from 'react'
import { BackHandler, Linking as RNLinking, Platform, StyleSheet, View } from 'react-native'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'
import { WebView, type WebViewMessageEvent, type WebViewNavigation } from 'react-native-webview'

import { HouseChrome, quietChrome, tabFromPath, type HouseTab } from './HouseChrome'
import { HouseFailed } from './HouseFailed'
import { HouseSplash } from './HouseSplash'
import { HouseWord } from './HouseWord'
import { pathFromNotificationResponse, registerHousePush, setHouseBadge } from './HousePush'

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

function overlayStatus(pathname: string) {
  return (
    pathname === '/' ||
    pathname === '/story' ||
    pathname.startsWith('/craftsmanship')
  )
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
      if (window.location.pathname === path) {
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

function openEvent(name: 'kiano-open-bag' | 'kiano-open-word' | 'kiano-close-bag' | 'kiano-close-word') {
  return `
    window.dispatchEvent(new Event(${JSON.stringify(name)}));
    true;
  `
}

const scrollTopScript = 'window.scrollTo(0, 0); true;'

void SystemUI.setBackgroundColorAsync('#F2EBDC')

function HouseApp() {
  const insets = useSafeAreaInsets()
  const [uri, setUri] = useState(houseOrigin)
  const [path, setPath] = useState('/')
  const [houseReady, setHouseReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [pushToken, setPushToken] = useState('')
  const [bag, setBag] = useState(0)
  const [word, setWord] = useState(0)
  const [bagOpen, setBagOpen] = useState(false)
  const [wordOpen, setWordOpen] = useState(false)
  const firstLoad = useRef(true)
  const canGoBack = useRef(false)
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
    let payload: {
      type?: string
      bag?: unknown
      word?: unknown
      bagOpen?: unknown
      wordOpen?: unknown
    }
    try {
      payload = JSON.parse(event.nativeEvent.data) as {
        type?: string
        bag?: unknown
        word?: unknown
        bagOpen?: unknown
        wordOpen?: unknown
      }
    } catch {
      return
    }

    if (payload.type === 'kiano-chrome') {
      const nextBag = typeof payload.bag === 'number' ? payload.bag : 0
      const nextWord = typeof payload.word === 'number' ? payload.word : 0
      setBag(nextBag)
      setWord(nextWord)
      setBagOpen(payload.bagOpen === true)
      setWordOpen(payload.wordOpen === true)
      void setHouseBadge(nextWord)
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

  const tap = useCallback((fn: () => void) => {
    void Haptics.selectionAsync().catch(() => undefined)
    fn()
  }, [])

  const routeTab = tabFromPath(path)
  const tab: HouseTab = bagOpen ? 'bag' : routeTab
  const hideChrome = quietChrome(path)
  const lightStatus = overlayStatus(path) && !bagOpen && !wordOpen && !hideChrome

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (bagOpen) {
        webView.current?.injectJavaScript(openEvent('kiano-close-bag'))
        return true
      }
      if (wordOpen) {
        webView.current?.injectJavaScript(openEvent('kiano-close-word'))
        return true
      }
      if (canGoBack.current) {
        webView.current?.goBack()
        return true
      }
      return false
    })
    return () => sub.remove()
  }, [bagOpen, wordOpen])

  const retry = useCallback(() => {
    setFailed(false)
    firstLoad.current = true
    setHouseReady(false)
    webView.current?.reload()
  }, [])

  return (
    <View style={styles.shell}>
      <StatusBar style={lightStatus ? 'light' : 'dark'} />
      {lightStatus ? null : <View style={[styles.status, { height: insets.top }]} />}
      <WebView
        ref={webView}
        source={{ uri }}
        style={styles.frame}
        originWhitelist={['https://*', 'http://*', 'about:*']}
        onShouldStartLoadWithRequest={onNav}
        onNavigationStateChange={(nav) => {
          canGoBack.current = nav.canGoBack
          if (!nav.url) return
          setPath(pathOf(nav.url))
        }}
        onLoadEnd={() => {
          setFailed(false)
          onHousePainted()
        }}
        onError={() => {
          onHousePainted()
          setFailed(true)
        }}
        onHttpError={(event) => {
          if (event.nativeEvent.statusCode >= 500) setFailed(true)
        }}
        onMessage={onMessage}
        injectedJavaScriptBeforeContentLoaded={nativeMark()}
        injectedJavaScript={pushToken ? pushBridge(pushToken) : nativeMark()}
        allowsBackForwardNavigationGestures
        automaticallyAdjustContentInsets={false}
        contentInsetAdjustmentBehavior="never"
        pullToRefreshEnabled={Platform.OS === 'ios'}
        overScrollMode="never"
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        setSupportMultipleWindows={false}
        decelerationRate="normal"
      />
      {houseReady && !failed && !hideChrome && !wordOpen && !bagOpen ? (
        <HouseWord
          count={word}
          top={insets.top + 8}
          inverted={lightStatus}
          onPress={() =>
            tap(() => {
              webView.current?.injectJavaScript(openEvent('kiano-open-word'))
            })
          }
        />
      ) : null}
      {hideChrome ? null : (
        <HouseChrome
          path={path}
          tab={tab}
          bag={bag}
          inset={insets.bottom}
          onHouse={() =>
            tap(() => {
              if (bagOpen) webView.current?.injectJavaScript(openEvent('kiano-close-bag'))
              if (wordOpen) webView.current?.injectJavaScript(openEvent('kiano-close-word'))
              if (routeTab === 'house') {
                webView.current?.injectJavaScript(scrollTopScript)
                return
              }
              go('/')
            })
          }
          onLine={() =>
            tap(() => {
              if (bagOpen) webView.current?.injectJavaScript(openEvent('kiano-close-bag'))
              if (wordOpen) webView.current?.injectJavaScript(openEvent('kiano-close-word'))
              if (routeTab === 'line') {
                webView.current?.injectJavaScript(scrollTopScript)
                return
              }
              go('/shop')
            })
          }
          onShop={() => tap(() => go('/shop'))}
          onCollection={() => tap(() => go('/collection'))}
          onBag={() =>
            tap(() => {
              if (wordOpen) webView.current?.injectJavaScript(openEvent('kiano-close-word'))
              webView.current?.injectJavaScript(
                openEvent(bagOpen ? 'kiano-close-bag' : 'kiano-open-bag'),
              )
            })
          }
          onAccount={() =>
            tap(() => {
              if (bagOpen) webView.current?.injectJavaScript(openEvent('kiano-close-bag'))
              if (wordOpen) webView.current?.injectJavaScript(openEvent('kiano-close-word'))
              if (routeTab === 'account') {
                webView.current?.injectJavaScript(scrollTopScript)
                return
              }
              go('/account')
            })
          }
        />
      )}
      {failed ? <HouseFailed onRetry={retry} /> : null}
      <HouseSplash houseReady={houseReady} />
    </View>
  )
}

export default function App() {
  return (
    <SafeAreaProvider>
      <HouseApp />
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: '#F2EBDC',
  },
  frame: {
    flex: 1,
    backgroundColor: '#F2EBDC',
  },
  status: {
    backgroundColor: '#F2EBDC',
  },
})
