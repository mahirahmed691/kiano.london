import { Platform, Pressable, StyleSheet, Text, View } from 'react-native'

export type HouseTab = 'house' | 'line' | 'account'

type Props = {
  path: string
  tab: HouseTab
  bag: number
  word: number
  onHouse: () => void
  onLine: () => void
  onShop: () => void
  onCollection: () => void
  onBag: () => void
  onAccount: () => void
  onWord: () => void
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

export function HouseChrome({
  path,
  tab,
  bag,
  word,
  onHouse,
  onLine,
  onShop,
  onCollection,
  onBag,
  onAccount,
  onWord,
}: Props) {
  const shop = path.startsWith('/shop') || (!path.startsWith('/collection') && tab === 'line')
  const collection = path.startsWith('/collection')

  return (
    <View style={styles.chrome}>
      <View style={styles.overlay}>
        {tab === 'line' ? (
          <View style={styles.segment}>
            <Pressable
              onPress={onShop}
              accessibilityRole="tab"
              accessibilityState={{ selected: shop && !collection }}
              hitSlop={8}
            >
              <Text style={[styles.label, shop && !collection ? styles.active : styles.quiet]}>
                Shop
              </Text>
            </Pressable>
            <Pressable
              onPress={onCollection}
              accessibilityRole="tab"
              accessibilityState={{ selected: collection }}
              hitSlop={8}
            >
              <Text style={[styles.label, collection ? styles.active : styles.quiet]}>
                Collection
              </Text>
            </Pressable>
          </View>
        ) : (
          <View />
        )}
        <Pressable onPress={onWord} accessibilityRole="button" accessibilityLabel="Word from the house" hitSlop={8}>
          <Text style={styles.label}>
            Word{word > 0 ? ` · ${pad(word)}` : ''}
          </Text>
        </Pressable>
      </View>

      <View style={styles.tabs}>
        <Pressable onPress={onHouse} accessibilityRole="tab" accessibilityState={{ selected: tab === 'house' }} style={styles.tab}>
          <Text style={[styles.label, tab === 'house' ? styles.active : styles.quiet]}>House</Text>
        </Pressable>
        <Pressable onPress={onLine} accessibilityRole="tab" accessibilityState={{ selected: tab === 'line' }} style={styles.tab}>
          <Text style={[styles.label, tab === 'line' ? styles.active : styles.quiet]}>Line</Text>
        </Pressable>
        <Pressable onPress={onBag} accessibilityRole="button" accessibilityLabel="Bag" style={styles.tab}>
          <Text style={styles.label}>Bag{bag > 0 ? ` · ${pad(bag)}` : ''}</Text>
        </Pressable>
        <Pressable onPress={onAccount} accessibilityRole="tab" accessibilityState={{ selected: tab === 'account' }} style={styles.tab}>
          <Text style={[styles.label, tab === 'account' ? styles.active : styles.quiet]}>Account</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  chrome: {
    backgroundColor: '#F2EBDC',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#D4CBB8',
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
  },
  overlay: {
    minHeight: 36,
    paddingHorizontal: 24,
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  segment: {
    flexDirection: 'row',
    gap: 20,
  },
  tabs: {
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingHorizontal: 8,
    paddingBottom: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  label: {
    color: '#1B1714',
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
})
