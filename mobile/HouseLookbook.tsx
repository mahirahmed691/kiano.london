import { StyleSheet, Text, View } from 'react-native'

import { HouseImage } from './HouseImage'
import { HousePatch } from './HousePatch'
import { type ProductColour } from './catalogue'
import { color, type } from './theme'

export type HouseLook = {
  src: string
  alt: string
  objectPosition?: string
  kicker?: string
  name?: string
  colour?: ProductColour
}

export function HouseLookbook({ plates }: { plates: readonly HouseLook[] }) {
  return (
    <View style={styles.strip}>
      {plates.map((plate) => (
        <View key={plate.src} style={styles.plate}>
          <View style={styles.still}>
            <HouseImage
              src={plate.src}
              alt={plate.alt}
              objectPosition={plate.objectPosition}
              style={styles.image}
            />
            {plate.colour ? (
              <View style={styles.patch} pointerEvents="none">
                <HousePatch colour={plate.colour} size={52} />
              </View>
            ) : null}
          </View>
          {plate.kicker || plate.name ? (
            <View style={styles.caption}>
              {plate.kicker ? <Text style={styles.kicker}>{plate.kicker}</Text> : null}
              {plate.name ? <Text style={styles.name}>{plate.name}</Text> : null}
            </View>
          ) : null}
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  strip: {
    gap: 1,
    backgroundColor: color.rule,
  },
  plate: {
    backgroundColor: color.ivory,
  },
  still: {
    aspectRatio: 3 / 4,
    overflow: 'hidden',
    backgroundColor: color.ivoryDeep,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  patch: {
    position: 'absolute',
    left: 12,
    bottom: 12,
  },
  caption: {
    paddingHorizontal: 4,
    paddingVertical: 22,
  },
  kicker: {
    color: color.stone,
    fontFamily: type.sansRegular,
    fontSize: 10,
    letterSpacing: 3.2,
    textTransform: 'uppercase',
  },
  name: {
    marginTop: 6,
    color: color.ink,
    fontFamily: type.displayLight,
    fontSize: 22,
    fontWeight: '300',
    letterSpacing: -0.3,
  },
})
