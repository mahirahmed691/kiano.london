import {
  asHouseProfile,
  asThobeSize,
  mergeProfile,
  parseHouseProfile,
  profileFromShipping,
  profileHasAddress,
  type HouseProfile,
} from '../../src/lib/house-profile.js'
import { withDb } from './db.js'

type Sql = Awaited<ReturnType<typeof withDb>>

type MemberRow = {
  profile: unknown
  email: string
  name: string | null
}

export function profileFromBody(body: unknown): HouseProfile | null {
  if (!body || typeof body !== 'object') return null
  const record = body as Record<string, unknown>
  const source = record.profile && typeof record.profile === 'object' ? record.profile : body
  const parsed = parseHouseProfile(source)
  return 'profile' in parsed ? parsed.profile : null
}

export async function readMemberProfile(
  sql: Sql,
  clerkUserId: string,
): Promise<HouseProfile> {
  const rows = (await sql`
    SELECT profile, email, name FROM members WHERE clerk_user_id = ${clerkUserId}
  `) as MemberRow[]
  const row = rows[0]
  let profile = asHouseProfile(row?.profile)
  if (row?.email && !profile.email) profile = { ...profile, email: row.email }
  if (row?.name && !profile.name) profile = { ...profile, name: row.name }

  const email = row?.email ?? ''
  let dirty = false
  if (!profile.size) {
    const lines = (await sql`
      SELECT ol.size
      FROM order_lines ol
      INNER JOIN orders o ON o.id = ol.order_id
      WHERE o.status = 'paid'
        AND (
          o.clerk_user_id = ${clerkUserId}
          OR (${email} <> '' AND o.clerk_user_id IS NULL AND lower(o.email) = lower(${email}))
        )
      ORDER BY o.created_at DESC, ol.id ASC
      LIMIT 1
    `) as { size: number }[]
    const size = asThobeSize(lines[0]?.size)
    if (size) {
      profile = { ...profile, size }
      dirty = true
    }
  }

  if (profileHasAddress(profile)) {
    if (dirty && row) await writeMemberProfile(sql, clerkUserId, profile)
    return profile
  }
  const orders = (await sql`
    SELECT shipping
    FROM orders
    WHERE status = 'paid'
      AND shipping IS NOT NULL
      AND (
        clerk_user_id = ${clerkUserId}
        OR (${email} <> '' AND clerk_user_id IS NULL AND lower(email) = lower(${email}))
      )
    ORDER BY created_at DESC
    LIMIT 1
  `) as { shipping: unknown }[]
  const shipping = orders[0]?.shipping
  if (!shipping) return profile

  const seeded = mergeProfile(
    profile,
    profileFromShipping(
      shipping as Record<string, unknown>,
      { name: profile.name, email: profile.email, telephone: profile.telephone },
    ),
  )
  if (profileHasAddress(seeded) && row) {
    await writeMemberProfile(sql, clerkUserId, seeded)
  } else if (dirty && row) {
    await writeMemberProfile(sql, clerkUserId, profile)
  }
  return seeded
}

export async function writeMemberProfile(
  sql: Sql,
  clerkUserId: string,
  profile: HouseProfile,
) {
  await sql`
    UPDATE members
    SET
      profile = ${JSON.stringify(profile)}::jsonb,
      name = COALESCE(NULLIF(${profile.name}, ''), name),
      email = CASE WHEN ${profile.email} = '' THEN email ELSE ${profile.email} END
    WHERE clerk_user_id = ${clerkUserId}
  `
}

export async function upsertMember(
  sql: Sql,
  clerkUserId: string,
  email: string,
  name: string,
  profile?: HouseProfile | null,
) {
  const stored = profile ? JSON.stringify(profile) : null
  await sql`
    INSERT INTO members (clerk_user_id, email, name, profile)
    VALUES (
      ${clerkUserId},
      ${email},
      ${name || null},
      ${stored}::jsonb
    )
    ON CONFLICT (clerk_user_id) DO UPDATE SET
      email = EXCLUDED.email,
      name = COALESCE(EXCLUDED.name, members.name),
      profile = COALESCE(EXCLUDED.profile, members.profile)
  `
}

export async function keepPaidProfile(
  sql: Sql,
  clerkUserId: string,
  profile: HouseProfile,
) {
  if (!profileHasAddress(profile) && !profile.telephone && !profile.name && !profile.size) return
  const existing = await readMemberProfile(sql, clerkUserId)
  const next = mergeProfile(existing, profile)
  if (next.name || next.email || profileHasAddress(next) || next.size) {
    await writeMemberProfile(sql, clerkUserId, next)
  }
}

export async function forgetMember(sql: Sql, clerkUserId: string) {
  await sql`
    UPDATE orders
    SET clerk_user_id = NULL
    WHERE clerk_user_id = ${clerkUserId}
  `
  await sql`
    DELETE FROM members WHERE clerk_user_id = ${clerkUserId}
  `
  await sql`
    DELETE FROM push_tokens WHERE clerk_user_id = ${clerkUserId}
  `
  await sql`
    DELETE FROM notice_reads WHERE clerk_user_id = ${clerkUserId}
  `
  await sql`
    DELETE FROM notices WHERE audience = 'member' AND clerk_user_id = ${clerkUserId}
  `
}

export { asThobeSize, parseHouseProfile }
