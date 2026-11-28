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
    label: 'Ordered',
    line: 'Order received. Making starts soon.',
    memberTitle: 'Order confirmed',
    memberBody: 'We have your order and will start making it soon.',
  },
  cloth: {
    label: 'Waiting for cloth',
    line: 'We are waiting for the cloth to arrive.',
    memberTitle: 'Waiting for cloth',
    memberBody: 'We are waiting for the cloth for your order to arrive from the mill.',
  },
  cutting: {
    label: 'Being made',
    line: 'Your piece is being cut and sewn.',
    memberTitle: 'Your piece is being made',
    memberBody: 'Your piece is being cut and sewn.',
  },
  packed: {
    label: 'Packed',
    line: 'Bag, unscented tissue, a rigid box. A house card sits with it.',
    memberTitle: 'Your order is packed',
    memberBody: 'Garment bag, unscented tissue, a rigid box. A house card sits with the piece. No scent.',
  },
  sent: {
    label: 'Sent',
    line: 'On its way to you.',
    memberTitle: 'Your order has been sent',
    memberBody: 'Your order is on its way.',
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
