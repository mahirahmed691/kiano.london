export type NavItem = {
  label: string
  to: string
}

export const primaryNav: NavItem[] = [
  { label: 'Shop', to: '/shop' },
  { label: 'Collection', to: '/collection' },
  { label: 'Story', to: '/story' },
  { label: 'Craftsmanship', to: '/craftsmanship' },
  { label: 'Visit', to: '/visit' },
]

export const overlayPaths = [
  '/',
  '/stills',
  '/shop',
  '/collection',
  '/story',
  '/craftsmanship',
  '/craftsmanship-details',
  '/visit',
] as const

export function headerOverlays(pathname: string) {
  return (overlayPaths as readonly string[]).includes(pathname)
}
