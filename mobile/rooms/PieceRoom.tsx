import { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { HouseImage } from '../HouseImage'
import { HouseMotto } from '../HouseMotto'
import { HousePatch } from '../HousePatch'
import { HouseSizeGuide } from '../HouseSizeGuide'
import { RoomScroll, paper, section } from '../HousePaper'
import { HouseStill } from '../HouseStill'
import { Body, Display, Eyebrow, GhostLink, OutlineButton } from '../HouseType'
import {
  careLine,
  carriageLine,
  clothSwatch,
  colourVariants,
  getProduct,
  measureLead,
  measureStill,
  packingNote,
  packingSteps,
  linePath,
  productLineName,
  relatedProducts,
  thobeSizes,
  type ThobeSize,
} from '../catalogue'
import { color, type } from '../theme'
import { type HouseNav } from './nav'

type Props = HouseNav & {
  pieceId: string
  collection?: boolean
}

export function PieceRoom({
  open,
  addToBag,
  pieceId,
  collection,
  roomHeight,
  bottomInset,
  onOverlay,
}: Props) {
  const product = getProduct(pieceId)
  const [size, setSize] = useState<ThobeSize | ''>('')
  const hub = collection ? 'The Collection' : 'The Shop'
  const hubPath = collection ? '/collection' : '/shop'

  if (!product) {
    return (
      <View style={[paper(), { flex: 1, paddingTop: 96 }]}>
        <Eyebrow>The line</Eyebrow>
        <View style={styles.space} />
        <Display>This piece is not in the collection.</Display>
        <View style={styles.gap} />
        <GhostLink label={hub} onPress={() => open(hubPath)} />
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
        colour={product.colour}
        height={roomHeight}
        bottomInset={bottomInset}
        priority
      />

      <View style={paper()}>
        <Eyebrow>{`${hub} · ${product.colour}`}</Eyebrow>
        <View style={styles.space} />
        <Display size={36}>{productLineName(product)}</Display>
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
                  onPress={() => open(linePath(item, collection))}
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
          <OutlineButton
            label={size ? 'Add to bag' : 'Choose a size'}
            onPress={() => {
              if (!size) return
              addToBag(product.id, size)
            }}
          />
          <GhostLink label="Visit by appointment" onPress={() => open('/visit')} />
        </View>
        <View style={styles.gap} />
        {product.details.map((line) => (
          <Text key={line} style={styles.detail}>
            {line}
          </Text>
        ))}
        {product.proof ? (
          <Text style={styles.detail}>
            One pound to open the live till. Choose any size. Refund the charge from Stripe once
            the reservation is written.
          </Text>
        ) : (
          <>
            <Text style={styles.detail}>{product.composition}</Text>
            <Text style={styles.detail}>{careLine}</Text>
            <Text style={styles.detail}>{packingNote}</Text>
            <Text style={styles.detail}>{carriageLine}</Text>
          </>
        )}
      </View>

      {product.proof ? null : (
      <>
      <View style={section()}>
        <Eyebrow>The nape</Eyebrow>
        <View style={styles.space} />
        <Display size={32}>The woven mark.</Display>
        <View style={styles.mark}>
          <HousePatch colour={product.colour} size={88} />
        </View>
        <Body>
          The square mark is sewn, not printed — the interlocking KK, in the cloth of the piece — and set at the nape by hand after the last press. Size is a separate tab. Care sits at the side seam.
        </Body>
        <View style={styles.space} />
        <Eyebrow>The making</Eyebrow>
        <View style={styles.space} />
        <Display size={32}>{`How this ${product.cut === 'Jubbah' ? 'garment' : 'thobe'} is held.`}</Display>
        <View style={styles.gap} />
        <Body>{product.composition}</Body>
        <View style={styles.space} />
        <Eyebrow>Sizes 52–60</Eyebrow>
        <View style={styles.space} />
        <Display size={32}>The house block.</Display>
        <View style={styles.gap} />
        <HouseSizeGuide chosen={size} onChoose={setSize} />
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
        <Display size={32}>Against a thobe you own.</Display>
        <View style={styles.gap} />
        <Body>{measureLead}</Body>
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
      </>
      )}

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

      {related.length > 0 && !product.proof ? (
        <View style={section()}>
          <Eyebrow>The line</Eyebrow>
          <View style={styles.space} />
          <Display size={32}>{product.cut === 'Jubbah' ? 'The other colours' : 'The other pieces'}</Display>
          <View style={styles.space} />
          <GhostLink
            label={collection ? 'All of the collection' : 'All of the shop'}
            onPress={() => open(hubPath)}
          />
          <View style={styles.space} />
          {related.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => open(linePath(item, collection))}
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
  mark: {
    marginTop: 24,
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  measureStill: {
    width: '100%',
    aspectRatio: 4 / 5,
    backgroundColor: color.ivoryDeep,
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
