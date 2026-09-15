export type PlateKind = 'still' | 'reel' | 'carousel'

export type InstagramPlate = {
  id: string
  kind: PlateKind
  name: string
  src: string
  children?: readonly string[]
  caption: string
  alt: string
}

export const plateIntervalDays = 7

export const instagramPlates: readonly InstagramPlate[] = [
  {
    id: 'layl',
    kind: 'still',
    name: 'Layl',
    src: '/images/thobe-layl.jpg',
    caption: 'Layl. Matte black, hem to the ankle.\n\nkiano.london',
    alt: 'The Layl thobe: matte black, band collar, hem to the ankle.',
  },
  {
    id: 'lanesborough-white',
    kind: 'still',
    name: 'Hyde Park Corner',
    src: '/images/look-lanesborough.jpg',
    caption: 'The white column. Hyde Park Corner.\n\nkiano.london',
    alt: 'A white Emirati thobe at The Lanesborough, Hyde Park Corner.',
  },
  {
    id: 'raml',
    kind: 'still',
    name: 'Raml',
    src: '/images/thobe-raml.jpg',
    caption: 'Raml. Sand extra-long staple, the daylight column.\n\nkiano.london',
    alt: 'The Raml thobe: sand extra-long staple, the daylight column.',
  },
  {
    id: 'jubbah-black',
    kind: 'still',
    name: 'The jubbah, black',
    src: '/images/jubbah-black.jpg',
    caption: 'The jubbah in black. Worn alone, or over a thobe.\n\nkiano.london',
    alt: 'A black Emirati jubbah worn at full length.',
  },
  {
    id: 'ghabar',
    kind: 'still',
    name: 'Ghabār',
    src: '/images/thobe-ghabar.jpg',
    caption: 'Ghabār. Earth-grey, a column of cloth.\n\nkiano.london',
    alt: 'Ghabār: an earth-grey Emirati thobe, a column of cloth.',
  },
  {
    id: 'hadid',
    kind: 'still',
    name: 'Hadīd',
    src: '/images/featured-overcoat.jpg',
    caption: 'Hadīd. The first still of the house.\n\nkiano.london',
    alt: 'The Hadīd thobe, the first still of the house.',
  },
  {
    id: 'jubbah-sand',
    kind: 'still',
    name: 'The jubbah, sand',
    src: '/images/jubbah-sand.jpg',
    caption: 'The jubbah in sand. More air through the chest than the thobe.\n\nkiano.london',
    alt: 'The jubbah in sand, a modest column.',
  },
  {
    id: 'hajar',
    kind: 'still',
    name: 'Hajar',
    src: '/images/thobe-hajar.jpg',
    caption: 'Hajar. Stone, pressed once.\n\nkiano.london',
    alt: 'The Hajar thobe, stone cloth, pressed once.',
  },
  {
    id: 'jubbah-charcoal',
    kind: 'still',
    name: 'The jubbah, charcoal',
    src: '/images/jubbah-charcoal.jpg',
    caption: 'The jubbah in charcoal. Band collar, concealed placket.\n\nkiano.london',
    alt: 'The jubbah in charcoal, band collar, concealed placket.',
  },
] as const
