import { StyleSheet, View } from 'react-native'

import { HouseImage } from '../HouseImage'
import { HouseMotto } from '../HouseMotto'
import { RoomScroll, paper, section } from '../HousePaper'
import { HouseStill } from '../HouseStill'
import { Body, Display, Eyebrow, GhostLink, OutlineButton } from '../HouseType'
import { creedSpoken, detailSections } from '../catalogue'
import { type HouseNav } from './nav'

export function MakingDetailsRoom({ open, roomHeight, bottomInset, onOverlay }: HouseNav) {
  return (
    <RoomScroll
      bottomInset={bottomInset}
      overlayHero
      heroHeight={roomHeight}
      onOverlay={onOverlay}
    >
      <HouseStill
        src="/images/stitch-felled.jpg"
        alt="A felled seam at close range: the allowance enclosed, the face a single plane."
        objectPosition="center"
        kicker="The making"
        title="In detail."
        quiet
        height={roomHeight}
        bottomInset={bottomInset}
        priority
      />

      <View style={paper()}>
        <Eyebrow>An editorial of four</Eyebrow>
        <View style={styles.space} />
        <Display size={36}>Seam, stitch, fastening, the unseen.</Display>
        <View style={styles.gap} />
        <Body>
          {`${creedSpoken} A column is judged from ten paces. It is made in millimetres. These are not selling points. They are the reasons a piece can be worn again. We write them down so they are not treated as folklore.`}
        </Body>
      </View>

      {detailSections.map((block) => (
        <View key={block.id} style={section()}>
          <HouseImage src={block.image} alt={block.imageAlt} style={styles.split} />
          <View style={styles.space} />
          <Eyebrow>{block.kicker}</Eyebrow>
          <View style={styles.space} />
          <Display size={32}>{block.title}</Display>
          {block.copy.map((paragraph) => (
            <View key={paragraph.slice(0, 24)} style={styles.gap}>
              <Body>{paragraph}</Body>
            </View>
          ))}
        </View>
      ))}

      <HouseMotto quiet />

      <View style={section()}>
        <Eyebrow>Continue</Eyebrow>
        <View style={styles.space} />
        <Display size={36}>From the block to the rail.</Display>
        <View style={styles.gap} />
        <Body>
          See the line these methods produce, or return to the four acts of the making.
        </Body>
        <View style={styles.actions}>
          <OutlineButton label="The Collection" onPress={() => open('/collection')} />
          <GhostLink label="Craftsmanship" onPress={() => open('/craftsmanship')} />
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
  actions: {
    marginTop: 28,
    gap: 20,
    alignItems: 'flex-start',
  },
})
