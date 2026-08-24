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

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Cloth',
    summary:
      'We buy from a handful of British mills. Weight, handle and colour are chosen in the piece, never from a swatch book alone.',
    image: '/images/craft-cloth.jpg',
    imageAlt: 'Camel wool coat showing the drape and hand of the cloth.',
  },
  {
    number: '02',
    title: 'Pattern',
    summary:
      'Each pattern is cut in brown paper, then chalked onto the cloth. The shears follow the grain. Nothing is rushed through a machine.',
    image: '/images/craft-pattern.jpg',
    imageAlt: 'A navy tailored suit, the result of a carefully cut pattern.',
  },
  {
    number: '03',
    title: 'Canvas',
    summary:
      'A floating canvas of horsehair and linen is pad-stitched by hand. It is what gives a Cavendish coat its quiet structure.',
    image: '/images/craft-canvas.jpg',
    imageAlt: 'Crisp white shirting, a study in clean construction.',
  },
  {
    number: '04',
    title: 'Finish',
    summary:
      'Horn buttons, hand-sewn buttonholes, a silk lining set by hand. The last press is as considered as the first cut.',
    image: '/images/craft-finish.jpg',
    imageAlt: 'Finished outerwear, ready to be worn for years.',
  },
]

export const materials: Material[] = [
  {
    name: 'Yorkshire wool',
    origin: 'Abraham Moon & Sons',
    copy: 'Woven in Guiseley since 1837. We take camel, charcoal and a particular mid-navy that takes the London light well.',
  },
  {
    name: 'Huddersfield worsted',
    origin: 'Super 110s–150s',
    copy: 'For suits and the Chesterfield. A cloth that holds a crease and still moves when you walk.',
  },
  {
    name: 'Hawick cashmere',
    origin: 'Scottish Borders',
    copy: 'Two-ply, not over-brushed. The knit should last a decade, not a season.',
  },
  {
    name: 'Horn & silk',
    origin: 'Buttons and linings',
    copy: 'Dark buffalo horn, never plastic. Linings in cupro or silk, chosen to disappear against the cloth.',
  },
]

export const detailSections: DetailSection[] = [
  {
    id: 'canvas',
    kicker: '01 — Structure',
    title: 'The floating canvas',
    copy: [
      'Between the cloth and the lining sits a layer you never see. Horsehair, linen and a little wool, pad-stitched in concentric curves through the chest and lapel.',
      'The stitches are not decorative. They shape the roll of the lapel and keep the coat from collapsing after a wet afternoon. A fused chest is quicker. It is also why so many coats look tired by the third winter.',
    ],
    image: '/images/details-canvas.jpg',
    imageAlt: 'Hands and cloth in the cutting room, the quiet work of structure.',
    imagePosition: 'right',
  },
  {
    id: 'buttonhole',
    kicker: '02 — The hand',
    title: 'The buttonhole',
    copy: [
      'A machine buttonhole is a slit with a zigzag. A Cavendish buttonhole is worked in silk twist, the purl sitting proud of the cloth, the bartack set by eye.',
      'It takes a morning to do a coat. The first and last holes are always cut by the same hand, so the tension matches. We still mark them in chalk, never in a template.',
    ],
    image: '/images/details-buttonhole.jpg',
    imageAlt: 'Close study of outerwear construction and hardware.',
    imagePosition: 'left',
  },
  {
    id: 'shoulder',
    kicker: '03 — Line',
    title: 'The shoulder',
    copy: [
      'We cut a natural shoulder: a little padding, no rope, no theatrical peak. The sleeve is set high, the scye close, so the coat hangs from the frame rather than sitting on it.',
      'It is the line that reads as British from across a room. Not loud. Simply in place.',
    ],
    image: '/images/details-shoulder.jpg',
    imageAlt: 'The fall of a jacket through the shoulder and chest.',
    imagePosition: 'right',
  },
  {
    id: 'lining',
    kicker: '04 — The unseen',
    title: 'The lining',
    copy: [
      'Linings are felled by hand at the hem and the sleeve. We leave a little extra in the back so the coat can be let out, years from now, without showing the work.',
      'Nothing in a Cavendish garment is meant to be disposable. The lining is simply the part that proves it.',
    ],
    image: '/images/details-lining.jpg',
    imageAlt: 'Folded shirts and cloth, the quiet inventory of the house.',
    imagePosition: 'left',
  },
]
