import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'

import { HouseImage } from './HouseImage'
import { HousePatch } from './HousePatch'
import {
  colourOfPiece,
  houseMenuAccount,
  houseMenuHome,
  houseMenuTree,
  pad,
  thisWeekShopPlate,
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
  testID,
  onPress,
}: {
  label: string
  active: boolean
  large?: boolean
  testID?: string
  onPress: () => void
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="link"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      testID={testID ?? `house-menu-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
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
  const week = thisWeekShopPlate()
  const room = path.split('?')[0] || '/'
  const sections = houseMenuTree()
  const go = (next: string) => {
    onClose()
    onOpen(next)
  }

  if (!open) return null

  return (
    <View accessibilityViewIsModal testID="house-menu" style={styles.veil}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{
          paddingTop: topInset + 28,
          paddingBottom: Math.max(bottomInset, 36) + 28,
          paddingHorizontal: 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.stack} accessibilityLabel="House">
          <RoomLink
            label={houseMenuHome.label}
            large
            active={room === houseMenuHome.to}
            onPress={() => go(houseMenuHome.to)}
          />

          {sections.map((block) => {
            const hub = block.hub
            return (
            <View key={block.id} style={styles.block}>
              <SectionLabel>{block.section}</SectionLabel>
              {hub ? (
                <RoomLink
                  label={hub.label}
                  large
                  active={room === hub.to}
                  onPress={() => go(hub.to)}
                />
              ) : null}
              <View style={[styles.lines, Boolean(block.hub) && styles.linesUnderHub]}>
                {block.lines.map((line) => (
                  <RoomLink
                    key={line.to}
                    label={line.label}
                    large={!block.hub}
                    active={room === line.to}
                    testID={`house-menu-${block.id}-${line.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                    onPress={() => go(line.to)}
                  />
                ))}
              </View>
            </View>
            )
          })}

          <RoomLink
            label={houseMenuAccount.label}
            large
            active={room.startsWith(houseMenuAccount.to)}
            onPress={onAccount}
          />
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
            <View style={styles.weekPatch} pointerEvents="none">
              <HousePatch colour={colourOfPiece(week.id)} size={52} />
            </View>
          </View>
          <Text style={styles.weekKicker}>
            {week.place === week.name ? 'This week' : `This week · ${week.place}`}
          </Text>
          <Text style={styles.weekName}>{week.name}</Text>
        </Pressable>

        <View style={styles.notes}>
          <RoomLink label="Privacy" active={room === '/privacy'} onPress={() => go('/privacy')} />
          <RoomLink label="Cookies" active={room === '/cookies'} onPress={() => go('/cookies')} />
          <RoomLink label="If it must return" active={room === '/returns'} onPress={() => go('/returns')} />
        </View>

        <View style={styles.lockup} testID="house-menu-lockup">
          <HousePatch size={72} />
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
  },
  linesUnderHub: {
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
    position: 'relative',
    aspectRatio: 4 / 5,
    overflow: 'hidden',
    backgroundColor: color.ivoryDeep,
  },
  weekPatch: {
    position: 'absolute',
    left: 10,
    bottom: 10,
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
  notes: {
    marginTop: 48,
    gap: 10,
  },
  lockup: {
    marginTop: 40,
    alignItems: 'flex-start',
  },
})
