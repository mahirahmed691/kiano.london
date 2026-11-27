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

/** Only verified addresses count, matching the server check in api/_lib/admin.ts. */
export function isAdminUser(user: VerifiedEmailBearer | null | undefined) {
  if (!user) return false
  return (user.emailAddresses ?? []).some(
    (entry) => entry.verification?.status === 'verified' && isAdminEmail(entry.emailAddress),
  )
}

type VerifiedEmailBearer = {
  emailAddresses?: { emailAddress?: string | null; verification?: { status?: string | null } | null }[]
}
