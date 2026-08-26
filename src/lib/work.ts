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
