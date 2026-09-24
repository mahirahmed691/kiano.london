import { Image, type ImageContentPosition } from 'expo-image'
import { StyleSheet, type StyleProp, type ImageStyle } from 'react-native'

import { mediaUrl } from './house'
import { color } from './theme'

type Props = {
  src: string
  alt: string
  objectPosition?: string
  priority?: boolean
  style?: StyleProp<ImageStyle>
}

function stillPosition(objectPosition?: string): ImageContentPosition {
  if (!objectPosition) return { left: '50%', top: '22%' }
  const parts = objectPosition.trim().split(/\s+/)
  const axis = (value?: string) => {
    if (!value || value === 'center') return '50%'
    if (value === 'left' || value === 'top') return '0%'
    if (value === 'right' || value === 'bottom') return '100%'
    return value
  }
  if (parts.length === 1) return { left: '50%', top: axis(parts[0]) }
  return { left: axis(parts[0]), top: axis(parts[1]) }
}

export function HouseImage({ src, alt, objectPosition, priority, style }: Props) {
  return (
    <Image
      source={{ uri: mediaUrl(src) }}
      accessibilityLabel={alt}
      contentFit="cover"
      contentPosition={stillPosition(objectPosition)}
      priority={priority ? 'high' : 'normal'}
      cachePolicy="memory-disk"
      transition={800}
      style={[styles.still, style]}
    />
  )
}

const styles = StyleSheet.create({
  still: {
    backgroundColor: color.ivoryDeep,
  },
})
