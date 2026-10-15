import { useMemo, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { HouseCard } from '../HouseCard'
import { HouseMotto } from '../HouseMotto'
import { RoomScroll, paper } from '../HousePaper'
import { HouseStill } from '../HouseStill'
import { Body, Display, GhostLink, OutlineButton } from '../HouseType'
import {
  clothSwatch,
  creedIntent,
  jubbahColours,
  jubbahs,
  productLineName,
  productPath,
  type ProductColour,
} from '../catalogue'
import { color, type } from '../theme'
import { type HouseNav } from './nav'

type Filter = 'All' | ProductColour

type Props = HouseNav & {
  collection?: boolean
}

export function LineRoom({
  open,
  roomHeight,
  bottomInset,
  onOverlay,
  collection,
}: Props) {
  const [filter, setFilter] = useState<Filter>('All')
  const pieces = jubbahs
  const colours = jubbahColours
  const shown = useMemo(
    () => (filter === 'All' ? pieces : pieces.filter((item) => item.colour === filter)),
    [filter, pieces],
  )

  const countLabel = `${String(shown.length).padStart(2, '0')} ${shown.length === 1 ? 'colour' : 'colours'}`

  return (
    <RoomScroll
      bottomInset={bottomInset}
      overlayHero
      heroHeight={roomHeight}
      onOverlay={onOverlay}
    >
      <HouseStill
        src={collection ? '/images/jubbah-sand.jpg' : '/images/jubbah-sand-02.jpg'}
        alt="Urban Emirati in cream at rest, the cloth to the ankle."
        objectPosition={collection ? 'center 8%' : 'center 22%'}
        kicker={collection ? 'The line' : 'The outer garment'}
        title={collection ? 'The Collection.' : 'The Shop.'}
        height={roomHeight}
        priority
      />

      <View style={paper()}>
        <Display size={28}>
          {jubbahs.map((piece) => productLineName(piece)).join('\n')}
        </Display>
        <View style={styles.gap} />
        <Body>
          {`Cotton viscose mix, light GSM. Five sizes, 52 to 60. ${creedIntent}`}
        </Body>
        <View style={styles.meta}>
          <Text style={styles.count}>{countLabel}</Text>
          <Text style={styles.note}>Sizes 52–60. Three colourways. Made to order.</Text>
        </View>
        <View style={styles.filters}>
          {(['All', ...colours] as Filter[]).map((option) => (
            <Pressable
              key={option}
              onPress={() => setFilter(option)}
              accessibilityRole="button"
              accessibilityState={{ selected: filter === option }}
              hitSlop={6}
              style={({ pressed }) => [styles.filterBtn, pressed && styles.pressed]}
            >
              {option === 'All' ? null : (
                <View
                  style={[styles.swatch, { backgroundColor: clothSwatch[option] }]}
                />
              )}
              <Text style={[styles.filter, filter === option ? styles.filterOn : styles.filterOff]}>
                {option}
              </Text>
            </Pressable>
          ))}
        </View>
        {shown.length === 0 ? (
          <Body>No piece in this colour.</Body>
        ) : (
          shown.map((product) => (
            <HouseCard
              key={product.id}
              product={product}
              onPress={() => open(productPath(product))}
            />
          ))
        )}
        <View style={styles.foot}>
          <Body>
            Each piece leaves unscented, in a garment bag and a rigid box. The scent is coming, as its own line.
          </Body>
          <View style={styles.gap} />
          {collection ? (
            <GhostLink label="The Shop" onPress={() => open('/shop')} />
          ) : (
            <OutlineButton label="Visit by appointment" onPress={() => open('/visit')} />
          )}
          <GhostLink label="The Scent" onPress={() => open('/scent')} />
        </View>
      </View>
      <HouseMotto quiet />
    </RoomScroll>
  )
}

const styles = StyleSheet.create({
  gap: { height: 16 },
  meta: {
    marginTop: 36,
    marginBottom: 20,
    gap: 8,
  },
  count: {
    color: color.stone,
    fontFamily: type.sansRegular,
    fontSize: 11,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
  note: {
    color: color.stone,
    fontFamily: type.sans,
    fontSize: 13,
    fontWeight: '300',
    lineHeight: 20,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
    marginBottom: 28,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  swatch: {
    width: 10,
    height: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(26, 24, 20, 0.15)',
  },
  filter: {
    fontFamily: type.sansRegular,
    fontSize: 11,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    paddingBottom: 4,
  },
  filterOn: {
    color: color.ink,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: color.ink,
  },
  filterOff: {
    color: color.stone,
  },
  foot: {
    marginTop: 12,
    gap: 22,
  },
  pressed: {
    opacity: 0.55,
  },
})
