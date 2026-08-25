import { createClerkClient } from '@clerk/backend'
import { clerkUserIdFrom } from './clerk.ts'
import { withDb } from './db.ts'

function parseAdminEmails(raw: string | undefined) {
  return (raw ?? '')
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)
}

export function adminAllowlist() {
  return parseAdminEmails(process.env.ADMIN_EMAILS || process.env.VITE_ADMIN_EMAILS)
}

export async function requireAdmin(request: Request) {
  const clerkUserId = await clerkUserIdFrom(request)
  if (!clerkUserId) {
    return { error: Response.json({ error: 'Sign in to open the ledger.' }, { status: 401 }) }
  }

  const allowed = adminAllowlist()
  if (allowed.length === 0) {
    return { error: Response.json({ error: 'The ledger is closed.' }, { status: 403 }) }
  }

  let email = ''
  const secret = process.env.CLERK_SECRET_KEY
  if (secret) {
    try {
      const clerk = createClerkClient({ secretKey: secret })
      const user = await clerk.users.getUser(clerkUserId)
      email = user.primaryEmailAddress?.emailAddress?.trim().toLowerCase() ?? ''
    } catch (caught) {
      console.error(caught)
    }
  }

  if (!email) {
    try {
      const sql = await withDb()
      const rows = (await sql`
        SELECT email FROM members WHERE clerk_user_id = ${clerkUserId}
      `) as { email: string }[]
      email = rows[0]?.email?.trim().toLowerCase() ?? ''
    } catch (caught) {
      console.error(caught)
    }
  }

  if (!email || !allowed.includes(email)) {
    return { error: Response.json({ error: 'This ledger is not for this account.' }, { status: 403 }) }
  }

  return { clerkUserId, email }
}
