import { type ThobeSize, thobeSizes } from '@/data/products'

export type SizeRow = {
  size: ThobeSize
  chest: string
  length: string
  shoulder: string
}

export const sizeChart: SizeRow[] = [
  { size: 52, chest: '112 cm', length: '142 cm', shoulder: '46 cm' },
  { size: 54, chest: '116 cm', length: '145 cm', shoulder: '47 cm' },
  { size: 56, chest: '120 cm', length: '148 cm', shoulder: '48 cm' },
  { size: 58, chest: '124 cm', length: '152 cm', shoulder: '49 cm' },
  { size: 60, chest: '128 cm', length: '156 cm', shoulder: '50 cm' },
]

export const sizeMeasures = [
  {
    title: 'Chest',
    copy: 'Around the fullest of the chest. Tape level, not tight. Breathe out.',
  },
  {
    title: 'Length',
    copy: 'From the high point of the shoulder, down the front, to where the hem should sit.',
  },
  {
    title: 'Shoulder',
    copy: 'Seam to seam across the back, where a well-set sleeve would sit.',
  },
] as const

export const sizeNote =
  'Chest, length and shoulder as cut. A fitting will move a centimetre where it matters. If you are between sizes, write; we cut from the larger and take in.'

export const measureStill = {
  src: '/images/look-lanesborough.jpg',
  alt: 'A white Emirati thobe worn at full length: measure against a column you already own.',
  objectPosition: 'center 22%',
} as const

export const measureLead =
  'If you already wear a thobe, measure that one: chest, length, shoulder. Name the size that matches, or write that you do not know. A visit is not required.'

export { thobeSizes }
