import { getProduct } from '../../src/data/products.js'
import { adminAllowlist } from './admin.js'
import { withDb } from './db.js'

export type NoticeAudience = 'member' | 'admin'
export type NoticeKind = 'order' | 'visit' | 'list' | 'cut' | 'member' | 'work' | 'return'

const kinds = new Set<NoticeKind>(['order', 'visit', 'list', 'cut', 'member', 'work', 'return'])
const expoToken = /^(Expo(nent)?PushToken)\[[^\s[\]]+]$/
const expoPushUrl = 'https://exp.host/--/api/v2/push/send'

type NoticeInput = {
  audience: NoticeAudience
  clerkUserId?: string | null
  kind: NoticeKind
  title: string
  body: string
  href?: string
  productIds?: string[]
}

export function storedProductIds(ids: string[] | undefined) {
  return [...new Set((ids ?? []).map((id) => id.trim()).filter((id) => Boolean(getProduct(id))))]
    .slice(0, 8)
    .join(',')
}

export function parsedProductIds(raw: string | null | undefined) {
  if (!raw) return []
  return raw
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean)
}

export function houseHref(value: string | undefined) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return ''
  if (value.includes('://') || value.includes('\\')) return ''
  return value.slice(0, 200)
}

export function isExpoPushToken(value: string) {
  return expoToken.test(value)
}

export async function recordNotice(input: NoticeInput) {
  if (!kinds.has(input.kind)) return
  if (input.audience === 'member' && !input.clerkUserId) return

  const title = input.title.trim().slice(0, 160)
  const body = input.body.trim().slice(0, 400)
  const href = houseHref(input.href)
  const productIds = storedProductIds(input.productIds)
  if (!title || !body) return

  try {
    const sql = await withDb()
    await sql`
      INSERT INTO notices (audience, clerk_user_id, kind, title, body, href, product_ids)
      VALUES (
        ${input.audience},
        ${input.audience === 'member' ? input.clerkUserId : null},
        ${input.kind},
        ${title},
        ${body},
        ${href},
        ${productIds}
      )
    `
  } catch (caught) {
    console.error(caught)
    return
  }

  void pushNotice(input, title, body, href).catch((caught) => {
    console.error(caught)
  })
}

async function pushNotice(input: NoticeInput, title: string, body: string, href: string) {
  const sql = await withDb()
  let tokens: string[] = []

  if (input.audience === 'member' && input.clerkUserId) {
    const rows = (await sql`
      SELECT token FROM push_tokens WHERE clerk_user_id = ${input.clerkUserId}
    `) as { token: string }[]
    tokens = rows.map((row) => row.token)
  } else if (input.audience === 'admin') {
    const allowed = adminAllowlist()
    if (allowed.length === 0) return
    const rows = (await sql`
      SELECT t.token, m.email
      FROM push_tokens t
      INNER JOIN members m ON m.clerk_user_id = t.clerk_user_id
    `) as { token: string; email: string }[]
    const listed = new Set(allowed)
    tokens = rows
      .filter((row) => listed.has(row.email.trim().toLowerCase()))
      .map((row) => row.token)
  }

  const unique = [...new Set(tokens.filter(isExpoPushToken))]
  if (unique.length === 0) return

  const messages = unique.map((token) => ({
    to: token,
    title,
    body,
    channelId: 'word',
    badge: 1,
    data: { href },
  }))

  await fetch(expoPushUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(messages),
  })
}
