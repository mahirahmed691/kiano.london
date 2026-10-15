import { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { HouseImage } from '../HouseImage'
import { HouseMotto } from '../HouseMotto'
import { HousePatch } from '../HousePatch'
import { RoomScroll, paper, section } from '../HousePaper'
import { HouseStill } from '../HouseStill'
import { Arabic, Body, Display, Eyebrow, GhostLink, OutlineButton } from '../HouseType'
import {
  careLine,
  carriageLine,
  clothSwatch,
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
          <View>
            <Text style={styles.kicker}>Colour</Text>
            <View style={styles.row}>
              {variants.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => open(productPath(item))}
                  accessibilityRole="button"
                  accessibilityLabel={item.colour}
                  accessibilityState={{ selected: item.id === product.id }}
                  style={({ pressed }) => pressed && styles.pressed}
                >
                  <View
                    style={[
                      styles.swatch,
                      { backgroundColor: item.swatch ?? clothSwatch[item.colour] },
                      item.id === product.id ? styles.swatchOn : styles.swatchOff,
                    ]}
                  />
                </Pressable>
              ))}
            </View>
            <Text style={styles.colourName}>{product.colour}</Text>
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
        <View key={still.src} style={[styles.galleryWrap, { height: roomHeight * 0.86 }]}>
          <HouseImage
            src={still.src}
            alt={still.alt}
            objectPosition={still.objectPosition}
            style={styles.gallery}
          />
          <View style={styles.galleryPatch} pointerEvents="none">
            <HousePatch colour={product.colour} size={52} />
          </View>
        </View>
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
              <View style={styles.relatedStillWrap}>
                <HouseImage
                  src={item.image}
                  alt={item.imageAlt}
                  objectPosition={item.objectPosition}
                  style={styles.relatedStill}
                />
                <View style={styles.relatedPatch} pointerEvents="none">
                  <HousePatch colour={item.colour} size={36} />
                </View>
              </View>
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
  swatch: {
    width: 28,
    height: 28,
    borderWidth: StyleSheet.hairlineWidth,
  },
  swatchOn: {
    borderColor: color.ink,
  },
  swatchOff: {
    borderColor: color.rule,
    opacity: 0.7,
  },
  colourName: {
    marginTop: -12,
    marginBottom: 8,
    color: color.stone,
    fontFamily: type.sans,
    fontSize: 13,
    fontWeight: '300',
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
  galleryWrap: {
    width: '100%',
    backgroundColor: color.night,
    overflow: 'hidden',
  },
  gallery: {
    width: '100%',
    height: '100%',
    backgroundColor: color.night,
  },
  galleryPatch: {
    position: 'absolute',
    left: 20,
    bottom: 20,
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
  relatedStillWrap: {
    width: '100%',
    aspectRatio: 3 / 4,
    overflow: 'hidden',
    backgroundColor: color.ivoryDeep,
  },
  relatedStill: {
    width: '100%',
    height: '100%',
  },
  relatedPatch: {
    position: 'absolute',
    left: 10,
    bottom: 10,
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
