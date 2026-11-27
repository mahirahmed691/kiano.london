import { type ThobeSize, thobeSizes } from '@/data/products'
import { sizeChart } from '@/data/sizing'

export type Build = 'slim' | 'regular' | 'broad'
export type FitPreference = 'close' | 'as-cut' | 'easy'

/**
 * Shoulder-to-ankle is roughly 81% of standing height on an adult man. The house length
 * runs from the high point of the shoulder to the hem at the ankle, so height picks the
 * length; build and preference then move the chest a size either way.
 */
const lengthShare = 0.81

export type FitAnswer = {
  size: ThobeSize
  note: string
}

export function findSize(heightCm: number, build: Build, fit: FitPreference): FitAnswer | null {
  if (!Number.isFinite(heightCm) || heightCm < 140 || heightCm > 215) return null
  const length = heightCm * lengthShare
  const byLength = sizeChart.reduce((best, row) =>
    Math.abs(row.length - length) < Math.abs(best.length - length) ? row : best,
  )
  let index = thobeSizes.indexOf(byLength.size)
  if (build === 'broad') index += 1
  if (build === 'slim' && fit !== 'easy') index -= 1
  if (fit === 'easy') index += 1
  if (fit === 'close' && build !== 'broad') index -= 1
  const clamped = Math.min(Math.max(index, 0), thobeSizes.length - 1)
  const size = thobeSizes[clamped]

  const first = sizeChart[0]
  const last = sizeChart[sizeChart.length - 1]
  let note = ''
  if (length < first.length - 3) note = 'The hem may sit a little long. Write to us and we will take it up before it leaves.'
  else if (length > last.length + 3) note = 'The hem may sit above the ankle. Write to us before you order.'
  else if (index !== clamped) note = 'You sit at the edge of the range. If you can, measure a thobe you own.'
  return { size, note }
}

export function feetToCm(feet: number, inches: number) {
  return Math.round((feet * 12 + inches) * 2.54)
}
