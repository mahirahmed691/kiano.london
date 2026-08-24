export type NavItem = {
  label: string
  to: string
}

export const primaryNav: NavItem[] = [
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
