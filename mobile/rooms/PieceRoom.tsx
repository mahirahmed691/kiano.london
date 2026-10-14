import { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { HouseImage } from '../HouseImage'
import { HouseMotto } from '../HouseMotto'
import { RoomScroll, paper, section } from '../HousePaper'
import { HouseStill } from '../HouseStill'
import { Arabic, Body, Display, Eyebrow, GhostLink, OutlineButton } from '../HouseType'
import {
  careLine,
  carriageLine,
  colourVariants,
  getProduct,
  packingNote,
  packingNoteAr,
  packingSteps,
  productLineName,
  productPath,
  relatedProducts,
  thobeSizes,
  type ThobeSize,
} from '../catalogue'
import { color, type } from '../theme'
import { type HouseNav } from './nav'

type Props = HouseNav & {
  pieceId: string
}

export function PieceRoom({
  open,
  openWeb,
  pieceId,
  roomHeight,
  bottomInset,
  onOverlay,
}: Props) {
  const product = getProduct(pieceId)
  const [size, setSize] = useState<ThobeSize | ''>('')

  if (!product) {
    return (
      <View style={[paper(), { flex: 1, paddingTop: 96 }]}>
        <Eyebrow>The line</Eyebrow>
        <View style={styles.space} />
        <Display>This piece is not in the collection.</Display>
        <View style={styles.gap} />
        <GhostLink label="The Shop" onPress={() => open('/shop')} />
      </View>
    )
  }

  const variants = colourVariants(product)
  const related = relatedProducts(product.id).slice(0, 3)
  const first = product.gallery[0] ?? {
    src: product.image,
    alt: product.imageAlt,
    objectPosition: product.objectPosition,
  }
  const rest = product.gallery.slice(1)
  const reservePath = size ? `${productPath(product)}?size=${size}` : productPath(product)

  return (
    <RoomScroll
      bottomInset={bottomInset}
      overlayHero
      heroHeight={roomHeight}
      onOverlay={onOverlay}
    >
      <HouseStill
        src={first.src}
        alt={first.alt}
        objectPosition={first.objectPosition ?? product.objectPosition}
        kicker={product.cut === 'Jubbah' ? 'The outer garment' : 'Emirati thobe'}
        title={productLineName(product)}
        height={roomHeight}
        priority
      >
        <Text style={styles.arabicIvory}>{product.arabicName}</Text>
      </HouseStill>

      <View style={paper()}>
        <Eyebrow>{product.cloth}</Eyebrow>
        <View style={styles.space} />
        <Display size={36}>{productLineName(product)}</Display>
        <Arabic>{product.arabicName}</Arabic>
        <View style={styles.gap} />
        <Body>{product.description}</Body>
        <Text style={styles.price}>{product.price}</Text>
        <Text style={styles.lead}>{product.leadTime}</Text>
        {variants.length > 1 ? (
          <View style={styles.row}>
            {variants.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => open(productPath(item))}
                accessibilityRole="button"
                accessibilityState={{ selected: item.id === product.id }}
                style={({ pressed }) => pressed && styles.pressed}
              >
                <Text style={[styles.chip, item.id === product.id ? styles.chipOn : styles.chipOff]}>
                  {item.colour}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : null}
        <Text style={styles.kicker}>Size</Text>
        <View style={styles.row}>
          {thobeSizes.map((value) => (
            <Pressable
              key={value}
              onPress={() => setSize(value)}
              accessibilityRole="button"
              accessibilityState={{ selected: size === value }}
              style={({ pressed }) => [
                styles.size,
                size === value && styles.sizeOn,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.sizeLabel, size === value && styles.sizeLabelOn]}>{value}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.actions}>
          <OutlineButton label="Reserve" onPress={() => openWeb(reservePath)} />
          <GhostLink label="A visit" onPress={() => open('/visit')} />
        </View>
        <View style={styles.gap} />
        {product.details.map((line) => (
          <Text key={line} style={styles.detail}>
            {line}
          </Text>
        ))}
        <Text style={styles.detail}>{product.composition}</Text>
        <Text style={styles.detail}>{careLine}</Text>
        <Text style={styles.detail}>{packingNote}</Text>
        <Arabic>{packingNoteAr}</Arabic>
        <Text style={styles.detail}>{carriageLine}</Text>
      </View>

      <View style={section()}>
        <Eyebrow>The packing</Eyebrow>
        <View style={styles.space} />
        <Display size={32}>How it leaves.</Display>
        {packingSteps.map((step) => (
          <View key={step.src} style={styles.packStep}>
            <HouseImage
              src={step.src}
              alt={step.alt}
              objectPosition={step.objectPosition}
              style={styles.packStill}
            />
            <Text style={styles.kicker}>{`${step.number} · ${step.title}`}</Text>
            <Body>{step.copy}</Body>
          </View>
        ))}
      </View>

      {rest.map((still) => (
        <HouseImage
          key={still.src}
          src={still.src}
          alt={still.alt}
          objectPosition={still.objectPosition}
          style={[styles.gallery, { height: roomHeight * 0.86 }]}
        />
      ))}

      <HouseMotto quiet />

      {related.length > 0 ? (
        <View style={section()}>
          <Eyebrow>Also on the line</Eyebrow>
          <View style={styles.space} />
          {related.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => open(productPath(item))}
              accessibilityRole="link"
              accessibilityLabel={productLineName(item)}
              style={({ pressed }) => [styles.related, pressed && styles.pressed]}
            >
              <HouseImage
                src={item.image}
                alt={item.imageAlt}
                objectPosition={item.objectPosition}
                style={styles.relatedStill}
              />
              <View style={styles.relatedCopy}>
                <Text style={styles.relatedName}>{productLineName(item)}</Text>
                <Text style={styles.relatedMeta}>{`${item.colour} · ${item.price}`}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      ) : null}
    </RoomScroll>
  )
}

const styles = StyleSheet.create({
  space: { height: 16 },
  gap: { height: 18 },
  arabicIvory: {
    marginTop: 16,
    color: 'rgba(242, 235, 220, 0.72)',
    fontFamily: type.arabic,
    fontSize: 24,
    writingDirection: 'rtl',
    alignSelf: 'flex-start',
  },
  price: {
    marginTop: 24,
    color: color.ink,
    fontFamily: type.sansRegular,
    fontSize: 13,
    letterSpacing: 2,
  },
  lead: {
    marginTop: 8,
    marginBottom: 24,
    color: color.stone,
    fontFamily: type.sans,
    fontSize: 13,
    fontWeight: '300',
  },
  kicker: {
    marginTop: 8,
    marginBottom: 12,
    color: color.stone,
    fontFamily: type.sansRegular,
    fontSize: 11,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  chip: {
    fontFamily: type.sansRegular,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    paddingBottom: 4,
  },
  chipOn: {
    color: color.ink,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: color.ink,
  },
  chipOff: {
    color: color.stone,
  },
  size: {
    minWidth: 48,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: color.rule,
    paddingHorizontal: 12,
  },
  sizeOn: {
    borderColor: color.ink,
    backgroundColor: color.ink,
  },
  sizeLabel: {
    color: color.ink,
    fontFamily: type.sansRegular,
    fontSize: 13,
    letterSpacing: 1.2,
  },
  sizeLabelOn: {
    color: color.ivory,
  },
  actions: {
    gap: 22,
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  detail: {
    marginBottom: 12,
    color: color.inkSoft,
    fontFamily: type.sans,
    fontSize: 15,
    fontWeight: '300',
    lineHeight: 26,
    maxWidth: 340,
  },
  gallery: {
    width: '100%',
    backgroundColor: color.night,
  },
  packStep: {
    marginTop: 28,
  },
  packStill: {
    width: '100%',
    aspectRatio: 3 / 4,
    marginBottom: 16,
    backgroundColor: color.ivoryDeep,
  },
  related: {
    marginBottom: 28,
  },
  relatedStill: {
    width: '100%',
    aspectRatio: 3 / 4,
  },
  relatedCopy: {
    marginTop: 14,
  },
  relatedName: {
    color: color.ink,
    fontFamily: type.displayLight,
    fontSize: 24,
    fontWeight: '300',
  },
  relatedMeta: {
    marginTop: 6,
    color: color.stone,
    fontFamily: type.sans,
    fontSize: 11,
    letterSpacing: 1.6,
  },
  pressed: {
    opacity: 0.62,
  },
})
