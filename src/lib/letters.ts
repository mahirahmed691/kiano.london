export const letterStatuses = ['new', 'seen', 'named', 'refused'] as const

export type LetterStatus = (typeof letterStatuses)[number]

export type LetterKind = 'visit' | 'return'

export function isLetterStatus(value: string): value is LetterStatus {
  return (letterStatuses as readonly string[]).includes(value)
}

export function asLetterStatus(value: string | null | undefined): LetterStatus {
  if (value && isLetterStatus(value)) return value
  return 'new'
}

export function asLetterKind(value: string | null | undefined): LetterKind {
  return value === 'return' ? 'return' : 'visit'
}

export function asLetterReply(value: unknown) {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, 400)
}

export function storedNamedFor(value: string | Date | null | undefined) {
  if (!value) return ''
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return ''
    return value.toISOString().slice(0, 10)
  }
  const text = String(value).trim().slice(0, 10)
  return /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : ''
}

export function asNamedDay(value: unknown) {
  if (typeof value !== 'string') return ''
  const trimmed = value.trim()
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return ''
  const year = Number(trimmed.slice(0, 4))
  const month = Number(trimmed.slice(5, 7))
  const day = Number(trimmed.slice(8, 10))
  const date = new Date(Date.UTC(year, month - 1, day))
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return ''
  }
  const now = new Date()
  const start = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 2)
  const end = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 548)
  if (date.getTime() < start || date.getTime() > end) return ''
  return trimmed
}

export function formatNamedDay(iso: string) {
  const stored = storedNamedFor(iso)
  if (!stored) return ''
  const year = Number(stored.slice(0, 4))
  const month = Number(stored.slice(5, 7))
  const day = Number(stored.slice(8, 10))
  const date = new Date(Date.UTC(year, month - 1, day))
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

export function letterLine(input: {
  kind: LetterKind
  status: LetterStatus
  namedFor?: string
  reply?: string
}) {
  if (input.kind === 'return') {
    if (input.status === 'refused') {
      return input.reply?.trim()
        ? input.reply.trim()
        : 'The house cannot take the return.'
    }
    if (input.status === 'seen') return 'The house has the letter. It is not a refund.'
    return 'The letter is held. It is not a refund.'
  }

  if (input.status === 'named') {
    const day = formatNamedDay(input.namedFor ?? '')
    if (day) return `The house can keep the morning of ${day}.`
    return 'The house has named a morning.'
  }
  if (input.status === 'refused') {
    return input.reply?.trim()
      ? input.reply.trim()
      : 'The house cannot keep a morning.'
  }
  if (input.status === 'seen') return 'The house has the letter. A morning has not been named.'
  return 'The letter is held. It is not a booking.'
}
