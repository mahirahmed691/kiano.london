export const workStages = ['reserved', 'cutting', 'packed', 'sent'] as const

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
