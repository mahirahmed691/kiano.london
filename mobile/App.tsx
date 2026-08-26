import { StatusBar } from 'expo-status-bar'
import * as Linking from 'expo-linking'
import * as SystemUI from 'expo-system-ui'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Linking as RNLinking, SafeAreaView, StyleSheet, View } from 'react-native'
import { WebView, type WebViewNavigation } from 'react-native-webview'

import { HouseSplash } from './HouseSplash'

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
    const route = path || host
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

void SystemUI.setBackgroundColorAsync('#F2EBDC')

export default function App() {
  const [uri, setUri] = useState(houseOrigin)
  const [houseReady, setHouseReady] = useState(false)
  const firstLoad = useRef(true)

  useEffect(() => {
    void Linking.getInitialURL().then((url) => {
      setUri(urlForHouse(url))
    })
    const subscription = Linking.addEventListener('url', ({ url }) => {
      setUri(urlForHouse(url))
    })
    return () => subscription.remove()
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

  return (
    <View style={styles.shell}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.shell}>
        <WebView
          source={{ uri }}
          style={styles.frame}
          originWhitelist={['https://*', 'http://*', 'about:*']}
          onShouldStartLoadWithRequest={onNav}
          onLoadEnd={onHousePainted}
          onError={onHousePainted}
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
