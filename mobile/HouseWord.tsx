import Svg, { Path } from 'react-native-svg'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { pad } from './catalogue'
import { color, type } from './theme'

type Props = {
  count: number
  top: number
  inverted: boolean
  onPress: () => void
}

export function HouseWord({ count, top, inverted, onPress }: Props) {
  const ink = inverted ? color.ivory : color.ink
  const waiting = count > 0

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={
        waiting ? `Word from the house, ${count} unread` : 'Word from the house'
      }
      hitSlop={10}
      style={({ pressed }) => [
        styles.hit,
        { top, right: 16 },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.row}>
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 4.5c-2.6 0-4.5 2-4.5 5.2v4.2L5 17.5h14l-2.5-3.6v-4.2c0-3.2-1.9-5.2-4.5-5.2z"
            stroke={ink}
            strokeWidth="1.2"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
          <Path
            d="M10 18.5c0 1.1.9 2 2 2s2-.9 2-2"
            stroke={ink}
            strokeWidth="1.2"
            strokeLinecap="square"
          />
        </Svg>
        {waiting ? <Text style={[styles.count, { color: ink }]}>{pad(count)}</Text> : null}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  hit: {
    position: 'absolute',
    zIndex: 12,
    minHeight: 44,
    minWidth: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  pressed: {
    opacity: 0.55,
    transform: [{ scale: 0.97 }],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  count: {
    fontFamily: type.sansRegular,
    fontSize: 10,
    fontWeight: '400',
    letterSpacing: 1.6,
  },
})
