import { clerkUserIdFrom } from './_lib/clerk.js'
import { withDb } from './_lib/db.js'
import {
  asThobeSize,
  parseHouseProfile,
  profileFromBody,
  readMemberProfile,
  upsertMember,
  writeMemberProfile,
} from './_lib/profile.js'

function asTrimmed(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

export async function GET(request: Request) {
  const clerkUserId = await clerkUserIdFrom(request)
  if (!clerkUserId) {
    return Response.json({ error: 'Sign in to open an account.' }, { status: 401 })
  }

  try {
    const sql = await withDb()
    const profile = await readMemberProfile(sql, clerkUserId)
    return Response.json({ profile })
  } catch (caught) {
    console.error(caught)
    return Response.json({ error: 'The atelier could not read the account.' }, { status: 503 })
  }
}

export async function POST(request: Request) {
  const clerkUserId = await clerkUserIdFrom(request)
  if (!clerkUserId) {
    return Response.json({ error: 'Sign in to open an account.' }, { status: 401 })
  }

  let body: { email?: unknown; name?: unknown; profile?: unknown; size?: unknown }
  try {
    body = (await request.json()) as {
      email?: unknown
      name?: unknown
      profile?: unknown
      size?: unknown
    }
  } catch {
    return Response.json({ error: 'The account could not be read.' }, { status: 400 })
  }

  const email = asTrimmed(body.email).toLowerCase()
  const name = asTrimmed(body.name)
  if (!email.includes('@')) {
    return Response.json({ error: 'A valid email is needed.' }, { status: 400 })
  }

  try {
    const sql = await withDb()
    await upsertMember(sql, clerkUserId, email, name, profileFromBody(body))
    await sql`
      UPDATE orders
      SET clerk_user_id = ${clerkUserId}
      WHERE clerk_user_id IS NULL AND lower(email) = lower(${email})
    `
    const size = asThobeSize(body.size)
    let profile = await readMemberProfile(sql, clerkUserId)
    if (size && profile.size !== size) {
      profile = { ...profile, size }
      await writeMemberProfile(sql, clerkUserId, profile)
    }
    return Response.json({ ok: true, profile })
  } catch (caught) {
    console.error(caught)
    return Response.json({ error: 'The atelier could not open the account.' }, { status: 503 })
  }
}

export async function PUT(request: Request) {
  const clerkUserId = await clerkUserIdFrom(request)
  if (!clerkUserId) {
    return Response.json({ error: 'Sign in to keep these details.' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'The details could not be read.' }, { status: 400 })
  }

  const parsed = parseHouseProfile(body)
  if ('error' in parsed) {
    return Response.json({ error: parsed.error }, { status: 400 })
  }

  try {
    const sql = await withDb()
    const existing = (await sql`
      SELECT email, name FROM members WHERE clerk_user_id = ${clerkUserId}
    `) as { email: string; name: string | null }[]
    const email = parsed.profile.email || existing[0]?.email || ''
    if (!email.includes('@')) {
      return Response.json({ error: 'A valid email is needed.' }, { status: 400 })
    }
    const name = parsed.profile.name || existing[0]?.name || ''
    const profile = { ...parsed.profile, email }
    await upsertMember(sql, clerkUserId, email, name, profile)
    await writeMemberProfile(sql, clerkUserId, profile)
    return Response.json({ ok: true, profile })
  } catch (caught) {
    console.error(caught)
    return Response.json({ error: 'The atelier could not keep the details.' }, { status: 503 })
  }
}
