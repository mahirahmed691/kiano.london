export type ScentStill = {
  src: string
  alt: string
  objectPosition?: string
  kicker?: string
}

export type ScentMovement = {
  kicker: string
  notes: string[]
}

export type Scent = {
  id: string
  name: string
  image: string
  imageAlt: string
  objectPosition?: string
  gallery: ScentStill[]
  /** One line of the juice, in the house voice. */
  line: string
  /** How it wears. Stands in until the juice is of the house. */
  wear: string
  /** At first, then, what remains. One set per name; not two pyramids. */
  movements: ScentMovement[]
}

export const scentArabic = 'العطر'

export const scentComing = 'Coming'

export const scentFamilies = [
  {
    id: 'oud',
    name: 'Arabian Oud',
    src: '/images/scent-oud.jpg',
    alt: 'Mayfair, Bond Street and Kensington: three bottles of Arabian Oud.',
    objectPosition: 'center 42%',
  },
  {
    id: 'eau',
    name: 'Eau de Parfum',
    src: '/images/scent-eau.jpg',
    alt: 'Mayfair, Bond Street and Kensington: three bottles of eau de parfum.',
    objectPosition: 'center 42%',
  },
] as const

export const scents: Scent[] = [
  {
    id: 'mayfair',
    name: 'Mayfair',
    image: '/images/scent-mayfair.jpg',
    imageAlt: 'Mayfair: a bottle of Kiano London, Arabian Oud, in still light.',
    objectPosition: 'center 42%',
    line: 'A rose, held. Oud after it.',
    wear: 'Saffron threads it so the rose does not sweeten. Amber keeps the last of the oud on the cloth.',
    movements: [
      { kicker: 'At first', notes: ['Damask rose', 'Saffron', 'Pink pepper'] },
      { kicker: 'Then', notes: ['Rose otto', 'Labdanum'] },
      { kicker: 'What remains', notes: ['Oud', 'Amber', 'Musk'] },
    ],
    gallery: [
      {
        src: '/images/scent-mayfair.jpg',
        alt: 'Mayfair: a bottle of Kiano London, Arabian Oud, in still light.',
        objectPosition: 'center 42%',
      },
      {
        src: '/images/scent-oud.jpg',
        alt: 'Mayfair among the three, Arabian Oud.',
        objectPosition: '18% 58%',
        kicker: 'Arabian Oud',
      },
      {
        src: '/images/scent-eau.jpg',
        alt: 'Mayfair among the three, eau de parfum.',
        objectPosition: '18% 58%',
        kicker: 'Eau de Parfum',
      },
    ],
  },
  {
    id: 'bond-street',
    name: 'Bond Street',
    image: '/images/scent-bond-street.jpg',
    imageAlt: 'Bond Street: a bottle of Kiano London, Arabian Oud, in still light.',
    objectPosition: 'center 42%',
    line: 'Citrus on stone, then leather and wood.',
    wear: 'The citrus is short. Leather takes the street. Sandalwood and oud stay on the cloth.',
    movements: [
      { kicker: 'At first', notes: ['Bergamot', 'Cardamom', 'Pink pepper'] },
      { kicker: 'Then', notes: ['Saffron', 'Leather', 'Cedar'] },
      { kicker: 'What remains', notes: ['Sandalwood', 'Oud'] },
    ],
    gallery: [
      {
        src: '/images/scent-bond-street.jpg',
        alt: 'Bond Street: a bottle of Kiano London, Arabian Oud, in still light.',
        objectPosition: 'center 42%',
      },
      {
        src: '/images/scent-oud.jpg',
        alt: 'Bond Street among the three, Arabian Oud.',
        objectPosition: '50% 26%',
        kicker: 'Arabian Oud',
      },
      {
        src: '/images/scent-eau.jpg',
        alt: 'Bond Street among the three, eau de parfum.',
        objectPosition: '48% 24%',
        kicker: 'Eau de Parfum',
      },
    ],
  },
  {
    id: 'kensington',
    name: 'Kensington',
    image: '/images/scent-kensington.jpg',
    imageAlt: 'Kensington: a bottle of Kiano London, Arabian Oud, in still light.',
    objectPosition: 'center 42%',
    line: 'Green at first. Vetiver, and the garden at dusk.',
    wear: 'Fig leaf at the gate, a little bitter. When the light goes, oakmoss and oud sit close to the cloth.',
    movements: [
      { kicker: 'At first', notes: ['Fig leaf', 'Green mandarin'] },
      { kicker: 'Then', notes: ['Vetiver', 'Iris'] },
      { kicker: 'What remains', notes: ['Oakmoss', 'Oud', 'Cedar'] },
    ],
    gallery: [
      {
        src: '/images/scent-kensington.jpg',
        alt: 'Kensington: a bottle of Kiano London, Arabian Oud, in still light.',
        objectPosition: 'center 42%',
      },
      {
        src: '/images/scent-oud.jpg',
        alt: 'Kensington among the three, Arabian Oud.',
        objectPosition: '82% 58%',
        kicker: 'Arabian Oud',
      },
      {
        src: '/images/scent-eau.jpg',
        alt: 'Kensington among the three, eau de parfum.',
        objectPosition: '82% 58%',
        kicker: 'Eau de Parfum',
      },
    ],
  },
]

export function getScent(id: string | undefined) {
  if (!id) return undefined
  return scents.find((item) => item.id === id)
}

export function scentNotes(scent: Scent) {
  return scent.movements.flatMap((move) => move.notes)
}

export function joinNames(names: string[]) {
  if (names.length === 0) return ''
  const items = names.map((name, index) =>
    index === 0 ? name : `${name.charAt(0).toLowerCase()}${name.slice(1)}`,
  )
  if (items.length === 1) return items[0]!
  if (items.length === 2) return `${items[0]} and ${items[1]}`
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}

export function movementLine(move: ScentMovement) {
  return joinNames(move.notes)
}

export function notesJoin(scent: Scent) {
  return joinNames(scentNotes(scent))
}

export function scentPath(scent: Scent) {
  return `/scent/${scent.id}`
}

export function relatedScents(id: string) {
  return scents.filter((item) => item.id !== id)
}
