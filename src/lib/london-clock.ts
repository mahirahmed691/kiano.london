const LONDON = 'Europe/London'

function part(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes) {
  return Number(parts.find((entry) => entry.type === type)?.value ?? 0)
}

export function londonTime(date: Date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: LONDON,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(date)

  const hour = part(parts, 'hour')
  const minute = part(parts, 'minute')
  const second = part(parts, 'second')

  return {
    hour,
    minute,
    second,
    hourAngle: 30 * (hour % 12) + minute * 0.5 + second * (0.5 / 60),
    minuteAngle: 6 * minute + second * 0.1,
    secondAngle: 6 * second,
    stamp: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`,
  }
}

export function londonTimeLabel(date: Date = new Date()) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: LONDON,
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}
