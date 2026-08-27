export const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || ''

export const clerkEnabled = Boolean(clerkPublishableKey)

export type ClerkContact = {
  name: string
  email: string
  telephone: string
}

export function clerkContact(user: {
  fullName?: string | null
  primaryEmailAddress?: { emailAddress?: string | null } | null
  primaryPhoneNumber?: { phoneNumber?: string | null } | null
  phoneNumbers?: { phoneNumber?: string | null }[]
} | null | undefined): ClerkContact {
  if (!user) return { name: '', email: '', telephone: '' }
  return {
    name: user.fullName?.trim() || '',
    email: user.primaryEmailAddress?.emailAddress?.trim() || '',
    telephone:
      user.primaryPhoneNumber?.phoneNumber?.trim() ||
      user.phoneNumbers?.[0]?.phoneNumber?.trim() ||
      '',
  }
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function emailFromSearch(params: URLSearchParams) {
  const email = (params.get('email') ?? '').trim().toLowerCase()
  return emailPattern.test(email) ? email : undefined
}
