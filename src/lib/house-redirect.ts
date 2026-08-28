export function isHouseRedirect(value: string | null): value is string {
  if (!value) return false
  if (!value.startsWith('/') || value.startsWith('//') || value.includes('://')) {
    return false
  }
  const path = value.split('?')[0] ?? ''
  return path === '/account' || path === '/reservation' || path === '/checkout' || path === '/admin' || path.startsWith('/admin/')
}
