import { createClerkClient } from '@clerk/backend'
import { resolveAdminEmails } from '../../src/lib/admin-allowlist.js'
import { clerkUserIdFrom } from './clerk.js'

export function adminAllowlist() {
  return resolveAdminEmails(process.env.ADMIN_EMAILS || process.env.VITE_ADMIN_EMAILS)
}

type AdminDenied = { ok: false; error: Response }
type AdminOk = { ok: true; clerkUserId: string; email: string }

type ClerkEmail = {
  emailAddress?: string | null
  verification?: { status?: string | null } | null
}

/** Only verified addresses count. An unverified address can be added to any account by its holder. */
function clerkUserEmails(user: { emailAddresses?: ClerkEmail[] }) {
  return [
    ...new Set(
      (user.emailAddresses ?? [])
        .filter((entry) => entry.verification?.status === 'verified')
        .map((entry) => entry.emailAddress?.trim().toLowerCase())
        .filter((email): email is string => Boolean(email)),
    ),
  ]
}

export async function adminEmailFor(clerkUserId: string): Promise<string> {
  const allowed = adminAllowlist()
  if (allowed.length === 0) return ''

  const matched = new Set<string>()
  const secret = process.env.CLERK_SECRET_KEY
  if (secret) {
    try {
      const clerk = createClerkClient({ secretKey: secret })
      const user = await clerk.users.getUser(clerkUserId)
      for (const email of clerkUserEmails(user)) matched.add(email)
    } catch (caught) {
      console.error(caught)
    }
  }

  return [...matched].find((entry) => allowed.includes(entry)) ?? ''
}

export async function requireAdmin(request: Request): Promise<AdminOk | AdminDenied> {
  const clerkUserId = await clerkUserIdFrom(request)
  if (!clerkUserId) {
    return {
      ok: false,
      error: Response.json({ error: 'Sign in to open the ledger.' }, { status: 401 }),
    }
  }

  if (adminAllowlist().length === 0) {
    return { ok: false, error: Response.json({ error: 'The ledger is closed.' }, { status: 403 }) }
  }

  const email = await adminEmailFor(clerkUserId)
  if (!email) {
    return {
      ok: false,
      error: Response.json({ error: 'This ledger is not for this account.' }, { status: 403 }),
    }
  }

  return { ok: true, clerkUserId, email }
}
