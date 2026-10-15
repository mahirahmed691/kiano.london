export type PlateKind = 'still' | 'reel' | 'carousel'

export type PlateChild = {
  src: string
  alt: string
  objectPosition?: string
}

export type InstagramPlate = {
  id: string
  kind: PlateKind
  name: string
  src: string
  children?: readonly PlateChild[]
  caption: string
  alt: string
  place: string
  to?: string
  objectPosition?: string
}

export const plateIntervalDays = 7

/** Monday the book opened. The public stills room turns one plate a week from here. */
export const plateWeekOrigin = '2026-01-05T00:00:00.000Z'

export const instagramPlates: readonly InstagramPlate[] = [
  {
    id: 'layl',
    kind: 'still',
    name: 'Black',
    src: '/images/thobe-layl.jpg',
    caption: 'Black. Matte, hem to the ankle.\n\nkiano.london',
    alt: 'A black Emirati column: band collar, hem to the ankle.',
    place: 'London',
    objectPosition: 'center 12%',
  },
  {
    id: 'lanesborough-white',
    kind: 'still',
    name: 'Hyde Park Corner',
    src: '/images/look-lanesborough.jpg',
    caption: 'The white column. Hyde Park Corner.\nWorn in London stone.\n\nkiano.london',
    alt: 'A white Emirati thobe at The Lanesborough, Hyde Park Corner.',
    place: 'Hyde Park Corner',
    to: '/story',
    objectPosition: 'center 22%',
  },
  {
    id: 'raml',
    kind: 'still',
    name: 'Beige',
    src: '/images/thobe-raml.jpg',
    caption: 'Beige. The daylight column.\n\nkiano.london',
    alt: 'A beige Emirati column, the cloth to the ankle.',
    place: 'London',
    objectPosition: 'center 12%',
  },
  {
    id: 'jubbah-black',
    kind: 'carousel',
    name: 'Urban Emirati in Black',
    src: '/images/jubbah-black.jpg',
    children: [
      {
        src: '/images/jubbah-black-02.jpg',
        alt: 'Urban Emirati in black from behind: a clean column, hem to the ankle.',
        objectPosition: 'center 12%',
      },
    ],
    caption: 'Urban Emirati in black. Worn alone, or over a thobe.\n\nkiano.london',
    alt: 'Urban Emirati in black, worn at full length.',
    place: 'London',
    to: '/shop/jubbah-black',
    objectPosition: 'center 12%',
  },
  {
    id: 'ghabar',
    kind: 'still',
    name: 'Grey',
    src: '/images/thobe-ghabar.jpg',
    caption: 'Grey. A column of cloth.\n\nkiano.london',
    alt: 'An earth-grey Emirati column of cloth.',
    place: 'London',
    objectPosition: 'center 12%',
  },
  {
    id: 'hadid',
    kind: 'still',
    name: 'Charcoal',
    src: '/images/featured-overcoat.jpg',
    caption: 'Charcoal. The first still of the house.\n\nkiano.london',
    alt: 'A charcoal Emirati column, the first still of the house.',
    place: 'London',
    objectPosition: '72% 18%',
  },
  {
    id: 'jubbah-sand',
    kind: 'carousel',
    name: 'Urban Emirati in Cream',
    src: '/images/jubbah-sand.jpg',
    children: [
      {
        src: '/images/jubbah-sand-02.jpg',
        alt: 'Urban Emirati in cream at rest: the cloth draped to the ankle.',
        objectPosition: 'center 18%',
      },
    ],
    caption: 'Urban Emirati in cream. More air through the chest than the thobe.\n\nkiano.london',
    alt: 'Urban Emirati in cream, a modest column.',
    place: 'London',
    to: '/shop/jubbah-sand',
    objectPosition: 'center 8%',
  },
  {
    id: 'hajar',
    kind: 'still',
    name: 'Bone',
    src: '/images/thobe-hajar.jpg',
    caption: 'Bone. Pressed once.\n\nkiano.london',
    alt: 'A bone Emirati column, pressed once.',
    place: 'London',
    objectPosition: 'center 12%',
  },
  {
    id: 'jubbah-charcoal',
    kind: 'carousel',
    name: 'Urban Emirati in Stone Grey',
    src: '/images/jubbah-charcoal.jpg',
    children: [
      {
        src: '/images/jubbah-charcoal-02.jpg',
        alt: 'Urban Emirati in stone grey walking: ankle hem, concealed placket.',
        objectPosition: 'center 18%',
      },
    ],
    caption: 'Urban Emirati in stone grey. Band collar, concealed placket.\n\nkiano.london',
    alt: 'Urban Emirati in stone grey, band collar, concealed placket.',
    place: 'London',
    to: '/shop/jubbah-charcoal',
    objectPosition: 'center 10%',
  },
] as const
