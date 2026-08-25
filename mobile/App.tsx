import { StatusBar } from 'expo-status-bar'
import * as SplashScreen from 'expo-splash-screen'
import * as SystemUI from 'expo-system-ui'
import { useCallback } from 'react'
import { Linking, SafeAreaView, StyleSheet } from 'react-native'
import { WebView, type WebViewNavigation } from 'react-native-webview'

const HOUSE_URL = 'https://www.kiano.london'

void SystemUI.setBackgroundColorAsync('#F2EBDC')
SplashScreen.setOptions({ duration: 400, fade: true })

function shouldOpenOutside(url: string) {
  return url.startsWith('tel:') || url.startsWith('mailto:') || url.startsWith('sms:')
}

export default function App() {
  const onNav = useCallback((request: WebViewNavigation) => {
    if (shouldOpenOutside(request.url)) {
      void Linking.openURL(request.url)
      return false
    }
    return true
  }, [])

  return (
    <SafeAreaView style={styles.shell}>
      <StatusBar style="dark" />
      <WebView
        source={{ uri: HOUSE_URL }}
        style={styles.frame}
        originWhitelist={['https://*', 'http://*', 'about:*']}
        onShouldStartLoadWithRequest={onNav}
        allowsBackForwardNavigationGestures
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        setSupportMultipleWindows={false}
        decelerationRate="normal"
      />
    </SafeAreaView>
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
