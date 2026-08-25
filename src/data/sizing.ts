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

export const sizeNote =
  'Chest, length and shoulder as cut. A fitting will move a centimetre where it matters. If you are between sizes, write; we cut from the larger and take in.'

export { thobeSizes }
