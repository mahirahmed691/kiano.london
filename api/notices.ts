import { adminEmailFor } from './_lib/admin.ts'
import { clerkUserIdFrom } from './_lib/clerk.ts'
import { withDb } from './_lib/db.ts'
import { houseHref, isExpoPushToken } from './_lib/notices.ts'

type NoticeRow = {
  id: number
  audience: string
  kind: string
  title: string
  body: string
  href: string
  created_at: string | Date
  read_at: string | Date | null
}

function asIso(value: string | Date) {
  return value instanceof Date ? value.toISOString() : String(value)
}

function asNotice(row: NoticeRow) {
  return {
    id: row.id,
    audience: row.audience === 'admin' ? 'admin' : 'member',
    kind: row.kind,
    title: row.title,
    body: row.body,
    href: houseHref(row.href),
    createdAt: asIso(row.created_at),
    read: Boolean(row.read_at),
  }
}

async function signedIn(request: Request) {
  const clerkUserId = await clerkUserIdFrom(request)
  if (!clerkUserId) {
    return {
      ok: false as const,
      error: Response.json({ error: 'Sign in to read word from the house.' }, { status: 401 }),
    }
  }
  return { ok: true as const, clerkUserId, admin: Boolean(await adminEmailFor(clerkUserId)) }
}

export async function GET(request: Request) {
  const gate = await signedIn(request)
  if (gate.ok === false) return gate.error

  try {
    const sql = await withDb()
    const rows = (
      gate.admin
        ? await sql`
            SELECT n.id, n.audience, n.kind, n.title, n.body, n.href, n.created_at, r.read_at
            FROM notices n
            LEFT JOIN notice_reads r
              ON r.notice_id = n.id AND r.clerk_user_id = ${gate.clerkUserId}
            WHERE
              (n.audience = 'member' AND n.clerk_user_id = ${gate.clerkUserId})
              OR n.audience = 'admin'
            ORDER BY n.created_at DESC
            LIMIT 40
          `
        : await sql`
            SELECT n.id, n.audience, n.kind, n.title, n.body, n.href, n.created_at, r.read_at
            FROM notices n
            LEFT JOIN notice_reads r
              ON r.notice_id = n.id AND r.clerk_user_id = ${gate.clerkUserId}
            WHERE n.audience = 'member' AND n.clerk_user_id = ${gate.clerkUserId}
            ORDER BY n.created_at DESC
            LIMIT 40
          `
    ) as NoticeRow[]

    const notices = rows.map(asNotice)
    return Response.json({
      notices,
      unread: notices.filter((notice) => !notice.read).length,
    })
  } catch (caught) {
    console.error(caught)
    return Response.json({ error: 'Word from the house could not be read.' }, { status: 503 })
  }
}

export async function PATCH(request: Request) {
  const gate = await signedIn(request)
  if (gate.ok === false) return gate.error

  let body: { id?: unknown; all?: unknown }
  try {
    body = (await request.json()) as { id?: unknown; all?: unknown }
  } catch {
    return Response.json({ error: 'The word could not be read.' }, { status: 400 })
  }

  try {
    const sql = await withDb()

    if (body.all === true) {
      if (gate.admin) {
        await sql`
          INSERT INTO notice_reads (notice_id, clerk_user_id)
          SELECT n.id, ${gate.clerkUserId}
          FROM notices n
          WHERE
            (n.audience = 'member' AND n.clerk_user_id = ${gate.clerkUserId})
            OR n.audience = 'admin'
          ON CONFLICT (notice_id, clerk_user_id) DO NOTHING
        `
      } else {
        await sql`
          INSERT INTO notice_reads (notice_id, clerk_user_id)
          SELECT n.id, ${gate.clerkUserId}
          FROM notices n
          WHERE n.audience = 'member' AND n.clerk_user_id = ${gate.clerkUserId}
          ON CONFLICT (notice_id, clerk_user_id) DO NOTHING
        `
      }
      return Response.json({ ok: true })
    }

    const id = typeof body.id === 'number' ? body.id : Number(body.id)
    if (!Number.isInteger(id) || id < 1) {
      return Response.json({ error: 'That word could not be marked.' }, { status: 400 })
    }

    const rows = (
      gate.admin
        ? await sql`
            SELECT id FROM notices
            WHERE id = ${id}
              AND (
                (audience = 'member' AND clerk_user_id = ${gate.clerkUserId})
                OR audience = 'admin'
              )
          `
        : await sql`
            SELECT id FROM notices
            WHERE id = ${id} AND audience = 'member' AND clerk_user_id = ${gate.clerkUserId}
          `
    ) as { id: number }[]

    if (!rows[0]) {
      return Response.json({ error: 'That word is not for this account.' }, { status: 404 })
    }

    await sql`
      INSERT INTO notice_reads (notice_id, clerk_user_id)
      VALUES (${id}, ${gate.clerkUserId})
      ON CONFLICT (notice_id, clerk_user_id) DO NOTHING
    `
    return Response.json({ ok: true })
  } catch (caught) {
    console.error(caught)
    return Response.json({ error: 'The word could not be marked.' }, { status: 503 })
  }
}

export async function POST(request: Request) {
  const gate = await signedIn(request)
  if (gate.ok === false) return gate.error

  let body: { token?: unknown; platform?: unknown; forget?: unknown }
  try {
    body = (await request.json()) as { token?: unknown; platform?: unknown; forget?: unknown }
  } catch {
    return Response.json({ error: 'The device could not be read.' }, { status: 400 })
  }

  const token = typeof body.token === 'string' ? body.token.trim() : ''
  if (!isExpoPushToken(token)) {
    return Response.json({ error: 'That device cannot take word from the house.' }, { status: 400 })
  }

  const platform = typeof body.platform === 'string' ? body.platform.trim().slice(0, 20) : ''

  try {
    const sql = await withDb()
    if (body.forget === true) {
      await sql`
        DELETE FROM push_tokens
        WHERE clerk_user_id = ${gate.clerkUserId} AND token = ${token}
      `
      return Response.json({ ok: true })
    }

    await sql`
      INSERT INTO push_tokens (clerk_user_id, token, platform, updated_at)
      VALUES (${gate.clerkUserId}, ${token}, ${platform}, now())
      ON CONFLICT (clerk_user_id, token) DO UPDATE SET
        platform = EXCLUDED.platform,
        updated_at = now()
    `
    return Response.json({ ok: true })
  } catch (caught) {
    console.error(caught)
    return Response.json({ error: 'The device could not be kept.' }, { status: 503 })
  }
}
