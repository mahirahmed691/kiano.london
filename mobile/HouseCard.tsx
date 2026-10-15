import { Pressable, StyleSheet, Text, View } from 'react-native'

import { HouseImage } from './HouseImage'
import { HousePatch } from './HousePatch'
import { type Product } from './catalogue'
import { color, type } from './theme'

type Props = {
  product: Product
  index?: string
  onPress: () => void
}

export function HouseCard({ product, index, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${product.name}, ${product.colour}, ${product.price}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.still}>
        <HouseImage
          src={product.image}
          alt={product.imageAlt}
          objectPosition={product.objectPosition}
          style={styles.image}
        />
        <View style={styles.label} pointerEvents="none">
          <HousePatch colour={product.colour} size={52} />
        </View>
      </View>
      <View style={styles.meta}>
        <View style={styles.copy}>
          {index ? <Text style={styles.index}>{index}</Text> : null}
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.colour}>{product.colour}</Text>
        </View>
        <Text style={styles.price}>{product.price}</Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 40,
  },
  pressed: {
    opacity: 0.72,
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
  colour: {
    marginTop: 6,
    color: color.stone,
    fontFamily: type.sans,
    fontSize: 11,
    letterSpacing: 1.8,
  },
  price: {
    color: color.inkSoft,
    fontFamily: type.sansRegular,
    fontSize: 11,
    letterSpacing: 1.8,
  },
})
