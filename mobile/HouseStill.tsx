import { type ReactNode } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { HouseImage } from './HouseImage'
import { HousePatch } from './HousePatch'
import { type ProductColour } from './catalogue'
import { color, type } from './theme'

type Props = {
  src: string
  alt: string
  objectPosition?: string
  kicker?: string
  title?: string
  colour?: ProductColour
  quiet?: boolean
  height: number
  priority?: boolean
  onPress?: () => void
  children?: ReactNode
}

export function HouseStill({
  src,
  alt,
  objectPosition,
  kicker,
  title,
  colour,
  quiet,
  height,
  priority,
  onPress,
  children,
}: Props) {
  const caption = quiet && Boolean(kicker || title)
  const plate = (
    <View style={[styles.plate, { height }]}>
      <HouseImage
        src={src}
        alt={alt}
        objectPosition={objectPosition}
        priority={priority}
        style={StyleSheet.absoluteFill}
      />
      <View pointerEvents="none" style={quiet ? styles.quietScrim : styles.heroScrim} />
      {colour ? (
        <View style={styles.patch} pointerEvents="none">
          <HousePatch colour={colour} size={52} />
        </View>
      ) : null}
      {caption ? (
        <View style={styles.caption} pointerEvents="none">
          {kicker ? <Text style={styles.kicker}>{kicker}</Text> : null}
          {title ? <Text style={styles.title}>{title}</Text> : null}
        </View>
      ) : null}
      {!quiet && (kicker || title || children) ? (
        <View style={styles.heroCopy}>
          {kicker ? <Text style={styles.heroKicker}>{kicker}</Text> : null}
          {title ? <Text style={styles.heroTitle}>{title}</Text> : null}
          {children}
        </View>
      ) : null}
    </View>
  )

  if (!onPress) return plate

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title ? `${kicker ?? ''} ${title}`.trim() : alt}
      style={({ pressed }) => pressed && styles.pressed}
    >
      {plate}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  plate: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: color.night,
    justifyContent: 'flex-end',
  },
  quietScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 168,
    backgroundColor: 'rgba(37, 40, 43, 0.38)',
  },
  heroScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(37, 40, 43, 0.32)',
  },
  patch: {
    position: 'absolute',
    left: 20,
    bottom: 20,
  },
  caption: {
    paddingHorizontal: 24,
    paddingBottom: 28,
    paddingTop: 72,
  },
  kicker: {
    color: color.bronze,
    fontFamily: type.sansRegular,
    fontSize: 11,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  title: {
    marginTop: 8,
    color: color.ivory,
    fontFamily: type.displayLight,
    fontSize: 32,
    fontWeight: '300',
    letterSpacing: -0.4,
  },
  heroCopy: {
    paddingHorizontal: 24,
    paddingBottom: 36,
    paddingTop: 72,
  },
  heroKicker: {
    color: color.bronze,
    fontFamily: type.sansRegular,
    fontSize: 11,
    letterSpacing: 3.2,
    textTransform: 'uppercase',
    marginBottom: 18,
  },
  heroTitle: {
    color: color.ivory,
    fontFamily: type.displayLight,
    fontSize: 42,
    fontWeight: '300',
    letterSpacing: -0.6,
    lineHeight: 46,
    maxWidth: 340,
  },
  pressed: {
    opacity: 0.92,
  },
})
