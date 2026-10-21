import { Image } from 'expo-image'

import { jubbahs, packingSteps, thisWeekPlate } from './catalogue'
import { mediaUrl } from './house'

export function prefetchHouseStills() {
  const week = thisWeekPlate()
  const paths = [
    week.src,
    ...jubbahs.flatMap((piece) => [piece.image, piece.gallery[0]?.src, piece.gallery[1]?.src]),
    ...packingSteps.map((step) => step.src),
    '/images/cutting-room.jpg',
    '/images/atelier-rail.jpg',
    '/images/pack-box.jpg',
  ].filter((src, index, all): src is string => Boolean(src) && all.indexOf(src) === index)

  return Promise.all(paths.map((src) => Image.prefetch(mediaUrl(src), 'memory-disk'))).catch(
    () => undefined,
  )
}
