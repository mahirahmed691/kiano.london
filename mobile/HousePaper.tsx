import { type ReactNode } from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import { color } from './theme'

type Props = {
  children: ReactNode
  bottomInset: number
  overlayHero?: boolean
  onOverlay?: (value: boolean) => void
  heroHeight?: number
}

export function RoomScroll({
  children,
  bottomInset,
  overlayHero,
  onOverlay,
  heroHeight = 520,
}: Props) {
  return (
    <ScrollView
      testID="house-scroll"
      style={[styles.scroll, { height: heroHeight }]}
      contentContainerStyle={{ paddingBottom: bottomInset + 36 }}
      contentInsetAdjustmentBehavior="never"
      automaticallyAdjustContentInsets={false}
      showsVerticalScrollIndicator={false}
      scrollEnabled
      bounces
      nestedScrollEnabled
      keyboardShouldPersistTaps="handled"
      canCancelContentTouches
      scrollEventThrottle={16}
      onScroll={(event) => {
        if (!overlayHero || !onOverlay) return
        onOverlay(event.nativeEvent.contentOffset.y < heroHeight * 0.62)
      }}
    >
      {children}
    </ScrollView>
  )
}

export function paper() {
  return styles.paper
}

export function section() {
  return styles.section
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: color.night,
  },
  paper: {
    backgroundColor: color.ivory,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 56,
  },
  section: {
    backgroundColor: color.ivory,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 48,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: color.rule,
  },
})
