import { Pressable, StyleSheet, Text, View } from 'react-native'

import { HouseImage } from '../HouseImage'
import { HouseMotto } from '../HouseMotto'
import { HousePatch } from '../HousePatch'
import { RoomScroll, paper, section } from '../HousePaper'
import { HouseStill } from '../HouseStill'
import { Body, Display, Eyebrow, GhostLink, OutlineButton } from '../HouseType'
import {
  colourOfPiece,
  creedSpoken,
  creedWoven,
  instagramPlates,
  plateCopy,
  plateDestination,
  plateIntervalDays,
  plateKindLabel,
  plateLinkLabel,
  plateNumber,
  site,
  thisWeekPlate,
} from '../catalogue'
import { color, type } from '../theme'
import { type HouseNav } from './nav'

type Props = HouseNav & {
  plateId?: string
}

export function StillsRoom({ open, roomHeight, bottomInset, onOverlay, plateId }: Props) {
  const week = thisWeekPlate()
  const focus = instagramPlates.find((plate) => plate.id === plateId) ?? week
  const weekCopy = plateCopy(week.caption)

  return (
    <RoomScroll
      bottomInset={bottomInset}
      overlayHero
      heroHeight={roomHeight}
      onOverlay={onOverlay}
    >
      <HouseStill
        src={focus.src}
        alt={focus.alt}
        objectPosition={focus.objectPosition}
        kicker={
          focus.id === week.id
            ? focus.place === focus.name
              ? 'This week'
              : `This week · ${focus.place}`
            : `${plateNumber(focus)} · ${focus.place}`
        }
        title={focus.name}
        quiet
        height={roomHeight}
        priority
        onPress={
          plateDestination(focus) ? () => open(plateDestination(focus)!) : undefined
        }
      />

      <View style={paper()}>
        <Eyebrow>{`This week · ${week.place}`}</Eyebrow>
        <View style={styles.space} />
        <Display size={36}>The stills.</Display>
        <Text style={styles.lockup}>{site.lockup}</Text>
        <View style={styles.gap} />
        <Body>
          {`One still a week, in this order. London stone, the column, a quiet line. ${creedWoven} The house does not invent a second look for a feed.`}
        </Body>
        <View style={styles.gap} />
        <Body>{`${weekCopy.lines.join(' ')} Cadence: every ${plateIntervalDays} days.`}</Body>
        {plateDestination(week) ? (
          <>
            <View style={styles.gap} />
            <GhostLink label={week.name} onPress={() => open(plateDestination(week)!)} />
          </>
        ) : null}

        <View style={styles.book}>
          <Text style={styles.bookKicker}>The book</Text>
          {instagramPlates.map((plate) => {
            const current = plate.id === week.id
            return (
              <Pressable
                key={plate.id}
                onPress={() => open(`/stills#${plate.id}`)}
                accessibilityRole="link"
                accessibilityLabel={plate.name}
                style={({ pressed }) => [styles.bookRow, pressed && styles.pressed]}
              >
                <Text style={styles.bookIndex}>{plateNumber(plate)}</Text>
                <Text style={styles.bookName}>{plate.name}</Text>
                {current ? <Text style={styles.bookNow}>This week</Text> : null}
              </Pressable>
            )
          })}
        </View>
      </View>

      <HouseMotto quiet />

      {instagramPlates.map((plate) => {
        const copy = plateCopy(plate.caption)
        const current = plate.id === week.id
        const child = plate.children?.[0]
        const to = plateDestination(plate)
        return (
          <View key={plate.id} style={section()}>
            <View style={styles.plateStill}>
              <HouseImage
                src={plate.src}
                alt={plate.alt}
                objectPosition={plate.objectPosition}
                style={styles.plateImage}
              />
              {colourOfPiece(plate.id) ? (
                <View style={styles.platePatch} pointerEvents="none">
                  <HousePatch colour={colourOfPiece(plate.id)!} size={52} />
                </View>
              ) : null}
            </View>
            <Text style={styles.kicker}>
              {`${plateNumber(plate)} · ${plateKindLabel(plate.kind)}${current ? ' · This week' : ''}`}
            </Text>
            <Text style={styles.plateName}>{plate.name}</Text>
            <Text style={styles.place}>{plate.place}</Text>
            {copy.lines.map((line) => (
              <Body key={line}>{line}</Body>
            ))}
            {copy.mark ? <Text style={styles.lockup}>{copy.mark}</Text> : null}
            {to ? (
              <View style={styles.gap}>
                <GhostLink label={plateLinkLabel(to)} onPress={() => open(to)} />
              </View>
            ) : null}
            {child ? (
              <View style={styles.child}>
                <HouseImage
                  src={child.src}
                  alt={child.alt}
                  objectPosition={child.objectPosition}
                  style={styles.childImage}
                />
              </View>
            ) : null}
          </View>
        )
      })}

      <View style={section()}>
        <Eyebrow>The house</Eyebrow>
        <View style={styles.space} />
        <Display size={36}>By appointment</Display>
        <View style={styles.gap} />
        <Body>
          {`The stills are the line as it is worn. Cloth is shown on the table. A visit is the next still. ${creedSpoken}`}
        </Body>
        <View style={styles.actions}>
          <OutlineButton label="Visit by appointment" onPress={() => open('/visit')} />
          <GhostLink label="The Collection" onPress={() => open('/collection')} />
        </View>
      </View>
    </RoomScroll>
  )
}

const styles = StyleSheet.create({
  space: { height: 16 },
  gap: { height: 16 },
  lockup: {
    marginTop: 18,
    color: 'rgba(27, 23, 20, 0.55)',
    fontFamily: type.sansRegular,
    fontSize: 11,
    letterSpacing: 4.2,
    textTransform: 'uppercase',
  },
  book: {
    marginTop: 40,
    paddingTop: 28,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: color.rule,
    gap: 12,
  },
  bookKicker: {
    marginBottom: 8,
    color: color.stone,
    fontFamily: type.sansRegular,
    fontSize: 11,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
  bookRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 16,
  },
  bookIndex: {
    width: 28,
    color: color.stone,
    fontFamily: type.sansRegular,
    fontSize: 11,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
  },
  bookName: {
    flex: 1,
    color: color.ink,
    fontFamily: type.displayLight,
    fontSize: 22,
    fontWeight: '300',
    letterSpacing: -0.3,
  },
  bookNow: {
    color: color.stone,
    fontFamily: type.sansRegular,
    fontSize: 11,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
  },
  plateStill: {
    position: 'relative',
    aspectRatio: 3 / 4,
    overflow: 'hidden',
    backgroundColor: color.ivoryDeep,
    marginBottom: 22,
  },
  plateImage: {
    width: '100%',
    height: '100%',
  },
  platePatch: {
    position: 'absolute',
    left: 12,
    bottom: 12,
  },
  kicker: {
    color: color.stone,
    fontFamily: type.sansRegular,
    fontSize: 11,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
  plateName: {
    marginTop: 12,
    color: color.ink,
    fontFamily: type.displayLight,
    fontSize: 32,
    fontWeight: '300',
    letterSpacing: -0.4,
  },
  place: {
    marginTop: 10,
    marginBottom: 14,
    color: color.stone,
    fontFamily: type.sansRegular,
    fontSize: 11,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
  child: {
    marginTop: 28,
    aspectRatio: 3 / 4,
    overflow: 'hidden',
    backgroundColor: color.ivoryDeep,
  },
  childImage: {
    width: '100%',
    height: '100%',
  },
  actions: {
    marginTop: 28,
    gap: 20,
    alignItems: 'flex-start',
  },
  pressed: {
    opacity: 0.62,
  },
})
