import { useEffect } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { HouseLockup } from './HouseLockup'
import { houseLandedCopy, houseLandedHoldMs } from './HouseLandedCopy'
import { color, type } from './theme'

type Props = {
  top?: number
  bottom?: number
  onRestart: () => void
}

export function HouseLanded({ top = 0, bottom = 0, onRestart }: Props) {
  useEffect(() => {
    const hold = setTimeout(onRestart, houseLandedHoldMs)
    return () => clearTimeout(hold)
  }, [onRestart])

  return (
    <View
      pointerEvents="auto"
      style={[
        styles.veil,
        {
          paddingTop: Math.max(top, 56),
          paddingBottom: Math.max(bottom, 56),
        },
      ]}
      accessibilityRole="alert"
      accessibilityLabel={`${houseLandedCopy.kicker}. ${houseLandedCopy.display} ${houseLandedCopy.body}`}
      testID="house-landed"
    >
      <View style={styles.plate}>
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
          {({ pressed }) => (
            <Text style={[styles.retryLabel, pressed && styles.retryLabelOn]}>
              {houseLandedCopy.action}
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  veil: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 21,
    justifyContent: 'center',
    backgroundColor: color.night,
    paddingHorizontal: 32,
  },
  plate: {
    maxWidth: 360,
  },
  display: {
    marginTop: 36,
    color: color.ivory,
    fontFamily: type.displayLight,
    fontSize: 40,
    fontWeight: '300',
    letterSpacing: -0.5,
    lineHeight: 46,
  },
  body: {
    marginTop: 16,
    maxWidth: 280,
    color: color.bronze,
    fontFamily: type.sans,
    fontSize: 16,
    fontWeight: '300',
    lineHeight: 26,
  },
  retry: {
    alignSelf: 'flex-start',
    marginTop: 36,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: color.ivory,
    paddingHorizontal: 22,
    paddingVertical: 14,
  },
  pressed: {
    backgroundColor: color.ivory,
  },
  retryLabel: {
    color: color.ivory,
    fontFamily: type.sansRegular,
    fontSize: 11,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
  },
  retryLabelOn: {
    color: color.night,
  },
})
