import { useEffect, useRef } from 'react'
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native'

import { pad } from './catalogue'
import { HouseClock } from './HouseClock'
import { HouseLockup } from './HouseLockup'
import { HouseWord } from './HouseWord'
import { color, type } from './theme'

type Props = {
  inverted: boolean
  menuOpen: boolean
  topInset: number
  word: number
  bag: number
  onToggle: () => void
  onHome: () => void
  onWord: () => void
  onBag: () => void
  onHeight?: (height: number) => void
}

export function HouseHeader({
  inverted,
  menuOpen,
  topInset,
  word,
  bag,
  onToggle,
  onHome,
  onWord,
  onBag,
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
        <View style={styles.side}>
          <Pressable
            onPress={onToggle}
            accessibilityRole="button"
            accessibilityLabel={menuOpen ? 'Close menu' : 'Open menu'}
            accessibilityState={{ expanded: menuOpen }}
            testID="house-menu-toggle"
            hitSlop={8}
            style={({ pressed }) => [styles.hit, pressed && styles.pressed]}
          >
            <View style={styles.burger}>
              <Animated.View style={[styles.hair, { backgroundColor: ink }, topBar]} />
              <Animated.View style={[styles.hair, { backgroundColor: ink }, bottomBar]} />
            </View>
          </Pressable>
        </View>

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

        <View style={[styles.side, styles.sideEnd]}>
          <HouseWord count={word} inverted={!paper} embedded onPress={onWord} />
          <View style={styles.clock} testID="house-clock">
            <HouseClock inverted={!paper} />
          </View>
          <Pressable
            onPress={onBag}
            accessibilityRole="button"
            accessibilityLabel={bag ? `Open bag, ${bag} pieces` : 'Open bag'}
            testID="house-bag"
            hitSlop={6}
            style={({ pressed }) => [styles.bagHit, pressed && styles.pressed]}
          >
            <Text style={[styles.bag, { color: ink }]}>{bag > 0 ? `Bag ${pad(bag)}` : 'Bag'}</Text>
          </Pressable>
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  side: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
  },
  sideEnd: {
    justifyContent: 'flex-end',
    gap: 8,
  },
  hit: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mark: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  clock: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bagHit: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  bag: {
    fontFamily: type.sansRegular,
    fontSize: 10,
    fontWeight: '400',
    letterSpacing: 2.8,
    textTransform: 'uppercase',
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
