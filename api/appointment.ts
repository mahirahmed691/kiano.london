import { getProduct, productLineName, thobeSizes } from '../src/data/products.js'
import type { LetterKind } from '../src/lib/letters.js'
import { databaseUrl, withDb } from './_lib/db.js'
import {
  returnAskLetterHtml,
  returnAskLetterText,
  sendMail,
  visitLetterHtml,
  visitLetterText,
  waitAskLetterHtml,
  waitAskLetterText,
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

function letterKind(request: Request): LetterKind {
  const url = new URL(request.url)
  const path = url.pathname.replace(/\/$/, '')
  if (path.endsWith('/wait') || url.searchParams.get('kind') === 'wait') return 'wait'
  if (path.endsWith('/return') || url.searchParams.get('kind') === 'return') return 'return'
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
  if (kind === 'wait' && !getProduct(productId)) {
    return Response.json({ error: 'That piece is not in the collection.' }, { status: 400 })
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
  if (kind === 'wait' && size === null) {
    return Response.json({ error: 'A size is needed.' }, { status: 400 })
  }

  const product = productId ? getProduct(productId) : undefined
  const piece =
    product ? productLineName(product) : kind === 'return' ? 'a cut' : 'a piece to be discussed'
  const sizeLine = size ? `size ${size}` : kind === 'return' ? 'size to be named' : 'to be fitted'

  let kept = false
  let already = false
  if (databaseUrl()) {
    try {
      const sql = await withDb()
      if (kind === 'wait' && productId && size !== null) {
        const remaining = (await sql`
          SELECT quantity FROM inventory
          WHERE product_id = ${productId} AND size = ${size}
        `) as { quantity: number }[]
        if ((remaining[0]?.quantity ?? 0) > 0) {
          return Response.json(
            { error: 'This size is on the line.', onTheLine: true },
            { status: 409 },
          )
        }
        const held = (await sql`
          SELECT id FROM appointments
          WHERE kind = 'wait'
            AND lower(email) = ${email}
            AND product_id = ${productId}
            AND size = ${size}
            AND status IN ('new', 'seen')
          LIMIT 1
        `) as { id: number }[]
        if (held[0]) {
          kept = true
          already = true
        }
      }

      if (!already) {
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
          kind: kind === 'wait' ? 'wait' : kind === 'return' ? 'return' : 'visit',
          title:
            kind === 'return'
              ? 'A return is asked'
              : kind === 'wait'
                ? 'A size is waited on'
                : 'A letter is held',
          body:
            kind === 'return'
              ? `${name} · ${piece} · ${reference}.`
              : kind === 'wait'
                ? `${name} · ${piece} · ${sizeLine}.`
                : `${name} wrote for ${piece}.`,
          href: '/admin/diary',
          productIds: productId ? [productId] : undefined,
        })
      }
    } catch (caught) {
      console.error(caught)
    }
  }

  if (already) {
    return Response.json({ ok: true, kept, written: false, already: true })
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
      : kind === 'wait'
        ? await sendMail({
            to: email,
            subject: 'The letter is held — Kiano London',
            text: waitAskLetterText({ name, piece, size: sizeLine }),
            html: waitAskLetterHtml({ name, piece, size: sizeLine }),
            idempotencyKey: `wait-ask/${email}/${productId}/${size}`,
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
