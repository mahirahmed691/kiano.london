/**
 * Order-by dates for delivery before Eid.
 *
 * Eid dates are astronomical forecasts and move a day with the moon sighting, so we
 * take the earliest expected day and keep a two-day margin.
 */
export const eidDates = [
  { name: 'Eid al-Fitr', date: '2027-03-09' },
  { name: 'Eid al-Adha', date: '2027-05-16' },
] as const

/** Cut, sewn, pressed and packed, from payment. */
export const makeDays = 14
const marginDays = 2
/** Courier days once it leaves the atelier. */
const shipDays = { uk: 3, abroad: 7 } as const
/** Start telling people this many days before the order-by date. */
const leadInDays = 100

export type EidRegion = keyof typeof shipDays

const day = 24 * 60 * 60 * 1000

function londonToday(now = new Date()) {
  const ymd = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London' }).format(now)
  return new Date(`${ymd}T00:00:00Z`)
}

export type EidNotice =
  | { kind: 'order-by'; eid: string; orderBy: Date; daysLeft: number }
  | { kind: 'after'; eid: string }

export function eidNotice(region: EidRegion, now = new Date()): EidNotice | null {
  const today = londonToday(now)
  for (const eid of eidDates) {
    const eidDay = new Date(`${eid.date}T00:00:00Z`)
    if (today >= eidDay) continue
    const orderBy = new Date(eidDay.getTime() - (makeDays + shipDays[region] + marginDays) * day)
    const daysLeft = Math.round((orderBy.getTime() - today.getTime()) / day)
    if (daysLeft > leadInDays) return null
    if (daysLeft >= 0) return { kind: 'order-by', eid: eid.name, orderBy, daysLeft }
    return { kind: 'after', eid: eid.name }
  }
  return null
}

export function formatOrderBy(date: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }).format(date)
}

export function regionForCountry(code: string | null | undefined): EidRegion {
  return !code || code === 'GB' ? 'uk' : 'abroad'
}
