import { StatusBar } from 'expo-status-bar'
import * as Haptics from 'expo-haptics'
import * as Linking from 'expo-linking'
import * as SystemUI from 'expo-system-ui'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BackHandler, Linking as RNLinking, Platform, StyleSheet, useWindowDimensions, View } from 'react-native'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'
import { WebView, type WebViewMessageEvent, type WebViewNavigation } from 'react-native-webview'

import { HouseChrome, tabFromPath, type HouseTab } from './HouseChrome'
import { HouseFailed } from './HouseFailed'
import { HouseHeader } from './HouseHeader'
import { HouseMenu } from './HouseMenu'
import { HouseSplash } from './HouseSplash'
import {
  getProduct,
  isNativeBrowse,
  overlayRoom,
  pieceIdFromPath,
  productPath,
} from './catalogue'
import { useHouseFonts } from './fonts'
import {
  goScript,
  houseOrigin,
  isStripeUrl,
  isTillPath,
  nativeMark,
  openEvent,
  pathOf,
  pushBridge,
  shouldOpenOutside,
  urlForHouse,
} from './house'
import { lastHousePath, listenHousePush, registerHousePush, setHouseBadge } from './HousePush'
import { listenHouseUpdate } from './HouseUpdate'
import { HouseRoom } from './rooms/HouseRoom'
import { LineRoom } from './rooms/LineRoom'
import { MakingDetailsRoom } from './rooms/MakingDetailsRoom'
import { MakingRoom } from './rooms/MakingRoom'
import { PieceRoom } from './rooms/PieceRoom'
import { ScentRoom } from './rooms/ScentRoom'
import { StillsRoom } from './rooms/StillsRoom'
import { StoryRoom } from './rooms/StoryRoom'
import { VisitRoom } from './rooms/VisitRoom'
import { color } from './theme'

void SystemUI.setBackgroundColorAsync(color.night)


function isAccountPath(pathname: string) {
  const path = pathname.split('?')[0] || '/'
  return (
    path.startsWith('/account') ||
    path.startsWith('/sign-in') ||
    path.startsWith('/sign-up') ||
    path.startsWith('/admin')
  )
}

function roomPath(pathname: string) {
  return pathname.split('?')[0] || '/'
}

function isRootRoom(pathname: string) {
  const path = roomPath(pathname)
  return path === '/' || path === '/shop' || path === '/collection' || path === '/scent'
}

function parentRoom(pathname: string) {
  const path = roomPath(pathname)
  if (path.startsWith('/shop/')) return '/shop'
  if (path.startsWith('/collection/')) return '/collection'
  if (path.startsWith('/scent/')) return '/scent'
  if (path === '/craftsmanship-details') return '/craftsmanship'
  return '/'
}

function HouseApp() {
  const fontsReady = useHouseFonts()
  const insets = useSafeAreaInsets()
  const { height: windowHeight } = useWindowDimensions()
  const [uri, setUri] = useState(houseOrigin)
  const [path, setPath] = useState('/')
  const [plateId, setPlateId] = useState('')
  const [webKind, setWebKind] = useState<'hidden' | 'bag' | 'word' | 'account' | 'sheet'>('hidden')
  const [, setHeroOverlay] = useState(true)
  const [failed, setFailed] = useState(false)
  const [pushToken, setPushToken] = useState('')
  const [bag, setBag] = useState(0)
  const [word, setWord] = useState(0)
  const [bagOpen, setBagOpen] = useState(false)
  const [wordOpen, setWordOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [headerHeight, setHeaderHeight] = useState(120)
  const [chromeHeight, setChromeHeight] = useState(92)
  const [onStripe, setOnStripe] = useState(false)
  const hideHeader = wordOpen || webKind === 'word' || onStripe
  const hideTabs = hideHeader || isTillPath(path)
  const topChrome = hideHeader ? 0 : headerHeight
  const tabChrome = hideTabs ? 0 : chromeHeight
  const wellHeight = Math.max(1, windowHeight - topChrome)
  const roomHeight = wellHeight
  const nativePath = useRef('/')
  const pendingBag = useRef('')
  const tillHold = useRef(false)
  const webKindRef = useRef(webKind)
  const webView = useRef<WebView>(null)

  useEffect(() => {
    webKindRef.current = webKind
  }, [webKind])

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
      setMenuOpen(false)
      setOnStripe(false)
      tillHold.current = false
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
      setMenuOpen(false)
      if (Platform.OS === 'web') {
        void Linking.openURL(`${houseOrigin()}${next}`)
        return
      }
      setPath(next)
      setWebKind(kind)
      setOnStripe(false)
      if (kind === 'sheet' && isTillPath(next)) tillHold.current = true
      if (kind === 'account' || kind === 'sheet') {
        setUri(`${houseOrigin()}${next}`)
      }
      send(goScript(next), next)
    },
    [send],
  )

  const revealWord = useCallback(() => {
    setMenuOpen(false)
    if (Platform.OS === 'web') {
      void Linking.openURL(houseOrigin())
      return
    }
    setWebKind('word')
    webView.current?.injectJavaScript(openEvent('kiano-open-word'))
  }, [])

  const revealBag = useCallback(() => {
    setMenuOpen(false)
    if (Platform.OS === 'web') {
      void Linking.openURL(houseOrigin())
      return
    }
    if (wordOpen) webView.current?.injectJavaScript(openEvent('kiano-close-word'))
    setWebKind('bag')
    webView.current?.injectJavaScript(openEvent('kiano-open-bag'))
  }, [wordOpen])

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
      goWeb(next, 'sheet')
    },
    [goWeb],
  )

  const addToBag = useCallback(
    (productId: string, size: number) => {
      const piece = getProduct(productId)
      const href = `${piece ? productPath(piece) : `/shop/${productId}`}?size=${size}&add=1`
      if (Platform.OS === 'web') {
        void Linking.openURL(`${houseOrigin()}${href}`)
        return
      }
      setMenuOpen(false)
      setPath(href)
      setWebKind('bag')
      pendingBag.current = href
      setUri(`${houseOrigin()}${href}&t=${Date.now()}`)
    },
    [],
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

  useEffect(() => listenHouseUpdate(), [])

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
      path?: unknown
    }
    try {
      payload = JSON.parse(event.nativeEvent.data) as {
        type?: string
        bag?: unknown
        word?: unknown
        bagOpen?: unknown
        wordOpen?: unknown
        path?: unknown
      }
    } catch {
      return
    }

    if (payload.type === 'kiano-checkout') {
      tillHold.current = true
      goWeb('/checkout', 'sheet')
      return
    }

    if (payload.type === 'kiano-chrome') {
      const nextBag = typeof payload.bag === 'number' ? payload.bag : 0
      const nextWord = typeof payload.word === 'number' ? payload.word : 0
      const href = typeof payload.path === 'string' ? payload.path : ''
      setBag(nextBag)
      setWord(nextWord)
      setBagOpen(payload.bagOpen === true)
      setWordOpen(payload.wordOpen === true)
      void setHouseBadge(nextWord)
      if (payload.bagOpen !== true && webKindRef.current === 'bag') {
        if (tillHold.current || isTillPath(href) || isAccountPath(href)) {
          setPath(tillHold.current ? '/checkout' : href)
          setWebKind(isAccountPath(href) ? 'account' : 'sheet')
          return
        }
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
  }, [goNative, goWeb, webKind])

  const tap = useCallback((fn: () => void) => {
    void Haptics.selectionAsync().catch(() => undefined)
    fn()
  }, [])

  const webVisible = webKind !== 'hidden' || bagOpen || wordOpen
  const routeTab = tabFromPath(isNativeBrowse(path) ? path : nativePath.current)
  const tab: HouseTab = bagOpen || webKind === 'bag' ? 'bag' : webKind === 'account' || isAccountPath(path) ? 'account' : routeTab
  const lightStatus = !hideHeader
  const canBack = webVisible || (isNativeBrowse(path) && !isRootRoom(path))

  const back = useCallback(() => {
    if (menuOpen) {
      setMenuOpen(false)
      return
    }
    if (onStripe || isTillPath(path)) {
      goNative(nativePath.current)
      return
    }
    if (bagOpen || webKind === 'bag') {
      webView.current?.injectJavaScript(openEvent('kiano-close-bag'))
      goNative(nativePath.current)
      return
    }
    if (wordOpen || webKind === 'word') {
      webView.current?.injectJavaScript(openEvent('kiano-close-word'))
      goNative(nativePath.current)
      return
    }
    if (webKind === 'account') {
      goNative(nativePath.current)
      return
    }
    if (webKind === 'sheet') {
      goNative(nativePath.current)
      return
    }
    if (isNativeBrowse(path) && !isRootRoom(path)) {
      goNative(parentRoom(path))
    }
  }, [bagOpen, goNative, menuOpen, onStripe, path, webKind, wordOpen])

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!canBack && !menuOpen) return false
      back()
      return true
    })
    return () => sub.remove()
  }, [back, canBack, menuOpen])

  const retry = useCallback(() => {
    setFailed(false)
    webView.current?.reload()
  }, [])

  const nav = useMemo(
    () => ({
      open,
      openWeb,
      addToBag,
      roomHeight,
      bottomInset: hideTabs ? insets.bottom : chromeHeight,
      onOverlay: setHeroOverlay,
    }),
    [addToBag, chromeHeight, hideTabs, insets.bottom, open, openWeb, roomHeight],
  )

  const room = roomPath(isNativeBrowse(path) ? path : nativePath.current)
  const pieceId = pieceIdFromPath(room)

  return (
    <View style={styles.shell}>
      <StatusBar style={lightStatus ? 'light' : 'dark'} />
      {hideHeader && !lightStatus && !webVisible ? <View style={[styles.status, { height: insets.top }]} /> : null}
      <View style={[styles.rooms, { top: topChrome, height: wellHeight }]}>
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
        {room === '/craftsmanship-details' ? <MakingDetailsRoom {...nav} /> : null}
      </View>
      {Platform.OS === 'web' ? null : (
      <View
        pointerEvents={webVisible ? 'auto' : 'none'}
        collapsable={false}
        testID="house-till"
        style={[
          styles.frame,
          {
            top: topChrome,
            height: Math.max(1, windowHeight - topChrome - tabChrome),
            zIndex: webVisible ? 8 : 0,
            transform: [{ translateX: webVisible ? 0 : 4000 }],
          },
        ]}
      >
        <WebView
          ref={webView}
          source={{ uri }}
          scrollEnabled
          style={styles.till}
          originWhitelist={['https://*', 'http://*', 'about:*']}
          onShouldStartLoadWithRequest={onNav}
          onNavigationStateChange={(navState) => {
            if (!navState.url) return
            if (isStripeUrl(navState.url)) {
              setOnStripe(true)
              return
            }
            setOnStripe(false)
            if (!webVisible) return
            const next = pathOf(navState.url)
            if (isNativeBrowse(next) && isTillPath(path) && webKind !== 'bag' && webKind !== 'word') {
              goNative(next)
              return
            }
            setPath(next)
          }}
          onLoadEnd={() => {
            webReady.current = true
            setFailed(false)
            if (pendingBag.current) {
              webView.current?.injectJavaScript(openEvent('kiano-open-bag'))
              pendingBag.current = ''
            }
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
          setSupportMultipleWindows
          onOpenWindow={(event) => {
            const target = event.nativeEvent.targetUrl
            if (target) setUri(target)
          }}
          decelerationRate="normal"
        />
      </View>
      )}
      {fontsReady && !failed && !hideHeader ? (
        <>
          <HouseMenu
            open={menuOpen}
            path={isNativeBrowse(path) ? path : nativePath.current}
            bag={bag}
            topInset={headerHeight}
            bottomInset={insets.bottom}
            onClose={() => setMenuOpen(false)}
            onOpen={(next) => tap(() => open(next))}
            onAccount={() =>
              tap(() => {
                if (bagOpen) webView.current?.injectJavaScript(openEvent('kiano-close-bag'))
                goWeb('/account', 'account')
              })
            }
            onWord={() => tap(revealWord)}
            onBag={() => tap(revealBag)}
          />
          <HouseHeader
            inverted={lightStatus}
            menuOpen={menuOpen}
            topInset={insets.top}
            word={word}
            bag={bag}
            onBack={canBack ? () => tap(back) : undefined}
            onHeight={setHeaderHeight}
            onToggle={() => tap(() => setMenuOpen((value) => !value))}
            onHome={() =>
              tap(() => {
                setMenuOpen(false)
                if (bagOpen) webView.current?.injectJavaScript(openEvent('kiano-close-bag'))
                if (wordOpen) webView.current?.injectJavaScript(openEvent('kiano-close-word'))
                goNative('/')
              })
            }
            onWord={() => tap(revealWord)}
            onBag={() => tap(revealBag)}
          />
        </>
      ) : null}
      {hideTabs ? null : (
        <HouseChrome
          path={isNativeBrowse(path) ? path : nativePath.current}
          tab={tab}
          bag={bag}
          inset={insets.bottom}
          onHeight={setChromeHeight}
          onHouse={() =>
            tap(() => {
              if (bagOpen) webView.current?.injectJavaScript(openEvent('kiano-close-bag'))
              if (wordOpen) webView.current?.injectJavaScript(openEvent('kiano-close-word'))
              if (webVisible) {
                goNative('/')
                return
              }
              if (room === '/' || room === '') {
                goNative('/stills')
                return
              }
              goNative('/')
            })
          }
          onLine={() =>
            tap(() => {
              if (bagOpen) webView.current?.injectJavaScript(openEvent('kiano-close-bag'))
              if (wordOpen) webView.current?.injectJavaScript(openEvent('kiano-close-word'))
              if (webVisible) {
                goNative('/shop')
                return
              }
              if (room.startsWith('/shop/') || room.startsWith('/collection/') || room.startsWith('/scent/')) {
                goNative(parentRoom(room))
                return
              }
              if (routeTab === 'line') return
              goNative('/shop')
            })
          }
          onShop={() => tap(() => goNative('/shop'))}
          onCollection={() => tap(() => goNative('/collection'))}
          onScent={() => tap(() => goNative('/scent'))}
          onBag={() =>
            tap(() => {
              if (Platform.OS === 'web') {
                void Linking.openURL(houseOrigin())
                return
              }
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
              if (tab === 'account' || webKind === 'account' || isAccountPath(path)) {
                goNative(nativePath.current)
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
    position: 'absolute',
    left: 0,
    right: 0,
    overflow: 'hidden',
    zIndex: 1,
    backgroundColor: color.night,
  },
  frame: {
    position: 'absolute',
    left: 0,
    right: 0,
    width: '100%',
    overflow: 'hidden',
    backgroundColor: color.ivory,
  },
  till: {
    flex: 1,
    backgroundColor: color.ivory,
  },
  status: {
    backgroundColor: color.ivory,
  },
})
