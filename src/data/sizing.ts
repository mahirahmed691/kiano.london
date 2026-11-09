import { type ThobeSize, thobeSizes } from './products'

export type MeasureKey = 'chest' | 'length' | 'shoulder'
export type MeasureUnit = 'cm' | 'in'

export type SizeRow = {
  size: ThobeSize
  chest: number
  length: number
  shoulder: number
}

export const sizeChart: SizeRow[] = [
  { size: 52, chest: 112, length: 142, shoulder: 46 },
  { size: 54, chest: 116, length: 145, shoulder: 47 },
  { size: 56, chest: 120, length: 148, shoulder: 48 },
  { size: 58, chest: 124, length: 152, shoulder: 49 },
  { size: 60, chest: 128, length: 156, shoulder: 50 },
]

/** Slider ends sit just outside the block, so a tape can fall short or run past it. */
export const measureSpan: Record<MeasureKey, { min: number; max: number }> = {
  chest: { min: 96, max: 140 },
  length: { min: 120, max: 168 },
  shoulder: { min: 38, max: 56 },
}

export const sizeMeasures: { key: MeasureKey; title: string; copy: string }[] = [
  {
    key: 'chest',
    title: 'Chest',
    copy: 'Around the chest of a thobe you own, tape level. Laid flat, measure across and double it.',
  },
  {
    key: 'length',
    title: 'Length',
    copy: 'From the high point of the shoulder, down the front, to the hem.',
  },
  {
    key: 'shoulder',
    title: 'Shoulder',
    copy: 'Seam to seam across the back, where the sleeve meets the body.',
  },
]

export const sizeNote =
  'Chest, length and shoulder as cut. A fitting will move a centimetre where it matters. If you are between sizes, write; we cut from the larger and take in.'

export const measureStill = {
  src: '/images/look-lanesborough.jpg',
  alt: 'A white Emirati thobe worn at full length: measure against a column you already own.',
  objectPosition: 'center 22%',
} as const

export const measureLead =
  'If you already wear a thobe, measure that one: chest, length, shoulder. Name the size that matches, or write that you do not know. A visit is not required.'

const slack = 0.45
const over = 1.5
const floor: Record<MeasureKey, number> = { chest: 100, length: 125, shoulder: 40 }
const measureName: Record<MeasureKey, string> = {
  chest: 'chest',
  length: 'length',
  shoulder: 'shoulder',
}

export function formatMeasure(cm: number, unit: MeasureUnit): string {
  if (unit === 'in') return `${(cm / 2.54).toFixed(1)} in`
  const rounded = Math.round(cm * 10) / 10
  return `${Number.isInteger(rounded) ? rounded : rounded.toFixed(1)} cm`
}

export function measureToCm(value: number, unit: MeasureUnit): number {
  const cm = unit === 'in' ? value * 2.54 : value
  return Math.round(cm * 10) / 10
}

export type CutReading = {
  size: ThobeSize | null
  copy: string
}

type FitCall = {
  kind: 'fit'
  key: MeasureKey
  size: ThobeSize
  exact: boolean
  eased: boolean
  between: ThobeSize | null
  close: boolean
}

type MeasureCall = { kind: 'low' | 'past'; key: MeasureKey } | FitCall

function asSize(value: number): ThobeSize {
  const found = thobeSizes.find((size) => size === value)
  return found ?? 56
}

function list(keys: MeasureKey[]): string {
  const words = keys.map((key) => measureName[key])
  if (words.length <= 1) return words[0] ?? ''
  if (words.length === 2) return `${words[0]} and ${words[1]}`
  return `${words[0]}, ${words[1]} and ${words[2]}`
}

function capital(text: string): string {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : text
}

function measureCall(key: MeasureKey, cm: number): MeasureCall {
  if (cm < floor[key]) return { kind: 'low', key }
  const rows = sizeChart
  const nearest = rows.reduce((best, row) =>
    Math.abs(row[key] - cm) < Math.abs(best[key] - cm) ? row : best,
  )
  if (Math.abs(nearest[key] - cm) <= slack) {
    return {
      kind: 'fit',
      key,
      size: nearest.size,
      exact: true,
      eased: false,
      between: null,
      close: false,
    }
  }
  const last = rows[rows.length - 1]
  if (cm > last[key] + over) return { kind: 'past', key }
  if (cm > last[key]) {
    return { kind: 'fit', key, size: last.size, exact: false, eased: false, between: null, close: true }
  }
  const index = rows.findIndex((row) => row[key] >= cm)
  const row = rows[Math.max(index, 0)]
  const eased = cm < rows[0][key]
  return {
    kind: 'fit',
    key,
    size: row.size,
    exact: false,
    eased,
    between: eased ? null : rows[index - 1].size,
    close: false,
  }
}

function easeClause(calls: FitCall[]): string {
  if (calls.length === 0) return ''
  const words = list(calls.map((call) => call.key))
  return ` ${capital(words)} ${calls.length === 1 ? 'is' : 'are'} at ease.`
}

function phrase(fit: FitCall[]): CutReading {
  const eased = fit.filter((call) => call.eased)
  const named = fit.filter((call) => !call.eased)

  if (named.length === 0) {
    const words = list(eased.map((call) => call.key))
    return {
      size: 52,
      copy: `52. ${capital(words)} ${eased.length === 1 ? 'has' : 'have'} room inside the block.`,
    }
  }

  const size = asSize(Math.max(...named.map((call) => call.size)))
  const asking = named.filter((call) => call.size === size)
  const ease = easeClause([...named.filter((call) => call.size < size), ...eased])

  if (asking.every((call) => call.exact)) {
    const words = list(asking.map((call) => call.key))
    if (!ease) {
      return {
        size,
        copy: `${size}. ${capital(words)} ${asking.length === 1 ? 'sits' : 'sit'} on this size.`,
      }
    }
    return { size, copy: `${size}, for the ${words}.${ease}` }
  }

  const close = asking.filter((call) => call.close)
  if (close.length === asking.length) {
    const words = list(close.map((call) => call.key))
    return {
      size,
      copy: `${size}. ${capital(words)} ${close.length === 1 ? 'is' : 'are'} a centimetre past the cut. A fitting can move it.${ease}`,
    }
  }

  const gaps = asking.filter((call) => call.between)
  const between = gaps[0]?.between ?? null
  if (between && gaps.length > 0 && gaps.every((call) => call.between === between)) {
    const words = list(gaps.map((call) => call.key))
    const resting = asking.filter((call) => !call.between)
    const onIt =
      resting.length > 0
        ? ` ${capital(list(resting.map((call) => call.key)))} ${resting.length === 1 ? 'sits' : 'sit'} on it.`
        : ''
    return {
      size,
      copy: `${size}. ${capital(words)} ${gaps.length === 1 ? 'sits' : 'sit'} between ${between} and ${size}.${onIt} The house cuts from the larger and takes in.${ease}`,
    }
  }

  const words = list(asking.map((call) => call.key))
  return {
    size,
    copy: `${size}. ${capital(words)} ${asking.length === 1 ? 'asks' : 'ask'} for it.${ease}`,
  }
}

export function readCut(input: Partial<Record<MeasureKey, number>>): CutReading | null {
  const keys = (['chest', 'length', 'shoulder'] as const).filter((key) => {
    const value = input[key]
    return typeof value === 'number' && value >= 20
  })
  if (keys.length === 0) return null

  const calls = keys.map((key) => measureCall(key, input[key] as number))
  const past = calls.filter((call) => call.kind === 'past')
  if (past.length > 0) {
    const words = list(past.map((call) => call.key))
    return {
      size: null,
      copy: `${capital(words)} ${past.length === 1 ? 'is' : 'are'} past size 60. Write, and the house will say if it can be cut.`,
    }
  }

  const low = calls.filter((call) => call.kind === 'low')
  const fit = calls.filter((call): call is FitCall => call.kind === 'fit')
  if (fit.length === 0) {
    const words = list(low.map((call) => call.key))
    return {
      size: null,
      copy: `${capital(words)} ${low.length === 1 ? 'is' : 'are'} under the block. Measure a thobe you own. The chart is the finished cut.`,
    }
  }

  const reading = phrase(fit)
  if (low.length === 0) return reading
  const words = list(low.map((call) => call.key))
  return {
    size: reading.size,
    copy: `${reading.copy} ${capital(words)} ${low.length === 1 ? 'is' : 'are'} under the block.`,
  }
}

export function sizeRow(size: ThobeSize): SizeRow {
  return sizeChart.find((row) => row.size === size) ?? sizeChart[2]
}

export { thobeSizes }
