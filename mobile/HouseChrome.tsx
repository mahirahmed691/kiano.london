import { Pressable, StyleSheet, Text, View } from 'react-native'

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
  onBag: () => void
  onAccount: () => void
}

function pad(value: number) {
  return String(value).padStart(2, '0')
}

export function tabFromPath(pathname: string): HouseTab {
  if (
    pathname.startsWith('/account') ||
    pathname.startsWith('/sign-in') ||
    pathname.startsWith('/sign-up') ||
    pathname.startsWith('/admin')
  ) {
    return 'account'
  }
  if (pathname.startsWith('/shop') || pathname.startsWith('/collection')) {
    return 'line'
  }
  return 'house'
}

export function quietChrome(pathname: string) {
  return pathname.startsWith('/checkout') || pathname.startsWith('/order')
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
  onBag,
  onAccount,
}: Props) {
  const line = tabFromPath(path) === 'line'
  const collection = path.startsWith('/collection')
  const shop = path.startsWith('/shop') || (line && !collection)

  return (
    <View style={[styles.chrome, { paddingBottom: Math.max(inset, 10) }]}>
      {line ? (
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
    backgroundColor: '#F2EBDC',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#D4CBB8',
  },
  segment: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
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
    fontSize: 11,
    fontWeight: '400',
    letterSpacing: 2.2,
    textTransform: 'uppercase',
  },
  sub: {
    fontSize: 11,
    fontWeight: '400',
    letterSpacing: 2.2,
    textTransform: 'uppercase',
  },
  active: {
    color: '#1B1714',
  },
  quiet: {
    color: '#6F675C',
  },
  mark: {
    marginTop: 7,
    height: StyleSheet.hairlineWidth,
    width: 12,
  },
  markOn: {
    backgroundColor: '#1B1714',
  },
  markOff: {
    backgroundColor: 'transparent',
  },
})
