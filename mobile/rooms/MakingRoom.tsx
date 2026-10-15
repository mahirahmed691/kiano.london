import { StyleSheet, Text, View } from 'react-native'

import { HouseImage } from '../HouseImage'
import { HouseMotto } from '../HouseMotto'
import { RoomScroll, paper, section } from '../HousePaper'
import { HouseStill } from '../HouseStill'
import { Body, Display, Eyebrow, GhostLink, OutlineButton } from '../HouseType'
import { creedIntent, creedSpoken, materials, processSteps, stitchStudies } from '../catalogue'
import { color, type } from '../theme'
import { type HouseNav } from './nav'

export function MakingRoom({ open, roomHeight, bottomInset, onOverlay }: HouseNav) {
  return (
    <RoomScroll
      bottomInset={bottomInset}
      overlayHero
      heroHeight={roomHeight}
      onOverlay={onOverlay}
    >
      <HouseStill
        src="/images/worsted-wool.jpg"
        alt="A needle on charcoal cloth: the stitch that holds the column."
        objectPosition="center"
        kicker="Craftsmanship"
        title="The stitch."
        quiet
        height={roomHeight}
        priority
      />

      <View style={paper()}>
        <Eyebrow>Process</Eyebrow>
        <View style={styles.space} />
        <Display size={36}>The garment is built, not assembled.</Display>
        <View style={styles.gap} />
        <Body>
          {`${creedSpoken} Cloth. Pattern. Stitch. Finish. Every piece is built in that order. We do not fuse a collar because it is faster. The methods are kept because they still make a better garment. ${creedIntent}`}
        </Body>
        <View style={styles.heroAction}>
          <OutlineButton label="The making, in detail" onPress={() => open('/craftsmanship-details')} />
        </View>
        <View style={styles.steps}>
          {processSteps.map((step) => (
            <View key={step.number}>
              <HouseImage src={step.image} alt={step.imageAlt} style={styles.stepStill} />
              <Text style={styles.kicker}>{step.number}</Text>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Body>{step.summary}</Body>
            </View>
          ))}
        </View>
      </View>

      <View style={section()}>
        <Eyebrow>Studies</Eyebrow>
        <View style={styles.space} />
        <Display size={36}>Stitch, seam, fastening, pocket.</Display>
        <View style={styles.steps}>
          {stitchStudies.map((study) => (
            <View key={study.id}>
              <HouseImage src={study.image} alt={study.imageAlt} style={styles.studyStill} />
              <Text style={styles.stepTitle}>{study.title}</Text>
              <Body>{study.note}</Body>
            </View>
          ))}
        </View>
      </View>

      <HouseMotto quiet />

      <View style={section()}>
        <Eyebrow>Cloth</Eyebrow>
        <View style={styles.space} />
        <Display size={36}>Chosen in the piece.</Display>
        <View style={styles.steps}>
          {materials.map((cloth) => (
            <View key={cloth.name}>
              <Text style={styles.kicker}>{cloth.origin}</Text>
              <Text style={styles.stepTitle}>{cloth.name}</Text>
              <Body>{cloth.copy}</Body>
            </View>
          ))}
        </View>
        <View style={styles.actions}>
          <OutlineButton label="The Collection" onPress={() => open('/collection')} />
          <GhostLink label="A visit" onPress={() => open('/visit')} />
        </View>
      </View>
    </RoomScroll>
  )
}

const styles = StyleSheet.create({
  space: { height: 16 },
  gap: { height: 16 },
  heroAction: {
    marginTop: 24,
  },
  steps: {
    marginTop: 36,
    gap: 36,
  },
  stepStill: {
    width: '100%',
    aspectRatio: 5 / 4,
    marginBottom: 4,
  },
  studyStill: {
    width: '100%',
    aspectRatio: 4 / 5,
  },
  kicker: {
    marginTop: 16,
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
  actions: {
    marginTop: 32,
    gap: 20,
    alignItems: 'flex-start',
  },
})
