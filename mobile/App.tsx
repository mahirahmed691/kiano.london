import { StatusBar } from 'expo-status-bar'
import * as Haptics from 'expo-haptics'
import * as Linking from 'expo-linking'
import * as SystemUI from 'expo-system-ui'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BackHandler, Linking as RNLinking, Platform, StyleSheet, View } from 'react-native'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'
import { WebView, type WebViewMessageEvent, type WebViewNavigation } from 'react-native-webview'

import { HouseChrome, quietChrome, tabFromPath, type HouseTab } from './HouseChrome'
import { HouseFailed } from './HouseFailed'
import { HouseSplash } from './HouseSplash'
import { HouseWord } from './HouseWord'
import {
  getProduct,
  isNativeBrowse,
  overlayRoom,
  pieceIdFromPath,
} from './catalogue'
import { useHouseFonts } from './fonts'
import {
  goScript,
  houseOrigin,
  nativeMark,
  openEvent,
  openHousePath,
  pathOf,
  pushBridge,
  scrollTopScript,
  shouldOpenOutside,
  urlForHouse,
} from './house'
import { lastHousePath, listenHousePush, registerHousePush, setHouseBadge } from './HousePush'
import { HouseRoom } from './rooms/HouseRoom'
import { LineRoom } from './rooms/LineRoom'
import { MakingRoom } from './rooms/MakingRoom'
import { PieceRoom } from './rooms/PieceRoom'
import { ScentRoom } from './rooms/ScentRoom'
import { StillsRoom } from './rooms/StillsRoom'
import { StoryRoom } from './rooms/StoryRoom'
import { VisitRoom } from './rooms/VisitRoom'
import { color } from './theme'

void SystemUI.setBackgroundColorAsync(color.ivory)

function overlayStatus(pathname: string) {
  const path = pathname.split('?')[0] || '/'
  return overlayRoom(path)
}

function isAccountPath(pathname: string) {
  const path = pathname.split('?')[0] || '/'
  return (
    path.startsWith('/account') ||
    path.startsWith('/sign-in') ||
    path.startsWith('/sign-up') ||
    path.startsWith('/admin')
  )
}

function HouseApp() {
  const fontsReady = useHouseFonts()
  const insets = useSafeAreaInsets()
  const [uri, setUri] = useState(houseOrigin)
  const [path, setPath] = useState('/')
  const [plateId, setPlateId] = useState('')
  const [webKind, setWebKind] = useState<'hidden' | 'bag' | 'word' | 'account' | 'sheet'>('hidden')
  const [heroOverlay, setHeroOverlay] = useState(true)
  const [failed, setFailed] = useState(false)
  const [pushToken, setPushToken] = useState('')
  const [bag, setBag] = useState(0)
  const [word, setWord] = useState(0)
  const [bagOpen, setBagOpen] = useState(false)
  const [wordOpen, setWordOpen] = useState(false)
  const [roomHeight, setRoomHeight] = useState(640)
  const nativePath = useRef('/')
  const canGoBack = useRef(false)
  const webView = useRef<WebView>(null)

  const rememberNative = useCallback((next: string) => {
    if (isNativeBrowse(next)) nativePath.current = next.split('?')[0] || '/'
  }, [])

  const goNative = useCallback(
    (next: string) => {
      const [pathname, hash] = next.split('#')
      setPath(pathname || '/')
      setPlateId(hash ?? '')
      setWebKind('hidden')
      setBagOpen(false)
      setWordOpen(false)
      rememberNative(pathname || '/')
      setHeroOverlay(overlayRoom(pathname || '/'))
    },
    [rememberNative],
  )

  const webReady = useRef(false)

  const send = useCallback((script: string, fallbackPath?: string) => {
    if (webReady.current) {
      webView.current?.injectJavaScript(script)
      return
    }
    if (fallbackPath) setUri(`${houseOrigin()}${fallbackPath}`)
  }, [])

  const goWeb = useCallback(
    (next: string, kind: 'bag' | 'word' | 'account' | 'sheet') => {
      setPath(next)
      setWebKind(kind)
      send(goScript(next), next)
    },
    [send],
  )

  const open = useCallback(
    (next: string) => {
      const pathname = next.split('#')[0] || '/'
      if (isNativeBrowse(pathname)) {
        goNative(next)
        return
      }
      if (isAccountPath(pathname)) {
        goWeb(pathname, 'account')
        return
      }
      goWeb(pathname, 'sheet')
    },
    [goNative, goWeb],
  )

  const openWeb = useCallback(
    (next: string) => {
      setWebKind('sheet')
      send(goScript(next), next)
    },
    [send],
  )

  useEffect(() => {
    void Linking.getInitialURL().then((url) => {
      const next = urlForHouse(url)
      setUri(next)
      const pathname = pathOf(next)
      if (isNativeBrowse(pathname)) goNative(pathname)
      else open(pathname)
    })
    const subscription = Linking.addEventListener('url', ({ url }) => {
      const next = urlForHouse(url)
      setUri(next)
      const pathname = pathOf(next)
      if (isNativeBrowse(pathname)) goNative(pathname)
      else open(pathname)
    })
    return () => subscription.remove()
  }, [goNative, open])

  useEffect(() => {
    const opened = lastHousePath()
    if (opened) open(opened)
    return listenHousePush((href) => open(href))
  }, [open])

  const onNav = useCallback((request: WebViewNavigation) => {
    if (shouldOpenOutside(request.url)) {
      void RNLinking.openURL(request.url)
      return false
    }
    return true
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
      if (payload.bagOpen !== true && webKind === 'bag') {
        goNative(nativePath.current)
      }
      if (payload.wordOpen !== true && webKind === 'word') {
        goNative(nativePath.current)
      }
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
  }, [goNative, webKind])

  const tap = useCallback((fn: () => void) => {
    void Haptics.selectionAsync().catch(() => undefined)
    fn()
  }, [])

  const webVisible = webKind !== 'hidden' || bagOpen || wordOpen
  const routeTab = tabFromPath(isNativeBrowse(path) ? path : nativePath.current)
  const tab: HouseTab = bagOpen || webKind === 'bag' ? 'bag' : webKind === 'account' || isAccountPath(path) ? 'account' : routeTab
  const hideChrome = quietChrome(path) || wordOpen || webKind === 'word'
  const lightStatus =
    !webVisible && overlayRoom(path) && heroOverlay && !bagOpen && !wordOpen && !hideChrome

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (bagOpen || webKind === 'bag') {
        webView.current?.injectJavaScript(openEvent('kiano-close-bag'))
        goNative(nativePath.current)
        return true
      }
      if (wordOpen || webKind === 'word') {
        webView.current?.injectJavaScript(openEvent('kiano-close-word'))
        goNative(nativePath.current)
        return true
      }
      if (webKind === 'sheet') {
        goNative(nativePath.current)
        return true
      }
      const current = path.split('?')[0] || '/'
      if (current.startsWith('/shop/') || current.startsWith('/collection/')) {
        const piece = getProduct(pieceIdFromPath(current))
        goNative(piece?.cut === 'Jubbah' ? '/shop' : '/collection')
        return true
      }
      if (current.startsWith('/scent/')) {
        goNative('/scent')
        return true
      }
      if (current === '/stills' || current === '/visit' || current === '/story' || current === '/craftsmanship' || current === '/scent') {
        goNative('/')
        return true
      }
      if (canGoBack.current && webVisible) {
        webView.current?.goBack()
        return true
      }
      return false
    })
    return () => sub.remove()
  }, [bagOpen, goNative, path, webKind, webVisible, wordOpen])

  const retry = useCallback(() => {
    setFailed(false)
    webView.current?.reload()
  }, [])

  const nav = useMemo(
    () => ({
      open,
      openWeb,
      roomHeight,
      bottomInset: 0,
      onOverlay: setHeroOverlay,
    }),
    [open, openWeb, roomHeight],
  )

  const room = path.split('?')[0] || '/'
  const pieceId = pieceIdFromPath(room)

  return (
    <View style={styles.shell}>
      <StatusBar style={lightStatus ? 'light' : 'dark'} />
      {lightStatus ? null : webVisible ? null : <View style={[styles.status, { height: insets.top }]} />}
      <View
        style={styles.rooms}
        onLayout={(event) => setRoomHeight(event.nativeEvent.layout.height)}
      >
        {room === '/' ? <HouseRoom {...nav} /> : null}
        {room === '/stills' ? <StillsRoom {...nav} plateId={plateId} /> : null}
        {room === '/shop' ? <LineRoom {...nav} /> : null}
        {room === '/collection' ? <LineRoom {...nav} collection /> : null}
        {room === '/scent' ? <ScentRoom {...nav} /> : null}
        {room.startsWith('/scent/') ? <ScentRoom {...nav} scentId={pieceId} /> : null}
        {room.startsWith('/shop/') || room.startsWith('/collection/') ? (
          <PieceRoom {...nav} pieceId={pieceId} />
        ) : null}
        {room === '/visit' ? <VisitRoom {...nav} /> : null}
        {room === '/story' ? <StoryRoom {...nav} /> : null}
        {room === '/craftsmanship' ? <MakingRoom {...nav} /> : null}
      </View>
      {Platform.OS === 'web' ? null : (
      <WebView
        ref={webView}
        source={{ uri }}
        style={[
          styles.frame,
          webVisible ? styles.frameOn : styles.frameOff,
          { pointerEvents: webVisible ? 'auto' : 'none' },
        ]}
        originWhitelist={['https://*', 'http://*', 'about:*']}
        onShouldStartLoadWithRequest={onNav}
        onNavigationStateChange={(navState) => {
          canGoBack.current = navState.canGoBack
          if (!navState.url || !webVisible) return
          const next = pathOf(navState.url)
          if (isNativeBrowse(next) && webKind === 'sheet') return
          setPath(next)
        }}
        onLoadEnd={() => {
          webReady.current = true
          setFailed(false)
        }}
        onError={() => {
          if (webVisible) setFailed(true)
        }}
        onHttpError={(event) => {
          if (webVisible && event.nativeEvent.statusCode >= 500) setFailed(true)
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
      )}
      {fontsReady && !failed && !hideChrome && !wordOpen ? (
        <HouseWord
          count={word}
          top={insets.top + 8}
          inverted={lightStatus || (webVisible && overlayStatus(path))}
          onPress={() =>
            tap(() => {
              setWebKind('word')
              webView.current?.injectJavaScript(openEvent('kiano-open-word'))
            })
          }
        />
      ) : null}
      {hideChrome ? null : (
        <HouseChrome
          path={isNativeBrowse(path) ? path : nativePath.current}
          tab={tab}
          bag={bag}
          inset={insets.bottom}
          onHouse={() =>
            tap(() => {
              if (bagOpen) webView.current?.injectJavaScript(openEvent('kiano-close-bag'))
              if (wordOpen) webView.current?.injectJavaScript(openEvent('kiano-close-word'))
              if (routeTab === 'house') {
                if (room === '/' || room === '') {
                  goNative('/stills')
                  return
                }
                if (room === '/stills') {
                  return
                }
              }
              goNative('/')
            })
          }
          onLine={() =>
            tap(() => {
              if (bagOpen) webView.current?.injectJavaScript(openEvent('kiano-close-bag'))
              if (wordOpen) webView.current?.injectJavaScript(openEvent('kiano-close-word'))
              if (routeTab === 'line') return
              goNative('/shop')
            })
          }
          onShop={() => tap(() => goNative('/shop'))}
          onCollection={() => tap(() => goNative('/collection'))}
          onScent={() => tap(() => goNative('/scent'))}
          onBag={() =>
            tap(() => {
              if (wordOpen) webView.current?.injectJavaScript(openEvent('kiano-close-word'))
              if (bagOpen || webKind === 'bag') {
                webView.current?.injectJavaScript(openEvent('kiano-close-bag'))
                goNative(nativePath.current)
                return
              }
              setWebKind('bag')
              webView.current?.injectJavaScript(openEvent('kiano-open-bag'))
            })
          }
          onAccount={() =>
            tap(() => {
              if (bagOpen) webView.current?.injectJavaScript(openEvent('kiano-close-bag'))
              if (wordOpen) webView.current?.injectJavaScript(openEvent('kiano-close-word'))
              if (tab === 'account') {
                webView.current?.injectJavaScript(scrollTopScript)
                return
              }
              goWeb('/account', 'account')
            })
          }
        />
      )}
      {failed && webVisible ? <HouseFailed onRetry={retry} /> : null}
      <HouseSplash houseReady={fontsReady} />
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
    backgroundColor: color.night,
  },
  rooms: {
    flex: 1,
    backgroundColor: color.night,
  },
  frame: {
    backgroundColor: color.ivory,
  },
  frameOn: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 8,
  },
  frameOff: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
    left: 0,
    top: 0,
  },
  status: {
    backgroundColor: color.ivory,
  },
})
