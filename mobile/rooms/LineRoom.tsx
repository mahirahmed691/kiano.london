import { useMemo, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { HouseCard } from '../HouseCard'
import { HouseMotto } from '../HouseMotto'
import { RoomScroll, paper } from '../HousePaper'
import { HouseStill } from '../HouseStill'
import { Body, Display, GhostLink, OutlineButton } from '../HouseType'
import {
  creedIntent,
  creedMotto,
  jubbahColours,
  jubbahs,
  productColours,
  productLineName,
  productPath,
  thobes,
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
  const pieces = collection ? thobes : jubbahs
  const colours = collection ? productColours : jubbahColours
  const shown = useMemo(
    () => (filter === 'All' ? pieces : pieces.filter((item) => item.colour === filter)),
    [filter, pieces],
  )

  const countLabel = collection
    ? `${String(shown.length).padStart(2, '0')} ${shown.length === 1 ? 'piece' : 'pieces'}`
    : `${String(shown.length).padStart(2, '0')} ${shown.length === 1 ? 'colour' : 'colours'}`

  return (
    <RoomScroll
      bottomInset={bottomInset}
      overlayHero
      heroHeight={roomHeight}
      onOverlay={onOverlay}
    >
      {collection ? (
        <HouseStill
          src="/images/thobe-layl.jpg"
          alt="The Layl thobe: matte black, band collar, hem to the ankle."
          objectPosition="center 12%"
          kicker="Emirati thobe"
          title="The Collection."
          height={roomHeight}
          priority
        >
          <Text style={styles.arabic}>الثوب</Text>
        </HouseStill>
      ) : (
        <HouseStill
          src="/images/jubbah-sand-02.jpg"
          alt="Urban Emirati in cream at rest, the cloth to the ankle."
          objectPosition="center 22%"
          kicker="The outer garment"
          title="The Shop."
          height={roomHeight}
          priority
        >
          <Text style={styles.arabic}>الجُبَّة</Text>
        </HouseStill>
      )}

      <View style={paper()}>
        <Display size={28}>
          {collection
            ? 'Five columns: Layl, Hadīd, Ghabār, Raml and Hajar.'
            : jubbahs.map((piece) => productLineName(piece)).join('\n')}
        </Display>
        <View style={styles.gap} />
        <Body>
          {collection
            ? `Black, charcoal, grey, beige and bone. ${creedMotto}`
            : `Cotton viscose mix, light GSM. Five sizes, 52 to 60. ${creedIntent}`}
        </Body>
        <View style={styles.meta}>
          <Text style={styles.count}>{countLabel}</Text>
          <Text style={styles.note}>
            Sizes 52–60. Made to order, four to eight weeks.
          </Text>
        </View>
        <View style={styles.filters}>
          {(['All', ...colours] as Filter[]).map((option) => (
            <Pressable
              key={option}
              onPress={() => setFilter(option)}
              accessibilityRole="button"
              accessibilityState={{ selected: filter === option }}
              hitSlop={6}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <Text style={[styles.filter, filter === option ? styles.filterOn : styles.filterOff]}>
                {option}
              </Text>
            </Pressable>
          ))}
        </View>
        {shown.length === 0 ? (
          <Body>{collection ? 'No thobe in this colour.' : 'No piece in this colour.'}</Body>
        ) : (
          shown.map((product, index) => (
            <HouseCard
              key={product.id}
              product={product}
              index={collection ? String(index + 1).padStart(2, '0') : undefined}
              onPress={() => open(productPath(product))}
            />
          ))
        )}
        <View style={styles.foot}>
          <Body>
            {collection
              ? 'The garment is the outer column; the thobe is the one beneath.'
              : 'The house also keeps the thobe. This garment is the outer column; the thobe is the one beneath.'}
          </Body>
          <View style={styles.gap} />
          {collection ? (
            <GhostLink label="The Shop" onPress={() => open('/shop')} />
          ) : (
            <OutlineButton label="The thobes" onPress={() => open('/collection')} />
          )}
          <GhostLink label="The Scent" onPress={() => open('/scent')} />
        </View>
      </View>
      <HouseMotto quiet />
    </RoomScroll>
  )
}

const styles = StyleSheet.create({
  arabic: {
    marginTop: 18,
    color: 'rgba(242, 235, 220, 0.7)',
    fontFamily: type.arabic,
    fontSize: 24,
    writingDirection: 'rtl',
    alignSelf: 'flex-start',
  },
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
