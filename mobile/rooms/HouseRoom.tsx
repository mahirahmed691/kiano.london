import { Pressable, StyleSheet, Text, View } from 'react-native'

import { HouseImage } from '../HouseImage'
import { HouseMotto } from '../HouseMotto'
import { RoomScroll, paper, section } from '../HousePaper'
import { HouseStill } from '../HouseStill'
import { Body, Display, Eyebrow, GhostLink, OutlineButton } from '../HouseType'
import {
  creedIntent,
  creedJoin,
  creedSpoken,
  creedStandard,
  creedWoven,
  houseCreed,
  jubbahs,
  plateCopy,
  productLineName,
  productPath,
  recentShopPlates,
  scentComing,
  scentPath,
  scents,
  thisWeekShopPlate,
} from '../catalogue'
import { color, type } from '../theme'
import { type HouseNav } from './nav'

export function HouseRoom({ open, roomHeight, bottomInset, onOverlay }: HouseNav) {
  const week = thisWeekShopPlate()
  const previous = recentShopPlates(4)
  const weekCopy = plateCopy(week.caption)
  const kicker = week.place === week.name ? 'This week' : `This week · ${week.place}`

  return (
    <RoomScroll
      bottomInset={bottomInset}
      overlayHero
      heroHeight={roomHeight}
      onOverlay={onOverlay}
    >
      <HouseStill
        src={week.src}
        alt={week.alt}
        objectPosition={week.objectPosition}
        kicker={kicker}
        title={week.name}
        quiet
        height={roomHeight}
        priority
        onPress={() => open('/stills')}
      />

      <View style={paper()}>
        <Eyebrow>{creedStandard}</Eyebrow>
        <View style={styles.space} />
        <Display size={44}>Worn with purpose.</Display>
        <Text style={styles.join}>{creedJoin}</Text>
        <Text style={styles.week}>{`This week · ${week.place}`}</Text>
        <Body>{weekCopy.lines[0] ?? week.name}</Body>
        <View style={styles.gap} />
        <Body>
          {`${creedWoven} ${creedIntent} Urban Emirati in stone grey, cream and black. The scent is coming.`}
        </Body>
        <View style={styles.actions}>
          <OutlineButton label="The stills" onPress={() => open('/stills')} />
          <GhostLink label="The Shop" onPress={() => open('/shop')} />
          <GhostLink label="The Collection" onPress={() => open('/collection')} />
          <GhostLink label="The Scent" onPress={() => open('/scent')} />
        </View>
      </View>

      <View style={section()}>
        <Eyebrow>The house</Eyebrow>
        <View style={styles.space} />
        <Display size={36}>{creedSpoken}</Display>
        <View style={styles.creed}>
          {houseCreed.map((item, index) => (
            <Pressable
              key={item.word}
              onPress={() => open('/story')}
              accessibilityRole="button"
              accessibilityLabel={item.word}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <HouseImage
                src={item.image}
                alt={item.imageAlt}
                objectPosition={item.objectPosition}
                style={styles.creedStill}
              />
              <Text style={styles.index}>{String(index + 1).padStart(2, '0')}</Text>
              <Text style={styles.word}>{item.word}</Text>
              <Body>{item.line}</Body>
            </Pressable>
          ))}
        </View>
      </View>

      <HouseMotto />

      <View style={section()}>
        <Eyebrow>The line</Eyebrow>
        <View style={styles.lineBlock}>
          <Text style={styles.lineKicker}>The Shop</Text>
          {jubbahs.map((piece) => (
            <Pressable
              key={piece.id}
              onPress={() => open(productPath(piece))}
              accessibilityRole="link"
              accessibilityLabel={productLineName(piece)}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <Text style={styles.lineName}>{productLineName(piece)}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.lineBlock}>
          <Text style={styles.lineKicker}>The Collection</Text>
          {jubbahs.map((piece) => (
            <Pressable
              key={`collection-${piece.id}`}
              onPress={() => open(productPath(piece))}
              accessibilityRole="link"
              accessibilityLabel={productLineName(piece)}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <Text style={styles.lineName}>{productLineName(piece)}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.lineBlock}>
          <Text style={styles.lineKicker}>The Scent</Text>
          {scents.map((scent) => (
            <Pressable
              key={scent.id}
              onPress={() => open(scentPath(scent))}
              accessibilityRole="link"
              accessibilityLabel={scent.name}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <Text style={styles.lineName}>{scent.name}</Text>
              <Text style={styles.lineNote}>{scent.line}</Text>
            </Pressable>
          ))}
          <Text style={styles.lineKicker}>{scentComing}</Text>
        </View>
      </View>

      {previous.map((plate, index) => (
        <HouseStill
          key={plate.id}
          src={plate.src}
          alt={plate.alt}
          objectPosition={plate.objectPosition}
          kicker={index === 0 ? `Last week · ${plate.place}` : plate.place}
          title={plate.name}
          quiet
          height={roomHeight}
          onPress={() => open(plate.to ?? '/stills')}
        />
      ))}

      <HouseStill
        src="/images/stitch-pad.jpg"
        alt="Stitching through the collar stand."
        objectPosition="center 40%"
        kicker="The stitch"
        title="Closer."
        quiet
        height={roomHeight}
        onPress={() => open('/craftsmanship')}
      />

      <View style={section()}>
        <HouseImage
          src="/images/cutting-room.jpg"
          alt="Paper, shears, and cloth: the work of a thobe."
          objectPosition="center 40%"
          style={styles.splitStill}
        />
        <View style={styles.space} />
        <Eyebrow>The house</Eyebrow>
        <View style={styles.space} />
        <Display size={36}>By appointment</Display>
        <View style={styles.gap} />
        <Body>
          Fittings are by appointment. We do not keep a shop window. The work is the invitation: Urban Emirati. A visit is the next still.
        </Body>
        <View style={styles.actions}>
          <OutlineButton label="Visit by appointment" onPress={() => open('/visit')} />
          <GhostLink label="The stills" onPress={() => open('/stills')} />
          <GhostLink label="The story" onPress={() => open('/story')} />
        </View>
      </View>
    </RoomScroll>
  )
}

const styles = StyleSheet.create({
  space: { height: 18 },
  gap: { height: 16 },
  join: {
    marginTop: 18,
    color: 'rgba(27, 23, 20, 0.5)',
    fontFamily: type.sansRegular,
    fontSize: 10,
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  week: {
    marginTop: 28,
    marginBottom: 14,
    color: color.stone,
    fontFamily: type.sansRegular,
    fontSize: 10,
    letterSpacing: 3.2,
    textTransform: 'uppercase',
  },
  actions: {
    marginTop: 28,
    gap: 22,
    alignItems: 'flex-start',
  },
  creed: {
    marginTop: 32,
    gap: 40,
  },
  creedStill: {
    width: '100%',
    aspectRatio: 4 / 5,
  },
  index: {
    marginTop: 18,
    color: color.stone,
    fontFamily: type.sansRegular,
    fontSize: 10,
    letterSpacing: 3.2,
    textTransform: 'uppercase',
  },
  word: {
    marginTop: 10,
    marginBottom: 12,
    color: color.ink,
    fontFamily: type.displayLight,
    fontSize: 32,
    fontWeight: '300',
    letterSpacing: -0.4,
  },
  lineBlock: {
    marginTop: 28,
    gap: 12,
  },
  lineKicker: {
    color: color.stone,
    fontFamily: type.sansRegular,
    fontSize: 11,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  lineName: {
    color: color.ink,
    fontFamily: type.displayLight,
    fontSize: 26,
    fontWeight: '300',
    letterSpacing: -0.3,
  },
  lineNote: {
    marginTop: 4,
    marginBottom: 6,
    color: color.stone,
    fontFamily: type.sans,
    fontSize: 13,
    fontWeight: '300',
    lineHeight: 20,
  },
  splitStill: {
    width: '100%',
    aspectRatio: 4 / 5,
    marginBottom: 8,
  },
  pressed: {
    opacity: 0.62,
  },
})
