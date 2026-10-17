export type NavItem = {
  label: string
  to: string
}

export const primaryNav: NavItem[] = [
  { label: 'Shop', to: '/shop' },
  { label: 'Collection', to: '/collection' },
  { label: 'Scent', to: '/scent' },
  { label: 'Story', to: '/story' },
  { label: 'Craftsmanship', to: '/craftsmanship' },
  { label: 'Visit', to: '/visit' },
]

export const overlayPaths = [
  '/',
  '/stills',
  '/shop',
  '/collection',
  '/scent',
  '/story',
  '/craftsmanship',
  '/craftsmanship-details',
  '/visit',
  '/checkout',
  '/account',
  '/returns',
  '/privacy',
  '/cookies',
  '/reservation',
  '/letters/confirmed',
] as const

export function headerOverlays(pathname: string) {
  const path = pathname.split('?')[0] || '/'
  if (path.startsWith('/admin')) return false
  if ((overlayPaths as readonly string[]).includes(path)) return true
  return (
    path.startsWith('/shop/') ||
    path.startsWith('/collection/') ||
    path.startsWith('/scent/') ||
    path.startsWith('/sign-in') ||
    path.startsWith('/sign-up') ||
    path.startsWith('/order') ||
    path !== '/'
  )
}
