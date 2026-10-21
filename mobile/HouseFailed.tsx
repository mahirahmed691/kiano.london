import { Pressable, StyleSheet, Text, View } from 'react-native'

import { color, type } from './theme'

type Props = {
  till?: boolean
  onRetry: () => void
}

export function HouseFailed({ till, onRetry }: Props) {
  return (
    <View style={styles.veil} accessibilityRole="alert">
      <Text style={styles.kicker}>Kiano London</Text>
      <Text style={styles.display}>
        {till ? 'The till needs a connection.' : 'The house could not be reached.'}
      </Text>
      <Text style={styles.body}>
        {till
          ? 'Bag, account, and payment live on the house site. Try again when you have a line.'
          : 'A line dropped. Try again when you have a moment.'}
      </Text>
      <Pressable
        onPress={onRetry}
        accessibilityRole="button"
        accessibilityLabel="Try again"
        style={({ pressed }) => [styles.retry, pressed && styles.pressed]}
      >
        {({ pressed }) => (
          <Text style={[styles.retryLabel, pressed && styles.retryLabelOn]}>Try again</Text>
        )}
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  veil: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 15,
    justifyContent: 'center',
    backgroundColor: color.ivory,
    paddingHorizontal: 32,
  },
  kicker: {
    color: color.stone,
    fontFamily: type.sansRegular,
    fontSize: 11,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  display: {
    marginTop: 16,
    color: color.ink,
    fontFamily: type.displayLight,
    fontSize: 32,
    fontWeight: '300',
    letterSpacing: -0.4,
    lineHeight: 38,
  },
  body: {
    marginTop: 16,
    maxWidth: 280,
    color: color.inkSoft,
    fontFamily: type.sans,
    fontSize: 15,
    fontWeight: '300',
    lineHeight: 24,
  },
  retry: {
    alignSelf: 'flex-start',
    marginTop: 28,
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
