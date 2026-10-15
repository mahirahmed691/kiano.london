import { StyleSheet, Text, View } from 'react-native'

import { HouseImage } from '../HouseImage'
import { HouseMotto } from '../HouseMotto'
import { RoomScroll, paper, section } from '../HousePaper'
import { HouseStill } from '../HouseStill'
import { Body, Display, Eyebrow, GhostLink, OutlineButton } from '../HouseType'
import { creedIntent, creedMotto, creedSpoken, creedStandard, creedWoven, site } from '../catalogue'
import { color, type } from '../theme'
import { type HouseNav } from './nav'

export function StoryRoom({ open, roomHeight, bottomInset, onOverlay }: HouseNav) {
  return (
    <RoomScroll
      bottomInset={bottomInset}
      overlayHero
      heroHeight={roomHeight}
      onOverlay={onOverlay}
    >
      <HouseStill
        src="/images/atelier-rail.jpg"
        alt="The house line on the rail: black, sand, and bone."
        objectPosition="18% 40%"
        kicker={creedStandard}
        title="The house."
        quiet
        height={roomHeight}
        priority
      />

      <View style={paper()}>
        <HouseImage
          src="/images/cloth-giza.jpg"
          alt="Extra-long staple cotton unrolled, before it is chalked."
          objectPosition="center 40%"
          style={styles.split}
        />
        <View style={styles.space} />
        <Eyebrow>{site.established}</Eyebrow>
        <View style={styles.space} />
        <Display size={32}>Founded for those who preferred to be well dressed rather than noticed.</Display>
        <View style={styles.gap} />
        <Body>
          {`${creedWoven} ${creedIntent} The first ledger lists thobes, not customers. Cloth chosen to last, and a belief that a modest column of cloth is a long conversation, not a season. ${creedMotto}`}
        </Body>
        <View style={styles.gap} />
        <Body>
          The name is Kiano London. It is not a translation, and not a legend taken from elsewhere. We remain a single address and the same silhouette: ankle, shoulder, placket concealed.
        </Body>
      </View>

      <HouseImage
        src="/images/look-lanesborough.jpg"
        alt="A white Emirati thobe at The Lanesborough, Hyde Park Corner."
        objectPosition="center 22%"
        style={[styles.week, { height: roomHeight * 0.82 }]}
      />
      <View style={paper()}>
        <Eyebrow>Hyde Park Corner</Eyebrow>
        <View style={styles.space} />
        <Display size={36}>The white column.</Display>
        <View style={styles.gap} />
        <Body>
          The stills are the line as it is worn: London stone, a quiet column, a caption that ends with the name of the house. Not a second look for a feed.
        </Body>
        <View style={styles.gap} />
        <GhostLink label="The stills" onPress={() => open('/stills')} />
      </View>

      <View style={section()}>
        <Eyebrow>{creedStandard}</Eyebrow>
        <View style={styles.space} />
        <Display size={36}>{creedSpoken}</Display>
        <View style={styles.words}>
          <View style={styles.word}>
            <Text style={styles.wordTitle}>Discipline</Text>
            <Body>
              Paper for the Emirati thobe is kept. One block, one silhouette. New patterns are added; old ones are not discarded. The shears follow the grain.
            </Body>
          </View>
          <View style={styles.word}>
            <Text style={styles.wordTitle}>Craftsmanship</Text>
            <Body>
              Ready-to-wear follows the same methods as commission work: felled seams, pad-stitched collars, a finish from the inside. The difference is only time.
            </Body>
          </View>
          <View style={styles.word}>
            <Text style={styles.wordTitle}>Purpose</Text>
            <Body>
              {`There is no window dressing. Cloth is shown on the table. A thobe is tried in natural light, then worn with intent. ${creedMotto}`}
            </Body>
          </View>
        </View>
      </View>

      <HouseMotto />

      <View style={section()}>
        <HouseImage
          src="/images/cutting-room.jpg"
          alt="Paper, shears, and cloth: the work of a thobe."
          objectPosition="center 40%"
          style={styles.split}
        />
        <View style={styles.space} />
        <Eyebrow>Visit</Eyebrow>
        <View style={styles.space} />
        <Display size={36}>By appointment</Display>
        <View style={styles.gap} />
        <Body>
          {`Write to the atelier if you wish to see cloth, sit for a fitting, or simply come. We keep the diary small on purpose. ${creedIntent}`}
        </Body>
        <View style={styles.actions}>
          <OutlineButton label="Visit by appointment" onPress={() => open('/visit')} />
          <GhostLink label="How it is made" onPress={() => open('/craftsmanship')} />
        </View>
      </View>
    </RoomScroll>
  )
}

const styles = StyleSheet.create({
  space: { height: 16 },
  gap: { height: 16 },
  split: {
    width: '100%',
    aspectRatio: 4 / 5,
  },
  week: {
    width: '100%',
    backgroundColor: color.night,
  },
  words: {
    marginTop: 32,
    gap: 28,
  },
  word: {
    paddingBottom: 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: color.rule,
    gap: 12,
  },
  wordTitle: {
    color: color.ink,
    fontFamily: type.displayLight,
    fontSize: 28,
    fontWeight: '300',
  },
  actions: {
    marginTop: 28,
    gap: 20,
    alignItems: 'flex-start',
  },
})
