import { storedNamedFor } from './letters.js'

export const workStages = ['reserved', 'cloth', 'cutting', 'packed', 'sent'] as const

export type WorkStage = (typeof workStages)[number]

export function isWorkStage(value: string): value is WorkStage {
  return (workStages as readonly string[]).includes(value)
}

export const workCopy: Record<
  WorkStage,
  { label: string; line: string; memberTitle: string; memberBody: string }
> = {
  reserved: {
    label: 'Reserved',
    line: 'Cloth is held. Not yet on the table.',
    memberTitle: 'The cut is reserved',
    memberBody: 'Cloth is held against the account.',
  },
  cloth: {
    label: 'Held for cloth',
    line: 'The mill has not yet sent the cloth.',
    memberTitle: 'Cloth is waited on',
    memberBody: 'The house is waiting on the mill for this cut.',
  },
  cutting: {
    label: 'On the table',
    line: 'The piece is being cut.',
    memberTitle: 'The piece is on the table',
    memberBody: 'The house is cutting the cloth you reserved.',
  },
  packed: {
    label: 'Packed',
    line: 'Bag, unscented tissue, a rigid box.',
    memberTitle: 'It is in the house box',
    memberBody: 'Garment bag, unscented tissue, a rigid box. No scent.',
  },
  sent: {
    label: 'Left the house',
    line: 'Sent from the atelier.',
    memberTitle: 'It has left the house',
    memberBody: 'The cut is on its way.',
  },
}

export function asWorkStage(value: string | null | undefined): WorkStage {
  if (value && isWorkStage(value)) return value
  return 'reserved'
}

export function asCarrier(value: string | null | undefined) {
  return (value ?? '').trim().replace(/\s+/g, ' ').slice(0, 40)
}

export function asTrackingCode(value: string | null | undefined) {
  const trimmed = (value ?? '').trim()
  if (/^https?:\/\//i.test(trimmed)) return ''
  return trimmed.slice(0, 80)
}

export function asTrackingHref(value: string | null | undefined) {
  const trimmed = (value ?? '').trim()
  if (!trimmed) return ''
  try {
    const url = new URL(trimmed)
    if (url.protocol !== 'https:') return ''
    if (url.username || url.password) return ''
    return url.toString().slice(0, 300)
  } catch {
    return ''
  }
}

export function dispatchLine(carrier: string, tracking: string) {
  const how = asCarrier(carrier)
  const code = asTrackingCode(tracking)
  if (how && code) return `${how} · ${code}`
  if (how) return how
  if (code) return code
  return workCopy.sent.line
}

export function isFullyReturned(amountPence: number, refundedPence: number) {
  return refundedPence > 0 && refundedPence >= amountPence
}

export function isPartReturned(amountPence: number, refundedPence: number) {
  return refundedPence > 0 && refundedPence < amountPence
}

export function asWorkReason(value: unknown) {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, 400)
}

export function isWorkBackwards(before: WorkStage, next: WorkStage) {
  return workStages.indexOf(next) < workStages.indexOf(before)
}

function utcDay(iso: string) {
  const year = Number(iso.slice(0, 4))
  const month = Number(iso.slice(5, 7))
  const day = Number(iso.slice(8, 10))
  const date = new Date(Date.UTC(year, month - 1, day))
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null
  }
  return date
}

function mondayUtc(date: Date) {
  const next = new Date(date.getTime())
  const weekday = next.getUTCDay()
  const offset = weekday === 0 ? -6 : 1 - weekday
  next.setUTCDate(next.getUTCDate() + offset)
  return next.toISOString().slice(0, 10)
}

export function asNamedWeek(value: unknown) {
  const stored = storedNamedFor(typeof value === 'string' ? value : '')
  if (!stored) return ''
  const date = utcDay(stored)
  if (!date) return ''
  const monday = mondayUtc(date)
  const week = utcDay(monday)
  if (!week) return ''
  const now = new Date()
  const start = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 7)
  const end = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 548)
  if (week.getTime() < start || week.getTime() > end) return ''
  return monday
}

export function formatNamedWeek(iso: string) {
  const stored = storedNamedFor(iso)
  if (!stored) return ''
  const date = utcDay(stored)
  if (!date) return ''
  const monday = mondayUtc(date)
  const week = utcDay(monday)
  if (!week) return ''
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(week)
}
