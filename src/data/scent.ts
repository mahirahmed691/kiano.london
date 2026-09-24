export type ScentStill = {
  src: string
  alt: string
  objectPosition?: string
  kicker?: string
}

export type Scent = {
  id: string
  name: string
  image: string
  imageAlt: string
  objectPosition?: string
  gallery: ScentStill[]
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

export function scentPath(scent: Scent) {
  return `/scent/${scent.id}`
}

export function relatedScents(id: string) {
  return scents.filter((item) => item.id !== id)
}
