import { useCallback, useEffect, useRef, useState } from 'react'
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Image,
  StyleSheet,
} from 'react-native'
import * as SplashScreen from 'expo-splash-screen'

const MIN_HOLD_MS = 1600
const MAX_HOLD_MS = 7000
const FADE_MS = 680

type Props = {
  houseReady: boolean
}

export function HouseSplash({ houseReady }: Props) {
  const opacity = useRef(new Animated.Value(1)).current
  const [visible, setVisible] = useState(true)
  const shownAt = useRef(Date.now())
  const dismissed = useRef(false)
  const reduceMotion = useRef(false)

  const dismiss = useCallback(() => {
    if (dismissed.current) return
    dismissed.current = true
    if (reduceMotion.current) {
      setVisible(false)
      return
    }
    Animated.timing(opacity, {
      toValue: 0,
      duration: FADE_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) setVisible(false)
    })
  }, [opacity])

  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      reduceMotion.current = value
    })
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (value) => {
        reduceMotion.current = value
      },
    )
    const failsafe = setTimeout(dismiss, MAX_HOLD_MS)
    return () => {
      subscription.remove()
      clearTimeout(failsafe)
    }
  }, [dismiss])

  useEffect(() => {
    if (!houseReady) return
    const wait = Math.max(0, MIN_HOLD_MS - (Date.now() - shownAt.current))
    const timer = setTimeout(dismiss, wait)
    return () => clearTimeout(timer)
  }, [dismiss, houseReady])

  const onLayout = useCallback(() => {
    void SplashScreen.hideAsync()
  }, [])

  if (!visible) return null

  return (
    <Animated.View
      pointerEvents="auto"
      accessibilityRole="image"
      accessibilityLabel="Kiano London"
      onLayout={onLayout}
      style={[styles.veil, { opacity }]}
    >
      <Image
        source={require('./assets/images/splash-lockup.png')}
        style={styles.lockup}
        resizeMode="contain"
      />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  veil: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2EBDC',
    paddingBottom: 28,
  },
  lockup: {
    width: 236,
    height: 191,
  },
})
