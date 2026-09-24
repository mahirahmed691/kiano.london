import { Pressable, StyleSheet, Text, View } from 'react-native'

import { HouseImage } from '../HouseImage'
import { HouseMotto } from '../HouseMotto'
import { RoomScroll, paper, section } from '../HousePaper'
import { HouseStill } from '../HouseStill'
import { Arabic, Body, Display, Eyebrow, GhostLink, OutlineButton } from '../HouseType'
import {
  creedIntent,
  getScent,
  relatedScents,
  scentArabic,
  scentComing,
  scentFamilies,
  scentPath,
  scents,
} from '../catalogue'
import { color, type } from '../theme'
import { type HouseNav } from './nav'

type Props = HouseNav & {
  scentId?: string
}

function ScentStillCard({
  name,
  src,
  alt,
  objectPosition,
  onPress,
  index,
}: {
  name: string
  src: string
  alt: string
  objectPosition?: string
  onPress: () => void
  index?: string
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${name}, coming`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.still}>
        <HouseImage src={src} alt={alt} objectPosition={objectPosition} style={styles.image} />
        <View style={styles.label} pointerEvents="none">
          <Text style={styles.woven}>KIANO</Text>
          <Text style={styles.wovenCity}>LONDON</Text>
        </View>
      </View>
      <View style={styles.meta}>
        <View style={styles.copy}>
          {index ? <Text style={styles.index}>{index}</Text> : null}
          <Text style={styles.name}>{name}</Text>
        </View>
        <Text style={styles.coming}>{scentComing}</Text>
      </View>
    </Pressable>
  )
}

export function ScentRoom({
  open,
  scentId,
  roomHeight,
  bottomInset,
  onOverlay,
}: Props) {
  const named = scentId ? getScent(scentId) : undefined

  if (scentId && !named) {
    return (
      <View style={[paper(), { flex: 1, paddingTop: 96 }]}>
        <Eyebrow>The Scent</Eyebrow>
        <View style={styles.space} />
        <Display>This scent is not of the house.</Display>
        <View style={styles.gap} />
        <GhostLink label="The Scent" onPress={() => open('/scent')} />
      </View>
    )
  }

  if (named) {
    const rest = named.gallery.slice(1)
    const related = relatedScents(named.id)

    return (
      <RoomScroll
        bottomInset={bottomInset}
        overlayHero
        heroHeight={roomHeight}
        onOverlay={onOverlay}
      >
        <HouseStill
          src={named.image}
          alt={named.imageAlt}
          objectPosition={named.objectPosition}
          quiet
          height={roomHeight}
          priority
        />

        <View style={paper()}>
          <Eyebrow>{scentComing}</Eyebrow>
          <View style={styles.space} />
          <Display size={36}>{`${named.name}.`}</Display>
          <View style={styles.space} />
          <Arabic>{scentArabic}</Arabic>
          <View style={styles.gap} />
          <Body>
            Arabian Oud, and eau de parfum. The name is of the house. The bottle is not yet of the bag.
          </Body>
          <View style={styles.actions}>
            <OutlineButton label="The Scent" onPress={() => open('/scent')} />
            <GhostLink label="Visit by appointment" onPress={() => open('/visit')} />
          </View>
        </View>

        {rest.map((still) => (
          <View key={`${still.src}-${still.objectPosition ?? ''}`} style={section()}>
            <HouseImage
              src={still.src}
              alt={still.alt}
              objectPosition={still.objectPosition}
              style={styles.splitStill}
            />
            {still.kicker ? <Text style={styles.lineKicker}>{still.kicker}</Text> : null}
          </View>
        ))}

        <HouseMotto quiet />

        <View style={section()}>
          <Eyebrow>The three</Eyebrow>
          <View style={styles.space} />
          <Display size={32}>Also coming.</Display>
          <View style={styles.gap} />
          {related.map((piece, index) => (
            <ScentStillCard
              key={piece.id}
              name={piece.name}
              src={piece.image}
              alt={piece.imageAlt}
              objectPosition={piece.objectPosition}
              index={String(index + 1).padStart(2, '0')}
              onPress={() => open(scentPath(piece))}
            />
          ))}
        </View>
      </RoomScroll>
    )
  }

  const oud = scentFamilies[0]
  const eau = scentFamilies[1]

  return (
    <RoomScroll
      bottomInset={bottomInset}
      overlayHero
      heroHeight={roomHeight}
      onOverlay={onOverlay}
    >
      <HouseStill
        src="/images/scent-mayfair.jpg"
        alt="Mayfair: a bottle of Kiano London, Arabian Oud, in still light."
        objectPosition="center 42%"
        kicker={scentComing}
        title="The Scent."
        height={roomHeight}
        priority
      >
        <Text style={styles.arabicIvory}>{scentArabic}</Text>
      </HouseStill>

      <View style={paper()}>
        <Display size={28}>Three names: Mayfair, Bond Street, Kensington.</Display>
        <View style={styles.gap} />
        <Body>{`The scent is coming. It is not yet of the bag. ${creedIntent}`}</Body>
        <View style={styles.metaRow}>
          <Text style={styles.count}>{`${String(scents.length).padStart(2, '0')} names`}</Text>
          <Text style={styles.note}>Arabian Oud, and eau de parfum. Not on the till.</Text>
        </View>
        {scents.map((scent, index) => (
          <ScentStillCard
            key={scent.id}
            name={scent.name}
            src={scent.image}
            alt={scent.imageAlt}
            objectPosition={scent.objectPosition}
            index={String(index + 1).padStart(2, '0')}
            onPress={() => open(scentPath(scent))}
          />
        ))}
      </View>

      <HouseStill
        src={oud.src}
        alt={oud.alt}
        objectPosition={oud.objectPosition}
        kicker={oud.name}
        title="The three."
        quiet
        height={roomHeight}
      />

      <View style={section()}>
        <HouseImage
          src={eau.src}
          alt={eau.alt}
          objectPosition={eau.objectPosition}
          style={styles.splitStill}
        />
        <View style={styles.space} />
        <Eyebrow>{eau.name}</Eyebrow>
        <View style={styles.space} />
        <Display size={32}>The same three names.</Display>
        <View style={styles.gap} />
        <Body>
          Two stills. Arabian Oud, and eau de parfum. The cloth still leaves unscented. This line is its own still, when it is of the house.
        </Body>
        <View style={styles.lineBlock}>
          {scents.map((scent) => (
            <Pressable
              key={scent.id}
              onPress={() => open(scentPath(scent))}
              accessibilityRole="link"
              accessibilityLabel={scent.name}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <Text style={styles.lineName}>{scent.name}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <HouseMotto quiet />

      <View style={section()}>
        <Eyebrow>The list</Eyebrow>
        <View style={styles.space} />
        <Display size={32}>When it is of the house.</Display>
        <View style={styles.gap} />
        <Body>
          Write if you wish to be told. A visit is still for cloth. The scent is not yet reserved.
        </Body>
        <View style={styles.actions}>
          <OutlineButton label="Visit by appointment" onPress={() => open('/visit')} />
          <GhostLink label="The Shop" onPress={() => open('/shop')} />
          <GhostLink label="The Collection" onPress={() => open('/collection')} />
        </View>
      </View>
    </RoomScroll>
  )
}

const styles = StyleSheet.create({
  arabicIvory: {
    marginTop: 18,
    color: 'rgba(242, 235, 220, 0.7)',
    fontFamily: type.arabic,
    fontSize: 24,
    writingDirection: 'rtl',
    alignSelf: 'flex-start',
  },
  space: { height: 18 },
  gap: { height: 16 },
  actions: {
    marginTop: 28,
    gap: 22,
    alignItems: 'flex-start',
  },
  metaRow: {
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
  card: {
    marginBottom: 40,
  },
  still: {
    aspectRatio: 3 / 4,
    backgroundColor: color.ivoryDeep,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  label: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    width: 64,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    backgroundColor: color.night,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(184, 160, 129, 0.35)',
  },
  woven: {
    color: color.bronze,
    fontFamily: type.display,
    fontSize: 9,
    letterSpacing: 2.4,
  },
  wovenCity: {
    marginTop: 3,
    color: color.bronze,
    fontFamily: type.sansRegular,
    fontSize: 6,
    letterSpacing: 1.8,
  },
  meta: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
  },
  copy: {
    flex: 1,
  },
  index: {
    marginBottom: 8,
    color: color.stone,
    fontFamily: type.sansRegular,
    fontSize: 10,
    letterSpacing: 3.2,
    textTransform: 'uppercase',
  },
  name: {
    color: color.ink,
    fontFamily: type.displayLight,
    fontSize: 24,
    fontWeight: '300',
    letterSpacing: -0.3,
    lineHeight: 28,
  },
  coming: {
    color: color.inkSoft,
    fontFamily: type.sansRegular,
    fontSize: 11,
    letterSpacing: 1.8,
  },
  splitStill: {
    width: '100%',
    aspectRatio: 4 / 5,
    marginBottom: 8,
  },
  lineKicker: {
    marginTop: 14,
    color: color.stone,
    fontFamily: type.sansRegular,
    fontSize: 11,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
  lineBlock: {
    marginTop: 28,
    gap: 12,
  },
  lineName: {
    color: color.ink,
    fontFamily: type.displayLight,
    fontSize: 26,
    fontWeight: '300',
    letterSpacing: -0.3,
  },
  pressed: {
    opacity: 0.62,
  },
})
