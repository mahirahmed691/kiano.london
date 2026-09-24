import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'

import { HouseImage } from './HouseImage'
import { HouseLockup } from './HouseLockup'
import {
  jubbahs,
  pad,
  productLineName,
  productPath,
  scentPath,
  scents,
  thisWeekPlate,
  thobes,
} from './catalogue'
import { color, type } from './theme'

type Props = {
  open: boolean
  path: string
  bag: number
  topInset: number
  bottomInset: number
  onClose: () => void
  onOpen: (path: string) => void
  onAccount: () => void
  onWord: () => void
  onBag: () => void
}

function SectionLabel({ children }: { children: string }) {
  return <Text style={styles.section}>{children}</Text>
}

function RoomLink({
  label,
  active,
  large,
  onPress,
}: {
  label: string
  active: boolean
  large?: boolean
  onPress: () => void
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="link"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      testID={`house-menu-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
      hitSlop={4}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <Text style={[large ? styles.large : styles.small, active ? styles.on : styles.off]}>{label}</Text>
    </Pressable>
  )
}

export function HouseMenu({
  open,
  path,
  bag,
  topInset,
  bottomInset,
  onClose,
  onOpen,
  onAccount,
  onWord,
  onBag,
}: Props) {
  const week = thisWeekPlate()
  const room = path.split('?')[0] || '/'
  const go = (next: string) => {
    onClose()
    onOpen(next)
  }

  return (
    <View
      pointerEvents={open ? 'auto' : 'none'}
      accessibilityViewIsModal={open}
      importantForAccessibility={open ? 'yes' : 'no-hide-descendants'}
      testID="house-menu"
      style={[styles.veil, { opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none' }]}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{
          paddingTop: topInset + 28,
          paddingBottom: Math.max(bottomInset, 36) + 28,
          paddingHorizontal: 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.stack}>
          <RoomLink label="Home" large active={room === '/'} onPress={() => go('/')} />

          <View style={styles.block}>
            <SectionLabel>The Shop</SectionLabel>
            <RoomLink label="Shop" large active={room === '/shop'} onPress={() => go('/shop')} />
            <View style={styles.lines}>
              {jubbahs.map((piece) => (
                <RoomLink
                  key={piece.id}
                  label={productLineName(piece)}
                  active={room === productPath(piece)}
                  onPress={() => go(productPath(piece))}
                />
              ))}
            </View>
          </View>

          <View style={styles.block}>
            <SectionLabel>The Collection</SectionLabel>
            <RoomLink
              label="Collection"
              large
              active={room === '/collection'}
              onPress={() => go('/collection')}
            />
            <View style={styles.lines}>
              {thobes.map((piece) => (
                <RoomLink
                  key={piece.id}
                  label={piece.name}
                  active={room === productPath(piece)}
                  onPress={() => go(productPath(piece))}
                />
              ))}
            </View>
          </View>

          <View style={styles.block}>
            <SectionLabel>The Scent</SectionLabel>
            <RoomLink label="Scent" large active={room === '/scent'} onPress={() => go('/scent')} />
            <View style={styles.lines}>
              {scents.map((scent) => (
                <RoomLink
                  key={scent.id}
                  label={scent.name}
                  active={room === scentPath(scent)}
                  onPress={() => go(scentPath(scent))}
                />
              ))}
            </View>
          </View>

          <View style={styles.block}>
            <SectionLabel>The house</SectionLabel>
            <View style={styles.lines}>
              <RoomLink label="Stills" large active={room === '/stills'} onPress={() => go('/stills')} />
              <RoomLink label="Story" large active={room === '/story'} onPress={() => go('/story')} />
              <RoomLink
                label="Craftsmanship"
                large
                active={room === '/craftsmanship'}
                onPress={() => go('/craftsmanship')}
              />
              <RoomLink label="Visit" large active={room === '/visit'} onPress={() => go('/visit')} />
            </View>
          </View>

          <RoomLink label="Account" large active={room.startsWith('/account')} onPress={onAccount} />
          <RoomLink label="Word" large active={false} onPress={onWord} />
          <RoomLink label={bag > 0 ? `Bag ${pad(bag)}` : 'Bag'} large active={false} onPress={onBag} />
        </View>

        <Pressable
          onPress={() => go('/stills')}
          accessibilityRole="link"
          accessibilityLabel={`This week, ${week.name}`}
          testID="house-menu-week"
          style={({ pressed }) => [styles.week, pressed && styles.pressed]}
        >
          <View style={styles.plate}>
            <HouseImage src={week.src} alt={week.alt} objectPosition={week.objectPosition} style={styles.still} />
          </View>
          <Text style={styles.weekKicker}>
            {week.place === week.name ? 'This week' : `This week · ${week.place}`}
          </Text>
          <Text style={styles.weekName}>{week.name}</Text>
        </Pressable>

        <View style={styles.lockup} testID="house-menu-lockup">
          <HouseLockup compact tone="ink" />
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  veil: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 11,
    backgroundColor: color.ivory,
  },
  scroll: {
    flex: 1,
  },
  stack: {
    gap: 32,
    justifyContent: 'center',
    minHeight: 420,
  },
  block: {
    gap: 12,
  },
  lines: {
    gap: 4,
    paddingTop: 4,
  },
  section: {
    color: color.stone,
    fontFamily: type.sansRegular,
    fontSize: 11,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
  large: {
    fontFamily: type.displayLight,
    fontWeight: '300',
    fontSize: 36,
    letterSpacing: -0.4,
    color: color.ink,
  },
  small: {
    fontFamily: type.displayLight,
    fontWeight: '300',
    fontSize: 24,
    letterSpacing: -0.3,
    color: color.ink,
  },
  on: {
    opacity: 1,
  },
  off: {
    opacity: 0.55,
  },
  pressed: {
    opacity: 0.7,
  },
  week: {
    marginTop: 64,
    maxWidth: 224,
  },
  plate: {
    aspectRatio: 4 / 5,
    overflow: 'hidden',
    backgroundColor: color.ivoryDeep,
  },
  still: {
    width: '100%',
    height: '100%',
  },
  weekKicker: {
    marginTop: 16,
    color: color.stone,
    fontFamily: type.sansRegular,
    fontSize: 11,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
  weekName: {
    marginTop: 8,
    color: color.ink,
    fontFamily: type.displayLight,
    fontWeight: '300',
    fontSize: 24,
    letterSpacing: -0.3,
  },
  lockup: {
    marginTop: 40,
    alignItems: 'flex-start',
  },
})
