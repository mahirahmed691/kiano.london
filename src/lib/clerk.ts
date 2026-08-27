export const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || ''

export const clerkEnabled = Boolean(clerkPublishableKey)

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function emailFromSearch(params: URLSearchParams) {
  const email = (params.get('email') ?? '').trim().toLowerCase()
  return emailPattern.test(email) ? email : undefined
}
