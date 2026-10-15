import { Pressable, StyleSheet, Text, View } from 'react-native'

import { pad } from './catalogue'
import { color, type } from './theme'

export type HouseTab = 'house' | 'line' | 'bag' | 'account'

type Props = {
  path: string
  tab: HouseTab
  bag: number
  inset: number
  onHouse: () => void
  onLine: () => void
  onShop: () => void
  onCollection: () => void
  onScent: () => void
  onBag: () => void
  onAccount: () => void
  onHeight?: (height: number) => void
}

export function tabFromPath(pathname: string): HouseTab {
  const path = pathname.split('?')[0] || '/'
  if (
    path.startsWith('/account') ||
    path.startsWith('/sign-in') ||
    path.startsWith('/sign-up') ||
    path.startsWith('/admin')
  ) {
    return 'account'
  }
  if (path.startsWith('/shop') || path.startsWith('/collection') || path.startsWith('/scent')) {
    return 'line'
  }
  return 'house'
}

export function quietChrome(pathname: string) {
  const path = pathname.split('?')[0] || '/'
  return path.startsWith('/checkout') || path.startsWith('/order')
}

function Tab({
  label,
  selected,
  onPress,
  accessibilityLabel,
  role = 'tab',
}: {
  label: string
  selected: boolean
  onPress: () => void
  accessibilityLabel?: string
  role?: 'tab' | 'button'
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={role}
      accessibilityState={role === 'tab' ? { selected } : undefined}
      accessibilityLabel={accessibilityLabel}
      testID={`house-tab-${label.split('·')[0].trim().toLowerCase()}`}
      hitSlop={4}
      style={({ pressed }) => [styles.tab, pressed && styles.pressed]}
    >
      <Text style={[styles.label, selected ? styles.active : styles.quiet]}>{label}</Text>
      <View style={[styles.mark, selected ? styles.markOn : styles.markOff]} />
    </Pressable>
  )
}

export function HouseChrome({
  path,
  tab,
  bag,
  inset,
  onHouse,
  onLine,
  onShop,
  onCollection,
  onScent,
  onBag,
  onAccount,
  onHeight,
}: Props) {
  const line = tabFromPath(path) === 'line' || tab === 'line'
  const collection = path.startsWith('/collection')
  const scent = path.startsWith('/scent')
  const shop = path.startsWith('/shop') || (line && !collection && !scent)

  return (
    <View
      style={[styles.chrome, { paddingBottom: Math.max(inset, 10) }]}
      onLayout={(event) => onHeight?.(event.nativeEvent.layout.height)}
    >
      {line && tab !== 'bag' && tab !== 'account' ? (
        <View style={styles.segment}>
          <Pressable
            onPress={onShop}
            accessibilityRole="tab"
            accessibilityState={{ selected: shop }}
            hitSlop={8}
            style={({ pressed }) => pressed && styles.pressed}
          >
            <Text style={[styles.sub, shop ? styles.active : styles.quiet]}>Shop</Text>
          </Pressable>
          <Pressable
            onPress={onCollection}
            accessibilityRole="tab"
            accessibilityState={{ selected: collection }}
            hitSlop={8}
            style={({ pressed }) => pressed && styles.pressed}
          >
            <Text style={[styles.sub, collection ? styles.active : styles.quiet]}>Collection</Text>
          </Pressable>
          <Pressable
            onPress={onScent}
            accessibilityRole="tab"
            accessibilityState={{ selected: scent }}
            hitSlop={8}
            style={({ pressed }) => pressed && styles.pressed}
          >
            <Text style={[styles.sub, scent ? styles.active : styles.quiet]}>Scent</Text>
          </Pressable>
        </View>
      ) : null}

      <View style={styles.tabs}>
        <Tab label="House" selected={tab === 'house'} onPress={onHouse} />
        <Tab label="Line" selected={tab === 'line'} onPress={onLine} />
        <Tab
          label={bag > 0 ? `Bag · ${pad(bag)}` : 'Bag'}
          selected={tab === 'bag'}
          onPress={onBag}
          role="button"
          accessibilityLabel={bag > 0 ? `Bag, ${bag} pieces` : 'Bag'}
        />
        <Tab label="Account" selected={tab === 'account'} onPress={onAccount} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  chrome: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9,
    backgroundColor: color.ivory,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: color.rule,
  },
  segment: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 22,
    paddingTop: 12,
    paddingBottom: 2,
  },
  tabs: {
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingHorizontal: 4,
    paddingTop: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    paddingTop: 8,
    paddingBottom: 6,
  },
  pressed: {
    opacity: 0.55,
    transform: [{ scale: 0.97 }],
  },
  label: {
    fontFamily: type.sansRegular,
    fontSize: 11,
    fontWeight: '400',
    letterSpacing: 2.2,
    textTransform: 'uppercase',
  },
  sub: {
    fontFamily: type.sansRegular,
    fontSize: 11,
    fontWeight: '400',
    letterSpacing: 2.2,
    textTransform: 'uppercase',
  },
  active: {
    color: color.ink,
  },
  quiet: {
    color: color.stone,
  },
  mark: {
    marginTop: 7,
    height: StyleSheet.hairlineWidth,
    width: 12,
  },
  markOn: {
    backgroundColor: color.ink,
  },
  markOff: {
    backgroundColor: 'transparent',
  },
})
