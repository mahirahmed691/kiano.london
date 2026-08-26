import { StatusBar } from 'expo-status-bar'
import * as Linking from 'expo-linking'
import * as Notifications from 'expo-notifications'
import * as SystemUI from 'expo-system-ui'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Linking as RNLinking, SafeAreaView, StyleSheet, View } from 'react-native'
import { WebView, type WebViewMessageEvent, type WebViewNavigation } from 'react-native-webview'

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

function pushBridge(token: string) {
  const encoded = JSON.stringify(token)
  return `
    window.__KIANO_NATIVE = true;
    window.__KIANO_EXPO_PUSH = ${encoded};
    window.dispatchEvent(new Event('kiano-expo-push'));
    true;
  `
}

void SystemUI.setBackgroundColorAsync('#F2EBDC')

export default function App() {
  const [uri, setUri] = useState(houseOrigin)
  const [houseReady, setHouseReady] = useState(false)
  const [pushToken, setPushToken] = useState('')
  const firstLoad = useRef(true)
  const webView = useRef<WebView>(null)

  useEffect(() => {
    void Linking.getInitialURL().then((url) => {
      setUri(urlForHouse(url))
    })
    const subscription = Linking.addEventListener('url', ({ url }) => {
      setUri(urlForHouse(url))
    })
    return () => subscription.remove()
  }, [])

  useEffect(() => {
    const opened = pathFromNotificationResponse(Notifications.getLastNotificationResponse())
    if (opened) setUri(openHousePath(opened))

    const listening = Notifications.addNotificationResponseReceivedListener((response) => {
      const href = pathFromNotificationResponse(response)
      if (href) setUri(openHousePath(href))
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
    try {
      const payload = JSON.parse(event.nativeEvent.data) as { type?: string }
      if (payload.type !== 'kiano-request-push') return
    } catch {
      return
    }

    void registerHousePush()
      .then((token) => {
        if (!token) return
        setPushToken(token)
        webView.current?.injectJavaScript(pushBridge(token))
      })
      .catch(() => undefined)
  }, [])

  return (
    <View style={styles.shell}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.shell}>
        <WebView
          ref={webView}
          source={{ uri }}
          style={styles.frame}
          originWhitelist={['https://*', 'http://*', 'about:*']}
          onShouldStartLoadWithRequest={onNav}
          onLoadEnd={onHousePainted}
          onError={onHousePainted}
          onMessage={onMessage}
          injectedJavaScript={pushToken ? pushBridge(pushToken) : 'window.__KIANO_NATIVE = true; true;'}
          allowsBackForwardNavigationGestures
          sharedCookiesEnabled
          thirdPartyCookiesEnabled
          setSupportMultipleWindows={false}
          decelerationRate="normal"
        />
      </SafeAreaView>
      <HouseSplash houseReady={houseReady} />
    </View>
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
})
