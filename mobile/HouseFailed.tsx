import { Pressable, StyleSheet, Text, View } from 'react-native'

type Props = {
  onRetry: () => void
}

export function HouseFailed({ onRetry }: Props) {
  return (
    <View style={styles.veil} accessibilityRole="alert">
      <Text style={styles.kicker}>Kiano London</Text>
      <Text style={styles.display}>The house could not be reached.</Text>
      <Text style={styles.body}>
        A line dropped. Try again when you have a moment.
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
    backgroundColor: '#F2EBDC',
    paddingHorizontal: 32,
  },
  kicker: {
    color: '#6F675C',
    fontSize: 11,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  display: {
    marginTop: 16,
    color: '#1B1714',
    fontSize: 32,
    fontWeight: '300',
    letterSpacing: -0.4,
    lineHeight: 38,
  },
  body: {
    marginTop: 16,
    maxWidth: 280,
    color: '#3F3933',
    fontSize: 15,
    fontWeight: '300',
    lineHeight: 24,
  },
  retry: {
    alignSelf: 'flex-start',
    marginTop: 28,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#1B1714',
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  pressed: {
    backgroundColor: '#1B1714',
  },
  retryLabel: {
    color: '#1B1714',
    fontSize: 11,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
  },
  retryLabelOn: {
    color: '#F2EBDC',
  },
})
