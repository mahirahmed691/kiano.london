import { resolveAdminEmails } from '@/lib/admin-allowlist'

type EmailBearer = {
  primaryEmailAddress?: { emailAddress?: string | null } | null
  emailAddresses?: { emailAddress?: string | null }[]
}

export { parseAdminEmails, resolveAdminEmails, HOUSE_ADMIN_EMAILS } from '@/lib/admin-allowlist'

export function isAdminEmail(email: string | undefined | null) {
  if (!email) return false
  const allowed = resolveAdminEmails(import.meta.env.VITE_ADMIN_EMAILS)
  return allowed.includes(email.trim().toLowerCase())
}

export function clerkEmails(user: EmailBearer | null | undefined) {
  if (!user) return []
  const emails = [
    user.primaryEmailAddress?.emailAddress,
    ...(user.emailAddresses ?? []).map((entry) => entry.emailAddress),
  ]
  return [
    ...new Set(
      emails
        .map((email) => email?.trim().toLowerCase())
        .filter((email): email is string => Boolean(email)),
    ),
  ]
}

export function isAdminUser(user: EmailBearer | null | undefined) {
  return clerkEmails(user).some((email) => isAdminEmail(email))
}
