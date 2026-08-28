import { getProduct, productLineName, thobeSizes } from '../src/data/products.js'
import { databaseUrl, withDb } from './_lib/db.js'
import {
  returnAskLetterHtml,
  returnAskLetterText,
  sendMail,
  visitLetterHtml,
  visitLetterText,
} from './_lib/mail.js'
import { recordNotice } from './_lib/notices.js'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const allowedSizes = new Set<number>(thobeSizes)
const referencePattern = /^[A-Z0-9]{6,20}$/

function asText(value: unknown, max: number) {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, max)
}

function asReference(value: unknown) {
  return asText(value, 20).replace(/[\s-]/g, '').toUpperCase()
}

function letterKind(request: Request): 'visit' | 'return' {
  const url = new URL(request.url)
  const path = url.pathname.replace(/\/$/, '')
  if (path.endsWith('/return') || url.searchParams.get('kind') === 'return') {
    return 'return'
  }
  return 'visit'
}

export async function POST(request: Request) {
  const kind = letterKind(request)
  let body: {
    name?: unknown
    email?: unknown
    telephone?: unknown
    productId?: unknown
    size?: unknown
    note?: unknown
    reference?: unknown
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
  const reference = asReference(body.reference)

  if (!name) {
    return Response.json({ error: 'A name is needed.' }, { status: 400 })
  }
  if (!emailPattern.test(email)) {
    return Response.json({ error: 'A valid email is needed.' }, { status: 400 })
  }
  if (kind === 'return' && !referencePattern.test(reference)) {
    return Response.json({ error: 'The reservation is needed.' }, { status: 400 })
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

  const product = productId ? getProduct(productId) : undefined
  const piece = product ? productLineName(product) : kind === 'return' ? 'a cut' : 'a piece to be discussed'
  const sizeLine = size ? `size ${size}` : kind === 'return' ? 'size to be named' : 'to be fitted'

  let kept = false
  if (databaseUrl()) {
    try {
      const sql = await withDb()
      await sql`
        INSERT INTO appointments (name, email, telephone, product_id, size, note, kind, reference)
        VALUES (
          ${name},
          ${email},
          ${telephone || null},
          ${productId || null},
          ${size},
          ${note || null},
          ${kind},
          ${kind === 'return' ? reference : ''}
        )
      `
      kept = true
      await recordNotice({
        audience: 'admin',
        kind,
        title: kind === 'return' ? 'A return is asked' : 'A letter is held',
        body: kind === 'return' ? `${name} · ${piece} · ${reference}.` : `${name} wrote for ${piece}.`,
        href: '/admin/diary',
        productIds: productId ? [productId] : undefined,
      })
    } catch (caught) {
      console.error(caught)
    }
  }

  const day = new Date().toISOString().slice(0, 10)
  const mail =
    kind === 'return'
      ? await sendMail({
          to: email,
          subject: 'The letter is held — Kiano London',
          text: returnAskLetterText({ name, piece, size: sizeLine, reference }),
          html: returnAskLetterHtml({ name, piece, size: sizeLine, reference }),
          idempotencyKey: `return-ask/${email}/${reference}`,
        })
      : await sendMail({
          to: email,
          subject: 'The letter is held — Kiano London',
          text: visitLetterText({ name, piece, size: sizeLine }),
          html: visitLetterHtml({ name, piece, size: sizeLine }),
          idempotencyKey: `visit-confirm/${email}/${day}`,
        })

  return Response.json({ ok: true, kept, written: mail.sent })
}
