export type ProcessStep = {
  number: string
  title: string
  summary: string
  image: string
  imageAlt: string
}

export type Material = {
  name: string
  origin: string
  copy: string
}

export type DetailSection = {
  id: string
  kicker: string
  title: string
  copy: string[]
  image: string
  imageAlt: string
  imagePosition: 'left' | 'right'
}

export type StitchStudy = {
  id: string
  title: string
  note: string
  image: string
  imageAlt: string
}

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Cloth',
    summary:
      'Cotton viscose mix, light GSM. Weight and handle are chosen in the piece. An Emirati column lives or dies by the drape.',
    image: '/images/cloth-giza.jpg',
    imageAlt: 'Cloth unrolled, before it is chalked.',
  },
  {
    number: '02',
    title: 'Pattern',
    summary:
      'Each piece is cut from the house block: modest through the chest, clean through the shoulder, the hem set to the ankle. Five sizes, 52 to 60.',
    image: '/images/cutting-room.jpg',
    imageAlt: 'Paper for the house block, shears, and cloth on the bench.',
  },
  {
    number: '03',
    title: 'Stitch',
    summary:
      'The column is sewn so the face stays a single plane of cloth. The neck holds. Nothing is announced from a few paces.',
    image: '/images/worsted-wool.jpg',
    imageAlt: 'A needle on charcoal cloth: the stitch that holds the column.',
  },
  {
    number: '04',
    title: 'Finish',
    summary:
      'The square mark is set at the nape, in the cloth of the piece. Size sewn in separately. Care at the side seam. The last press is as considered as the first cut.',
    image: '/images/stitch-buttonhole.jpg',
    imageAlt: 'The finish of a placket, close to the cloth.',
  },
]

export const materials: Material[] = [
  {
    name: 'Cotton viscose mix',
    origin: 'The line',
    copy: 'Urban Emirati. Light GSM. The cloth of the three colourways: stone grey, cream, and black.',
  },
  {
    name: 'The square mark',
    origin: 'Nape',
    copy: 'The interlocking KK, sewn in the cloth of the piece. Thread is ivory. The colour follows the garment.',
  },
  {
    name: 'The house block',
    origin: 'Sizes 52–60',
    copy: 'Modest through the chest, hem to the ankle. Five sizes. Measure against a column you already own.',
  },
  {
    name: 'The packing',
    origin: 'Unscented',
    copy: 'A garment bag, unscented tissue, and a rigid box. The cloth is never scented.',
  },
]

export const stitchStudies: StitchStudy[] = [
  {
    id: 'stitch',
    title: 'The stitch',
    note: 'Work at the collar, so the neck holds.',
    image: '/images/stitch-pad.jpg',
    imageAlt: 'Stitching on the collar stand, rows following the neck.',
  },
  {
    id: 'seam',
    title: 'The seam',
    note: 'A side seam, the allowance enclosed, the face uninterrupted.',
    image: '/images/stitch-felled.jpg',
    imageAlt: 'The inside of a seam: the fold enclosed, two parallel rows of stitching.',
  },
  {
    id: 'fastening',
    title: 'The fastening',
    note: 'Closures set into the placket, never sitting on it.',
    image: '/images/stitch-buttonhole.jpg',
    imageAlt: 'A buttonhole set into the placket, the stitch catching the light.',
  },
  {
    id: 'pocket',
    title: 'The pocket',
    note: 'A concealed interior pocket that does not break the silhouette.',
    image: '/images/concealed-pocket.jpg',
    imageAlt: 'A concealed interior pocket set into the lining of a garment.',
  },
]

export const detailSections: DetailSection[] = [
  {
    id: 'seam',
    kicker: '01 — The seam',
    title: 'The side seam',
    copy: [
      'The line down the body should stay a single plane of cloth. The allowance is worked so the inside of the garment is as considered as the face.',
      'It is made to be washed, pressed and worn. The column should still read as a column.',
    ],
    image: '/images/stitch-felled.jpg',
    imageAlt: 'Cloth at close range, where the seam has been worked out of sight.',
    imagePosition: 'right',
  },
  {
    id: 'stitch',
    kicker: '02 — The stitch',
    title: 'The neck',
    copy: [
      'The collar stand is worked so the neck holds after a day’s wear. The stitches are not decorative. They keep the stand from collapsing.',
      'A fused collar is quicker. It is also why so many garments look tired by the third season.',
    ],
    image: '/images/cloth-dust.jpg',
    imageAlt: 'Cloth and a needle, the stitch of the column.',
    imagePosition: 'left',
  },
  {
    id: 'fastening',
    kicker: '03 — The fastening',
    title: 'The concealed placket',
    copy: [
      'From a few paces the garment reads as a single column of cloth. The closures sit inside the placket, not on it.',
      'It is the modest line: nothing announced, everything in place.',
    ],
    image: '/images/stitch-buttonhole.jpg',
    imageAlt: 'A buttonhole set into the placket, never sitting on it.',
    imagePosition: 'right',
  },
  {
    id: 'pocket',
    kicker: '04 — The unseen',
    title: 'The nape, and the rest',
    copy: [
      'The square mark is sewn in the cloth of the piece and set at the nape. Size is a separate tab. Care sits at the side seam.',
      'Even the parts that remain unseen are made to the same standard. A pocket, if it is cut, should not pull the cloth.',
    ],
    image: '/images/concealed-pocket.jpg',
    imageAlt: 'The concealed interior of the garment, the mark set by hand.',
    imagePosition: 'left',
  },
]
