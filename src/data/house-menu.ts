import { jubbahs, productLineName, productPath } from './products'
import { scentPath, scents } from './scent'

export type HouseMenuLink = {
  label: string
  to: string
}

export type HouseMenuSection = {
  id: string
  section: string
  hub?: HouseMenuLink
  lines: HouseMenuLink[]
}

export const houseMenuHome: HouseMenuLink = { label: 'Home', to: '/' }

export const houseMenuAccount: HouseMenuLink = { label: 'Account', to: '/account' }

export const houseMenuHouse: HouseMenuSection = {
  id: 'house',
  section: 'The house',
  lines: [
    { label: 'Stills', to: '/stills' },
    { label: 'Story', to: '/story' },
    { label: 'Craftsmanship', to: '/craftsmanship' },
    { label: 'The making', to: '/craftsmanship-details' },
    { label: 'Visit', to: '/visit' },
  ],
}

export function houseMenuTree(): HouseMenuSection[] {
  return [
    {
      id: 'shop',
      section: 'The Shop',
      hub: { label: 'Shop', to: '/shop' },
      lines: jubbahs.map((piece) => ({
        label: productLineName(piece),
        to: productPath(piece),
      })),
    },
    {
      id: 'collection',
      section: 'The Collection',
      hub: { label: 'Collection', to: '/collection' },
      lines: jubbahs.map((piece) => ({
        label: productLineName(piece),
        to: `/collection/${piece.id}`,
      })),
    },
    {
      id: 'scent',
      section: 'The Scent',
      hub: { label: 'Scent', to: '/scent' },
      lines: scents.map((scent) => ({
        label: scent.name,
        to: scentPath(scent),
      })),
    },
    houseMenuHouse,
  ]
}
