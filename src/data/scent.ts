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
    wear: 'Rose first, close, with saffron through it. The rose does not sweeten. Oud is the room after; amber keeps the last of it on the cloth.',
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
    wear: 'Bergamot on stone. The citrus leaves. Leather and saffron take the street; sandalwood and oud are what the cloth keeps.',
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
    wear: 'Fig leaf at the gate, green and a little bitter. Vetiver when the light goes. Oakmoss and oud, the garden after rain, close to the cloth.',
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

export function notesJoin(scent: Scent) {
  const notes = scentNotes(scent)
  if (notes.length === 0) return ''
  if (notes.length === 1) return notes[0]!
  if (notes.length === 2) return `${notes[0]} and ${notes[1]}`
  return `${notes.slice(0, -1).join(', ')} and ${notes[notes.length - 1]}`
}

export function scentPath(scent: Scent) {
  return `/scent/${scent.id}`
}

export function relatedScents(id: string) {
  return scents.filter((item) => item.id !== id)
}
