import { creedMotto, creedSpoken } from './creed.js'

export const packingNote =
  'It leaves in a garment bag, unscented tissue, and a rigid box. The cloth is never scented.'

export const careLine = 'Cold wash or wet clean. Press from the reverse. Hang.'

export const packingSteps = [
  {
    number: '01',
    title: 'The bag',
    src: '/images/pack-bag.jpg',
    alt: 'A white thobe hanging in a clear garment bag. No mark on the poly.',
    objectPosition: 'center 18%',
    copy: 'A clear garment bag first. Protection for the column, not a logo on the poly.',
  },
  {
    number: '02',
    title: 'The wrap',
    src: '/images/pack-tissue.jpg',
    alt: 'Unscented cream tissue around a column of white cloth.',
    objectPosition: 'center 42%',
    copy: 'Unscented, acid-free tissue. No perfume, no sachet. The piece should smell of cotton or wool.',
  },
  {
    number: '03',
    title: 'The box',
    src: '/images/pack-box.jpg',
    alt: 'A rigid night box, sealed, on limestone. No mark on the lid.',
    objectPosition: 'center 55%',
    copy: `A rigid box, sealed once. The address sits on the face. Inside: a house card with the piece name, the size you chose, and a line if you wrote one. The hang tag carries the house: ${creedSpoken} ${creedMotto}`,
  },
] as const

export const sewnLabels = [
  {
    number: '01',
    title: 'Neck',
    copy: 'The woven mark: KIANO, London, Est. MMXXIV. Set at the nape by hand after the last press.',
  },
  {
    number: '02',
    title: 'Size',
    copy: 'A quiet tab, the number only. Sewn in separately, beside the nape, so a tailor can read it.',
  },
  {
    number: '03',
    title: 'Care',
    copy: `Fibre and pressing, at the side seam. ${careLine}`,
  },
] as const
