export type PlateKind = 'still' | 'reel' | 'carousel'

export type InstagramPlate = {
  id: string
  kind: PlateKind
  name: string
  src: string
  children?: readonly string[]
  caption: string
  alt: string
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
    name: 'Layl',
    src: '/images/thobe-layl.jpg',
    caption: 'Layl. Matte black, hem to the ankle.\n\nkiano.london',
    alt: 'The Layl thobe: matte black, band collar, hem to the ankle.',
    to: '/collection/layl-thobe',
    objectPosition: 'center 12%',
  },
  {
    id: 'lanesborough-white',
    kind: 'still',
    name: 'Hyde Park Corner',
    src: '/images/look-lanesborough.jpg',
    caption: 'The white column. Hyde Park Corner.\n\nkiano.london',
    alt: 'A white Emirati thobe at The Lanesborough, Hyde Park Corner.',
    to: '/story',
    objectPosition: 'center 22%',
  },
  {
    id: 'raml',
    kind: 'still',
    name: 'Raml',
    src: '/images/thobe-raml.jpg',
    caption: 'Raml. Sand extra-long staple, the daylight column.\n\nkiano.london',
    alt: 'The Raml thobe: sand extra-long staple, the daylight column.',
    to: '/collection/raml-thobe',
    objectPosition: 'center 12%',
  },
  {
    id: 'jubbah-black',
    kind: 'still',
    name: 'The jubbah, black',
    src: '/images/jubbah-black.jpg',
    caption: 'The jubbah in black. Worn alone, or over a thobe.\n\nkiano.london',
    alt: 'A black Emirati jubbah worn at full length.',
    to: '/shop/jubbah-black',
    objectPosition: 'center 12%',
  },
  {
    id: 'ghabar',
    kind: 'still',
    name: 'Ghabār',
    src: '/images/thobe-ghabar.jpg',
    caption: 'Ghabār. Earth-grey, a column of cloth.\n\nkiano.london',
    alt: 'Ghabār: an earth-grey Emirati thobe, a column of cloth.',
    to: '/collection/ghabar-thobe',
    objectPosition: 'center 12%',
  },
  {
    id: 'hadid',
    kind: 'still',
    name: 'Hadīd',
    src: '/images/featured-overcoat.jpg',
    caption: 'Hadīd. The first still of the house.\n\nkiano.london',
    alt: 'The Hadīd thobe, the first still of the house.',
    to: '/collection/hadid-thobe',
    objectPosition: '72% 18%',
  },
  {
    id: 'jubbah-sand',
    kind: 'still',
    name: 'The jubbah, sand',
    src: '/images/jubbah-sand.jpg',
    caption: 'The jubbah in sand. More air through the chest than the thobe.\n\nkiano.london',
    alt: 'The jubbah in sand, a modest column.',
    to: '/shop/jubbah-sand',
    objectPosition: 'center 8%',
  },
  {
    id: 'hajar',
    kind: 'still',
    name: 'Hajar',
    src: '/images/thobe-hajar.jpg',
    caption: 'Hajar. Stone, pressed once.\n\nkiano.london',
    alt: 'The Hajar thobe, stone cloth, pressed once.',
    to: '/collection/hajar-thobe',
    objectPosition: 'center 12%',
  },
  {
    id: 'jubbah-charcoal',
    kind: 'still',
    name: 'The jubbah, charcoal',
    src: '/images/jubbah-charcoal.jpg',
    caption: 'The jubbah in charcoal. Band collar, concealed placket.\n\nkiano.london',
    alt: 'The jubbah in charcoal, band collar, concealed placket.',
    to: '/shop/jubbah-charcoal',
    objectPosition: 'center 10%',
  },
] as const
