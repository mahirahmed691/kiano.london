import {
  instagramPlates,
  plateIntervalDays,
  plateWeekOrigin,
  type InstagramPlate,
} from '../src/data/instagram-plates'
import { productPath, type Product } from '../src/data/products'

export {
  clothSwatch,
  clothThread,
  colourOfPiece,
  colourVariants,
  getProduct,
  jubbahColours,
  jubbahs,
  productColours,
  productLineName,
  productPath,
  products,
  relatedProducts,
  swatchOf,
  thobeSizes,
  thobes,
  type Product,
  type ProductColour,
  type ThobeSize,
} from '../src/data/products'
export {
  getScent,
  movementLine,
  notesJoin,
  relatedScents,
  scentNotes,
  scentComing,
  scentFamilies,
  scentPath,
  scents,
  type Scent,
  type ScentMovement,
  type ScentStill,
} from '../src/data/scent'
export { creedIntent, creedJoin, creedMotto, creedSpoken, creedStandard, creedWoven, houseCreed } from '../src/data/creed'
export { processSteps, materials, stitchStudies, detailSections } from '../src/data/craftsmanship'
export { site } from '../src/data/site'
export { instagramPlates, plateIntervalDays, type InstagramPlate } from '../src/data/instagram-plates'
export {
  plateDestination,
  plateKindLabel,
  plateLinkLabel,
  recentShopPlates,
  thisWeekShopPlate,
} from '../src/lib/instagram-plates'
export {
  formatMeasure,
  measureLead,
  measureStill,
  measureToCm,
  readCut,
  sizeChart,
  sizeMeasures,
  sizeNote,
  sizeRow,
  type CutReading,
  type MeasureKey,
  type MeasureUnit,
} from '../src/data/sizing'
export { carriageLine } from '../src/data/shipping'
export {
  careLine,
  packingNote,
  packingSteps,
  sewnLabels,
} from '../src/data/packing'
export {
  houseMenuAccount,
  houseMenuHome,
  houseMenuHouse,
  houseMenuTree,
  type HouseMenuLink,
  type HouseMenuSection,
} from '../src/data/house-menu'
export {
  cookiesLetter,
  legalLetter,
  legalLetters,
  privacyLetter,
  returnsLetter,
  type LegalLetter,
} from '../src/data/legal'

export function plateCopy(caption: string) {
  const parts = caption
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
  const last = parts[parts.length - 1]
  if (last && last.toLowerCase() === 'kiano.london') {
    return { lines: parts.slice(0, -1), mark: last }
  }
  return { lines: parts, mark: '' }
}

export function plateWeekIndex(now = Date.now()) {
  const elapsed = now - Date.parse(plateWeekOrigin)
  const weeks = Math.max(0, Math.floor(elapsed / (plateIntervalDays * 24 * 60 * 60 * 1000)))
  return weeks % instagramPlates.length
}

export function thisWeekPlate(now = Date.now()) {
  return instagramPlates[plateWeekIndex(now)]!
}

export function plateNumber(plate: InstagramPlate) {
  const index = instagramPlates.findIndex((item) => item.id === plate.id)
  return String(Math.max(0, index) + 1).padStart(2, '0')
}

export function recentPlates(count = 4, now = Date.now()) {
  const week = plateWeekIndex(now)
  const total = instagramPlates.length
  const take = Math.min(count, Math.max(0, total - 1))
  const out: InstagramPlate[] = []
  for (let step = 1; step <= take; step += 1) {
    const index = (week - step + total) % total
    out.push(instagramPlates[index]!)
  }
  return out
}

export function pieceIdFromPath(pathname: string) {
  const match = pathname.match(/^\/(shop|collection|scent)\/([^/?#]+)/)
  return match?.[2] ?? ''
}

export function linePath(product: Product, collection = false) {
  return collection ? `/collection/${product.id}` : productPath(product)
}

export function isNativeBrowse(pathname: string) {
  const path = pathname.split('?')[0] || '/'
  return (
    path === '/' ||
    path === '/stills' ||
    path === '/shop' ||
    path === '/collection' ||
    path === '/scent' ||
    path === '/visit' ||
    path === '/story' ||
    path === '/craftsmanship' ||
    path === '/craftsmanship-details' ||
    path === '/privacy' ||
    path === '/cookies' ||
    path === '/returns' ||
    path.startsWith('/shop/') ||
    path.startsWith('/collection/') ||
    path.startsWith('/scent/')
  )
}

export { headerOverlays as overlayRoom } from '../src/data/navigation'

export function pad(value: number) {
  return String(value).padStart(2, '0')
}

export function lineName(product: Product) {
  return product.cut === 'Jubbah' ? `${product.name} in ${product.colour}` : product.name
}
