import { Linking } from 'react-native'
import { StyleSheet, Text, View } from 'react-native'

import { HouseImage } from '../HouseImage'
import { HousePatch } from '../HousePatch'
import { HouseMotto } from '../HouseMotto'
import { HouseSizeGuide } from '../HouseSizeGuide'
import { RoomScroll, paper, section } from '../HousePaper'
import { HouseStill } from '../HouseStill'
import { Body, Display, Eyebrow, GhostLink, OutlineButton } from '../HouseType'
import {
  colourOfPiece,
  creedIntent,
  measureLead,
  measureStill,
  plateCopy,
  site,
  thisWeekShopPlate,
} from '../catalogue'
import { color, type } from '../theme'
import { type HouseNav } from './nav'

const visitSteps = [
  {
    number: '01',
    title: 'Write',
    copy: 'Name the piece if you know it, and a size if you have one. If you do not, say so. The house names a morning. There is no calendar to pick from.',
  },
  {
    number: '02',
    title: 'Sit',
    copy: 'Cloth is shown on the table in daylight. A thobe is tried. The stills are the line as it is worn; a visit is the next still. The appointment lasts as long as it needs to.',
  },
  {
    number: '03',
    title: 'After',
    copy: 'The piece is made from the house block. A second visit for a fitting if the garment asks for one.',
  },
]

export function VisitRoom({ open, openWeb, roomHeight, bottomInset, onOverlay }: HouseNav) {
  const week = thisWeekShopPlate()
  const weekCopy = plateCopy(week.caption)

  return (
    <RoomScroll
      bottomInset={bottomInset}
      overlayHero
      heroHeight={roomHeight}
      onOverlay={onOverlay}
    >
      <HouseStill
        src="/images/cutting-room.jpg"
        alt="Paper, shears, and cloth: the work of a thobe."
        objectPosition="center 40%"
        kicker="The house"
        title="By appointment."
        quiet
        height={roomHeight}
        priority
      />

      <View style={paper()}>
        <Eyebrow>A visit</Eyebrow>
        <View style={styles.space} />
        <Display size={36}>Three acts.</Display>
        <View style={styles.gap} />
        <Body>{`There is no shop window. Come to see cloth, or to be fitted. Write first. ${creedIntent}`}</Body>
        <View style={styles.steps}>
          {visitSteps.map((step) => (
            <View key={step.number}>
              <Text style={styles.kicker}>{step.number}</Text>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Body>{step.copy}</Body>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.weekHold, { height: roomHeight * 0.72 }]}>
        <HouseImage
          src={week.src}
          alt={week.alt}
          objectPosition={week.objectPosition}
          style={styles.weekStill}
        />
        {colourOfPiece(week.id) ? (
          <View style={styles.weekPatch} pointerEvents="none">
            <HousePatch colour={colourOfPiece(week.id)!} size={52} />
          </View>
        ) : null}
      </View>
      <View style={paper()}>
        <Eyebrow>{`This week · ${week.place}`}</Eyebrow>
        <View style={styles.space} />
        <Display size={36}>{week.name}</Display>
        <View style={styles.gap} />
        <Body>
          {`${weekCopy.lines[0] ?? week.alt} A visit is the next still. Cloth is shown on the table; the book is the line as it is worn.`}
        </Body>
        <View style={styles.gap} />
        <GhostLink label="The stills" onPress={() => open('/stills')} />
      </View>

      <HouseMotto quiet />

      <View style={section()}>
        <Eyebrow>The letter</Eyebrow>
        <View style={styles.space} />
        <Display size={36}>Request a time.</Display>
        <View style={styles.gap} />
        <Body>
          The house keeps the letter in the diary. It is held, not a booking. The house names a morning, or writes that it cannot be kept.
        </Body>
        <View style={styles.actions}>
          <OutlineButton label="Write" onPress={() => openWeb('/visit')} />
          <GhostLink
            label={site.email}
            onPress={() => {
              void Linking.openURL(`mailto:${site.email}`)
            }}
          />
        </View>
        <Text style={styles.kicker}>The house</Text>
        <Body>{`${site.city}\n${site.hours}`}</Body>
      </View>

      <View style={section()}>
        <HouseImage
          src={measureStill.src}
          alt={measureStill.alt}
          objectPosition={measureStill.objectPosition}
          style={styles.measureStill}
        />
        <View style={styles.space} />
        <Eyebrow>Sizes 52–60</Eyebrow>
        <View style={styles.space} />
        <Display size={36}>Against a thobe you own.</Display>
        <View style={styles.gap} />
        <Body>{measureLead}</Body>
        <View style={styles.gap} />
        <HouseSizeGuide compact />
        <View style={styles.gap} />
        <Body>Prices include VAT. Each piece is made to order. A visit is not required.</Body>
      </View>
    </RoomScroll>
  )
}

const styles = StyleSheet.create({
  space: { height: 16 },
  gap: { height: 16 },
  steps: {
    marginTop: 36,
    gap: 28,
  },
  kicker: {
    marginTop: 20,
    color: color.stone,
    fontFamily: type.sansRegular,
    fontSize: 11,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
  stepTitle: {
    marginTop: 8,
    marginBottom: 10,
    color: color.ink,
    fontFamily: type.displayLight,
    fontSize: 28,
    fontWeight: '300',
  },
  weekHold: {
    position: 'relative',
    width: '100%',
    backgroundColor: color.night,
    overflow: 'hidden',
  },
  weekStill: {
    width: '100%',
    height: '100%',
  },
  weekPatch: {
    position: 'absolute',
    left: 20,
    bottom: 20,
  },
  measureStill: {
    width: '100%',
    aspectRatio: 4 / 5,
    backgroundColor: color.ivoryDeep,
  },
  actions: {
    marginTop: 24,
    marginBottom: 8,
    gap: 20,
    alignItems: 'flex-start',
  },
})
