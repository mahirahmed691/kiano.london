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
      'Japanese compact cotton, Super 150s wool-cotton, extra-long staple Giza. Weight and handle are chosen in the piece. An Emirati thobe lives or dies by the drape.',
    image: '/images/heritage-linen.jpg',
    imageAlt: 'Heritage linen in the piece, before it is chalked and cut.',
  },
  {
    number: '02',
    title: 'Pattern',
    summary:
      'Each thobe is cut from the house block: modest through the chest, clean through the shoulder, the hem set to the ankle. The shears follow the grain.',
    image: '/images/workbench.jpg',
    imageAlt: 'The cutting bench: paper, chalk and shears for the house block.',
  },
  {
    number: '03',
    title: 'Stitch',
    summary:
      'Side seams are felled. The collar is pad-stitched. Buttonholes, where they exist, are worked in silk twist. Nothing on a thobe is fused.',
    image: '/images/worsted-wool.jpg',
    imageAlt: 'A needle on charcoal worsted: the stitch that holds a winter thobe.',
  },
  {
    number: '04',
    title: 'Finish',
    summary:
      'Concealed plackets, horn buttons, three labels set by hand. The woven mark at the nape, the size beside it, care at the side seam. The last press is as considered as the first cut. The garment should look finished from the inside.',
    image: '/images/fastenings.jpg',
    imageAlt: 'Integrated fastenings at the finish of a thobe placket.',
  },
]

export const materials: Material[] = [
  {
    name: 'Japanese compact cotton',
    origin: 'Shizuoka',
    copy: 'For Layl and Ghabār. Dense, matte, a high-count two-ply that holds a clean column without stiffness.',
  },
  {
    name: 'Super 150s wool-cotton',
    origin: 'Huddersfield',
    copy: 'For Hadīd, and the charcoal jubbah. Compact, resilient, a memory in the fibre so the silhouette stays architectural.',
  },
  {
    name: 'Extra-long staple cotton',
    origin: 'Giza',
    copy: 'For Raml, and the sand jubbah. Long fibre, a quiet sheen, washed so the cloth drapes rather than stands.',
  },
  {
    name: 'Silk twist & horn',
    origin: 'Thread and closures',
    copy: 'Buttonholes in silk twist. Dark buffalo horn, never plastic. The hardware should disappear until you need it.',
  },
]

export const stitchStudies: StitchStudy[] = [
  {
    id: 'stitch',
    title: 'The stitch',
    note: 'Pad-stitching through the collar stand, silk on linen.',
    image: '/images/stitch-pad.jpg',
    imageAlt: 'Pad stitching on collar canvas, rows of espresso silk following the stand.',
  },
  {
    id: 'seam',
    title: 'The seam',
    note: 'A felled side seam, the allowance enclosed, the face uninterrupted.',
    image: '/images/stitch-felled.jpg',
    imageAlt: 'The inside of a felled seam: the fold enclosed, two parallel rows of stitching.',
  },
  {
    id: 'fastening',
    title: 'The fastening',
    note: 'Integrated closures set into the placket, never sitting on it.',
    image: '/images/stitch-buttonhole.jpg',
    imageAlt: 'A hand-worked silk keyhole buttonhole, the purl catching the light.',
  },
  {
    id: 'pocket',
    title: 'The pocket',
    note: 'A concealed interior pocket that does not break the silhouette.',
    image: '/images/concealed-pocket.jpg',
    imageAlt: 'A concealed interior pocket set into the lining of a thobe.',
  },
]

export const detailSections: DetailSection[] = [
  {
    id: 'seam',
    kicker: '01 — The seam',
    title: 'The felled seam',
    copy: [
      'A machine overlock is a shortcut. A side seam here is felled: the allowance is folded into itself and stitched twice, so the inside of the thobe is as clean as the face.',
      'It takes longer. It also means the garment can be washed, pressed and worn for years without the seam opening or the edge fraying. The line down the body stays a single plane of cloth.',
    ],
    image: '/images/heritage-linen.jpg',
    imageAlt: 'Cloth at close range, where the seam has been worked out of sight.',
    imagePosition: 'right',
  },
  {
    id: 'stitch',
    kicker: '02 — The stitch',
    title: 'The hand stitch',
    copy: [
      'The collar stand of a thobe is pad-stitched by hand. The stitches are not decorative. They shape the roll of the neck and keep the stand from collapsing after a day’s wear.',
      'We work in silk twist, the tension set by eye. A fused collar is quicker. It is also why so many garments look tired by the third season.',
    ],
    image: '/images/worsted-wool.jpg',
    imageAlt: 'Close work: a needle and charcoal cloth, the stitch of a thobe.',
    imagePosition: 'left',
  },
  {
    id: 'fastening',
    kicker: '03 — The fastening',
    title: 'The concealed placket',
    copy: [
      'Buttons sit inside the placket, not on it. From a few paces the thobe reads as a single column of cloth. The closures are horn, the buttonholes worked in silk, the bartack set by the same hand that cut the first hole.',
      'It is the modest line: nothing announced, everything in place.',
    ],
    image: '/images/fastenings.jpg',
    imageAlt: 'Concealed fastenings integrated into the thobe placket.',
    imagePosition: 'right',
  },
  {
    id: 'pocket',
    kicker: '04 — The unseen',
    title: 'The interior pocket',
    copy: [
      'A telephone, a pair of glasses, a folded letter. The pocket is bagged in the lining and set so it does not pull the cloth. You feel it. Nobody else should see it.',
      'The label is woven, not printed: the Kiano monogram, set at the nape by hand. Size is a separate tab. Care sits at the side seam. Even the parts that remain unseen are made to the same standard.',
    ],
    image: '/images/concealed-pocket.jpg',
    imageAlt: 'The concealed interior pocket of the Layl thobe.',
    imagePosition: 'left',
  },
]
