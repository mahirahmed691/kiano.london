import { getProduct, thobeSizes } from '../src/data/products.ts'
import { databaseUrl, withDb } from './_lib/db.ts'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const allowedSizes = new Set<number>(thobeSizes)

function asText(value: unknown, max: number) {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, max)
}

export async function POST(request: Request) {
  let body: {
    name?: unknown
    email?: unknown
    telephone?: unknown
    productId?: unknown
    size?: unknown
    note?: unknown
  }
  try {
    body = (await request.json()) as typeof body
  } catch {
    return Response.json({ error: 'The letter could not be read.' }, { status: 400 })
  }

  const name = asText(body.name, 120)
  const email = asText(body.email, 160).toLowerCase()
  const telephone = asText(body.telephone, 40)
  const productId = asText(body.productId, 80)
  const note = asText(body.note, 2000)

  if (!name) {
    return Response.json({ error: 'A name is needed.' }, { status: 400 })
  }
  if (!emailPattern.test(email)) {
    return Response.json({ error: 'A valid email is needed.' }, { status: 400 })
  }
  if (productId && !getProduct(productId)) {
    return Response.json({ error: 'That piece is not in the collection.' }, { status: 400 })
  }

  let size: number | null = null
  if (body.size !== '' && body.size !== undefined && body.size !== null) {
    const parsed = Number(body.size)
    if (!allowedSizes.has(parsed)) {
      return Response.json({ error: 'That size is not cut.' }, { status: 400 })
    }
    size = parsed
  }

  if (!databaseUrl()) {
    return Response.json({ ok: true, kept: false })
  }

  try {
    const sql = await withDb()
    await sql`
      INSERT INTO appointments (name, email, telephone, product_id, size, note)
      VALUES (
        ${name},
        ${email},
        ${telephone || null},
        ${productId || null},
        ${size},
        ${note || null}
      )
    `
    return Response.json({ ok: true, kept: true })
  } catch (caught) {
    console.error(caught)
    return Response.json({ ok: true, kept: false })
  }
}
