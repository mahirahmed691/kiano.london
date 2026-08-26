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
  '/story',
  '/craftsmanship',
  '/craftsmanship-details',
] as const

export function isShopSurface(pathname: string) {
  return (
    pathname === '/shop' ||
    pathname === '/collection' ||
    pathname.startsWith('/shop/') ||
    pathname.startsWith('/collection/')
  )
}

export function headerOverlays(pathname: string) {
  if (isShopSurface(pathname)) return false
  return (overlayPaths as readonly string[]).includes(pathname)
}
