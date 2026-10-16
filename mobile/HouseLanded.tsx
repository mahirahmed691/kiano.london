import { Pressable, StyleSheet, Text, View } from 'react-native'

import { houseLandedCopy } from './HouseLandedCopy'
import { color, type } from './theme'

type Props = {
  bottom: number
  onRestart: () => void
}

export function HouseLanded({ bottom, onRestart }: Props) {
  return (
    <View
      pointerEvents="box-none"
      style={[styles.hold, { paddingBottom: Math.max(bottom, 18) }]}
      accessibilityRole="alert"
      testID="house-landed"
    >
      <View style={styles.plate}>
        <Text style={styles.kicker}>{houseLandedCopy.kicker}</Text>
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
  hold: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 14,
  },
  plate: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: color.rule,
    backgroundColor: color.ivory,
    paddingTop: 22,
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  kicker: {
    color: color.stone,
    fontFamily: type.sansRegular,
    fontSize: 11,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  display: {
    marginTop: 12,
    color: color.ink,
    fontFamily: type.displayLight,
    fontSize: 28,
    fontWeight: '300',
    letterSpacing: -0.4,
    lineHeight: 34,
  },
  body: {
    marginTop: 10,
    maxWidth: 280,
    color: color.inkSoft,
    fontFamily: type.sans,
    fontSize: 15,
    fontWeight: '300',
    lineHeight: 24,
  },
  retry: {
    alignSelf: 'flex-start',
    marginTop: 22,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: color.ink,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  pressed: {
    backgroundColor: color.ink,
  },
  retryLabel: {
    color: color.ink,
    fontFamily: type.sansRegular,
    fontSize: 11,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
  },
  retryLabelOn: {
    color: color.ivory,
  },
})
