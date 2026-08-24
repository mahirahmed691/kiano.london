export type NavItem = {
  label: string
  to: string
}

export const primaryNav: NavItem[] = [
  { label: 'Collection', to: '/collection' },
  { label: 'Our Story', to: '/story' },
  { label: 'Craftsmanship', to: '/craftsmanship' },
]

export const overlayPaths = [
  '/',
  '/story',
  '/craftsmanship',
  '/craftsmanship-details',
] as const
