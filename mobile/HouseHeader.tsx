import { useEffect, useRef } from 'react'
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native'

import { HouseLockup } from './HouseLockup'
import { HouseWord } from './HouseWord'
import { color } from './theme'

type Props = {
  inverted: boolean
  menuOpen: boolean
  topInset: number
  word: number
  onToggle: () => void
  onHome: () => void
  onWord: () => void
  onHeight?: (height: number) => void
}

export function HouseHeader({
  inverted,
  menuOpen,
  topInset,
  word,
  onToggle,
  onHome,
  onWord,
  onHeight,
}: Props) {
  const paper = menuOpen || !inverted
  const ink = paper ? color.ink : color.ivory
  const lockupTone = paper ? 'ink' : 'bronze'
  const progress = useRef(new Animated.Value(menuOpen ? 1 : 0)).current

  useEffect(() => {
    Animated.timing(progress, {
      toValue: menuOpen ? 1 : 0,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start()
  }, [menuOpen, progress])

  const topBar = {
    transform: [
      {
        translateY: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 6],
        }),
      },
      {
        rotate: progress.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '45deg'],
        }),
      },
    ],
  }
  const bottomBar = {
    transform: [
      {
        translateY: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [12, 6],
        }),
      },
      {
        rotate: progress.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '-45deg'],
        }),
      },
    ],
  }

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.bar,
        { paddingTop: topInset, backgroundColor: paper ? color.ivory : 'transparent' },
        paper && styles.ruled,
      ]}
      onLayout={(event) => onHeight?.(event.nativeEvent.layout.height)}
    >
      <View style={styles.row} pointerEvents="box-none">
        <Pressable
          onPress={onHome}
          accessibilityRole="link"
          accessibilityLabel="Kiano London, home"
          testID="house-mark"
          hitSlop={6}
          style={({ pressed }) => [styles.mark, pressed && styles.pressed]}
        >
          <HouseLockup compact tone={lockupTone} />
        </Pressable>

        <Pressable
          onPress={onToggle}
          accessibilityRole="button"
          accessibilityLabel={menuOpen ? 'Close menu' : 'Open menu'}
          accessibilityState={{ expanded: menuOpen }}
          testID="house-menu-toggle"
          hitSlop={8}
          style={({ pressed }) => [styles.hit, styles.hitLeft, pressed && styles.pressed]}
        >
          <View style={styles.burger}>
            <Animated.View style={[styles.hair, { backgroundColor: ink }, topBar]} />
            <Animated.View style={[styles.hair, { backgroundColor: ink }, bottomBar]} />
          </View>
        </Pressable>

        <View style={[styles.hit, styles.hitRight]}>
          <HouseWord count={word} inverted={!paper} embedded onPress={onWord} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 13,
    overflow: 'hidden',
  },
  ruled: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: color.rule,
  },
  row: {
    minHeight: 96,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hit: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  hitLeft: {
    left: 12,
  },
  hitRight: {
    right: 12,
  },
  mark: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    zIndex: 1,
  },
  burger: {
    width: 24,
    height: 13,
  },
  hair: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 24,
    height: 1,
  },
  pressed: {
    opacity: 0.55,
  },
})
