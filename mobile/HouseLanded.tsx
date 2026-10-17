import { useEffect, useRef } from 'react'
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native'
import { StatusBar } from 'expo-status-bar'

import { HouseLockup } from './HouseLockup'
import { houseLandedCopy, houseLandedHoldMs } from './HouseLandedCopy'
import { color, type } from './theme'

type Props = {
  top?: number
  bottom?: number
  onRestart: () => void
}

export function HouseLanded({ top = 0, bottom = 0, onRestart }: Props) {
  const opacity = useRef(new Animated.Value(0)).current
  const rise = useRef(new Animated.Value(18)).current

  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (value) {
        opacity.setValue(1)
        rise.setValue(0)
        return
      }
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(rise, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start()
    })
    const hold = setTimeout(onRestart, houseLandedHoldMs)
    return () => clearTimeout(hold)
  }, [onRestart, opacity, rise])

  return (
    <Animated.View
      pointerEvents="auto"
      style={[
        styles.veil,
        {
          paddingTop: Math.max(top, 72),
          paddingBottom: Math.max(bottom, 72),
          opacity,
        },
      ]}
      accessibilityRole="alert"
      accessibilityLabel={`${houseLandedCopy.kicker}. ${houseLandedCopy.display} ${houseLandedCopy.body}`}
      testID="house-landed"
    >
      <StatusBar style="light" />
      <Animated.View style={[styles.plate, { transform: [{ translateY: rise }] }]}>
        <HouseLockup tone="bronze" />
        <Text style={styles.display}>{houseLandedCopy.display}</Text>
        <Text style={styles.body}>{houseLandedCopy.body}</Text>
        <Pressable
          onPress={onRestart}
          accessibilityRole="button"
          accessibilityLabel={houseLandedCopy.action}
          testID="house-landed-restart"
          style={({ pressed }) => [styles.retry, pressed && styles.pressed]}
        >
          <Text style={styles.retryLabel}>{houseLandedCopy.action}</Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  veil: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 21,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.night,
    paddingHorizontal: 32,
  },
  plate: {
    width: '100%',
    maxWidth: 360,
  },
  display: {
    marginTop: 44,
    color: color.ivory,
    fontFamily: type.displayLight,
    fontSize: 48,
    fontWeight: '300',
    letterSpacing: -0.6,
    lineHeight: 54,
    textAlign: 'center',
  },
  body: {
    marginTop: 18,
    alignSelf: 'center',
    maxWidth: 300,
    color: color.bronze,
    fontFamily: type.sans,
    fontSize: 17,
    fontWeight: '300',
    lineHeight: 28,
    textAlign: 'center',
  },
  retry: {
    alignSelf: 'center',
    marginTop: 40,
    backgroundColor: color.ivory,
    paddingHorizontal: 26,
    paddingVertical: 16,
  },
  pressed: {
    opacity: 0.7,
  },
  retryLabel: {
    color: color.night,
    fontFamily: type.sansRegular,
    fontSize: 11,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
})
